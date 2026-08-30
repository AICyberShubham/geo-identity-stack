import {
  Activity,
  AlertTriangle,
  Boxes,
  Building2,
  Layers3,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Cuboid,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { OVERVIEW_STATS, RECENT_ACTIVITY, UNIT_GROWTH } from "@/data/demo";
import { cn } from "@/lib/utils";

const ICONS = [Layers3, Building2, Boxes, Cuboid, AlertTriangle, ShieldCheck];

export function StatsCard({
  label,
  value,
  trend,
  up,
  Icon,
}: {
  label: string;
  value: string;
  trend: string;
  up: boolean;
  Icon: typeof Boxes;
}) {
  return (
    <div className="rounded-sm border border-border bg-card/70 p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
        <Icon className="size-3.5 text-primary/70" />
      </div>
      <div className="tabular mt-2 text-2xl font-semibold">{value}</div>
      <div
        className={cn(
          "mt-1 flex items-center gap-1 text-[11px]",
          up ? "text-success" : "text-accent",
        )}
      >
        {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
        {trend} <span className="text-muted-foreground">vs last quarter</span>
      </div>
    </div>
  );
}

const KIND_STYLES: Record<string, string> = {
  model: "text-primary",
  floor: "text-foreground",
  ulpin: "text-accent",
  conflict: "text-destructive",
  ug: "text-chart-4",
};

export function Overview() {
  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Land Administration Overview</h1>
        <p className="text-[12px] text-muted-foreground">
          Lucknow Circle · Synthetic demonstration dataset · 3D-ULPIN engine v0.9
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {OVERVIEW_STATS.map((s, i) => (
          <StatsCard key={s.label} {...s} Icon={ICONS[i]} />
        ))}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-sm border border-border bg-card/70 p-4">
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Vertical Unit Registration
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={UNIT_GROWTH}>
                <defs>
                  <linearGradient id="gUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gVer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} width={44} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="units"
                  stroke="var(--color-chart-1)"
                  fill="url(#gUnits)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="verified"
                  stroke="var(--color-chart-3)"
                  fill="url(#gVer)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-sm border border-border bg-card/70 p-4">
          <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Activity className="size-3.5" />
            Recent Spatial Activity
          </div>
          <ul className="space-y-2.5">
            {RECENT_ACTIVITY.map((a) => (
              <li key={a.id} className="flex gap-2.5 border-b border-border/60 pb-2.5 last:border-0">
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full bg-current",
                    KIND_STYLES[a.kind],
                  )}
                />
                <div className="min-w-0">
                  <div className="text-[12px] leading-snug">{a.text}</div>
                  <div className="tabular text-[10.5px] text-muted-foreground">{a.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
