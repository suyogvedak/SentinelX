"use client";

import { useEffect, useRef, useState } from "react";

/* ================= TYPES ================= */

type SOSStatus =
  | "RECEIVED"
  | "ACKNOWLEDGED"
  | "RESPONDING"
  | "RESOLVED"
  | "CLOSED"
  | "unresolved"
  | "resolved"; // legacy support

type SOS = {
  _id: string;
  phone?: string;
  country?: string;
  platform?: string;
  status: SOSStatus;
  createdAt?: string;

  timestamps?: {
    receivedAt?: string;
    acknowledgedAt?: string;
    respondingAt?: string;
    resolvedAt?: string;
    closedAt?: string;
  };

  location?: {
    lat: number;
    lng: number;
  };
};

const CRITICAL_MINUTES = 5;

const MESSAGE_TEMPLATES = {
  en: "This is SentinelX Emergency Response. We received your SOS. Please reply with your current status.",
};

const normalizeStatus = (status: string): SOSStatus => {
  if (status === "unresolved") return "RECEIVED";
  if (status === "resolved") return "RESOLVED";
  return status as SOSStatus;
};


/* ================= COMPONENT ================= */

export default function AdminSOSPage() {
  const [sosList, setSosList] = useState<SOS[]>([]);
  const alertAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastCountRef = useRef(0);

  /* ---------- ALERT SOUND ---------- */
  useEffect(() => {
    alertAudioRef.current = new Audio("/sounds/alert.mp3");
  }, []);

  /* ---------- HELPERS ---------- */

  const getReceivedAt = (sos: SOS) =>
    sos.timestamps?.receivedAt ?? sos.createdAt ?? new Date().toISOString();

  const minutesOld = (date: string) =>
    Math.floor((Date.now() - new Date(date).getTime()) / 60000);

  const isCritical = (sos: SOS) => {
    const activeStatuses = ["RECEIVED", "ACKNOWLEDGED", "unresolved"];
    return (
      activeStatuses.includes(sos.status) &&
      minutesOld(getReceivedAt(sos)) >= CRITICAL_MINUTES
    );
  };

  const normalizePhone = (phone?: string) =>
    phone ? phone.replace(/\D/g, "") : null;

  const nextActions: Record<SOSStatus, SOSStatus | null> = {
    unresolved: "ACKNOWLEDGED",
    RECEIVED: "ACKNOWLEDGED",
    ACKNOWLEDGED: "RESPONDING",
    RESPONDING: "RESOLVED",
    RESOLVED: "CLOSED",
    resolved: null,
    CLOSED: null,
  };

  /* ---------- FETCH ---------- */

  const fetchSOS = async () => {
    const res = await fetch("/api/admin/sos");
    if (!res.ok) return;

    const text = await res.text();
    const data: SOS[] = text ? JSON.parse(text) : [];

    if (lastCountRef.current && data.length > lastCountRef.current) {
      alertAudioRef.current?.play().catch(() => {});
    }

    lastCountRef.current = data.length;
    setSosList(data);
  };

  useEffect(() => {
    fetchSOS();
    const i = setInterval(fetchSOS, 5000);
    return () => clearInterval(i);
  }, []);

  /* ---------- STATUS UPDATE (FIXED) ---------- */

  const updateStatus = async (sos: SOS, nextStatus: SOSStatus) => {
  try {
    const res = await fetch("/api/admin/sos-update", {
      method: "PATCH", // ✅ MUST MATCH BACKEND
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: sos._id,
        nextStatus,
      }),
    });

    if (!res.ok) {
      alert("Status update failed");
      return;
    }

    // optimistic UI update
    setSosList((prev) =>
      prev.map((s) =>
        s._id === sos._id ? { ...s, status: nextStatus } : s
      )
    );
  } catch {
    alert("Network error");
  }
};




  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          🚨 SOS Command Center
        </h1>

        <div className="space-y-4">
          {sosList.map((sos) => {
            const critical = isCritical(sos);
            const phone = normalizePhone(sos.phone);
            const message = MESSAGE_TEMPLATES.en;
            const next = nextActions[sos.status];

            return (
              <div
  key={sos._id}
  className={`border rounded-xl p-4 transition-all duration-300 ${
    sos.status === "RESOLVED" || sos.status === "resolved"
      ? "border-green-600 bg-green-600/20"
      : sos.status === "ACKNOWLEDGED"
      ? "border-yellow-500 bg-yellow-500/10"
      : critical
      ? "border-red-600 bg-red-600/15 animate-pulse"
      : "border-red-500 bg-red-500/10"
  }`}


              >
                {/* HEADER */}
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-red-400">
                    {sos.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {minutesOld(getReceivedAt(sos))} min ago
                  </span>
                </div>

                {/* DETAILS */}
                <div className="text-sm text-gray-300">
                  📞 {sos.phone ?? "Not provided"} <br />
                  🌍 {sos.country ?? "Unknown"} <br />
                  📱 {sos.platform ?? "Unknown"} <br />
                  📍{" "}
                  {sos.location
                    ? `${sos.location.lat}, ${sos.location.lng}`
                    : "Location unavailable"}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3 mt-4">
                  {phone && (
                    <>
                      <a
                        href={`tel:${phone}`}
                        className="px-4 py-2 bg-yellow-600 rounded text-sm"
                      >
                        Call
                      </a>

                      <a
                        href={`https://wa.me/${phone}?text=${encodeURIComponent(
                          message
                        )}`}
                        target="_blank"
                        className="px-4 py-2 bg-green-600 rounded text-sm"
                      >
                        WhatsApp
                      </a>

                      <a
                        href={`sms:${phone}?body=${encodeURIComponent(
                          message
                        )}`}
                        className="px-4 py-2 bg-blue-600 rounded text-sm"
                      >
                        SMS
                      </a>
                    </>
                  )}

                <div className="flex flex-wrap gap-3 mt-4">
  {normalizeStatus(sos.status) === "RECEIVED" && (
    <button
      onClick={() => updateStatus(sos, "ACKNOWLEDGED")}
      className="px-4 py-2 bg-yellow-600 rounded text-sm"
    >
      Acknowledge
    </button>
  )}

  {normalizeStatus(sos.status) === "ACKNOWLEDGED" && (
    <button
      onClick={() => updateStatus(sos, "RESOLVED")}
      className="px-4 py-2 bg-green-600 rounded text-sm"
    >
      Resolve
    </button>
  )}

  {normalizeStatus(sos.status) === "RESOLVED" && (
    <span className="px-4 py-2 bg-green-900 rounded text-sm">
      ✅ Resolved
    </span>
  )}
</div>


                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
