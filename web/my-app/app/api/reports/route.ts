import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("sentinelx");

    const reports = await db
      .collection("reports")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reports);

  } catch (err) {
    console.error("FETCH REPORTS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}