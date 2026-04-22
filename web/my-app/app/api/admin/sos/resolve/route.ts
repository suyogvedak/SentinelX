import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db("sentinelx");

  await db.collection("sos_events").updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: "resolved", resolvedAt: new Date() } }
  );

  return NextResponse.json({ success: true });
}
