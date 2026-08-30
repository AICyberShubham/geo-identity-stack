import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { BASE_CHECKS } from "@/data/demo";
import type { Selection, SpatialConflict, ValidationCheck } from "@/data/types";

export type LayerKey =
  | "parcels"
  | "buildings"
  | "floors"
  | "units"
  | "roads"
  | "utilities"
  | "tunnels"
  | "labels"
  | "dem";

export type CameraPreset = "reset" | "top" | "side" | "iso";

export interface FocusRequest {
  target: [number, number, number];
  distance: number;
  ts: number;
}

export const DEFAULT_LAYERS: Record<LayerKey, boolean> = {
  parcels: true,
  buildings: true,
  floors: true,
  units: true,
  roads: true,
  utilities: false,
  tunnels: false,
  labels: true,
  dem: false,
};

interface BhuState {
  view: "2d" | "3d";
  setView: (v: "2d" | "3d") => void;
  layers: Record<LayerKey, boolean>;
  toggleLayer: (k: LayerKey) => void;
  setLayer: (k: LayerKey, v: boolean) => void;
  showUnderground: boolean;
  setShowUnderground: (v: boolean) => void;
  selection: Selection;
  select: (s: Selection) => void;
  hovered: string | null;
  setHovered: (id: string | null) => void;
  conflict: SpatialConflict | null;
  simulateConflict: () => void;
  resolveConflict: () => void;
  checks: ValidationCheck[];
  setChecks: (c: ValidationCheck[]) => void;
  validatedAt: string | null;
  setValidatedAt: (v: string | null) => void;
  cameraPreset: { preset: CameraPreset; ts: number };
  setCameraPreset: (p: CameraPreset) => void;
  focus: FocusRequest | null;
  focusOn: (target: [number, number, number], distance?: number) => void;
  generatedUlpins: string[];
  addGeneratedUlpin: (u: string) => void;
}

const Ctx = createContext<BhuState | null>(null);

export const CONFLICT: SpatialConflict = {
  type: "Vertical Volume Overlap",
  units: ["F04-U05", "F04-U06"],
  overlap: 8.4,
  severity: "High",
  action: "Review property geometry.",
};

export function BhuProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<"2d" | "3d">("2d");
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [showUnderground, setShowUnderground] = useState(false);
  const [selection, setSelection] = useState<Selection>({ kind: null, id: null });
  const [hovered, setHovered] = useState<string | null>(null);
  const [conflict, setConflict] = useState<SpatialConflict | null>(null);
  const [checks, setChecks] = useState<ValidationCheck[]>(BASE_CHECKS);
  const [validatedAt, setValidatedAt] = useState<string | null>(null);
  const [cameraPreset, setCameraPresetState] = useState({ preset: "reset" as CameraPreset, ts: 0 });
  const [focus, setFocus] = useState<FocusRequest | null>(null);
  const [generatedUlpins, setGenerated] = useState<string[]>([]);

  const toggleLayer = useCallback((k: LayerKey) => {
    setLayers((prev) => ({ ...prev, [k]: !prev[k] }));
  }, []);
  const setLayer = useCallback((k: LayerKey, v: boolean) => {
    setLayers((prev) => ({ ...prev, [k]: v }));
  }, []);

  const setCameraPreset = useCallback((preset: CameraPreset) => {
    setCameraPresetState({ preset, ts: Date.now() });
  }, []);

  const focusOn = useCallback((target: [number, number, number], distance = 48) => {
    setFocus({ target, distance, ts: Date.now() });
  }, []);

  const value = useMemo<BhuState>(
    () => ({
      view,
      setView,
      layers,
      toggleLayer,
      setLayer,
      showUnderground,
      setShowUnderground: (v: boolean) => {
        setShowUnderground(v);
        setLayers((prev) => ({ ...prev, utilities: v, tunnels: v }));
      },
      selection,
      select: setSelection,
      hovered,
      setHovered,
      conflict,
      simulateConflict: () => setConflict(CONFLICT),
      resolveConflict: () => setConflict(null),
      checks,
      setChecks,
      validatedAt,
      setValidatedAt,
      cameraPreset,
      setCameraPreset,
      focus,
      focusOn,
      generatedUlpins,
      addGeneratedUlpin: (u: string) =>
        setGenerated((prev) => (prev.includes(u) ? prev : [...prev, u])),
    }),
    [
      view,
      layers,
      toggleLayer,
      setLayer,
      showUnderground,
      selection,
      hovered,
      conflict,
      checks,
      validatedAt,
      cameraPreset,
      setCameraPreset,
      focus,
      focusOn,
      generatedUlpins,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBhu() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBhu must be used inside BhuProvider");
  return ctx;
}
