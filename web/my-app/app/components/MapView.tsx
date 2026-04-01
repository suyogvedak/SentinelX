"use client";

import {
  MapContainer,
  TileLayer,
  LayersControl,
  Circle,
  Popup,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { useEffect, useMemo, useState } from "react";

const { BaseLayer, Overlay } = LayersControl;

/* ---------------- FIX LEAFLET ICONS ---------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------------- TYPES ---------------- */
type Severity = "Low" | "Medium" | "High";
type DisasterType = "Earthquake" | "Wildfire" | "Alert";

type Disaster = {
  type: DisasterType;
  lat: number;
  lon: number;
  severity: Severity;
  timestamp?: number;
  description?: string;
};

/* ---------------- COLORS ---------------- */
const severityColor: Record<Severity, string> = {
  Low: "green",
  Medium: "orange",
  High: "red",
};

/* ================= MAP VIEW ================= */
export default function MapView() {
  const [data, setData] = useState<Disaster[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  /* ---- FILTERS ---- */
  const [range, setRange] = useState<1 | 7 | 30>(7);
  const [filters, setFilters] = useState<Record<DisasterType, boolean>>({
    Earthquake: true,
    Wildfire: true,
    Alert: true,
  });

  /* ---------------- FETCH REAL DATA ---------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [eq, fire, alert] = await Promise.all([
          fetch("/api/disasters/earthquakes").then((r) => r.json()),
          fetch("/api/disasters/wildfires").then((r) => r.json()),
          fetch("/api/disasters/global").then((r) => r.json()),
        ]);

        setData([...eq, ...fire, ...alert]);
      } catch {
        setData([]);
      }
    };

    fetchAll();
    const i = setInterval(fetchAll, 300000);
    return () => clearInterval(i);
  }, []);

  /* ---------------- USER LOCATION ---------------- */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((p) =>
      setUserLocation([p.coords.latitude, p.coords.longitude])
    );
  }, []);

  /* ---------------- TIME FILTER ---------------- */
  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoff = now - range * 24 * 60 * 60 * 1000;

    return data.filter(
      (d) =>
        filters[d.type] &&
        (!d.timestamp || d.timestamp >= cutoff)
    );
  }, [data, range, filters]);

  /* ---------------- HEATMAP DATA ---------------- */
  const heatPoints = filtered.map((d) => [
    d.lat,
    d.lon,
    d.severity === "High" ? 1 : d.severity === "Medium" ? 0.6 : 0.3,
  ]);

  /* ---------------- AI RISK OVERLAY ---------------- */
  const aiRiskZones = useMemo(() => {
    const clusters: Record<string, number> = {};

    filtered.forEach((d) => {
      const key = `${Math.round(d.lat)}_${Math.round(d.lon)}`;
      clusters[key] = (clusters[key] || 0) + 1;
    });

    return Object.entries(clusters)
      .filter(([, count]) => count >= 3)
      .map(([key]) => {
        const [lat, lon] = key.split("_").map(Number);
        return { lat, lon };
      });
  }, [filtered]);

  return (
    <div className="h-full w-full relative">
      {/* CONTROLS */}
      <div className="absolute z-[1000] top-3 left-3 bg-black/70 p-3 rounded-lg text-xs space-y-2">
        <div>
          Time:
          {[1, 7, 30].map((d) => (
            <button
              key={d}
              onClick={() => setRange(d as any)}
              className={`ml-2 px-2 py-1 rounded ${
                range === d ? "bg-red-500" : "bg-white/10"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>

        {Object.keys(filters).map((k) => (
          <label key={k} className="block">
            <input
              type="checkbox"
              checked={filters[k as DisasterType]}
              onChange={() =>
                setFilters((f) => ({
                  ...f,
                  [k]: !f[k as DisasterType],
                }))
              }
            />{" "}
            {k}
          </label>
        ))}
      </div>

      <MapContainer center={[20, 0]} zoom={2} className="h-full w-full">
        <LayersControl position="topright">
          <BaseLayer checked name="Street">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </BaseLayer>
          <BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </BaseLayer>
        </LayersControl>

        {/* DISASTER ZONES */}
        {filtered.map((d, i) => (
          <Circle
            key={i}
            center={[d.lat, d.lon]}
            radius={d.severity === "High" ? 80000 : 40000}
            pathOptions={{
              color: severityColor[d.severity],
              fillOpacity: 0.35,
            }}
          >
            <Popup>
              <strong>{d.type}</strong>
              <br />
              Severity: {d.severity}
              <br />
              {d.description}
            </Popup>
          </Circle>
        ))}

        {/* AI RISK */}
        {aiRiskZones.map((z, i) => (
          <Circle
            key={`ai-${i}`}
            center={[z.lat, z.lon]}
            radius={120000}
            pathOptions={{
              color: "purple",
              dashArray: "4",
              fillOpacity: 0.2,
            }}
          >
            <Popup>⚠️ AI-predicted risk escalation</Popup>
          </Circle>
        ))}

        {/* USER */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
