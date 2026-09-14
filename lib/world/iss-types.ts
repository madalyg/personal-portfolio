export interface GeoPoint {
  lat: number;
  lng: number;
  alt: number;
}

export type IssPath = {
  id: string;
  points: GeoPoint[];
};

export interface IssOrbitPayload {
  name: string;
  paths: IssPath[];
  position: GeoPoint;
}
