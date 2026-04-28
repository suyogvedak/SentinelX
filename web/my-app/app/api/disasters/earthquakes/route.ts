import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      { cache: "no-store" }
    );

    const data = await res.json();

    const earthquakes = data.features.map((q: any) => ({
      type: "Earthquake",
      lat: q.geometry.coordinates[1],
      lon: q.geometry.coordinates[0],
      magnitude: q.properties.mag,
      place: q.properties.place,
      severity:
        q.properties.mag >= 6
          ? "High"
          : q.properties.mag >= 4
          ? "Medium"
          : "Low",
    }));

    return NextResponse.json(earthquakes);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
