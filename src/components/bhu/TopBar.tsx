import { Bell, Boxes, Radio, Search, User } from "lucide-react";
import { SearchPanel } from "./SearchPanel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  "Overview",
  "3D Property Map",
  "Parcels",
  "Buildings",
  "Vertical Units",
  "Validation",
  "Reports",
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export function TopBar({
  active,
  onNavigate,
}: {
  active: NavItem;
  onNavigate: (n: NavItem) => void;
}) {
  return (
    <header className="z-40 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-surface/80 px-4 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-sm bg-primary/15 ring-1 ring-primary/40">
          <Boxes className="size-4 text-primary" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-[0.14em] text-foreground">BHU-3D</div>
          <div className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
            3D ULPIN &amp; Vertical Property Mapping
          </div>
        </div>
      </div>

      <nav className="ml-4 hidden items-center gap-0.5 overflow-x-auto xl:flex">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            className={cn(
              "relative whitespace-nowrap px-3 py-2 text-[12.5px] font-medium transition-colors",
              active === item
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item}
            {active === item && (
              <span className="absolute inset-x-2 -bottom-px h-px bg-primary" />
            )}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <SearchPanel />
        <Badge
          variant="outline"
          className="hidden gap-1.5 border-accent/40 text-accent md:inline-flex"
        >
          <Radio className="size-3 animate-pulse" />
          DEMO MODE
        </Badge>
        <button className="relative rounded-sm p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="size-4" />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
        </button>
        <button className="hidden items-center gap-2 rounded-sm border border-border px-2 py-1.5 text-left sm:flex">
          <span className="flex size-6 items-center justify-center rounded-full bg-secondary">
            <User className="size-3.5 text-muted-foreground" />
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] font-medium">Survey Admin</span>
            <span className="block text-[10px] text-muted-foreground">Lucknow Circle</span>
          </span>
        </button>
        <button className="rounded-sm p-2 text-muted-foreground xl:hidden" aria-label="Search">
          <Search className="size-4" />
        </button>
      </div>
    </header>
  );
}
