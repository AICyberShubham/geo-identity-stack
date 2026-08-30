import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Overview } from "@/components/bhu/Overview";
import { SectionView } from "@/components/bhu/SectionView";
import { Sidebar } from "@/components/bhu/Sidebar";
import { TopBar, type NavItem } from "@/components/bhu/TopBar";
import { ValidationPanel } from "@/components/bhu/ValidationPanel";
import { Workspace } from "@/components/bhu/Workspace";
import { BhuProvider } from "@/state/bhu";

export const Route = createFileRoute("/app")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "3D Property Map — BHU-3D Vertical Property Workspace" },
      {
        name: "description",
        content:
          "Interactive 3D GIS workspace for parcels, buildings, floors, vertical property units, underground assets and 3D ULPIN validation.",
      },
      { property: "og:title", content: "BHU-3D — 3D Property Map Workspace" },
      {
        property: "og:description",
        content:
          "Explore a 2D land parcel converted into navigable 3D property volumes with generated 3D ULPIN identifiers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppWorkspace,
});

function AppWorkspace() {
  const [section, setSection] = useState<NavItem>("3D Property Map");

  return (
    <BhuProvider>
      <TooltipProvider delayDuration={200}>
        <div className="flex h-screen w-full flex-col overflow-hidden">
          <TopBar active={section} onNavigate={setSection} />
          <div className="flex min-h-0 flex-1">
            <Sidebar active={section} onNavigate={setSection} />
            <main className="flex min-w-0 flex-1 flex-col">
              {section === "3D Property Map" ? (
                <Workspace />
              ) : section === "Overview" ? (
                <div className="min-h-0 flex-1">
                  <Overview />
                </div>
              ) : (
                <div className="min-h-0 flex-1">
                  <SectionView section={section} />
                </div>
              )}
              <ValidationPanel />
            </main>
          </div>
        </div>
        <Toaster position="top-right" />
      </TooltipProvider>
    </BhuProvider>
  );
}
