"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function GlobeHero() {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // idle rotation
    animate(globeRef.current, {
      rotate: 360,
      duration: 40000,
      easing: "linear",
      loop: true,
    });

    const onScroll = () => {
      const scrollY = window.scrollY;
      animate(globeRef.current!, {
        scale: Math.max(0.5, 1 - scrollY / 1200),
        translateY: -scrollY / 3,
        rotate: scrollY / 3,
        duration: 0,
        easing: "linear",
      });
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="sticky top-0 flex h-screen items-center justify-center">
      <div
        ref={globeRef}
        className="h-72 w-72 rounded-full bg-gradient-to-br
                   from-blue-500 via-green-400 to-blue-700
                   shadow-[0_0_80px_rgba(0,150,255,0.6)]"
      />
    </section>
  );
}
