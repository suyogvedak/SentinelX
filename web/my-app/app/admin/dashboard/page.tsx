"use client";

import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor emergencies and manage system operations.
          </p>
        </div>

        {/* ================= NAV CARDS ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <AdminCard
            title="🚨 SOS Monitor"
            description="View and resolve live SOS alerts from users."
            href="/admin/sos"
            danger
          />

          <AdminCard
            title="🗺️ Live Map"
            description="Visualize active emergencies on the map."
            href="/admin/map"
          />

          <AdminCard
            title="📊 Reports"
            description="Review submitted incident reports."
            href="/admin/reports"
          />

          <AdminCard
            title="⚙️ System Settings"
            description="Manage admin settings and configurations."
            href="/admin/settings"
          />

          {/* ✅ NEW CHAT CARD */}
          <AdminCard
            title="💬 Chat Center"
            description="Monitor user conversations and emergency chats."
            href="/admin/chat"
          />

        </div>
      </div>
    </main>
  );
}

/* ================= CARD COMPONENT ================= */

function AdminCard({
  title,
  description,
  href,
  danger,
}: {
  title: string;
  description: string;
  href: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`border rounded-xl p-6 transition ${
        danger
          ? "border-red-500/40 hover:bg-red-500/10"
          : "border-white/10 hover:bg-white/5"
      }`}
    >
      <h2 className="text-lg font-semibold mb-2">
        {title}
      </h2>
      <p className="text-sm text-gray-400">
        {description}
      </p>
    </Link>
  );
}
