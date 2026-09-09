import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BASE_CHECKS } from "@/data/demo";
import { useBhu } from "@/state/bhu";
import { cn } from "@/lib/utils";

export function ValidationPanel() {
  const {
    checks,
    setChecks,
    validatedAt,
    setValidatedAt,
    conflict,
    simulateConflict,
    resolveConflict,
    select,
    setView,
  } = useBhu();

  const running = checks.some((c) => c.state === "running");
  const allPass = checks.every((c) => c.state === "pass");
  const anyFail = checks.some((c) => c.state === "fail");

  function runValidation() {
    const failing = !!conflict;
    setChecks(BASE_CHECKS.map((c) => ({ ...c, state: "running" })));
    BASE_CHECKS.forEach((c, i) => {
      window.setTimeout(
        () => {
          setChecksAt(i, failing && c.id === "overlap" ? "fail" : "pass");
        },
        320 * (i + 1),
      );
    });
    window.setTimeout(
      () => {
        setValidatedAt(new Date().toLocaleTimeString("en-IN", { hour12: false }));
        if (failing)
          toast.error("Spatial validation failed", { description: "1 topology conflict detected" });
        else toast.success("All spatial checks passed", { description: "14 volumes validated" });
      },
      320 * BASE_CHECKS.length + 150,
    );
  }

  function setChecksAt(index: number, state: "pass" | "fail") {
    setChecks(
      BASE_CHECKS.map((c, i) => ({
        ...c,
        state:
          i < index
            ? conflict && c.id === "overlap"
              ? "fail"
              : "pass"
            : i === index
              ? state
              : "running",
      })),
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border bg-surface/80 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-2">
        <Button size="sm" className="h-8 text-[12px]" onClick={runValidation} disabled={running}>
          {running ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <ShieldCheck className="size-3.5" />
          )}
          Run Spatial Validation
        </Button>
        {conflict ? (
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-success/50 text-[12px] text-success"
            onClick={() => {
              resolveConflict();
              setChecks(BASE_CHECKS.map((c) => ({ ...c, state: "pass" })));
              toast.success("Conflict resolved", { description: "Valid geometry restored" });
            }}
          >
            <Wrench className="size-3.5" />
            Resolve Conflict
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-8 border-destructive/45 text-[12px] text-destructive"
            onClick={() => {
              setView("3d");
              simulateConflict();
              select({ kind: "unit", id: "F04-U05" });
              setChecks(
                BASE_CHECKS.map((c) => ({ ...c, state: c.id === "overlap" ? "fail" : "pass" })),
              );
              toast.error("SPATIAL CONFLICT DETECTED", {
                description: "Vertical volume overlap · F04-U05 / F04-U06",
              });
            }}
          >
            <TriangleAlert className="size-3.5" />
            Simulate Conflict
          </Button>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3.5 gap-y-1">
        {checks.map((c) => (
          <div key={c.id} className="flex items-center gap-1.5 text-[11.5px]" title={c.detail}>
            {c.state === "running" ? (
              <Loader2 className="size-3.5 animate-spin text-primary" />
            ) : c.state === "fail" ? (
              <AlertTriangle className="size-3.5 text-destructive" />
            ) : (
              <CheckCircle2
                className={cn(
                  "size-3.5",
                  c.state === "pass" ? "text-success" : "text-muted-foreground/40",
                )}
              />
            )}
            <span
              className={cn(
                c.state === "fail"
                  ? "text-destructive"
                  : c.state === "pass"
                    ? "text-foreground"
                    : "text-muted-foreground",
              )}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>

      <div className="tabular ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>
          Status:{" "}
          <span
            className={cn(
              anyFail ? "text-destructive" : allPass ? "text-success" : "text-muted-foreground",
            )}
          >
            {anyFail ? "CONFLICT" : allPass ? "ALL SPATIAL CHECKS PASSED" : "NOT VALIDATED"}
          </span>
        </span>
        <span>Last run: {validatedAt ?? "—"}</span>
      </div>
    </div>
  );
}
