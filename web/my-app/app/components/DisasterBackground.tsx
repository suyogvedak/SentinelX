"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

const backgrounds = {
  earthquake: "from-yellow-700 via-orange-600 to-red-700",
  flood: "from-blue-800 via-blue-600 to-cyan-500",
  fire: "from-red-800 via-orange-600 to-yellow-500",
  cyclone: "from-purple-800 via-indigo-600 to-blue-700",
};

export default function DisasterBackground({
  type = "earthquake",
}: {
  type?: keyof typeof backgrounds;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    animate(ref.current, {
      backgroundPosition: ["0% 50%", "100% 50%"],
      easing: "linear",
      duration: 20000,
      loop: true,
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 -z-10 bg-linear-to-r ${backgrounds[type]} bg-size-[400%_400%]`}
    />
  );
}
