"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  COUNTRY_CODES,
  type CountryCode,
} from "../lib/countryCodes";

export default function SOSPage() {
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] =
    useState<CountryCode>(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const getLocation = (): Promise<{ lat: number; lng: number }> =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 0, lng: 0 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => resolve({ lat: 0, lng: 0 }),
        { timeout: 5000 }
      );
    });

  const fetchLatestSOSId = async (
    fullPhone: string
  ): Promise<string | null> => {
    try {
      const res = await fetch("/api/admin/sos");
      if (!res.ok) return null;

      const list = await res.json();
      const latest = list.find(
        (s: any) => s.phone === fullPhone
      );

      return latest?._id ?? null;
    } catch {
      return null;
    }
  };

  const sendSOS = async () => {
    setLoading(true);
    setError(null);

    try {
      if (phone.length < 6) {
        setError("Enter a valid phone number");
        setLoading(false);
        return;
      }

      const location = await getLocation();
      const fullPhone = `${selectedCountry.dialCode}${phone}`;

      // 1️⃣ Fire SOS (ignore response completely)
      await fetch("/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: fullPhone,
          country: selectedCountry.code,
          platform: "web",
          location,
        }),
      });

      // 2️⃣ Fetch latest SOS created for this phone
      const sosId = await fetchLatestSOSId(fullPhone);

      if (!sosId) {
        throw new Error("Unable to confirm SOS");
      }

      localStorage.setItem("ACTIVE_SOS_ID", sosId);
      router.push("/sos/track");
      setCooldown(true);
      setTimeLeft(120);
    } catch (err) {
      console.error(err);
      setError(
        "SOS was sent, but confirmation failed. Please stay on this page."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!cooldown) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        setCooldown(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [cooldown]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold text-red-500">
          🚨 EMERGENCY SOS
        </h1>

        <div className="flex gap-2">
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const found = COUNTRY_CODES.find(
                (c) => c.code === e.target.value
              );
              if (found) setSelectedCountry(found);
            }}
            className="px-3 py-3 bg-gray-900 border border-gray-700 rounded"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>

          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, ""))
            }
            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded"
          />
        </div>

        <button
  onClick={sendSOS}
  disabled={loading || cooldown}
  className={`w-full py-4 rounded-full text-xl font-bold transition ${
    cooldown
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-red-600 hover:bg-red-700"
  }`}
>
  {cooldown
    ? `Wait ${timeLeft}s`
    : loading
    ? "Sending SOS…"
    : "SEND SOS"}
</button>

        {error && (
          <p className="text-yellow-400 text-sm">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
