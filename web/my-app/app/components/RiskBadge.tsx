export default function RiskBadge({ risk }: any) {

  const colors: any = {
    LOW: "bg-yellow-500",
    MEDIUM: "bg-orange-500",
    HIGH: "bg-red-600"
  };

  return (
    <span className={`${colors[risk]} px-3 py-1 rounded text-white`}>
      {risk} RISK
    </span>
  );
}
