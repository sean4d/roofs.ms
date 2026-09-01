/**
 * Approximate lat/lng for the South Mississippi communities we work in, keyed
 * by city name (lowercased). Used to project pins onto the Project Map's SVG.
 * EDIT/ADD here as new cities get jobs, a city with no entry simply won't get
 * a pin (it still appears in the gallery).
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export const CITY_COORDS: Record<string, LatLng> = {
  hattiesburg: { lat: 31.33, lng: -89.29 },
  petal: { lat: 31.35, lng: -89.24 },
  purvis: { lat: 31.14, lng: -89.41 },
  sumrall: { lat: 31.42, lng: -89.54 },
  seminary: { lat: 31.56, lng: -89.47 },
  collins: { lat: 31.64, lng: -89.56 },
  ellisville: { lat: 31.6, lng: -89.19 },
  laurel: { lat: 31.69, lng: -89.13 },
  richton: { lat: 31.35, lng: -88.94 },
  waynesboro: { lat: 31.68, lng: -88.65 },
  columbia: { lat: 31.25, lng: -89.84 },
  poplarville: { lat: 30.84, lng: -89.53 },
  wiggins: { lat: 30.86, lng: -89.14 },
  perkinston: { lat: 30.78, lng: -89.14 },
  lucedale: { lat: 30.92, lng: -88.59 },
  saucier: { lat: 30.63, lng: -89.13 },
  mchenry: { lat: 30.7, lng: -89.14 },
  kiln: { lat: 30.41, lng: -89.42 },
  diamondhead: { lat: 30.39, lng: -89.36 },
  picayune: { lat: 30.53, lng: -89.68 },
  gulfport: { lat: 30.37, lng: -89.09 },
  biloxi: { lat: 30.4, lng: -88.89 },
  "bay st. louis": { lat: 30.31, lng: -89.33 },
  "pass christian": { lat: 30.32, lng: -89.25 },
  "long beach": { lat: 30.35, lng: -89.15 },
  "d'iberville": { lat: 30.43, lng: -88.89 },
  "ocean springs": { lat: 30.41, lng: -88.83 },
  "moss point": { lat: 30.41, lng: -88.53 },
  pascagoula: { lat: 30.37, lng: -88.56 },
  brookhaven: { lat: 31.58, lng: -90.44 },
  mccomb: { lat: 31.24, lng: -90.45 },
  "crystal springs": { lat: 31.99, lng: -90.36 },
  jackson: { lat: 32.3, lng: -90.18 },
  meridian: { lat: 32.36, lng: -88.7 },
  monticello: { lat: 31.55, lng: -90.11 },
  brooklyn: { lat: 31.05, lng: -89.18 },
  prentiss: { lat: 31.6, lng: -89.87 },
  foxworth: { lat: 31.25, lng: -89.83 },
  tylertown: { lat: 31.11, lng: -90.14 },
  magee: { lat: 31.87, lng: -89.73 },
};

/** Bounding box for the SVG projection (padded around the service area). */
export const MAP_BOUNDS = {
  minLng: -90.7,
  maxLng: -88.3,
  minLat: 30.15,
  maxLat: 32.55,
};

/** Project a coordinate into an SVG viewBox of the given width/height. */
export function projectToSvg(
  { lat, lng }: LatLng,
  width: number,
  height: number,
): { x: number; y: number } {
  const { minLng, maxLng, minLat, maxLat } = MAP_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - lat) / (maxLat - minLat)) * height;
  return { x, y };
}
