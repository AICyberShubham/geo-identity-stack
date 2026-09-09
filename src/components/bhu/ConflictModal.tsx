import { TriangleAlert, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BASE_CHECKS } from "@/data/demo";
import { useBhu } from "@/state/bhu";

export function ConflictModal() {
  const { conflict, resolveConflict, setChecks } = useBhu();
  if (!conflict) return null;

  return (
    <div className="pointer-events-auto absolute left-1/2 top-6 z-30 w-[min(440px,calc(100%-2rem))] -translate-x-1/2">
      <div className="glass-panel animate-conflict rounded-sm border-destructive/50 p-4">
        <div className="flex items-center gap-2 text-destructive">
          <TriangleAlert className="size-4" />
          <span className="text-[13px] font-bold tracking-wide">SPATIAL CONFLICT DETECTED</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Conflict Type
            </div>
            <div>{conflict.type}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Affected Units
            </div>
            <div className="tabular">{conflict.units.join("  /  ")}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Overlap</div>
            <div className="tabular">{conflict.overlap} m²</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Severity
            </div>
            <div className="text-destructive">{conflict.severity}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Recommended Action
            </div>
            <div>{conflict.action}</div>
          </div>
        </div>
        <Button
          size="sm"
          className="mt-3 h-8 w-full text-[12px]"
          onClick={() => {
            resolveConflict();
            setChecks(BASE_CHECKS.map((c) => ({ ...c, state: "pass" })));
            toast.success("Conflict resolved", { description: "Valid geometry restored" });
          }}
        >
          <Wrench className="size-3.5" />
          Resolve Conflict
        </Button>
      </div>
    </div>
  );
}
