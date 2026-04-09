"use client";

import { useEffect, useState } from "react";
import ChatBot from "@/app/components/ChatBot";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/app/components/MapView"), {
  ssr: false,
});


/* ================= TYPES ================= */

type WeatherSeverity = "Low" | "Medium" | "High";

type WeatherData = {
  condition: string;
  temp: number;
  wind: number;
  severity: WeatherSeverity;
};

type NewsItem = {
  title: string;
  source: string;
  time: string;
};

/* ================= MAIN PAGE ================= */

export default function MainPage() {
  /* -------- WEATHER (API READY) -------- */
  const [weather, setWeather] = useState<WeatherData>({
    condition: "Loading...",
    temp: 0,
    wind: 0,
    severity: "Low",
  });

  /* -------- NEARBY THREATS -------- */
  const [threats, setThreats] = useState<string[]>([
    "Monitoring nearby regions...",
  ]);

  useEffect(() => {
  if (threats.length > 0 && threats[0] !== "Monitoring nearby regions...") {
    fetchAIInsights(threats);
  }
}, [threats]);

  /* -------- NEWS -------- */
  const [news, setNews] = useState<NewsItem[]>([]);

  /* -------- AI INSIGHTS -------- */
  const [aiInsights, setAiInsights] = useState<any>(null);
const [loadingAI, setLoadingAI] = useState(false);

  /* ================= EFFECTS ================= */

  useEffect(() => {
  const fetchWeather = async () => {
    try {
      const res = await fetch("/api/weather");
      const data = await res.json();

      if (!res.ok) throw new Error();

      setWeather(data);
    } catch {
      setWeather({
        condition: "Unavailable",
        temp: 0,
        wind: 0,
        severity: "Low",
      });
    }
  };

  fetchWeather();
  const interval = setInterval(fetchWeather, 600000); // refresh every 10 min

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();

      if (!res.ok) throw new Error();

      setNews(data);
    } catch {
      setNews([
        {
          title: "Unable to load disaster news",
          source: "System",
          time: "Try again later",
        },
      ]);
    }
  };

  fetchNews();
  const interval = setInterval(fetchNews, 900000); // every 15 min

  return () => clearInterval(interval);
}, []);


  // AI Insights
  const fetchAIInsights = async (threatData: string[]) => {
  if (!threatData || threatData.length === 0) return;

  try {
    setLoadingAI(true);

    const res = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ threats: threatData }),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    setAiInsights(data);

  } catch (err) {
    console.error("AI ERROR:", err);
  } finally {
    setLoadingAI(false);
  }
};

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Sentinel<span className="text-red-500">X</span> Dashboard
          </h1>
          <span className="text-sm text-green-400">
            ● AI Monitoring Active
          </span>
        </div>
      </header>

      {/* ================= TOP PRIORITY ================= */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <NearbyThreatCard threats={threats} />
          <WeatherUpdateCard weather={weather} />
        </div>
      </section>



      {/* ================= NEWS ================= */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">
            Disaster News
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((n, i) => (
              <NewsCard key={i} {...n} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Global Risk Map
          </h2>
          <div className="h-[420px] rounded-xl border border-white/10 overflow-hidden">
          <MapView />
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-20 border-t border-white/10 bg-black/60">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400">
          
          <div>
            <h3 className="text-white font-semibold mb-2">SentinelX</h3>
            <p>
              AI-powered global disaster intelligence and response platform.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Platform</h3>
            <ul className="space-y-1">
              <li>Disaster Monitoring</li>
              <li>AI Predictions</li>
              <li>Emergency Tools</li>
              <li>Global Map</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Status</h3>
            <p className="text-green-400">All systems operational</p>
            <p className="mt-2">© {new Date().getFullYear()} SentinelX</p>
          </div>

        </div>
      </footer>

      <ChatBot />
    </main>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-6">
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-4xl font-semibold mt-2">{value}</h3>
    </div>
  );
}

function InsightCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/50 p-6">
      <p className="text-gray-300">{text}</p>
    </div>
  );
}

function NearbyThreatCard({ threats }: { threats: string[] }) {
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const fetchAI = async () => {
      if (!threats || threats.length === 0) return;

      try {
        setLoadingAI(true);

        const res = await fetch("/api/ai/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ threats }),
        });

        const data = await res.json();
        setAiInsights(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAI();
  }, [threats]);

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
      <h3 className="text-xl font-semibold text-red-400 mb-3">
        Nearby Threats
      </h3>

      <ul className="space-y-2">
        {threats.map((t, i) => (
          <li key={i}>⚠️ {t}</li>
        ))}
      </ul>

      {/* ✅ AI SECTION ADDED */}
      {loadingAI && (
        <p className="text-sm text-gray-400 mt-3">
          Analyzing threats with AI...
        </p>
      )}

      {aiInsights && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-red-400 font-semibold mb-2">
            AI Risk Analysis
          </p>

          <p className="text-sm text-gray-300 mb-2">
            {aiInsights.summary}
          </p>

          <p className="text-yellow-400 text-sm">
            ⚠️ Risk Level: {aiInsights.riskLevel}
          </p>

          <p className="text-green-400 text-sm">
            🛣️ Evacuation: {aiInsights.evacuation}
          </p>
        </div>
      )}
    </div>
  );
}

function WeatherUpdateCard({ weather }: { weather: WeatherData }) {
  return (
    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6">
      <h3 className="text-xl font-semibold mb-3 text-blue-400">
        Weather Update
      </h3>
      <p>
        🌧️ {weather.condition}<br />
        🌡️ {weather.temp}°C<br />
        💨 {weather.wind} km/h
      </p>
    </div>
  );
}

function NewsCard({ title, source, time }: NewsItem) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-5">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-400">
        {source} • {time}
      </p>
    </div>
  );
}
