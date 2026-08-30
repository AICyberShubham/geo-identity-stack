import { OrbitControls, Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { Ground } from "./Ground";
import { Building3D } from "./Building3D";
import { UndergroundLayer } from "./UndergroundLayer";
import { PRIMARY_PARCEL } from "@/data/demo";
import { P } from "@/lib/palette";
import { useBhu } from "@/state/bhu";

const PRESETS: Record<string, [number, number, number]> = {
  reset: [46, 34, 58],
  top: [0.01, 96, 0.01],
  side: [92, 12, 0],
  iso: [58, 46, 58],
};

function CameraRig() {
  const controls = useRef<any>(null);
  const { camera } = useThree();
  const { cameraPreset, focus, view } = useBhu();
  const desiredPos = useRef(new THREE.Vector3(...PRESETS.reset));
  const desiredTarget = useRef(new THREE.Vector3(0, 6, 0));

  useEffect(() => {
    const p = PRESETS[cameraPreset.preset] ?? PRESETS.reset;
    desiredPos.current.set(...p);
    desiredTarget.current.set(0, cameraPreset.preset === "top" ? 0 : 6, 0);
  }, [cameraPreset]);

  useEffect(() => {
    if (view === "2d") {
      desiredPos.current.set(0.01, 96, 0.01);
      desiredTarget.current.set(0, 0, 0);
    } else {
      desiredPos.current.set(...PRESETS.iso);
      desiredTarget.current.set(0, 8, 0);
    }
  }, [view]);

  useEffect(() => {
    if (!focus) return;
    const [x, y, z] = focus.target;
    desiredTarget.current.set(x, y, z);
    desiredPos.current.set(x + focus.distance * 0.7, y + focus.distance * 0.55, z + focus.distance * 0.8);
  }, [focus]);

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-3.4 * Math.min(delta, 0.05));
    camera.position.lerp(desiredPos.current, k);
    if (controls.current) {
      controls.current.target.lerp(desiredTarget.current, k);
      controls.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      enableDamping
      dampingFactor={0.08}
      minDistance={18}
      maxDistance={220}
      maxPolarAngle={Math.PI / 2.05}
      onStart={() => {
        desiredPos.current.copy(camera.position);
        if (controls.current) desiredTarget.current.copy(controls.current.target);
      }}
    />
  );
}

function SceneLights() {
  return (
    <>
      <hemisphereLight args={["#8fb6d8", "#0f141b", 0.75]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[48, 62, 34]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
      />
      <directionalLight position={[-40, 20, -30]} intensity={0.35} color={P.primary} />
    </>
  );
}

function NorthMarker() {
  const { layers } = useBhu();
  if (!layers.labels) return null;
  return (
    <Html position={[0, 0.4, -60]} center distanceFactor={140}>
      <div className="tabular flex flex-col items-center text-[11px] text-primary/80">
        <span className="text-sm font-bold">N</span>
        <span className="text-muted-foreground">↑</span>
      </div>
    </Html>
  );
}

function ParcelLabel() {
  const { layers } = useBhu();
  if (!layers.labels) return null;
  return (
    <Html position={[-25, 0.4, 27]} distanceFactor={120}>
      <div className="tabular whitespace-nowrap rounded-sm border border-primary/40 bg-background/85 px-2 py-1 text-[11px] text-primary">
        {PRIMARY_PARCEL.id} · {PRIMARY_PARCEL.area.toLocaleString()} m²
      </div>
    </Html>
  );
}

export function GISViewer() {
  const { select } = useBhu();

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: PRESETS.reset, fov: 42, near: 0.5, far: 1200 }}
      onPointerMissed={() => select({ kind: null, id: null })}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[P.bg]} />
      <fog attach="fog" args={[P.bg, 150, 340]} />
      <SceneLights />
      <Suspense fallback={null}>
        <Ground />
        <Building3D />
        <UndergroundLayer />
        <NorthMarker />
        <ParcelLabel />
      </Suspense>
      <CameraRig />
    </Canvas>
  );
}
