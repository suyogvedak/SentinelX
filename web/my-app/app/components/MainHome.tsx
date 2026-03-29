import FeatureStackCard from "./FeatureStackCard";

export default function MainHome() {
  return (
    <section className="mx-auto max-w-4xl space-y-20 px-6 py-32">
      <FeatureStackCard
        title="Live Dashboard"
        description="Real-time threat levels, analytics, and alerts."
        href="/dashboard"
      />

      <FeatureStackCard
        title="Disaster Map"
        description="Severity zones, disaster types, and nearby risks."
        href="/map"
      />

      <FeatureStackCard
        title="Report Incident"
        description="Upload photos or videos to report incidents."
        href="/report"
      />

      <FeatureStackCard
        title="Helpline & SOS"
        description="Emergency contacts and SOS assistance."
        href="/helpline"
      />

      <FeatureStackCard
        title="Admin Access"
        description="Monitoring and analytics for authorities."
        href="/admin/signup"
      />
    </section>
  );
}
