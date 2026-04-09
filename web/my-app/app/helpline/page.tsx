"use client";

import { useState } from "react";

type Helpline = {
  service: string;
  description: string;
  number: string;
};

const HELPLINE_DATA: Record<string, Helpline[]> = {
  Global: [
    {
      service: "General Emergency",
      description: "Universal emergency assistance",
      number: "112 / 911",
    },
    {
      service: "Police Assistance",
      description: "Law enforcement emergency support",
      number: "911 / 112",
    },
    {
      service: "Ambulance & Medical",
      description: "Medical emergencies & ambulance",
      number: "911 / 112",
    },
    {
      service: "Fire & Rescue",
      description: "Fire, rescue, and hazards",
      number: "911 / 112",
    },
    {
      service: "Disaster Management",
      description: "Natural & large-scale disasters",
      number: "Local Authority",
    },
    {
      service: "Women & Child Safety",
      description: "Safety & protection services",
      number: "Local Helpline",
    },
  ],

  USA: [
    {
      service: "General Emergency",
      description: "Emergency services",
      number: "911",
    },
    {
      service: "Police Assistance",
      description: "Police emergency",
      number: "911",
    },
    {
      service: "Ambulance & Medical",
      description: "Medical emergency",
      number: "911",
    },
    {
      service: "Fire & Rescue",
      description: "Fire emergency",
      number: "911",
    },
  ],

  UK: [
    {
      service: "General Emergency",
      description: "Emergency services",
      number: "999 / 112",
    },
    {
      service: "Police Assistance",
      description: "Police emergency",
      number: "999",
    },
    {
      service: "Ambulance & Medical",
      description: "Medical emergency",
      number: "999",
    },
    {
      service: "Fire & Rescue",
      description: "Fire emergency",
      number: "999",
    },
  ],
};

export default function HelplinePage() {
  const [country, setCountry] = useState("Global");

  const helplines = HELPLINE_DATA[country] || HELPLINE_DATA.Global;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}
        <h1 className="text-4xl font-bold mb-4">
          Emergency Helplines
        </h1>

        <p className="text-gray-400 mb-8 max-w-3xl">
          Access emergency contact numbers based on your country and service
          type. Always use these services responsibly.
        </p>

        {/* ================= COUNTRY SELECT ================= */}
        <div className="mb-10 max-w-sm">
          <label className="block text-sm mb-2 text-gray-300">
            Select Country / Region
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3"
          >
            <option value="Global">Global (Default)</option>
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>

        {/* ================= HELPLINE CARDS ================= */}
        <div className="grid md:grid-cols-3 gap-6">
          {helplines.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/10 bg-black/40 p-6 hover:bg-white/5 transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                {item.service}
              </h3>

              <p className="text-sm text-gray-400 mb-4">
                {item.description}
              </p>

              <div className="text-2xl font-bold text-red-500">
                {item.number}
              </div>
            </div>
          ))}
        </div>

        {/* ================= DISCLAIMER ================= */}
        <p className="mt-12 text-sm text-gray-500">
          Emergency numbers vary by country and region. SentinelX does not
          replace official emergency services.
        </p>
      </div>
    </main>
  );
}
