export default function WeatherCard() {
  return (
    <div className="rounded-xl bg-black p-6 shadow">
      <h3 className="text-lg font-semibold">Weather</h3>
      <p className="mt-2 text-gray-400">Location: Your Area</p>
      <p className="mt-2 text-3xl font-bold">28°C</p>
      <p className="text-sm text-gray-400">Clear skies</p>
    </div>
  );
}
