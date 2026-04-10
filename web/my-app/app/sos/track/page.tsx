"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserSOSTrackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    const sosId = localStorage.getItem("ACTIVE_SOS_ID");
    if (!sosId) {
      router.push("/sos");
      return;
    }

    const fetchStatus = async () => {
      const res = await fetch(`/api/sos/${sosId}`);
      if (!res.ok) return;

      const data = await res.json();
      setStatus(data.status ?? "RECEIVED");
    };

    fetchStatus();
    const i = setInterval(fetchStatus, 5000);
    return () => clearInterval(i);
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
  <h1 className="text-3xl font-bold">
    {status}
  </h1>

  <p className="text-gray-400">
    Please stay calm. Help is being coordinated.
  </p>

  {/* ✅ NEW BUTTON */}
  <a
    href="/main"
    className="inline-block px-8 py-3 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition"
  >
    Go to Home Page
  </a>
</div>
    </main>
  );
}
