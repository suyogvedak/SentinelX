export default function DownloadPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="text-4xl font-bold">Get SentinelX App</h1>

      <p className="mt-4 text-gray-400">
        Stay protected on the go. Download SentinelX now.
      </p>

      <div className="mt-10 flex justify-center gap-6">
        <button className="rounded bg-green-500 px-6 py-3 text-black">
          Google Play
        </button>

        <button className="rounded bg-white px-6 py-3 text-black">
          App Store
        </button>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        QR code support coming soon
      </p>
    </section>
  );
}
