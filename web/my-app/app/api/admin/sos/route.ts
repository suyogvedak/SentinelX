import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("sentinelx");
    const collection = db.collection("sos_events");

    const sosList = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      sosList.map((s) => ({
        ...s,
        _id: s._id.toString(),
      }))
    );
  } catch (err) {
    console.error("ADMIN FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
