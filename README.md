# VertiSpace 3D

Build a polished, hackathon-ready web prototype called “BHU-3D” for the problem statement:



3D ULPIN Generation and Vertical Property Mapping System



CORE PRODUCT IDEA



Build a visual 3D land administration platform that converts a traditional 2D land parcel into a navigable 3D property model.



The system should demonstrate:



2D Parcel → Building → Floors → 3D Property Volumes → 3D ULPIN → Spatial Validation



The prototype is for a Smart India Hackathon-style presentation. Prioritize a highly impressive, realistic and interactive demo over backend complexity.



Do NOT build a generic admin dashboard. The centerpiece must be the interactive 3D property visualization.



---



DESIGN DIRECTION



Create a premium government-tech / geospatial-tech interface.



Visual style:



- Professional

- Futuristic but realistic

- Clean

- Dark map-oriented interface

- High information density without clutter

- Suitable for an Indian government technology hackathon

- Desktop-first but responsive



Use:



- React

- TypeScript

- Tailwind CSS

- shadcn/ui

- Three.js / React Three Fiber for the 3D visualization

- Lucide icons

- Recharts where useful



Use subtle glassmorphism only for floating panels.



Avoid excessive gradients, cartoonish UI, huge rounded cards, unnecessary animations, and generic SaaS aesthetics.



---



MAIN APPLICATION STRUCTURE



Create a single-page application with these major areas:



1. Top navigation

2. Left navigation/sidebar

3. Main 3D GIS workspace

4. Right-side property information panel

5. Bottom status/validation panel

6. Modal panels for ULPIN details and topology conflicts



---



TOP NAVIGATION



Brand:



BHU-3D



Subtitle:



3D ULPIN & Vertical Property Mapping



Top-right:



- Search

- Notifications

- Demo Mode indicator

- User/Admin avatar



Navigation items:



- Overview

- 3D Property Map

- Parcels

- Buildings

- Vertical Units

- Validation

- Reports



Only the 3D Property Map needs to be fully interactive. Other sections can contain realistic placeholder/demo information.



---



DASHBOARD / OVERVIEW



Create a professional overview screen with:



Statistics



- Total Parcels: 12,480

- 3D Buildings: 4,218

- Vertical Units: 28,642

- Underground Assets: 1,284

- Spatial Conflicts: 17

- Verified Properties: 26,931



Show small trend indicators.



Create a “Recent Spatial Activity” section.



Example entries:



- Parcel P-10482 converted to 3D model

- Floor segmentation completed for Building B-239

- 3D ULPIN generated for Unit F04-U05

- Spatial overlap detected in Parcel P-10391



---



MAIN 3D PROPERTY MAP



This is the most important part of the application.



Create a large full-screen 3D GIS-style viewport using Three.js / React Three Fiber.



Display:



Ground



A large horizontal terrain/grid surface.



Show:



- road-like lines

- parcel boundaries

- subtle GIS grid

- north indicator

- coordinate indicator



Do not make it look like a video game.



---



DEMO PARCEL



Create one primary highlighted parcel in the center.



Parcel metadata:



Parcel ID:

UP-LKO-P123456



Existing ULPIN:

UP14-7F39-A82K-91



Area:

2,450 m²



District:

Lucknow



State:

Uttar Pradesh



Create a visible polygon boundary around it.



---



3D BUILDING



Inside the parcel create a realistic simplified multi-storey building.



Building:



- 6 floors

- 2 apartments per floor

- 1 basement

- rooftop

- parking area



Each floor should be a separate selectable 3D volume.



Example vertical structure:



BASEMENT

Z = -3m to 0m



GROUND / FLOOR 1

Z = 0m to 3m



FLOOR 2

Z = 3m to 6m



FLOOR 3

Z = 6m to 9m



FLOOR 4

Z = 9m to 12m



FLOOR 5

Z = 12m to 15m



FLOOR 6

Z = 15m to 18m



ROOFTOP

Z = 18m to 20m



---



FLOOR INTERACTION



Every floor must be clickable.



When a user clicks a floor:



1. Highlight that floor.

2. Slightly separate it vertically from the building.

3. Display the property information panel.

4. Show the corresponding 3D ULPIN.

5. Display floor number, unit number, area and Z range.

6. Display parent parcel.

7. Display validation status.



Example:



FLOOR 4



Unit:

F04-U05



3D ULPIN:



3D-UP-LKO-P123456-F04-U05



Area:

1,240 sq.ft



Vertical Range:

9m – 12m



Parent Parcel:

UP-LKO-P123456



Status:

Verified



Owner:

Raj Kumar



Confidence:

96.4%



---



3D ULPIN GENERATOR



Create a functional demo ULPIN generation interface.



Add a button:



Generate 3D ULPIN



When clicked, generate the identifier based on:



- State

- District

- Parent parcel

- Floor

- Unit



Example format:



3D-UP-LKO-P123456-F04-U05



Important:



Clearly label this in the UI as:



Proposed 3D ULPIN Extension



Do NOT claim that this exact identifier format is an officially adopted Government of India ULPIN format.



Show:



Parent ULPIN

↓

Vertical Position

↓

Floor

↓

Unit

↓

Generated 3D Identity



---



RIGHT PROPERTY PANEL



When no object is selected:



Show:



Select a property volume



“Click any floor, apartment or underground asset to inspect its 3D identity.”



When selected:



Display:



Property Identity



3D ULPIN

3D-UP-LKO-P123456-F04-U05



Parent ULPIN

UP14-7F39-A82K-91



Property Type

Residential Apartment



Floor

04



Unit

05



Area

1,240 sq.ft



Z Range

9m – 12m



Owner

Raj Kumar



Verification

Verified



Geometry Confidence

96.4%



---



UNDERGROUND INFRASTRUCTURE



Add a toggle:



Show Underground



When enabled:



- Ground becomes partially transparent

- Basement becomes visible

- Add underground utility lines

- Add one underground tunnel

- Add parking volume



Create an underground asset:



Type:

Metro Utility Tunnel



Asset ID:

UT-00982



Depth:

-12m to -8m



3D ULPIN:

3D-UP-LKO-P123456-UG-00982



Status:

Mapped



This is important because the project statement includes vertical property mapping and underground infrastructure.



---



2D / 3D TOGGLE



Create a prominent toggle:



2D VIEW | 3D VIEW



2D mode:



Show only:



- parcel polygons

- building footprint

- roads

- labels



3D mode:



Extrude the building and show:



- floors

- apartments

- basement

- underground infrastructure



Add a smooth transition between views.



This visually demonstrates the core problem:



Traditional 2D parcel → 3D property model



---



AI-ASSISTED EXTRACTION DEMO



Create a button:



Run AI Extraction



When clicked, show an animated processing sequence:



1. Loading spatial data

2. Detecting building footprint

3. Detecting horizontal planes

4. Segmenting floors

5. Creating volumetric units

6. Validating topology

7. Generating 3D ULPIN



Then show:



Extraction Complete



Building detected:

1



Floors detected:

6



Vertical units:

12



Basement:

1



Confidence:

96.4%



This can be simulated client-side for the prototype. Do not build a complicated ML pipeline unless necessary.



---



TOPOLOGY VALIDATION



Create a functional demo validation system.



Button:



Run Spatial Validation



Show validation checks:



✓ No overlapping property volumes



✓ Floor volumes connected



✓ Valid Z ranges



✓ Parcel/building alignment



✓ Underground asset mapped



✓ Unique 3D ULPIN



Then provide a demo conflict mode.



Add button:



Simulate Conflict



When clicked, slightly move one apartment volume so it overlaps another.



Display a prominent warning:



SPATIAL CONFLICT DETECTED



Conflict Type:

Vertical Volume Overlap



Affected Units:

F04-U05

F04-U06



Overlap:

8.4 m²



Severity:

High



Recommended Action:

Review property geometry.



Allow:



Resolve Conflict



which restores the valid geometry.



This feature is very important for the hackathon demo.



---



PROPERTY SEARCH



Add a global search box.



Allow searching:



- Parcel ID

- ULPIN

- 3D ULPIN

- Building ID

- Floor

- Unit



Example searches:



UP-LKO-P123456



3D-UP-LKO-P123456-F04-U05



B-239



F04-U05



Selecting a result should automatically focus the 3D camera on that object.



---



LAYER CONTROL



Create a floating layer control:



Layers



☑ Parcels



☑ Buildings



☑ Floors



☑ Property Units



☑ Roads



☐ Underground Utilities



☐ Tunnels



☑ Labels



☐ DEM / Terrain



Changing layers should actually affect the visualization where practical.



---



CAMERA CONTROLS



Add:



- Orbit

- Zoom

- Pan

- Reset View

- Top View

- Side View

- Isometric View



Add a small compass.



---



3D VISUALIZATION DETAILS



The building should not look like simple cubes.



Use:



- windows

- floor slabs

- balconies

- rooftop

- parking entrance

- simple roads

- trees only if visually useful



Keep geometry lightweight for performance.



Each apartment should be individually selectable.



When selected, slightly separate it from surrounding units and show a floating label:



F04-U05



---



DATA MODEL



Create realistic TypeScript data structures for:



Parcel

Building

Floor

PropertyUnit

UndergroundAsset

ULPIN

ValidationResult



Example:



Parcel:



id

name

state

district

area

geometry

ulpin



Building:



id

parcelId

floors

height

footprint



Floor:



id

buildingId

number

zMin

zMax

units



PropertyUnit:



id

floor

unitNumber

area

owner

zMin

zMax

ulpin3d

status

confidence



UndergroundAsset:



id

type

zMin

zMax

parentParcel

ulpin3d



---



DEMO DATA



Use synthetic data only.



Do not use real people's private property information.



Create:



1 primary parcel



1 building



6 floors



12 apartment units



1 basement



3 underground assets



3 roads



10 surrounding parcels



This makes the map feel like a real GIS environment.



---



RESPONSIVE DESIGN



Desktop is the primary target.



For smaller screens:



- collapse left navigation

- stack property panel

- preserve 3D viewer

- make controls touch-friendly



---



MICRO-INTERACTIONS



Add polished but restrained interactions:



- object hover

- selected floor elevation

- smooth camera movement

- loading states

- toast notifications

- validation animations

- ULPIN generation animation

- conflict warning animation



Do not over-animate.



---



IMPORTANT DEMO FLOW



The application must support this exact presentation flow:



STEP 1



Open 2D map.



Show parcel.



Text:



“Traditional 2D Parcel”



STEP 2



Switch to 3D.



Building rises vertically.



Text:



“3D Property Model”



STEP 3



Click Floor 4.



Floor separates slightly.



Property panel appears.



STEP 4



Click:



Generate 3D ULPIN



Show:



3D-UP-LKO-P123456-F04-U05



STEP 5



Enable:



Show Underground



Reveal basement and tunnel.



STEP 6



Click:



Run Spatial Validation



Show all checks passing.



STEP 7



Click:



Simulate Conflict



Create overlap.



Show:



SPATIAL CONFLICT DETECTED



STEP 8



Resolve conflict.



Return to:



All Spatial Checks Passed



This entire sequence should work smoothly without requiring external APIs.



---



LANDING / HERO SCREEN



Before entering the dashboard, create a professional hero screen.



Title:



BHU-3D



Subtitle:



3D ULPIN & Vertical Property Mapping System



Headline:



From 2D Land Parcels to 3D Property Identity



Supporting text:



“An AI-assisted geospatial platform for mapping surface, vertical and underground property volumes.”



Buttons:



Launch 3D Map



Explore Demo



Below the hero show:



2D Parcel → 3D Building → Vertical Units → 3D ULPIN → Validation



---



TECHNICAL REQUIREMENTS



Use clean reusable React components.



Recommended components:



- AppShell

- Sidebar

- TopBar

- StatsCard

- GISViewer

- Building3D

- FloorVolume

- PropertyUnit

- UndergroundLayer

- PropertyPanel

- ULPINGenerator

- ValidationPanel

- LayerControl

- CameraControls

- SearchPanel

- ConflictModal



Keep the application maintainable.



Use mock data/local state for the hackathon prototype.



Do not add authentication unless necessary.



Do not require users to upload actual LiDAR files for the main demo.



Do not depend on external APIs for the core experience.



The app must work immediately with the included synthetic demo dataset.



---



MOST IMPORTANT PRIORITY



The 3D viewer and interaction quality are more important than secondary pages.



The judge should immediately understand:



A 2D parcel can contain multiple vertical property units, and BHU-3D gives those units a structured 3D identity.



Make the prototype feel like a real government geospatial product rather than a student dashboard.



Finish with a polished, coherent, demo-ready application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://geo-identity-stack.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eaff038c-5eec-4f74-ab30-c3ade7d12635).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
