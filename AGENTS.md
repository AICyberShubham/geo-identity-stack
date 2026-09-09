# BHU-3D — Development Guidelines

This repository contains the BHU-3D (3D ULPIN Generation & Vertical Property Mapping System) web platform built for the Smart India Hackathon.

## Core Guidelines

- **3D GIS Workspace**: Maintain the Three.js / React Three Fiber scene, camera controls, coordinate indicators, and parcel boundary visualizations.
- **Data Integrity**: Preserve the 3D property hierarchy: Land Parcel → Multi-storey Building → Floors → Vertical Units (Apartments/Commercial) → 3D ULPIN.
- **Routing & Framework**: This application uses TanStack Start with TanStack Router. File-based routes live under `src/routes/`.
- **Styling**: Uses Tailwind CSS v4 and shadcn/ui components with a high-density, professional dark GIS theme.
