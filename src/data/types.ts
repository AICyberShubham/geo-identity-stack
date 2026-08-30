export type VerificationStatus = "Verified" | "Pending" | "Mapped" | "Disputed";

export interface Ulpin {
  value: string;
  kind: "2d" | "3d";
  issuedOn: string;
}

export interface Parcel {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  district: string;
  districtCode: string;
  area: number; // m²
  /** Footprint polygon in local metres, [x, z] pairs (ground plane). */
  geometry: [number, number][];
  ulpin: string;
  primary?: boolean;
}

export interface Building {
  id: string;
  parcelId: string;
  name: string;
  floors: number;
  height: number; // m
  /** width (x) x depth (z) in metres, centred at origin */
  footprint: { width: number; depth: number; center: [number, number] };
}

export interface PropertyUnit {
  id: string;
  floorId: string;
  unitNumber: string;
  area: number; // sq.ft
  owner: string;
  zMin: number;
  zMax: number;
  ulpin3d: string;
  status: VerificationStatus;
  confidence: number;
  type: string;
}

export interface Floor {
  id: string;
  buildingId: string;
  number: number;
  label: string;
  zMin: number;
  zMax: number;
  units: PropertyUnit[];
}

export interface UndergroundAsset {
  id: string;
  type: string;
  zMin: number;
  zMax: number;
  parentParcel: string;
  ulpin3d: string;
  status: VerificationStatus;
  /** local footprint for rendering */
  box: { x: number; z: number; width: number; depth: number };
}

export interface Road {
  id: string;
  name: string;
  points: [number, number][];
  width: number;
}

export interface ValidationCheck {
  id: string;
  label: string;
  detail: string;
  state: "idle" | "running" | "pass" | "fail";
}

export interface ValidationResult {
  ranAt: string | null;
  checks: ValidationCheck[];
  conflict: SpatialConflict | null;
}

export interface SpatialConflict {
  type: string;
  units: [string, string];
  overlap: number; // m²
  severity: "High" | "Medium" | "Low";
  action: string;
}

export type SelectionKind = "unit" | "floor" | "parcel" | "underground" | null;

export interface Selection {
  kind: SelectionKind;
  id: string | null;
}
