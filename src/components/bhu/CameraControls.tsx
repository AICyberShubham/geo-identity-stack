import { Box, Compass, Maximize2, MoveHorizontal, RotateCcw, Square } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useBhu } from "@/state/bhu";
import { cn } from "@/lib/utils";

const BUTTONS = [
  { preset: "reset", label: "Reset View", Icon: RotateCcw },
  { preset: "top", label: "Top View", Icon: Square },
  { preset: "side", label: "Side View", Icon: MoveHorizontal },
  { preset: "iso", label: "Isometric View", Icon: Box },
] as const;

export function CameraControls() {
  const { setCameraPreset, cameraPreset } = useBhu();
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="glass-panel flex flex-col gap-1 rounded-sm p-1">
        {BUTTONS.map(({ preset, label, Icon }) => (
          <Tooltip key={preset}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCameraPreset(preset)}
                className={cn(
                  "rounded-sm p-2 transition-colors",
                  cameraPreset.preset === preset
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
                aria-label={label}
              >
                <Icon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="glass-panel flex size-14 items-center justify-center rounded-full">
        <div className="relative flex size-11 items-center justify-center rounded-full border border-primary/30">
          <Compass className="size-5 text-primary" />
          <span className="tabular absolute -top-0.5 text-[8px] font-bold text-primary">N</span>
          <span className="tabular absolute -bottom-0.5 text-[8px] text-muted-foreground">S</span>
        </div>
      </div>

      <div className="glass-panel hidden items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] text-muted-foreground md:flex">
        <Maximize2 className="size-3" />
        Drag orbit · Scroll zoom · Right-drag pan
      </div>
    </div>
  );
}
