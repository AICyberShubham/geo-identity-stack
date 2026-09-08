import { Boxes, Cpu, EyeOff, Layers, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CameraControls } from "./CameraControls";
import { ConflictModal } from "./ConflictModal";
import { ExtractionOverlay } from "./ExtractionOverlay";
import { LayerControl } from "./LayerControl";
import { PropertyPanel } from "./PropertyPanel";
import { GISViewer } from "@/components/gis/GISViewer";
import { BUILDING, PRIMARY_PARCEL } from "@/data/demo";
import { useBhu } from "@/state/bhu";
import { cn } from "@/lib/utils";

function ViewToggle() {
  const { view, setView } = useBhu();
  return (
    <div className="glass-panel inline-flex rounded-sm p-0.5">
      {(["2d", "3d"] as const).map((v) => (
        <button
          key={v}
          onClick={() => setView(v)}
          className={cn(
            "rounded-sm px-3.5 py-1.5 text-[11.5px] font-semibold tracking-[0.12em] transition-colors",
            view === v
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {v.toUpperCase()} VIEW
        </button>
      ))}
    </div>
  );
}

export function Workspace() {
  const { view, showUnderground, setShowUnderground, layers } = useBhu();
  const [extracting, setExtracting] = useState(false);
  // on small screens the stacked panel would cover the map, so start collapsed
  const [panelOpen, setPanelOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 1280,
  );

  return (
    <div className="relative flex min-h-0 flex-1">
      <div className="relative min-w-0 flex-1">
        <GISViewer />

        {/* top-left controls */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start gap-2 p-3">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            <ViewToggle />
            <Button
              size="sm"
              variant="outline"
              className="glass-panel h-9 text-[12px]"
              onClick={() => {
                setExtracting(true);
              }}
            >
              <Cpu className="size-3.5" />
              Run AI Extraction
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "glass-panel h-9 text-[12px]",
                showUnderground && "border-accent/50 text-accent",
              )}
              onClick={() => setShowUnderground(!showUnderground)}
            >
              {showUnderground ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              Show Underground
            </Button>
          </div>

          <div className="pointer-events-auto ml-auto hidden lg:block">
            <LayerControl />
          </div>
        </div>

        {/* caption */}
        <div className="glass-panel pointer-events-none absolute bottom-3 left-3 rounded-sm px-3 py-2">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {view === "2d" ? "Traditional 2D Parcel" : "3D Property Model"}
          </div>
          <div className="tabular mt-0.5 text-[12px]">
            {PRIMARY_PARCEL.id} · {BUILDING.id}
          </div>
          <div className="tabular text-[10.5px] text-muted-foreground">
            26.8467° N, 80.9462° E · EPSG:32644 · {layers.dem ? "DEM ON" : "DEM OFF"}
          </div>
        </div>

        <div className="pointer-events-auto absolute bottom-3 right-3">
          <CameraControls />
        </div>

        <ConflictModal />
        <ExtractionOverlay open={extracting} onClose={() => setExtracting(false)} />

        <button
          onClick={() => setPanelOpen((p) => !p)}
          className="glass-panel absolute right-3 top-3 z-30 rounded-sm p-2 xl:hidden"
          aria-label="Toggle property panel"
        >
          <Layers className="size-4" />
        </button>
      </div>

      <aside
        className={cn(
          "w-[322px] shrink-0 overflow-auto border-l border-border bg-surface/70 backdrop-blur",
          panelOpen ? "hidden xl:block" : "hidden",
          "xl:block",
        )}
      >
        <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
          <Boxes className="size-4 text-primary" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Property Information
          </span>
        </div>
        <PropertyPanel />
      </aside>

      {/* mobile stacked panel */}
      {panelOpen && (
        <div className="glass-panel absolute inset-x-2 bottom-2 z-30 max-h-[46%] overflow-auto rounded-sm xl:hidden">
          <PropertyPanel />
        </div>
      )}
    </div>
  );
}
