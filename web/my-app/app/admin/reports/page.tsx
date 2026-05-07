"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STATS
  const total = reports.length;
  const pending = reports.filter(r => r.status === "PENDING_AI").length;
  const critical = reports.filter(
    r => r.aiResult?.prediction?.threatLevel === "CRITICAL"
  ).length;

  return (
    <div className="p-10 bg-[#0B1220] min-h-screen text-white">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111827] p-5 rounded border border-gray-700">
          <p className="text-gray-400">Total Reports</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-[#111827] p-5 rounded border border-gray-700">
          <p className="text-gray-400">Pending AI</p>
          <h2 className="text-2xl font-bold">{pending}</h2>
        </div>

        <div className="bg-[#111827] p-5 rounded border border-gray-700">
          <p className="text-gray-400">Critical Threats</p>
          <h2 className="text-2xl font-bold text-red-500">
            {critical}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#111827] rounded border border-gray-700 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#1F2937]">
            <tr>
              <th className="p-3">Report ID</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Threat</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <tr
                key={r.reportId}
                className="border-t border-gray-700"
              >
                <td className="p-3">{r.reportId}</td>
                <td className="p-3">{r.category}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      r.status === "ANALYZED"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                <td className="p-3">
                  {r.aiResult?.prediction?.threatLevel || "-"}
                </td>

                <td className="p-3">
                  <button
                    className="bg-blue-600 px-3 py-1 rounded text-sm"
                    onClick={() => alert(JSON.stringify(r, null, 2))}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {loading && <p className="mt-4">Loading...</p>}
    </div>
  );
}