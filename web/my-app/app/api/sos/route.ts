import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, country, platform, location } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("sentinelx");               // ✅ FIXED DB
    const collection = db.collection("sos_events"); // ✅ FIXED COLLECTION

    const sos = {
      phone,
      country,
      platform,
      location,
      status: "RECEIVED",
      createdAt: new Date(),
      timestamps: {
        receivedAt: new Date(),
      },
    };

    const result = await collection.insertOne(sos);

    return NextResponse.json({
      success: true,
      sosId: result.insertedId.toString(),
    });
  } catch (err) {
    console.error("SOS CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
