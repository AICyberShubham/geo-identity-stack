import { Layers } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { LayerKey } from "@/state/bhu";
import { useBhu } from "@/state/bhu";

const LAYERS: { key: LayerKey; label: string }[] = [
  { key: "parcels", label: "Parcels" },
  { key: "buildings", label: "Buildings" },
  { key: "floors", label: "Floors" },
  { key: "units", label: "Property Units" },
  { key: "roads", label: "Roads" },
  { key: "utilities", label: "Underground Utilities" },
  { key: "tunnels", label: "Tunnels" },
  { key: "labels", label: "Labels" },
  { key: "dem", label: "DEM / Terrain" },
];

export function LayerControl() {
  const { layers, toggleLayer } = useBhu();
  return (
    <div className="glass-panel w-[196px] rounded-sm p-2.5">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Layers className="size-3.5" />
        Layers
      </div>
      <div className="space-y-1.5">
        {LAYERS.map((l) => (
          <label
            key={l.key}
            className="flex cursor-pointer items-center gap-2 text-[12px] text-foreground/90"
          >
            <Checkbox
              checked={layers[l.key]}
              onCheckedChange={() => toggleLayer(l.key)}
              className="size-3.5"
            />
            {l.label}
          </label>
        ))}
      </div>
    </div>
  );
}
