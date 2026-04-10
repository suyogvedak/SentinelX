//sos/id/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/* ================= TYPES ================= */

type SOSStatus =
  | "RECEIVED"
  | "ACKNOWLEDGED"
  | "RESPONDING"
  | "RESOLVED"
  | "CLOSED"
  | "unresolved"
  | "resolved";

type SOS = {
  _id: string;
  status: SOSStatus;
  timestamps?: {
    receivedAt?: string;
    acknowledgedAt?: string;
    respondingAt?: string;
    resolvedAt?: string;
    closedAt?: string;
  };
  createdAt?: string;
};

/* ================= UI MAP ================= */

const STATUS_UI: Record<
  string,
  { title: string; message: string; color: string }
> = {
  RECEIVED: {
    title: "🚨 SOS Received",
    message: "Your SOS has been received. Please stay calm.",
    color: "border-red-500 bg-red-500/10",
  },
  ACKNOWLEDGED: {
    title: "✅ Acknowledged",
    message: "Control center has acknowledged your SOS.",
    color: "border-yellow-500 bg-yellow-500/10",
  },
  RESPONDING: {
    title: "🚑 Help is on the way",
    message: "Emergency responders are responding.",
    color: "border-blue-500 bg-blue-500/10",
  },
  RESOLVED: {
    title: "🛟 Situation Resolved",
    message: "Your situation has been resolved.",
    color: "border-green-500 bg-green-500/10",
  },
  CLOSED: {
    title: "📁 Case Closed",
    message: "This SOS case has been closed.",
    color: "border-gray-500 bg-gray-500/10",
  },
  unresolved: {
    title: "🚨 SOS Received",
    message: "Your SOS has been received.",
    color: "border-red-500 bg-red-500/10",
  },
  resolved: {
    title: "🛟 Resolved",
    message: "Your SOS has been resolved.",
    color: "border-green-500 bg-green-500/10",
  },
};

/* ================= COMPONENT ================= */

export default function UserSOSStatusPage() {
  const { id } = useParams<{ id: string }>();
  const [sos, setSos] = useState<SOS | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    const res = await fetch(`/api/sos/${id}`);
    if (!res.ok) {
      setError("Unable to fetch SOS status");
      return;
    }
    setSos(await res.json());
  };

  useEffect(() => {
    fetchStatus();
    const i = setInterval(fetchStatus, 5000);
    return () => clearInterval(i);
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-400 flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!sos) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading SOS status…
      </div>
    );
  }

  const ui = STATUS_UI[sos.status] ?? STATUS_UI.RECEIVED;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          SentinelX Emergency Status
        </h1>

        <div className={`border rounded-xl p-6 ${ui.color}`}>
          <h2 className="text-xl font-semibold mb-2">{ui.title}</h2>
          <p className="text-gray-200">{ui.message}</p>
          <div className="text-xs text-gray-400 mt-4">
            SOS ID: {sos._id}
          </div>
        </div>
      </div>
    </main>
  );
}
