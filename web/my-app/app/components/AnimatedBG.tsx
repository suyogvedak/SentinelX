"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function AnimatedBG() {
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
      className="absolute inset-0 -z-10 bg-gradient-to-r
                 from-indigo-600 via-purple-600 to-pink-600
                 bg-[length:400%_400%]"
    />
  );
}
