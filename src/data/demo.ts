import type {
  Building,
  Floor,
  Parcel,
  PropertyUnit,
  Road,
  UndergroundAsset,
  ValidationCheck,
} from "./types";

export const STATE = "Uttar Pradesh";
export const STATE_CODE = "UP";
export const DISTRICT = "Lucknow";
export const DISTRICT_CODE = "LKO";

export const PRIMARY_PARCEL: Parcel = {
  id: "UP-LKO-P123456",
  name: "Gomti Nagar Vistar — Sector 6",
  state: STATE,
  stateCode: STATE_CODE,
  district: DISTRICT,
  districtCode: DISTRICT_CODE,
  area: 2450,
  geometry: [
    [-25, -25],
    [25, -25],
    [25, 25],
    [-25, 25],
  ],
  ulpin: "UP14-7F39-A82K-91",
  primary: true,
};

function ring(cx: number, cz: number, w: number, d: number): [number, number][] {
  return [
    [cx - w / 2, cz - d / 2],
    [cx + w / 2, cz - d / 2],
    [cx + w / 2, cz + d / 2],
    [cx - w / 2, cz + d / 2],
  ];
}

/**
 * Blocks are laid out so no holding overlaps a road corridor:
 * roads occupy z 35..45, z -46..-38 and x -49..-41.
 */
const SURROUNDING_DEFS: { c: [number, number]; s: [number, number]; id: string }[] = [
  { c: [-72, -66], s: [40, 26], id: "UP-LKO-P123441" },
  { c: [-14, -66], s: [42, 26], id: "UP-LKO-P123442" },
  { c: [36, -66], s: [36, 26], id: "UP-LKO-P123443" },
  { c: [-74, -14], s: [36, 36], id: "UP-LKO-P123444" },
  { c: [-74, 20], s: [36, 24], id: "UP-LKO-P123445" },
  { c: [66, -10], s: [38, 40], id: "UP-LKO-P123446" },
  { c: [66, 22], s: [38, 20], id: "UP-LKO-P123447" },
  { c: [-72, 72], s: [40, 40], id: "UP-LKO-P123448" },
  { c: [-14, 72], s: [44, 40], id: "UP-LKO-P123449" },
  { c: [60, 72], s: [36, 40], id: "UP-LKO-P123450" },
];

export const SURROUNDING_PARCELS: Parcel[] = SURROUNDING_DEFS.map((p, i) => ({
  id: p.id,
  name: `Adjacent Holding ${i + 1}`,
  state: STATE,
  stateCode: STATE_CODE,
  district: DISTRICT,
  districtCode: DISTRICT_CODE,
  area: Math.round(p.s[0] * p.s[1] * 0.82),
  geometry: ring(p.c[0], p.c[1], p.s[0], p.s[1]),
  ulpin: `UP14-${(4210 + i).toString(16).toUpperCase()}-B${i}0K-${20 + i}`,
}));

export const ALL_PARCELS: Parcel[] = [PRIMARY_PARCEL, ...SURROUNDING_PARCELS];

export const BUILDING: Building = {
  id: "B-239",
  parcelId: PRIMARY_PARCEL.id,
  name: "Shrishti Residency Tower A",
  floors: 6,
  height: 20,
  footprint: { width: 26, depth: 18, center: [0, 0] },
};

const OWNERS = [
  "Raj Kumar",
  "Anita Verma",
  "S. Bhattacharya",
  "Meera Nair",
  "Vikram Singh",
  "Farhan Qureshi",
  "Kavita Joshi",
  "Deepak Rathore",
  "Neha Agarwal",
  "T. Balasubramanian",
  "Imran Sheikh",
  "Sunita Yadav",
];

export const FLOOR_DEFS = [
  { number: 0, label: "BASEMENT", zMin: -3, zMax: 0 },
  { number: 1, label: "GROUND / FLOOR 1", zMin: 0, zMax: 3 },
  { number: 2, label: "FLOOR 2", zMin: 3, zMax: 6 },
  { number: 3, label: "FLOOR 3", zMin: 6, zMax: 9 },
  { number: 4, label: "FLOOR 4", zMin: 9, zMax: 12 },
  { number: 5, label: "FLOOR 5", zMin: 12, zMax: 15 },
  { number: 6, label: "FLOOR 6", zMin: 15, zMax: 18 },
  { number: 7, label: "ROOFTOP", zMin: 18, zMax: 20 },
];

export function floorCode(n: number) {
  return `F${String(n).padStart(2, "0")}`;
}

export function makeUlpin3d(floorNumber: number, unitNumber: string) {
  return `3D-${STATE_CODE}-${DISTRICT_CODE}-P123456-${floorCode(floorNumber)}-${unitNumber}`;
}

let ownerIdx = 0;

export const FLOORS: Floor[] = FLOOR_DEFS.map((def) => {
  const id = `${BUILDING.id}-${floorCode(def.number)}`;
  const isApartmentFloor = def.number >= 1 && def.number <= 6;
  const units: PropertyUnit[] = [];

  if (isApartmentFloor) {
    for (let u = 0; u < 2; u++) {
      const unitNumber = `U${String(def.number * 2 - 1 + u).padStart(2, "0")}`;
      const owner = OWNERS[ownerIdx++ % OWNERS.length]!;
      units.push({
        id: `${floorCode(def.number)}-${unitNumber}`,
        floorId: id,
        unitNumber,
        area: [1180, 1240, 1310, 1420][(def.number + u) % 4]!,
        owner,
        zMin: def.zMin,
        zMax: def.zMax,
        ulpin3d: makeUlpin3d(def.number, unitNumber),
        status: def.number === 5 && u === 1 ? "Pending" : "Verified",
        confidence: 92 + ((def.number * 7 + u * 3) % 60) / 10,
        type: "Residential Apartment",
      });
    }
  } else if (def.number === 0) {
    units.push({
      id: "F00-U01",
      floorId: id,
      unitNumber: "U01",
      area: 4200,
      owner: "Shrishti Residency AOA",
      zMin: def.zMin,
      zMax: def.zMax,
      ulpin3d: makeUlpin3d(0, "U01"),
      status: "Mapped",
      confidence: 94.1,
      type: "Basement Parking",
    });
  } else {
    units.push({
      id: "F07-U01",
      floorId: id,
      unitNumber: "U01",
      area: 2100,
      owner: "Shrishti Residency AOA",
      zMin: def.zMin,
      zMax: def.zMax,
      ulpin3d: makeUlpin3d(7, "U01"),
      status: "Verified",
      confidence: 97.2,
      type: "Common Rooftop Area",
    });
  }

  return {
    id,
    buildingId: BUILDING.id,
    number: def.number,
    label: def.label,
    zMin: def.zMin,
    zMax: def.zMax,
    units,
  };
});

export const ALL_UNITS: PropertyUnit[] = FLOORS.flatMap((f) => f.units);

export const UNDERGROUND_ASSETS: UndergroundAsset[] = [
  {
    id: "UT-00982",
    type: "Metro Utility Tunnel",
    zMin: -12,
    zMax: -8,
    parentParcel: PRIMARY_PARCEL.id,
    ulpin3d: `3D-${STATE_CODE}-${DISTRICT_CODE}-P123456-UG-00982`,
    status: "Mapped",
    box: { x: 0, z: 18, width: 160, depth: 7 },
  },
  {
    id: "UW-00451",
    type: "Water Main Corridor",
    zMin: -6,
    zMax: -4.5,
    parentParcel: PRIMARY_PARCEL.id,
    ulpin3d: `3D-${STATE_CODE}-${DISTRICT_CODE}-P123456-UG-00451`,
    status: "Mapped",
    box: { x: -18, z: 0, width: 3, depth: 120 },
  },
  {
    id: "UP-00733",
    type: "HT Power Duct Bank",
    zMin: -5,
    zMax: -3.8,
    parentParcel: PRIMARY_PARCEL.id,
    ulpin3d: `3D-${STATE_CODE}-${DISTRICT_CODE}-P123456-UG-00733`,
    status: "Mapped",
    box: { x: 22, z: -10, width: 2.4, depth: 110 },
  },
];

export const ROADS: Road[] = [
  {
    id: "R-01",
    name: "Vistar Marg",
    points: [
      [-140, 40],
      [140, 40],
    ],
    width: 10,
  },
  {
    id: "R-02",
    name: "Sector 6 Approach",
    points: [
      [-45, -140],
      [-45, 140],
    ],
    width: 8,
  },
  {
    id: "R-03",
    name: "Link Road 14",
    points: [
      [-140, -42],
      [140, -42],
    ],
    width: 8,
  },
];

export const BASE_CHECKS: ValidationCheck[] = [
  {
    id: "overlap",
    label: "No overlapping property volumes",
    detail: "Pairwise AABB intersection across 14 volumes",
    state: "idle",
  },
  {
    id: "connected",
    label: "Floor volumes connected",
    detail: "Vertical adjacency graph is contiguous",
    state: "idle",
  },
  { id: "zrange", label: "Valid Z ranges", detail: "zMin < zMax on all volumes", state: "idle" },
  {
    id: "align",
    label: "Parcel / building alignment",
    detail: "Footprint contained within parcel polygon",
    state: "idle",
  },
  {
    id: "ug",
    label: "Underground asset mapped",
    detail: "3 subsurface assets referenced to parent parcel",
    state: "idle",
  },
  {
    id: "unique",
    label: "Unique 3D ULPIN",
    detail: "14 identifiers, 0 collisions",
    state: "idle",
  },
];

export const OVERVIEW_STATS = [
  { label: "Total Parcels", value: "12,480", trend: "+2.4%", up: true },
  { label: "3D Buildings", value: "4,218", trend: "+6.1%", up: true },
  { label: "Vertical Units", value: "28,642", trend: "+9.8%", up: true },
  { label: "Underground Assets", value: "1,284", trend: "+1.2%", up: true },
  { label: "Spatial Conflicts", value: "17", trend: "-12.5%", up: false },
  { label: "Verified Properties", value: "26,931", trend: "+4.7%", up: true },
];

export const RECENT_ACTIVITY = [
  {
    id: 1,
    text: "Parcel P-10482 converted to 3D model",
    kind: "model",
    time: "2 min ago",
  },
  {
    id: 2,
    text: "Floor segmentation completed for Building B-239",
    kind: "floor",
    time: "14 min ago",
  },
  { id: 3, text: "3D ULPIN generated for Unit F04-U05", kind: "ulpin", time: "38 min ago" },
  {
    id: 4,
    text: "Spatial overlap detected in Parcel P-10391",
    kind: "conflict",
    time: "1 hr ago",
  },
  { id: 5, text: "Underground asset UT-00982 mapped to parcel P123456", kind: "ug", time: "3 hr ago" },
  { id: 6, text: "Verification batch closed for Ward 21 (412 units)", kind: "model", time: "5 hr ago" },
];

export const UNIT_GROWTH = [
  { month: "Mar", units: 12400, verified: 10200 },
  { month: "Apr", units: 15800, verified: 13100 },
  { month: "May", units: 18900, verified: 16050 },
  { month: "Jun", units: 22400, verified: 19600 },
  { month: "Jul", units: 25800, verified: 23100 },
  { month: "Aug", units: 28642, verified: 26931 },
];
