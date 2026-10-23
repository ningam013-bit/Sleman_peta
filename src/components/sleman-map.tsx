import { useEffect, useRef } from "react";
import type { GeoJSON as GeoJSONLayer, LatLngBounds, Map as LeafletMap, Path, PathOptions } from "leaflet";
import { LANDMARKS } from "@/data/meta";
import { sleman, type KecamatanProps } from "@/data/sleman";

type Props = {
  selected: string | null;
  hovered: string | null;
  showLabels: boolean;
  showPins: boolean;
  onSelect: (name: string) => void;
  onHover: (name: string | null) => void;
  focusToken: number;
  resetToken: number;
  readyTick: number;
  onReady: () => void;
};

function styleFor(props: KecamatanProps, selected: string | null, hovered: string | null): PathOptions {
  const active = props.name === selected;
  const hot = props.name === hovered;
  return {
    color: active ? "#c45c28" : "#1c2b24",
    weight: active ? 3.2 : hot ? 2.4 : 1.35,
    fillColor: props.color,
    fillOpacity: active ? 0.84 : hot ? 0.74 : 0.58,
    opacity: 1,
  };
}

export function SlemanMap({
  selected,
  hovered,
  showLabels,
  showPins,
  onSelect,
  onHover,
  focusToken,
  resetToken,
  readyTick,
  onReady,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<GeoJSONLayer | null>(null);
  const byName = useRef(new globalThis.Map<string, Path>());
  const selectedRef = useRef(selected);
  const hoveredRef = useRef(hovered);
  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);
  selectedRef.current = selected;
  hoveredRef.current = hovered;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    const handle: { map: LeafletMap | null } = { map: null };

    void (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      if (disposed || !hostRef.current) return;

      const map = L.map(hostRef.current, {
        zoomControl: false,
        attributionControl: true,
        minZoom: 10,
        maxZoom: 16,
      });
      handle.map = map;
      mapRef.current = map;
      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
      }).addTo(map);

      const apply = () => {
        byName.current.forEach((layer, name) => {
          const feature = sleman.features.find((item) => item.properties.name === name);
          if (!feature) return;
          layer.setStyle(styleFor(feature.properties, selectedRef.current, hoveredRef.current));
          if (name === selectedRef.current || name === hoveredRef.current) layer.bringToFront();
        });
      };

      const geo = L.geoJSON(sleman as never, {
        style: (feature) => {
          const props = feature?.properties as KecamatanProps;
          return styleFor(props, selectedRef.current, hoveredRef.current);
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties as KecamatanProps;
          const path = layer as Path;
          byName.current.set(props.name, path);
          path.bindTooltip(props.name, {
            permanent: true,
            direction: "center",
            className: "kec-label",
            opacity: 1,
          });
          path.on("click", () => onSelectRef.current(props.name));
          path.on("mouseover", () => onHoverRef.current(props.name));
          path.on("mouseout", () => onHoverRef.current(null));
        },
      }).addTo(map);
      layerRef.current = geo;

      for (const place of LANDMARKS) {
        const marker = L.marker([place.lat, place.lon], {
          icon: L.divIcon({
            className: "landmark-pin",
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          }),
          keyboard: true,
          title: place.name,
        });
        marker.bindTooltip(`${place.name} · ${place.kind}`, {
          direction: "top",
          offset: [0, -8],
          className: "pin-tip",
          opacity: 1,
        });
        marker.addTo(map);
      }

      const bounds = geo.getBounds().pad(0.08);
      map.setMaxBounds(bounds.pad(0.45));
      map.fitBounds(geo.getBounds(), { padding: [28, 28] });
      apply();
      onReadyRef.current();
    })();

    return () => {
      disposed = true;
      handle.map?.remove();
      mapRef.current = null;
      layerRef.current = null;
      byName.current.clear();
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    host?.classList.toggle("labels-off", !showLabels);
    host?.classList.toggle("pins-off", !showPins);
  }, [showLabels, showPins]);

  useEffect(() => {
    byName.current.forEach((layer, name) => {
      const feature = sleman.features.find((item) => item.properties.name === name);
      if (!feature) return;
      layer.setStyle(styleFor(feature.properties, selected, hovered));
      if (name === selected || name === hovered) layer.bringToFront();
    });
  }, [selected, hovered]);

  useEffect(() => {
    if (!selected) return;
    const map = mapRef.current;
    const layer = byName.current.get(selected);
    if (!map || !layer) return;
    const bounds = (layer as Path & { getBounds(): LatLngBounds }).getBounds();
    map.fitBounds(bounds, { padding: [42, 42], maxZoom: 13, animate: true });
  }, [selected, focusToken, readyTick]);

  useEffect(() => {
    if (resetToken === 0) return;
    const map = mapRef.current;
    const geo = layerRef.current;
    if (!map || !geo) return;
    map.fitBounds(geo.getBounds(), { padding: [28, 28], animate: true });
  }, [resetToken]);

  return <div ref={hostRef} className="map-root labels-on h-full w-full" />;
}
