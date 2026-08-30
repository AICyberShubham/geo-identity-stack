import { CheckCircle2, Cpu, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  "Loading spatial data",
  "Detecting building footprint",
  "Detecting horizontal planes",
  "Segmenting floors",
  "Creating volumetric units",
  "Validating topology",
  "Generating 3D ULPIN",
];

export function ExtractionOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setDone(false);
    const timers = STEPS.map((_, i) => window.setTimeout(() => setStep(i + 1), 520 * (i + 1)));
    const end = window.setTimeout(() => setDone(true), 520 * STEPS.length + 320);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="glass-panel w-[min(460px,calc(100%-2rem))] rounded-sm p-5">
        <div className="flex items-center gap-2">
          <Cpu className="size-4 text-primary" />
          <span className="text-[13px] font-semibold tracking-wide">AI-Assisted Extraction</span>
          <span className="tabular ml-auto text-[11px] text-muted-foreground">
            {Math.min(step, STEPS.length)}/{STEPS.length}
          </span>
        </div>

        <div className="mt-4 space-y-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                "flex items-center gap-2 rounded-sm px-2 py-1.5 text-[12px] transition-all",
                step > i ? "bg-secondary/50 text-foreground" : "text-muted-foreground opacity-50",
              )}
            >
              {step > i ? (
                <CheckCircle2 className="size-3.5 text-success" />
              ) : step === i ? (
                <Loader2 className="size-3.5 animate-spin text-primary" />
              ) : (
                <span className="size-3.5 rounded-full border border-border" />
              )}
              {s}
            </div>
          ))}
        </div>

        {done && (
          <div className="mt-4 rounded-sm border border-primary/40 bg-primary/8 p-3">
            <div className="text-[12px] font-semibold text-primary">Extraction Complete</div>
            <div className="tabular mt-2 grid grid-cols-2 gap-y-1 text-[12px]">
              <span className="text-muted-foreground">Building detected</span>
              <span className="text-right">1</span>
              <span className="text-muted-foreground">Floors detected</span>
              <span className="text-right">6</span>
              <span className="text-muted-foreground">Vertical units</span>
              <span className="text-right">12</span>
              <span className="text-muted-foreground">Basement</span>
              <span className="text-right">1</span>
              <span className="text-muted-foreground">Confidence</span>
              <span className="text-right text-success">96.4%</span>
            </div>
            <Button size="sm" className="mt-3 h-8 w-full text-[12px]" onClick={onClose}>
              Continue to 3D Model
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
