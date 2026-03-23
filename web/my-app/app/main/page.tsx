"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import Link from "next/link";
import GlobeCanvas from "@/app/components/intro/GlobeCanvas";

export default function MainPage() {
  const heroContentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);

  /* ================= HERO ANIMATION ================= */
  useEffect(() => {
    if (!heroContentRef.current) return;

    animate(heroContentRef.current.children, {
      opacity: [0, 1],
      translateY: [40, 0],
      delay: (_el, i) => i * 180,
      duration: 900,
      easing: "easeOutCubic",
    });
  }, []);

  /* ================= SCROLL ANIMATION ================= */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target, {
              opacity: [0, 1],
              translateY: [60, 0],
              duration: 800,
              easing: "easeOutCubic",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative bg-black text-white overflow-x-hidden">

      {/* ================= HERO ================= */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-[420px] h-[420px] opacity-25">
            <GlobeCanvas />
          </div>
        </div>

        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        <div
          ref={heroContentRef}
          className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6"
        >
          <h1 className="text-6xl font-bold mb-4">
            Sentinel<span className="text-red-500">X</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Global Disaster Awareness & Rapid Response Platform
          </p>

          <div className="flex gap-4">
            <PrimaryButton href="/report" label="Report Incident" />
            <SecondaryButton href="/dashboard" label="Open Dashboard" />
            <SecondaryButton href="/reports" label="View Reports" />
          </div>
        </div>
      </section>

      {/* ================= REPORT INCIDENT (SOS STYLE) ================= */}
      <ActionSection
        refCb={(el) => (sectionRefs.current[0] = el!)}
        title="Report an Incident"
        description="Submit verified incident reports from anywhere in the world to help authorities and responders act faster."
        buttonLabel="CREATE REPORT"
        buttonHref="/report"
        danger={false}
      />


      <ActionSection
        refCb={(el) => (sectionRefs.current[3] = el!)}
        title="View Reports"
        description="Browse all submitted incident reports from users across different regions."
        buttonLabel="OPEN REPORTS"
        buttonHref="/reports"
        danger={false}
      />

      {/* ================= GLOBAL SOS ================= */}
      <ActionSection
        refCb={(el) => (sectionRefs.current[1] = el!)}
        title="Emergency SOS"
        description="Trigger an emergency alert instantly. Your location and device information will be securely shared with responders."
        buttonLabel="SEND SOS"
        buttonHref="/sos"
        danger
      />

      {/* ================= LIVE MAP FEED (FIXED) ================= */}
      <ActionSection
        refCb={(el) => (sectionRefs.current[2] = el!)}
        title="Live Disaster Map"
        description="Search locations, monitor active disasters, and visualize global risk zones in real time."
        buttonLabel="OPEN LIVE MAP"
        buttonHref="/map"
        danger={false}
      />

      {/* ================= GLOBAL HELPLINES (FIXED) ================= */}
      <section
        ref={(el) => {
          if (el) sectionRefs.current[3] = el;
        }}
        className="min-h-screen flex items-center border-t border-white/10 px-6 opacity-0"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6">
            Global Emergency Helplines
          </h2>

          <p className="text-gray-400 mb-10 max-w-3xl mx-auto">
            Access region-specific emergency contact numbers for police,
            medical, fire, and disaster services worldwide.
          </p>

          <div className="flex justify-center">
            <Link
              href="/helpline"
              className="px-10 py-4 bg-red-500 rounded-lg text-lg font-semibold hover:bg-red-600 transition"
            >
              VIEW HELPLINES
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SentinelX — All systems monitored.
      </footer>
    </main>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function ActionSection({
  title,
  description,
  buttonLabel,
  buttonHref,
  danger,
  refCb,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  danger?: boolean;
  refCb: (el: HTMLElement | null) => void;
}) {
  return (
    <section
      ref={refCb}
      className="min-h-screen flex items-center justify-center border-t border-white/10 px-6 opacity-0"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className={`text-4xl font-semibold mb-4 ${
            danger ? "text-red-500" : ""
          }`}
        >
          {title}
        </h2>

        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          {description}
        </p>

        <Link
          href={buttonHref}
          className={`px-12 py-5 rounded-full text-xl font-bold transition ${
            danger
              ? "bg-red-600 hover:bg-red-700 animate-pulse"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}

function PrimaryButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="px-8 py-4 bg-red-500 rounded-lg font-semibold hover:bg-red-600 transition"
    >
      {label}
    </Link>
  );
}

function SecondaryButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="px-8 py-4 border border-white/20 rounded-lg hover:bg-white/10 transition"
    >
      {label}
    </Link>
  );
}
