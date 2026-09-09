import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Building2, Layers3, ShieldCheck, Fingerprint, Map } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BHU-3D — 3D ULPIN & Vertical Property Mapping System" },
      {
        name: "description",
        content:
          "BHU-3D converts traditional 2D land parcels into navigable 3D property models with vertical unit identity, underground asset mapping and spatial validation.",
      },
      { property: "og:title", content: "BHU-3D — From 2D Land Parcels to 3D Property Identity" },
      {
        property: "og:description",
        content:
          "An AI-assisted geospatial platform for mapping surface, vertical and underground property volumes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PIPELINE = [
  { label: "2D Parcel", Icon: Map },
  { label: "3D Building", Icon: Building2 },
  { label: "Vertical Units", Icon: Layers3 },
  { label: "3D ULPIN", Icon: Fingerprint },
  { label: "Validation", Icon: ShieldCheck },
];

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="scan-line pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:64px_64px] opacity-25" />

      <header className="relative flex h-14 items-center gap-2.5 border-b border-border px-5">
        <div className="flex size-8 items-center justify-center rounded-sm bg-primary/15 ring-1 ring-primary/40">
          <Boxes className="size-4 text-primary" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-[0.14em]">BHU-3D</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            3D ULPIN &amp; Vertical Property Mapping System
          </div>
        </div>
        <span className="ml-auto hidden text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:block">
          Smart India Hackathon Prototype
        </span>
      </header>

      <section className="relative mx-auto flex max-w-5xl flex-col items-start px-6 pb-16 pt-20 md:pt-28">
        <span className="mb-5 inline-flex items-center gap-2 rounded-sm border border-primary/35 bg-primary/8 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-primary">
          Geospatial Land Administration
        </span>

        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
          From 2D Land Parcels to <span className="text-primary">3D Property Identity</span>
        </h1>

        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          An AI-assisted geospatial platform for mapping surface, vertical and underground property
          volumes — giving every apartment, basement and utility corridor a structured, verifiable
          3D identifier.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/app"
            className="inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-5 text-[13px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Launch 3D Map
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/app"
            className="inline-flex h-11 items-center gap-2 rounded-sm border border-border px-5 text-[13px] font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Explore Demo
          </Link>
        </div>

        <div className="mt-16 w-full">
          <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Processing pipeline
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {PIPELINE.map(({ label, Icon }, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-sm border border-border bg-card/70 px-3 py-2">
                  <Icon className="size-4 text-primary" />
                  <span className="text-[12.5px]">{label}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid w-full gap-3 sm:grid-cols-3">
          {[
            { k: "Vertical units modelled", v: "28,642" },
            { k: "Underground assets mapped", v: "1,284" },
            { k: "Geometry confidence", v: "96.4%" },
          ].map((s) => (
            <div key={s.k} className="rounded-sm border border-border bg-card/60 p-4">
              <div className="tabular text-2xl font-semibold text-primary">{s.v}</div>
              <div className="text-[11.5px] text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[11px] text-muted-foreground">
          Prototype uses synthetic demonstration data. The 3D identifier shown is a{" "}
          <span className="text-accent">proposed 3D ULPIN extension</span>, not an officially
          adopted Government of India format.
        </p>
      </section>
    </main>
  );
}
