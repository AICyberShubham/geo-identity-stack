import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { ALL_PARCELS, PRIMARY_PARCEL, ROADS } from "@/data/demo";
import { P } from "@/lib/palette";
import { useBhu } from "@/state/bhu";

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
  return <Line points={pts} color={color} lineWidth={width} />;
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

export function Ground() {
  const { layers, showUnderground, view } = useBhu();
  const groundOpacity = showUnderground ? 0.32 : 1;

  return (
    <group>
      {/* terrain plate */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[420, 420]} />
        <meshStandardMaterial
          color={layers.dem ? P.groundDeep : P.ground}
          roughness={0.95}
          metalness={0.05}
          transparent
          opacity={groundOpacity}
          polygonOffset
          polygonOffsetFactor={4}
          polygonOffsetUnits={4}
        />
      </mesh>

      {/* GIS grid */}
      <gridHelper
        args={[420, 84, P.gridStrong, P.grid]}
        position={[0, 0.01, 0]}
        material-transparent
        material-opacity={showUnderground ? 0.18 : 0.42}
      />

      {layers.dem && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 0]}>
          <planeGeometry args={[420, 420, 48, 48]} />
          <meshBasicMaterial color={P.primary} wireframe transparent opacity={0.08} />
        </mesh>
      )}

      {/* roads */}
      {layers.roads &&
        ROADS.map((r) => {
          const a = r.points[0]!;
          const b = r.points[1]!;
          const horizontal = a[1] === b[1];
          const length = horizontal ? Math.abs(b[0] - a[0]) : Math.abs(b[1] - a[1]);
          const cx = (a[0] + b[0]) / 2;
          const cz = (a[1] + b[1]) / 2;
          return (
            <group key={r.id} position={[cx, 0.03, cz]}>
              <mesh rotation-x={-Math.PI / 2}>
                <planeGeometry
                  args={horizontal ? [length, r.width] : [r.width, length]}
                />
                <meshStandardMaterial
                  color={P.road}
                  roughness={1}
                  transparent
                  opacity={groundOpacity}
                />
              </mesh>
              <Line
                points={
                  horizontal
                    ? [
                        [-length / 2, 0.02, 0],
                        [length / 2, 0.02, 0],
                      ]
                    : [
                        [0, 0.02, -length / 2],
                        [0, 0.02, length / 2],
                      ]
                }
                color={P.roadLine}
                lineWidth={1}
                dashed
                dashSize={3}
                gapSize={3}
                transparent
                opacity={0.6}
              />
            </group>
          );
        })}

      {/* parcels */}
      {layers.parcels && (
        <group>
          {ALL_PARCELS.filter((p) => !p.primary).map((p) => {
            const b = bbox(p.geometry);
            return (
              <group key={p.id}>
                <ParcelOutline points={p.geometry} color={P.parcel} width={1} y={0.05} />
                {/* flat cadastral fill: readable in 2D map view */}
                <mesh rotation-x={-Math.PI / 2} position={[b.cx, 0.035, b.cz]}>
                  <planeGeometry args={[b.w, b.d]} />
                  <meshBasicMaterial
                    color={P.parcel}
                    transparent
                    opacity={view === "2d" ? 0.14 : 0.05}
                    depthWrite={false}
                  />
                </mesh>
              </group>
            );
          })}
          <ParcelOutline
            points={PRIMARY_PARCEL.geometry}
            color={P.parcelPrimary}
            width={2.4}
            y={0.06}
          />
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.04, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial color={P.primary} transparent opacity={0.07} />
          </mesh>
        </group>
      )}
    </group>
  );
}
