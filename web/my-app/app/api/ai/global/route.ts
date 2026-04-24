import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://127.0.0.1:8000/global-insights");

    const data = await res.json();

    return NextResponse.json(data);

  } catch (err) {
    console.error("GLOBAL AI ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch global insights" },
      { status: 500 }
    );
  }
}