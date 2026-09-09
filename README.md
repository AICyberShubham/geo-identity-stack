# BHU-3D

**3D ULPIN & Vertical Property Mapping System**

BHU-3D is a Smart India Hackathon prototype for demonstrating how traditional
2D land parcels can be represented as navigable 3D property models. The
application combines parcel, building, floor, unit, and underground asset data
to show how vertical property identity and spatial validation could work in a
land administration workflow.

## Problem statement

Conventional parcel records describe land primarily in two dimensions. They do
not clearly represent stacked apartments, basements, or underground
infrastructure as independently identifiable property volumes. This makes
vertical ownership, geometry validation, and spatial conflict detection harder
to communicate and manage.

## Solution

The prototype turns a synthetic 2D parcel into an interactive 3D scene. Users
can inspect building floors and property units, generate a proposed 3D ULPIN
identifier, reveal underground assets, switch between 2D and 3D views, and
simulate spatial validation and conflict-resolution workflows.

## Key features

- Interactive 2D/3D GIS-style parcel and building visualization
- Selectable floors and apartment volumes with property metadata
- Proposed 3D ULPIN generation for vertical property units
- Underground utilities, tunnels, and basement visualization
- Layer controls, camera controls, search, and property inspection
- AI-assisted extraction demo with synthetic processing stages
- Spatial validation checks and simulated volume conflicts
- Responsive government-tech interface designed for a hackathon presentation

## Technology stack

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS and shadcn/ui primitives
- Three.js and React Three Fiber
- Lucide React icons
- Recharts and React Query
- Bun for dependency management

## Architecture

The application is a TanStack Start project with a Vite build:

- `src/routes/` contains the route tree and application shell.
- `src/components/bhu/` contains the BHU-3D workflow panels and controls.
- `src/components/gis/` contains the Three.js scene and GIS layers.
- `src/data/` contains the synthetic demo data model.
- `src/state/` contains client-side interaction state.
- `src/server.ts` and `src/start.ts` provide the server entry and middleware.

The core demo uses local synthetic data and does not require external APIs,
authentication, or a database.

## Setup

### Prerequisites

- [Bun](https://bun.sh/) 1.2 or later
- A modern browser with WebGL support

### Install dependencies

```sh
bun install
```

### Run locally

```sh
bun run dev
```

Open the local URL printed by Vite, typically `http://localhost:3000`.

### Build for production

```sh
bun run build
```

To preview a production build locally:

```sh
bun run preview
```

## Project information

This repository contains the BHU-3D Smart India Hackathon demonstration
project. All property records and spatial data included in the demo are
synthetic and intended for presentation and interaction testing only.
