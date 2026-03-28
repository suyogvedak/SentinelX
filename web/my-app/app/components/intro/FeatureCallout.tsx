export default function FeatureCallout({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-black/40 p-6 backdrop-blur-lg border border-white/20">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-gray-300">{description}</p>
    </div>
  );
}
