"use client";

import GlobeCanvas from "@/app/components/intro/GlobeCanvas";
import { animate } from "animejs";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    animate(".auth-card", {
      opacity: [0, 1],
      translateY: [60, 0],
      easing: "easeOutExpo",
      duration: 1200,
    });
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Globe background */}
      <div className="absolute inset-0 z-0">
        <GlobeCanvas />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Auth UI */}
      <div className="relative z-10 flex h-full items-center justify-center">
        {children}
      </div>

      {/* Cinematic transition overlay */}
      <div
        id="transition-overlay"
        className="fixed inset-0 z-50 bg-black opacity-0 pointer-events-none"
      />
    </div>
  );
}
