import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://www.gdacs.org/xml/rss.xml",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("GDACS feed failed");
    }

    const text = await res.text();

    // Very light XML parsing (no library needed)
    const items = text.split("<item>").slice(1, 25);

    const disasters = items.map((item) => {
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const geoMatch = item.match(/<geo:lat>(.*?)<\/geo:lat>[\s\S]*?<geo:long>(.*?)<\/geo:long>/);

      if (!titleMatch || !geoMatch) return null;

      return {
        type: "Global Alert",
        lat: parseFloat(geoMatch[1]),
        lon: parseFloat(geoMatch[2]),
        severity: "Medium",
        description: titleMatch[1],
      };
    }).filter(Boolean);

    return NextResponse.json(disasters);
  } catch (error: any) {
    console.error("GDACS error:", error.message);
    return NextResponse.json([], { status: 500 });
  }
}
