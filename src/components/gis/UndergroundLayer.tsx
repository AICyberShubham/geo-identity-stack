import { Html } from "@react-three/drei";
import { UNDERGROUND_ASSETS } from "@/data/demo";
import { P } from "@/lib/palette";
import { useBhu } from "@/state/bhu";

export function UndergroundLayer() {
  const { showUnderground, layers, selection, select, view } = useBhu();
  if (!showUnderground || view === "2d") return null;

  return (
    <group>
      {UNDERGROUND_ASSETS.map((a) => {
        const isTunnel = a.type.includes("Tunnel");
        if (isTunnel && !layers.tunnels) return null;
        if (!isTunnel && !layers.utilities) return null;
        const selected = selection.kind === "underground" && selection.id === a.id;
        const h = a.zMax - a.zMin;
        const y = (a.zMin + a.zMax) / 2;
        return (
          <group key={a.id}>
            <mesh
              position={[a.box.x, y, a.box.z]}
              onClick={(e) => {
                e.stopPropagation();
                select({ kind: "underground", id: a.id });
              }}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "auto")}
            >
              <boxGeometry args={[a.box.width, h, a.box.depth]} />
              <meshStandardMaterial
                color={selected ? P.primary : isTunnel ? P.tunnel : P.utility}
                emissive={selected ? P.primary : isTunnel ? P.tunnel : P.utility}
                emissiveIntensity={selected ? 0.55 : 0.28}
                transparent
                opacity={0.7}
                roughness={0.5}
              />
            </mesh>
            {layers.labels && (
              <Html position={[a.box.x, y + h / 2 + 1.4, a.box.z]} center distanceFactor={110}>
                <div className="tabular whitespace-nowrap rounded-sm border border-border bg-background/85 px-2 py-0.5 text-[10px] text-muted-foreground">
                  {a.id} · {a.type}
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* excavation shell to read depth */}
      <mesh position={[0, -7, 0]}>
        <boxGeometry args={[200, 14, 200]} />
        <meshBasicMaterial color={P.primary} wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
