"use client";

import GlobeCanvas from "./GlobeCanvas";

export default function GlobeIntro() {
  return (
    <section className="intro-root">
      {/* 🌍 BACKGROUND */}
      <GlobeCanvas />

      {/* 📝 FOREGROUND */}
      <div className="intro-hero">
        <h1>
          Sentinel<span>X</span>
        </h1>
        <p className="tagline">
          Global disaster intelligence & emergency response platform.
        </p>
        <p className="scroll-hint">
          Scroll to explore how SentinelX protects the planet 🌍
        </p>
      </div>
    </section>
  );
}
