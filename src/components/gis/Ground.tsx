import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { ALL_PARCELS, PRIMARY_PARCEL, ROADS } from "@/data/demo";
import { P } from "@/lib/palette";
import { useBhu } from "@/state/bhu";

/**
 * Every flat overlay lives on its own Y band and never writes depth, so
 * coplanar surfaces can't z-fight. Render order fixes the painter sequence.
 */
const Y = {
  terrain: -0.02,
  grid: 0.006,
  roadBase: 0.02,
  roadMark: 0.05,
  parcelFill: 0.09,
  parcelLine: 0.12,
  primaryFill: 0.14,
  primaryLine: 0.16,
} as const;

function ParcelOutline({
  points,
  color,
  width,
  y,
}: {
  points: [number, number][];
  color: string;
  width: number;
  y: number;
}) {
  const pts = useMemo(
    () =>
      [...points, points[0]!].map((pt) => [pt[0], y, pt[1]] as [number, number, number]),
    [points, y],
  );
  return <Line points={pts} color={color} lineWidth={width} depthWrite={false} />;
}

function bbox(points: [number, number][]) {
  const xs = points.map((p) => p[0]);
  const zs = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);
  return {
    cx: (minX + maxX) / 2,
    cz: (minZ + maxZ) / 2,
    w: Math.max(maxX - minX, 0.5),
    d: Math.max(maxZ - minZ, 0.5),
  };
}

/** A road segment: sunken asphalt slab + raised kerbs + centre lane dashes. */
function RoadSegment({
  cx,
  cz,
  length,
  width,
  horizontal,
  order,
  bright,
  opacity,
}: {
  cx: number;
  cz: number;
  length: number;
  width: number;
  horizontal: boolean;
  order: number;
  bright: boolean;
  opacity: number;
}) {
  const sx = horizontal ? length : width;
  const sz = horizontal ? width : length;
  const kerbOffset = width / 2 + 0.35;

  return (
    <group position={[cx, 0, cz]}>
      {/* asphalt slab — a real box, so the road reads with thickness from any angle */}
      <mesh position={[0, Y.roadBase, 0]} receiveShadow renderOrder={order}>
        <boxGeometry args={[sx, 0.06, sz]} />
        <meshStandardMaterial
          color={P.road}
          emissive={P.road}
          emissiveIntensity={bright ? 0.85 : 0.04}
          roughness={0.96}
          metalness={0.02}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* kerbs on both sides */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[
            horizontal ? 0 : s * kerbOffset,
            0.09,
            horizontal ? s * kerbOffset : 0,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry
            args={[
              horizontal ? sx : 0.7,
              0.18,
              horizontal ? 0.7 : sz,
            ]}
          />
          <meshStandardMaterial color={P.roadLine} roughness={0.9} transparent opacity={opacity} />
        </mesh>
      ))}

      {/* centre lane dashes */}
      <Line
        points={
          horizontal
            ? ([
                [-length / 2, Y.roadMark, 0],
                [length / 2, Y.roadMark, 0],
              ] as [number, number, number][])
            : ([
                [0, Y.roadMark, -length / 2],
                [0, Y.roadMark, length / 2],
              ] as [number, number, number][])
        }
        color={P.roadLine}
        lineWidth={1.4}
        dashed
        dashSize={3}
        gapSize={3}
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </group>
  );
}

export function Ground() {
  const { layers, showUnderground, view } = useBhu();
  const groundOpacity = showUnderground ? 0.32 : 1;
  const flat = view === "2d";

  return (
    <group>
      {/* terrain plate */}
      <mesh rotation-x={-Math.PI / 2} position={[0, Y.terrain, 0]} receiveShadow>
        <planeGeometry args={[420, 420]} />
        <meshStandardMaterial
          color={layers.dem ? P.groundDeep : P.ground}
          roughness={0.98}
          metalness={0.02}
          transparent
          opacity={groundOpacity}
        />
      </mesh>

      {/* GIS grid */}
      <gridHelper
        args={[420, 84, P.gridStrong, P.grid]}
        position={[0, Y.grid, 0]}
        material-transparent
        material-opacity={showUnderground ? 0.16 : 0.34}
        material-depthWrite={false}
      />

      {layers.dem && (
        <mesh rotation-x={-Math.PI / 2} position={[0, Y.grid + 0.002, 0]}>
          <planeGeometry args={[420, 420, 48, 48]} />
          <meshBasicMaterial
            color={P.primary}
            wireframe
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* roads: each segment gets its own render order so crossings never fight */}
      {layers.roads &&
        ROADS.map((r, i) => {
          const a = r.points[0]!;
          const b = r.points[1]!;
          const horizontal = a[1] === b[1];
          const length = horizontal ? Math.abs(b[0] - a[0]) : Math.abs(b[1] - a[1]);
          return (
            <RoadSegment
              key={r.id}
              cx={(a[0] + b[0]) / 2}
              cz={(a[1] + b[1]) / 2}
              length={length}
              width={r.width}
              horizontal={horizontal}
              order={i + 1}
              bright={flat}
              opacity={groundOpacity}
            />
          );
        })}

      {/* parcels */}
      {layers.parcels && (
        <group>
          {ALL_PARCELS.filter((p) => !p.primary).map((p) => {
            const b = bbox(p.geometry);
            return (
              <group key={p.id}>
                <ParcelOutline
                  points={p.geometry}
                  color={P.parcel}
                  width={flat ? 1.8 : 1}
                  y={Y.parcelLine}
                />
                <mesh
                  rotation-x={-Math.PI / 2}
                  position={[b.cx, Y.parcelFill, b.cz]}
                  renderOrder={10}
                >
                  <planeGeometry args={[b.w, b.d]} />
                  <meshBasicMaterial
                    color={P.parcel}
                    transparent
                    opacity={flat ? 0.22 : 0.06}
                    depthWrite={false}
                  />
                </mesh>
              </group>
            );
          })}

          <mesh rotation-x={-Math.PI / 2} position={[0, Y.primaryFill, 0]} renderOrder={11}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial
              color={P.primary}
              transparent
              opacity={flat ? 0.16 : 0.07}
              depthWrite={false}
            />
          </mesh>
          <ParcelOutline
            points={PRIMARY_PARCEL.geometry}
            color={P.parcelPrimary}
            width={2.4}
            y={Y.primaryLine}
          />
        </group>
      )}
    </group>
  );
}
