import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://firms.modaps.eosdis.nasa.gov/api/country/csv/USA/1",
      { cache: "no-store" }
    );

    const text = await res.text();

    // Simplified parse
    const rows = text.split("\n").slice(1, 100);

    const fires = rows.map((row) => {
      const cols = row.split(",");
      return {
        type: "Wildfire",
        lat: parseFloat(cols[0]),
        lon: parseFloat(cols[1]),
        severity: "High",
      };
    });

    return NextResponse.json(fires);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
