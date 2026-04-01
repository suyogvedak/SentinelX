"use client";

import { useEffect, useRef } from "react";
import { pulse } from "@/app/lib/anime";

type ThreatLevel = "LOW" | "MEDIUM" | "HIGH";

const levelStyles: Record<ThreatLevel, string> = {
  LOW: "bg-green-950 text-green-400",
  MEDIUM: "bg-yellow-950 text-yellow-400",
  HIGH: "bg-red-950 text-red-500",
};

export default function NearbyThreatCard({
  level = "LOW",
}: {
  level?: ThreatLevel;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && level !== "LOW") {
      pulse(ref.current);
    }
  }, [level]);

  return (
    <div
      ref={ref}
      className={`rounded-xl p-6 shadow ${levelStyles[level]}`}
    >
      <h3 className="text-lg font-semibold">
        Nearby Threat Level
      </h3>

      <p className="mt-2 text-4xl font-extrabold">
        {level}
      </p>

      <p className="mt-1 text-sm opacity-80">
        Based on nearby incidents and alerts
      </p>
    </div>
  );
}
