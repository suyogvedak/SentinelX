import RiskBadge from "./RiskBadge";

export default function ReportStatusCard({ reportId, status }: any) {

  return (
    <div className="bg-[#1F2937] p-6 rounded-xl mt-6 border border-gray-700">

      <h2 className="text-lg font-bold mb-3">
        Report Tracking
      </h2>

      <p><strong>Report ID:</strong> {reportId}</p>
      <p><strong>Status:</strong> {status}</p>

      {status === "COMPLETED" && (
        <div className="mt-4">
          <p><strong>AI Verdict:</strong> Authentic</p>
          <RiskBadge risk="LOW" />
        </div>
      )}
    </div>
  );
}
