"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-[#0B1220] min-h-screen text-white">
      
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">
        Submitted Reports
      </h1>

      {/* LOADING */}
      {loading && <p>Loading reports...</p>}

      {/* EMPTY */}
      {!loading && reports.length === 0 && (
        <p>No reports found</p>
      )}

      {/* REPORT GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {reports.map((report) => (
          <div
            key={report.reportId}
            className="bg-[#111827] p-5 rounded-lg border border-gray-700"
          >
            {/* HEADER */}
            <div className="flex justify-between mb-3">
              <h2 className="font-bold text-lg">
                {report.category}
              </h2>

              <span
                className={`px-2 py-1 text-xs rounded ${
                  report.status === "ANALYZED"
                    ? "bg-green-600"
                    : "bg-yellow-600"
                }`}
              >
                {report.status}
              </span>
            </div>

            {/* MEDIA */}
            {report.fileUrl && (
              <div className="mb-3">
                {report.fileUrl.includes("video") ? (
                  <video
                    src={report.fileUrl}
                    controls
                    className="w-full rounded"
                  />
                ) : (
                  <img
                    src={report.fileUrl}
                    alt="report"
                    className="w-full rounded"
                  />
                )}
              </div>
            )}

            {/* DETAILS */}
            <p className="text-sm mb-1">
              <strong>Severity:</strong> {report.severity}
            </p>

            <p className="text-sm mb-1">
              <strong>Description:</strong> {report.description}
            </p>

            <p className="text-sm mb-2">
              <strong>Report ID:</strong> {report.reportId}
            </p>

            {/* AI RESULT */}
            {report.aiResult && (
              <div className="mt-3 p-3 bg-[#1F2937] rounded">
                <p className="text-sm">
                  <strong>Threat:</strong>{" "}
                  {report.aiResult.prediction?.threatLevel}
                </p>

                <p className="text-sm">
                  <strong>Verdict:</strong>{" "}
                  {report.aiResult.prediction?.verdict}
                </p>

                <p className="text-sm">
                  <strong>Score:</strong>{" "}
                  {report.aiResult.prediction?.riskScore}
                </p>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}