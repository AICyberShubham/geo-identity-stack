import { ArrowDown, BadgeCheck, Copy, Cuboid, Layers3, MousePointerClick, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ALL_UNITS, DISTRICT, DISTRICT_CODE, FLOORS, PRIMARY_PARCEL, STATE, STATE_CODE, floorCode } from "@/data/demo";
import { UNDERGROUND_ASSETS } from "@/data/demo";
import { useBhu } from "@/state/bhu";
import { cn } from "@/lib/utils";

function Row({ label, value, mono = true, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span
        className={cn(
          "max-w-[62%] break-all text-right text-[12px]",
          mono && "tabular",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-sm border border-border bg-secondary/60">
        <MousePointerClick className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-semibold">Select a property volume</div>
      <p className="text-[12px] leading-relaxed text-muted-foreground">
        Click any floor, apartment or underground asset to inspect its 3D identity.
      </p>
    </div>
  );
}

function UlpinGenerator({
  parentUlpin,
  floorNumber,
  unitNumber,
  target,
}: {
  parentUlpin: string;
  floorNumber: number;
  unitNumber: string;
  target: string;
}) {
  const { addGeneratedUlpin, generatedUlpins } = useBhu();
  const [step, setStep] = useState(0);
  const generated = generatedUlpins.includes(target);

  useEffect(() => {
    setStep(generated ? 5 : 0);
  }, [target, generated]);

  const chain = [
    { label: "Parent ULPIN", value: parentUlpin },
    { label: "Vertical Position", value: `${STATE_CODE}-${DISTRICT_CODE}` },
    { label: "Floor", value: floorCode(floorNumber) },
    { label: "Unit", value: unitNumber },
    { label: "Generated 3D Identity", value: target },
  ];

  function run() {
    setStep(0);
    chain.forEach((_, i) => {
      window.setTimeout(() => setStep(i + 1), 220 * (i + 1));
    });
    window.setTimeout(() => {
      addGeneratedUlpin(target);
      toast.success("3D ULPIN generated", { description: target });
    }, 220 * chain.length + 120);
  }

  return (
    <div className="rounded-sm border border-border bg-background/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Proposed 3D ULPIN Extension
        </span>
        <Badge variant="outline" className="border-accent/40 text-[9px] text-accent">
          NOT AN OFFICIAL GoI FORMAT
        </Badge>
      </div>

      <div className="space-y-1">
        {chain.map((c, i) => (
          <div key={c.label}>
            <div
              className={cn(
                "flex items-center justify-between gap-2 rounded-sm border px-2 py-1.5 transition-all duration-300",
                step > i
                  ? i === chain.length - 1
                    ? "border-primary/50 bg-primary/10"
                    : "border-border bg-secondary/60"
                  : "border-dashed border-border/60 opacity-40",
              )}
            >
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {c.label}
              </span>
              <span
                className={cn(
                  "tabular truncate text-[11px]",
                  i === chain.length - 1 ? "text-primary" : "text-foreground",
                )}
              >
                {step > i ? c.value : "—"}
              </span>
            </div>
            {i < chain.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowDown
                  className={cn(
                    "size-3 transition-colors",
                    step > i + 1 ? "text-primary" : "text-border",
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Button size="sm" className="h-8 flex-1 text-[12px]" onClick={run}>
          <Sparkles className="size-3.5" />
          Generate 3D ULPIN
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8"
          onClick={() => {
            navigator.clipboard?.writeText(target);
            toast("Copied to clipboard", { description: target });
          }}
          aria-label="Copy identifier"
        >
          <Copy className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function PropertyPanel() {
  const { selection, conflict } = useBhu();

  if (selection.kind === "underground") {
    const a = UNDERGROUND_ASSETS.find((x) => x.id === selection.id);
    if (!a) return <EmptyState />;
    return (
      <div className="space-y-3 p-3.5">
        <div className="flex items-center gap-2">
          <Cuboid className="size-4 text-accent" />
          <span className="text-sm font-semibold">Underground Asset</span>
        </div>
        <div className="rounded-sm border border-border bg-background/40 px-3 py-2">
          <Row label="Asset ID" value={a.id} accent />
          <Row label="Type" value={a.type} mono={false} />
          <Row label="Depth" value={`${a.zMin}m to ${a.zMax}m`} />
          <Row label="Parent Parcel" value={a.parentParcel} />
          <Row label="3D ULPIN" value={a.ulpin3d} accent />
          <Row label="Status" value={a.status} mono={false} />
        </div>
      </div>
    );
  }

  if (selection.kind !== "unit" || !selection.id) return <EmptyState />;

  const unit = ALL_UNITS.find((u) => u.id === selection.id);
  if (!unit) return <EmptyState />;
  const floor = FLOORS.find((f) => f.id === unit.floorId)!;
  const inConflict = !!conflict && conflict.units.includes(unit.id);

  return (
    <div className="space-y-3 p-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers3 className="size-4 text-primary" />
          <span className="text-sm font-semibold">{floor.label}</span>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "gap-1 text-[10px]",
            inConflict
              ? "border-destructive/50 text-destructive"
              : unit.status === "Verified"
                ? "border-success/50 text-success"
                : "border-warning/50 text-warning",
          )}
        >
          <BadgeCheck className="size-3" />
          {inConflict ? "Conflict" : unit.status}
        </Badge>
      </div>

      <div className="rounded-sm border border-border bg-background/40 px-3 py-2">
        <div className="pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Property Identity
        </div>
        <Row label="3D ULPIN" value={unit.ulpin3d} accent />
        <Row label="Parent ULPIN" value={PRIMARY_PARCEL.ulpin} />
        <Separator className="my-1.5" />
        <Row label="Property Type" value={unit.type} mono={false} />
        <Row label="Floor" value={String(floor.number).padStart(2, "0")} />
        <Row label="Unit" value={unit.unitNumber.replace("U", "")} />
        <Row label="Area" value={`${unit.area.toLocaleString()} sq.ft`} />
        <Row label="Z Range" value={`${unit.zMin}m – ${unit.zMax}m`} />
        <Row label="Owner" value={unit.owner} mono={false} />
        <Row label="Parent Parcel" value={PRIMARY_PARCEL.id} />
        <Row label="Verification" value={unit.status} mono={false} />
        <Row label="Geometry Confidence" value={`${unit.confidence.toFixed(1)}%`} />
      </div>

      <div className="rounded-sm border border-border bg-background/40 px-3 py-2 text-[11px] text-muted-foreground">
        <div className="flex justify-between">
          <span>{STATE}</span>
          <span className="tabular">{STATE_CODE}</span>
        </div>
        <div className="flex justify-between">
          <span>{DISTRICT} District</span>
          <span className="tabular">{DISTRICT_CODE}</span>
        </div>
      </div>

      <UlpinGenerator
        parentUlpin={PRIMARY_PARCEL.ulpin}
        floorNumber={floor.number}
        unitNumber={unit.unitNumber}
        target={unit.ulpin3d}
      />
    </div>
  );
}
