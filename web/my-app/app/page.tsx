"use client";

import { useEffect, useRef } from "react";
import GlobeCanvas from "@/app/components/intro/GlobeCanvas";
import ChatBot from "@/app/components/ChatBot";

const FEATURES = [
  {
    id: "disaster-map",
    title: "Disaster Map",
    description: "Live disaster zones and severity mapping.",
    image: "/continents/asia.jpg",
  },
  {
    id: "sos",
    title: "SOS & Helplines",
    description: "Emergency contacts and SOS assistance.",
    image: "/continents/australia.jpg",
  },
  {
    id: "weather",
    title: "Weather & Risk",
    description: "Weather alerts and disaster probability.",
    image: "/continents/north_america.jpg",
  },
  {
    id: "reports",
    title: "Incident Reports",
    description: "Photo & video based reporting.",
    image: "/continents/south_america.jpg",
  },
  {
    id: "alerts",
    title: "Emergency Alerts",
    description: "Critical alerts and warnings.",
    image: "/continents/europe.jpg",
  },
  {
    id: "monitoring",
    title: "Global Monitoring",
    description: "Worldwide disaster awareness.",
    image: "/continents/africa.jpg",
  },
  {
    id: "response-coordination",
    title: "Global Response Coordination",
    description:
      "Cross-border disaster response coordination and humanitarian aid tracking.",
    image: "/continents/antartica.jpg",
  },
];

const FEATURE_ANIMATIONS = [
  // Feature 1
  {
    scale: [0.6, 1],
    opacity: [0, 1],
  },

  // Feature 2
  {
    translateY: [60, 0],
    opacity: [0, 1],
  },

  // Feature 3
  {
    translateX: [-60, 0],
    opacity: [0, 1],
  },

  // Feature 4
  {
    rotate: ["-15deg", "0deg"],
    scale: [0.8, 1],
    opacity: [0, 1],
  },

  // Feature 5
  {
    translateY: [-60, 0],
    scale: [0.9, 1],
    opacity: [0, 1],
  },

  // Feature 6
  {
    translateX: [60, 0],
    opacity: [0, 1],
  },

  // Feature 7
  {
    scale: [1.2, 1],
    opacity: [0, 1],
  },
];


export default function HomePage() {
  const featureCircleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<"up" | "down">("down");


  useEffect(() => {
  (async () => {
    const { animate } = await import("animejs");

    featureCircleRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const baseAnim =
              FEATURE_ANIMATIONS[index % FEATURE_ANIMATIONS.length];

            // 🔁 Reverse animation when scrolling UP
            const directionalAnim =
              scrollDirection.current === "down"
                ? baseAnim
                : {
                    ...baseAnim,
                    translateX: baseAnim.translateX
                      ? baseAnim.translateX.map((v: number) => -v)
                      : undefined,
                    translateY: baseAnim.translateY
                      ? baseAnim.translateY.map((v: number) => -v)
                      : undefined,
                  };

            animate(
              el,
              {
                ...directionalAnim,
                duration: 1000,
                easing: "easeOutExpo",
              } as any
            );

            observer.disconnect();
          }
        },
        { threshold: 0.35 }
      );

      observer.observe(el);
    });
  })();
}, []);





  return (
    <main className="relative min-h-[300vh] bg-black text-white overflow-x-hidden">
      {/* 🌍 Background Globe */}
      <GlobeCanvas />

      {/* HERO */}
      <section className="h-screen flex items-center justify-center">
        <div className="text-center z-10 max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">
            Sentinel<span className="text-red-500">X</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Global disaster intelligence & emergency response platform.
          </p>
          <p className="mt-6 text-sm text-gray-500">
            Scroll to explore how SentinelX protects the planet 🌍
          </p>
        </div>
      </section>

      {FEATURES.map((feature, index) => (
  <section
    key={feature.id}
    className="h-screen flex items-center justify-center"
  >
    <div className="flex flex-col items-center gap-6 z-10">
      {/* ⭕ BIG TRANSLUCENT CIRCLE */}
      <div
        ref={(el) => {
  featureCircleRefs.current[index] = el;
}}

        className="
          w-[320px] h-[320px]
          rounded-full overflow-hidden
          border border-white/20
          bg-black/30
          backdrop-blur-sm
          shadow-[0_0_80px_rgba(255,255,255,0.12)]
          opacity-0
        "
      >
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* 📦 FEATURE TEXT (REUSED FROM FEATURE CARD) */}
      <div className="max-w-md text-center bg-black/50 p-5 rounded-xl">
        <h3 className="text-2xl font-semibold mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-400">
          {feature.description}
        </p>
      </div>
    </div>
  </section>
))}


      {/* END */}
      <section className="h-screen flex items-center justify-center">
        <div className="text-center z-10">
          <h2 className="text-3xl font-semibold mb-4">
            Built to protect lives.
          </h2>
          <p className="text-gray-400 max-w-xl">
            SentinelX combines real-time monitoring, AI analysis, and global
            collaboration to reduce disaster impact.
          </p>

          <div className="mt-6 flex justify-center">
            <a
              href="/main"
              className="px-8 py-4 border-6 border-white/100 text-white rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Enter SentinelX
            </a>
          </div>
        </div>
      </section>

            <footer className="border-t border-white/10 py-10 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SentinelX — All systems monitored.
      </footer>
      <ChatBot />
    </main>
  );
}
