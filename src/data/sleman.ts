import raw from "./sleman-kecamatan.json";

export type KecamatanProps = {
  name: string;
  areaKm2: number;
  color: string;
  centroid: [number, number];
};

export type SlemanFeature = {
  type: "Feature";
  properties: KecamatanProps;
  geometry: { type: "Polygon"; coordinates: number[][][] };
};

export type SlemanCollection = {
  type: "FeatureCollection";
  features: SlemanFeature[];
};

export const sleman = raw as SlemanCollection;
export const kecamatan = sleman.features.map((feature) => feature.properties);

export const TOTAL_AREA_KM2 = kecamatan.reduce((sum, item) => sum + item.areaKm2, 0);

const areaFormat = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatKm2(value: number) {
  return `${areaFormat.format(value)} km²`;
}

export function formatShare(areaKm2: number) {
  return `${areaFormat.format((areaKm2 / TOTAL_AREA_KM2) * 100)}%`;
}
