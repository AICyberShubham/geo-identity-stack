import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ALL_PARCELS, ALL_UNITS, BUILDING, FLOORS, UNDERGROUND_ASSETS } from "@/data/demo";
import { useBhu } from "@/state/bhu";

interface Hit {
  id: string;
  title: string;
  sub: string;
  kind: "unit" | "parcel" | "underground" | "building" | "floor";
  y: number;
}

export function SearchPanel() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const { select, focusOn, setView, setShowUnderground } = useBhu();

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const out: Hit[] = [];
    for (const u of ALL_UNITS) {
      if (
        u.id.toLowerCase().includes(term) ||
        u.ulpin3d.toLowerCase().includes(term) ||
        u.owner.toLowerCase().includes(term)
      ) {
        out.push({
          id: u.id,
          title: u.ulpin3d,
          sub: `${u.type} · Unit ${u.id} · ${u.area} sq.ft`,
          kind: "unit",
          y: (u.zMin + u.zMax) / 2,
        });
      }
    }
    for (const f of FLOORS) {
      if (f.label.toLowerCase().includes(term) || f.id.toLowerCase().includes(term)) {
        out.push({
          id: f.units[0]!.id,
          title: f.label,
          sub: `${f.id} · Z ${f.zMin}m – ${f.zMax}m`,
          kind: "floor",
          y: (f.zMin + f.zMax) / 2,
        });
      }
    }
    for (const p of ALL_PARCELS) {
      if (p.id.toLowerCase().includes(term) || p.ulpin.toLowerCase().includes(term)) {
        out.push({
          id: p.id,
          title: p.id,
          sub: `ULPIN ${p.ulpin} · ${p.area.toLocaleString()} m²`,
          kind: "parcel",
          y: 0,
        });
      }
    }
    for (const a of UNDERGROUND_ASSETS) {
      if (a.id.toLowerCase().includes(term) || a.ulpin3d.toLowerCase().includes(term)) {
        out.push({
          id: a.id,
          title: a.id,
          sub: `${a.type} · ${a.zMin}m to ${a.zMax}m`,
          kind: "underground",
          y: (a.zMin + a.zMax) / 2,
        });
      }
    }
    if (BUILDING.id.toLowerCase().includes(term) || BUILDING.name.toLowerCase().includes(term)) {
      out.push({
        id: BUILDING.id,
        title: BUILDING.id,
        sub: `${BUILDING.name} · ${BUILDING.floors} floors`,
        kind: "building",
        y: 9,
      });
    }
    return out.slice(0, 7);
  }, [q]);

  function go(hit: Hit) {
    setView("3d");
    if (hit.kind === "underground") setShowUnderground(true);
    if (hit.kind === "unit" || hit.kind === "floor") select({ kind: "unit", id: hit.id });
    else if (hit.kind === "underground") select({ kind: "underground", id: hit.id });
    else select({ kind: null, id: null });
    focusOn([0, hit.y, 0], hit.kind === "parcel" || hit.kind === "building" ? 70 : 42);
    toast.success("Camera focused", { description: hit.title });
    setOpen(false);
    setQ("");
  }

  return (
    <div className="relative hidden xl:block">
      <div className="flex h-9 w-[300px] items-center gap-2 rounded-sm border border-border bg-background/60 px-2.5">
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder="Search ULPIN, parcel, building, unit…"
          className="w-full bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
        />
      </div>
      {open && hits.length > 0 && (
        <div className="glass-panel absolute right-0 top-11 z-50 w-[420px] rounded-sm p-1">
          {hits.map((h) => (
            <button
              key={`${h.kind}-${h.id}-${h.title}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(h)}
              className="flex w-full flex-col items-start gap-0.5 rounded-sm px-2.5 py-2 text-left transition-colors hover:bg-secondary"
            >
              <span className="tabular text-[12px] text-foreground">{h.title}</span>
              <span className="text-[11px] text-muted-foreground">{h.sub}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
