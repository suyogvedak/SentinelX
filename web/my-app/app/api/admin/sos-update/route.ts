import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export async function PATCH(req: NextRequest) {
  try {
    const { id, nextStatus } = await req.json();

    if (!id || !nextStatus) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("sentinelx");
    const collection = db.collection("sos_events");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: nextStatus,
          updatedAt: new Date(),
        },
      }
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { error: "SOS not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
