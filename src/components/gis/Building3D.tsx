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

/** Warm residential wall colours, varied per floor so the tower reads like a real building. */
const WALL_COLORS = [
  P.wallCream,
  P.wallSand,
  P.wallCream,
  P.wallTerracotta,
  P.wallSand,
  P.wallStone,
  P.wallBlue,
];

/** A grid of framed windows on one facade side, some of them lit. */
function WindowWall({
  width,
  height,
  seed,
  cols = 3,
}: {
  width: number;
  height: number;
  seed: number;
  cols?: number;
}) {
  const ww = Math.min(1.5, (width / cols) * 0.52);
  const wh = Math.min(1.5, height * 0.5);
  const items = [];
  for (let c = 0; c < cols; c++) {
    const x = (c - (cols - 1) / 2) * (width / cols);
    const lit = (Math.sin((c + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1;
    const isLit = Math.abs(lit) > 0.55;
    items.push(
      <group key={c} position={[x, 0, 0]}>
        {/* protruding surround: real geometry, so the facade has depth from any angle */}
        <mesh position={[0, 0, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[ww + 0.26, wh + 0.26, 0.12]} />
          <meshStandardMaterial color={P.surround} roughness={0.95} />
        </mesh>
        {/* recessed glass */}
        <mesh position={[0, 0, -0.03]}>
          <boxGeometry args={[ww, wh, 0.06]} />
          <meshStandardMaterial
            color={P.windowGlass}
            emissive={isLit ? P.windowLit : P.windowGlass}
            emissiveIntensity={isLit ? 0.7 : 0.1}
            roughness={0.12}
            metalness={0.55}
          />
        </mesh>
        {/* mullions */}
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[0.06, wh, 0.06]} />
          <meshStandardMaterial color={P.windowFrame} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[ww, 0.06, 0.06]} />
          <meshStandardMaterial color={P.windowFrame} roughness={0.7} />
        </mesh>
        {/* sill / shading ledge */}
        <mesh position={[0, -wh / 2 - 0.18, 0.12]} castShadow>
          <boxGeometry args={[ww + 0.34, 0.08, 0.26]} />
          <meshStandardMaterial color={P.surround} roughness={0.96} />
        </mesh>
      </group>,
    );
  }
  return <>{items}</>;
}

function WindowBand({
  w,
  d,
  y,
  h,
  seed,
}: {
  w: number;
  d: number;
  y: number;
  h: number;
  seed: number;
}) {
  return (
    <group position={[0, y, 0]}>
      <group position={[0, 0, d / 2 + 0.06]}>
        <WindowWall width={w} height={h} seed={seed} />
      </group>
      <group position={[0, 0, -d / 2 - 0.06]} rotation-y={Math.PI}>
        <WindowWall width={w} height={h} seed={seed + 3.1} />
      </group>
      <group position={[w / 2 + 0.06, 0, 0]} rotation-y={Math.PI / 2}>
        <WindowWall width={d} height={h} seed={seed + 6.4} cols={4} />
      </group>
      <group position={[-w / 2 - 0.06, 0, 0]} rotation-y={-Math.PI / 2}>
        <WindowWall width={d} height={h} seed={seed + 9.7} cols={4} />
      </group>
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
    // slide the storey OUT of the stack instead of lifting it into the slab
    // above — overlapping geometry was what caused the flicker on select
    const targetZ = selected ? depth * 1.25 : isHovered ? 0.6 : 0;
    const targetY = selected ? 0.9 : 0;
    const targetX = x + conflictShift;
    const targetS = view === "3d" ? 1 : 0.001;
    group.current.position.y += (targetY - group.current.position.y) * k;
    group.current.position.z += (targetZ - group.current.position.z) * k;
    group.current.position.x += (targetX - group.current.position.x) * k;
    group.current.scale.y += (targetS - group.current.scale.y) * k;
  });


  const floorNo = parseInt(unit.floorId.replace(/\D/g, ""), 10) || 1;
  const wall = WALL_COLORS[floorNo % WALL_COLORS.length]!;
  const color = conflictShift !== 0 ? P.danger : selected ? P.primary : wall;

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
          roughness={0.85}
          metalness={0.04}
          emissive={selected ? P.primary : conflictShift !== 0 ? P.danger : "#000000"}
          emissiveIntensity={selected ? 0.18 : conflictShift !== 0 ? 0.35 : 0}
        />

      </mesh>

      {/* painted cornice band at the top of each storey */}
      <mesh position={[0, baseY + height / 2 - 0.18, 0]}>
        <boxGeometry args={[width + 0.14, 0.22, depth + 0.14]} />
        <meshStandardMaterial color={P.surround} roughness={0.94} />
      </mesh>

      <WindowBand w={width} d={depth} y={baseY} h={height * 0.5} seed={floorNo + x} />

      {/* balcony */}
      <mesh position={[0, unit.zMin + 0.35, depth / 2 + 0.7]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.55, 0.16, 1.4]} />
        <meshStandardMaterial color={P.trim} roughness={0.9} />
      </mesh>
      <mesh position={[0, unit.zMin + 0.8, depth / 2 + 1.38]} castShadow>
        <boxGeometry args={[width * 0.55, 0.85, 0.05]} />
        <meshStandardMaterial
          color={P.windowGlass}
          transparent
          opacity={0.45}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0, unit.zMin + 1.25, depth / 2 + 1.38]}>
        <boxGeometry args={[width * 0.55, 0.08, 0.09]} />
        <meshStandardMaterial color={P.railing} metalness={0.6} roughness={0.4} />
      </mesh>
      {/* balcony door */}
      <mesh position={[width * 0.22, unit.zMin + 1.4, depth / 2 + 0.07]}>
        <planeGeometry args={[0.9, 2.1]} />
        <meshStandardMaterial color={P.door} roughness={0.85} />
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
      <boxGeometry args={[W + 0.6, 0.2, D + 0.6]} />
      <meshStandardMaterial color={P.trim} roughness={0.94} metalness={0.03} />
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
    // hide the collapsed shell in flat view so it never z-fights with the ground
    shell.current.visible = shell.current.scale.y > 0.02;
  });

  if (!layers.buildings) return null;

  return (
    <group>
      {/* footprint always visible (2D + 3D) — no depth write, so it can't z-fight the plot fills */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.2, 0]} renderOrder={20}>
        <planeGeometry args={[W, D]} />
        <meshBasicMaterial
          color={P.primary}
          transparent
          opacity={view === "2d" ? 0.28 : 0.12}
          depthWrite={false}
        />
      </mesh>
      <Line
        points={
          [
            [-W / 2, 0.22, -D / 2],
            [W / 2, 0.22, -D / 2],
            [W / 2, 0.22, D / 2],
            [-W / 2, 0.22, D / 2],
            [-W / 2, 0.22, -D / 2],
          ] as [number, number, number][]
        }
        color={P.primary}
        lineWidth={1.6}
        depthWrite={false}
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
                      select({ kind: "unit", id: floor.units[0]!.id });
                    }}
                  >
                    <boxGeometry args={[W * 0.34, 1.8, D * 0.4]} />
                    <meshStandardMaterial
                      color={
                        selection.id === floor.units[0]!.id ? P.primary : P.wallStone
                      }
                      roughness={0.7}
                    />
                  </mesh>
                  {/* roof deck */}
                  <mesh position={[0, floor.zMin + 0.13, 0]} receiveShadow>
                    <boxGeometry args={[W + 0.7, 0.06, D + 0.7]} />
                    <meshStandardMaterial color={P.roofDeck} roughness={0.95} />
                  </mesh>
                  {/* parapet on all four edges */}
                  {[
                    [0, D / 2, W + 0.9, 0.16],
                    [0, -D / 2, W + 0.9, 0.16],
                    [W / 2, 0, 0.16, D + 0.9],
                    [-W / 2, 0, 0.16, D + 0.9],
                  ].map((p, i) => (
                    <mesh key={i} position={[p[0]!, floor.zMin + 0.55, p[1]!]} castShadow>
                      <boxGeometry args={[p[2]!, 0.9, p[3]!]} />
                      <meshStandardMaterial color={P.trim} roughness={0.9} />
                    </mesh>
                  ))}
                  {/* water tanks + AC units */}
                  {[-1, 1].map((s) => (
                    <mesh key={s} position={[s * W * 0.3, floor.zMin + 1.5, D * 0.28]} castShadow>
                      <cylinderGeometry args={[1, 1.1, 1.6, 12]} />
                      <meshStandardMaterial color={P.waterTank} roughness={0.6} />
                    </mesh>
                  ))}
                  {[-1.4, 0, 1.4].map((s) => (
                    <mesh
                      key={s}
                      position={[s * 2, floor.zMin + 0.55, -D * 0.3]}
                      castShadow
                    >
                      <boxGeometry args={[1.2, 0.8, 0.9]} />
                      <meshStandardMaterial color={P.railing} metalness={0.5} roughness={0.5} />
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
              const u = floor.units[0]!;
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
          <meshStandardMaterial color={P.wallStone} roughness={0.85} />
        </mesh>

        {/* corner pilasters: vertical relief so the mass never reads as a flat slab */}
        {[
          [-W / 2, -D / 2],
          [W / 2, -D / 2],
          [W / 2, D / 2],
          [-W / 2, D / 2],
        ].map(([px, pz], i) => (
          <mesh key={i} position={[px!, 9.4, pz!]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 18.8, 1.1]} />
            <meshStandardMaterial color={P.wallStone} roughness={0.88} />
          </mesh>
        ))}

        {/* plinth + entrance porch at street level */}
        <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
          <boxGeometry args={[W + 1.6, 0.7, D + 1.6]} />
          <meshStandardMaterial color={P.trim} roughness={0.95} />
        </mesh>
        <mesh position={[0, 1.5, D / 2 + 1.6]} castShadow receiveShadow>
          <boxGeometry args={[5.4, 2.6, 2.4]} />
          <meshStandardMaterial color={P.wallStone} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.3, D / 2 + 2.82]}>
          <boxGeometry args={[3.2, 2.1, 0.12]} />
          <meshStandardMaterial
            color={P.windowGlass}
            transparent
            opacity={0.55}
            roughness={0.15}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0, 2.95, D / 2 + 2.2]} castShadow>
          <boxGeometry args={[6.6, 0.22, 3.6]} />
          <meshStandardMaterial color={P.trim} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
