import { BarChart3, Building2, LayoutGrid, Layers3, Map, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "./TopBar";
import { NAV_ITEMS } from "./TopBar";
import { cn } from "@/lib/utils";

const ICONS: Record<NavItem, typeof Map> = {
  Overview: LayoutGrid,
  "3D Property Map": Map,
  Parcels: Layers3,
  Buildings: Building2,
  "Vertical Units": Layers3,
  Validation: ShieldCheck,
  Reports: BarChart3,
};

export function Sidebar({
  active,
  onNavigate,
}: {
  active: NavItem;
  onNavigate: (n: NavItem) => void;
}) {
  const [open, setOpen] = useState(false);

  const list = (
    <nav className="flex flex-col gap-0.5 p-2">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item];
        const isActive = active === item;
        return (
          <button
            key={item}
            onClick={() => {
              onNavigate(item);
              setOpen(false);
            }}
            className={cn(
              "group flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-[12.5px] transition-colors",
              isActive
                ? "bg-primary/12 text-primary ring-1 ring-primary/25"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate lg:inline">{item}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-[212px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="px-4 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </div>
        {list}
        <div className="mt-auto space-y-2 border-t border-sidebar-border p-3 text-[11px] text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Survey Circle</span>
            <span className="tabular text-foreground">LKO-06</span>
          </div>
          <div className="flex items-center justify-between">
            <span>CRS</span>
            <span className="tabular text-foreground">EPSG:32644</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Engine</span>
            <span className="tabular text-primary">3D-ULPIN v0.9</span>
          </div>
        </div>
      </aside>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 rounded-full border border-border bg-surface p-3 shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-background/70" onClick={() => setOpen(false)} />
          <div className="glass-panel relative w-[240px] bg-sidebar">
            <div className="flex items-center justify-between px-3 pt-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Workspace
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close navigation">
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            {list}
          </div>
        </div>
      )}
    </>
  );
}
