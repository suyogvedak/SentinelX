"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayerGroup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/app/lib/leafletFix";

/* ================= TYPES ================= */

type SOS = {
  _id: string;
  status: "unresolved" | "resolved";
  createdAt: string;
  location?: {
    lat: number;
    lng: number;
  };
};

type Report = {
  _id: string;
  createdAt: string;
  type?: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
  };
};

type Disaster = {
  id: string;
  title: string;
  type: string;
  severity: "low" | "medium" | "high";
  lat: number;
  lng: number;
};

/* ================= ICONS ================= */

const sosCriticalIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const sosNormalIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [32, 32],
});

const sosResolvedIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const reportIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});

const disasterIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
  iconSize: [32, 32],
});

/* ================= CONSTANTS ================= */

const CRITICAL_MINUTES = 5;

export default function AdminMapClient() {
  /* ----- STATE & REFS (ALWAYS FIRST) ----- */
  const [mounted, setMounted] = useState(false);
  const [sosList, setSosList] = useState<SOS[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  /* ----- MOUNT FLAG ----- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ----- DATA FETCH (ALWAYS CALLED) ----- */
  useEffect(() => {
    if (!mounted) return;

    const fetchSOS = async () => {
      const res = await fetch("/api/admin/sos");
      const data: SOS[] = await res.json();
      setSosList(data.filter((s) => s.location));
    };

    const fetchReports = async () => {
  try {
    const res = await fetch("/api/reports");

    if (!res.ok) {
      console.error("Reports API failed:", res.status);
      return;
    }

    const data: Report[] = await res.json();
    setReports(data.filter((r) => r.location));

  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
};

    const fetchDisasters = async () => {
      const res = await fetch("/api/disasters");
      const data: Disaster[] = await res.json();
      setDisasters(data.filter((d) => d.lat && d.lng));
    };

    fetchSOS();
    fetchDisasters();
    fetchReports();

    const interval = setInterval(() => {
  fetchSOS();
  fetchReports();
}, 5000);});

  /* ----- HELPERS ----- */
  const minutesOld = (d: string) =>
    Math.floor(
      (Date.now() - new Date(d).getTime()) / 60000
    );

  const isCritical = (s: SOS) =>
    s.status === "unresolved" &&
    minutesOld(s.createdAt) >= CRITICAL_MINUTES;

  /* ----- RENDER ----- */
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading map…
      </div>
    );
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* SOS LAYER */}
      <LayerGroup>
        {sosList.map((sos) => {
          if (!sos.location) return null;

          const icon =
            sos.status === "resolved"
              ? sosResolvedIcon
              : isCritical(sos)
              ? sosCriticalIcon
              : sosNormalIcon;

          return (
            <Marker
              key={sos._id}
              position={[
                sos.location.lat,
                sos.location.lng,
              ]}
              icon={icon}
            >
              <Popup>
                <b>SOS</b>
                <br />
                Status: {sos.status}
                <br />
                Age: {minutesOld(sos.createdAt)} min
              </Popup>
            </Marker>
          );
        })}
      </LayerGroup>


      {/* REPORTS LAYER */}
<LayerGroup>
  {reports.map((report) => {
    if (!report.location) return null;

    return (
      <Marker
        key={report._id}
        position={[
          report.location.lat,
          report.location.lng,
        ]}
        icon={reportIcon}
      >
        <Popup>
          <b>Report</b>
          <br />
          Type: {report.type || "N/A"}
          <br />
          {report.description || "No description"}
        </Popup>
      </Marker>
    );
  })}
</LayerGroup>

      {/* DISASTER LAYER */}
      <LayerGroup>
        {disasters.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={disasterIcon}
          >
            <Popup>
              <b>{d.title}</b>
              <br />
              Type: {d.type}
              <br />
              Severity: {d.severity}
            </Popup>
          </Marker>
        ))}
      </LayerGroup>
    </MapContainer>
  );
}
