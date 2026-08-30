import { Html, Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { BUILDING, FLOORS } from "@/data/demo";
import { P } from "@/lib/palette";
import { useBhu } from "@/state/bhu";
import type { PropertyUnit } from "@/data/types";

const W = BUILDING.footprint.width;
const D = BUILDING.footprint.depth;
const GAP = 0.8;
const UNIT_W = (W - GAP) / 2;

function WindowBand({ w, d, y, h }: { w: number; d: number; y: number; h: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0, d / 2 + 0.02]}>
        <planeGeometry args={[w * 0.82, h]} />
        <meshStandardMaterial
          color={P.glass}
          emissive={P.glassLit}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0, 0, -d / 2 - 0.02]} rotation-y={Math.PI}>
        <planeGeometry args={[w * 0.82, h]} />
        <meshStandardMaterial
          color={P.glass}
          emissive={P.glassLit}
          emissiveIntensity={0.25}
          roughness={0.25}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[w / 2 + 0.02, 0, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[d * 0.7, h]} />
        <meshStandardMaterial
          color={P.glass}
          emissive={P.glassLit}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

function UnitVolume({
  unit,
  x,
  width,
  depth,
  conflictShift,
}: {
  unit: PropertyUnit;
  x: number;
  width: number;
  depth: number;
  conflictShift: number;
}) {
  const { selection, select, hovered, setHovered, layers, view } = useBhu();
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const [localHover, setLocalHover] = useState(false);

  const selected = selection.kind === "unit" && selection.id === unit.id;
  const isHovered = localHover || hovered === unit.id;
  const height = unit.zMax - unit.zMin - 0.25;
  const baseY = unit.zMin + height / 2 + 0.12;

  useFrame((_, delta) => {
    if (!group.current) return;
    const k = 1 - Math.exp(-8 * Math.min(delta, 0.05));
    const targetY = selected ? 2.1 : isHovered ? 0.45 : 0;
    const targetX = x + conflictShift;
    const targetS = view === "3d" ? 1 : 0.001;
    group.current.position.y += (targetY - group.current.position.y) * k;
    group.current.position.x += (targetX - group.current.position.x) * k;
    group.current.scale.y += (targetS - group.current.scale.y) * k;
  });

  const color = conflictShift !== 0 ? P.danger : selected ? P.primary : P.facade;

  return (
    <group ref={group} position={[x, 0, 0]}>
      <mesh
        ref={mesh}
        position={[0, baseY, 0]}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setLocalHover(true);
          setHovered(unit.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setLocalHover(false);
          setHovered(null);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          select({ kind: "unit", id: unit.id });
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          roughness={0.62}
          metalness={0.18}
          emissive={selected ? P.primary : conflictShift !== 0 ? P.danger : "#000000"}
          emissiveIntensity={selected ? 0.28 : conflictShift !== 0 ? 0.4 : 0}
          transparent
          opacity={selected || isHovered ? 0.98 : 0.92}
        />
      </mesh>

      <WindowBand w={width} d={depth} y={baseY} h={height * 0.5} />

      {/* balcony */}
      <mesh position={[0, unit.zMin + 0.35, depth / 2 + 0.7]} castShadow>
        <boxGeometry args={[width * 0.55, 0.14, 1.4]} />
        <meshStandardMaterial color={P.slab} roughness={0.8} />
      </mesh>
      <mesh position={[0, unit.zMin + 0.8, depth / 2 + 1.35]}>
        <boxGeometry args={[width * 0.55, 0.9, 0.06]} />
        <meshStandardMaterial
          color={P.glass}
          transparent
          opacity={0.4}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {(selected || isHovered) && (
        <Line
          points={
            [
              [-width / 2, baseY - height / 2, -depth / 2],
              [width / 2, baseY - height / 2, -depth / 2],
              [width / 2, baseY - height / 2, depth / 2],
              [-width / 2, baseY - height / 2, depth / 2],
              [-width / 2, baseY - height / 2, -depth / 2],
            ] as [number, number, number][]
          }
          color={conflictShift !== 0 ? P.danger : P.primary}
          lineWidth={2}
        />
      )}

      {selected && layers.labels && (
        <Html position={[0, baseY + height / 2 + 1.6, 0]} center distanceFactor={70}>
          <div className="tabular whitespace-nowrap rounded-sm border border-primary/60 bg-background/90 px-2 py-1 text-[11px] font-semibold text-primary shadow-lg">
            {unit.id}
          </div>
        </Html>
      )}
    </group>
  );
}

function FloorSlab({ y }: { y: number }) {
  return (
    <mesh position={[0, y, 0]} receiveShadow castShadow>
      <boxGeometry args={[W + 0.9, 0.22, D + 0.9]} />
      <meshStandardMaterial color={P.slab} roughness={0.85} metalness={0.1} />
    </mesh>
  );
}

export function Building3D() {
  const { layers, showUnderground, view, conflict, selection, select } = useBhu();
  const shell = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!shell.current) return;
    const k = 1 - Math.exp(-6 * Math.min(delta, 0.05));
    const target = view === "3d" ? 1 : 0.0001;
    shell.current.scale.y += (target - shell.current.scale.y) * k;
  });

  if (!layers.buildings) return null;

  return (
    <group>
      {/* footprint always visible (2D + 3D) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.08, 0]}>
        <planeGeometry args={[W, D]} />
        <meshBasicMaterial color={P.primary} transparent opacity={view === "2d" ? 0.28 : 0.12} />
      </mesh>
      <Line
        points={
          [
            [-W / 2, 0.09, -D / 2],
            [W / 2, 0.09, -D / 2],
            [W / 2, 0.09, D / 2],
            [-W / 2, 0.09, D / 2],
            [-W / 2, 0.09, -D / 2],
          ] as [number, number, number][]
        }
        color={P.primary}
        lineWidth={1.6}
      />

      <group ref={shell} scale-y={0.0001}>
        {layers.floors &&
          FLOORS.map((floor) => {
            const isBasement = floor.number === 0;
            const isRoof = floor.number === 7;
            if (isBasement && !showUnderground) return null;

            if (isRoof) {
              return (
                <group key={floor.id}>
                  <FloorSlab y={floor.zMin} />
                  <mesh
                    position={[0, floor.zMin + 0.9, 0]}
                    castShadow
                    onClick={(e) => {
                      e.stopPropagation();
                      select({ kind: "unit", id: floor.units[0].id });
                    }}
                  >
                    <boxGeometry args={[W * 0.34, 1.8, D * 0.4]} />
                    <meshStandardMaterial
                      color={
                        selection.id === floor.units[0].id ? P.primary : P.facadeLight
                      }
                      roughness={0.7}
                    />
                  </mesh>
                  {/* parapet */}
                  {[
                    [0, D / 2],
                    [0, -D / 2],
                  ].map(([x, z], i) => (
                    <mesh key={i} position={[x, floor.zMin + 0.55, z]}>
                      <boxGeometry args={[W + 0.9, 0.9, 0.16]} />
                      <meshStandardMaterial color={P.slab} transparent opacity={0.7} />
                    </mesh>
                  ))}
                  <mesh position={[W * 0.34, floor.zMin + 1.4, -D * 0.28]}>
                    <cylinderGeometry args={[0.06, 0.06, 2.8, 6]} />
                    <meshStandardMaterial
                      color={P.accent}
                      emissive={P.accent}
                      emissiveIntensity={0.6}
                    />
                  </mesh>
                </group>
              );
            }

            if (isBasement) {
              const u = floor.units[0];
              const sel = selection.id === u.id;
              return (
                <group key={floor.id}>
                  <mesh
                    position={[0, (floor.zMin + floor.zMax) / 2, 0]}
                    onClick={(e) => {
                      e.stopPropagation();
                      select({ kind: "unit", id: u.id });
                    }}
                  >
                    <boxGeometry args={[W + 4, floor.zMax - floor.zMin - 0.2, D + 4]} />
                    <meshStandardMaterial
                      color={sel ? P.primary : P.basement}
                      transparent
                      opacity={0.55}
                      roughness={0.9}
                      emissive={sel ? P.primary : "#000000"}
                      emissiveIntensity={sel ? 0.25 : 0}
                    />
                  </mesh>
                  {/* parking ramp */}
                  <mesh position={[W / 2 + 4, -1.5, D / 2 + 2]} rotation-z={0.35}>
                    <boxGeometry args={[8, 0.2, 5]} />
                    <meshStandardMaterial color={P.road} />
                  </mesh>
                </group>
              );
            }

            return (
              <group key={floor.id}>
                <FloorSlab y={floor.zMin} />
                {floor.units.map((u, i) => {
                  const x = i === 0 ? -(UNIT_W + GAP) / 2 : (UNIT_W + GAP) / 2;
                  const shift =
                    conflict && u.id === "F04-U06" ? -(UNIT_W * 0.34) : 0;
                  return (
                    <UnitVolume
                      key={u.id}
                      unit={u}
                      x={x}
                      width={UNIT_W}
                      depth={D}
                      conflictShift={shift}
                    />
                  );
                })}
              </group>
            );
          })}

        {/* core / stairwell */}
        <mesh position={[0, 9.2, 0]} castShadow>
          <boxGeometry args={[GAP * 0.9, 18.4, D * 0.55]} />
          <meshStandardMaterial color={P.facadeLight} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
