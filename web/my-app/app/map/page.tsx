"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MapView = dynamic(() => import("@/app/components/MapView"), {
  ssr: false,
});

export default function MapPage() {
  const [query, setQuery] = useState("");

  return (
    <main className="min-h-screen bg-black text-white px-6 py-6">
      <h1 className="text-3xl font-semibold mb-4">
        Live Disaster Map
      </h1>

      <input
        placeholder="Search location..."
        className="mb-4 w-full max-w-md px-4 py-3 rounded-lg bg-black/60 border border-white/20"
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="h-[500px] rounded-xl overflow-hidden border border-white/10">
        <MapView searchQuery={query} />
      </div>
    </main>
  );
}
