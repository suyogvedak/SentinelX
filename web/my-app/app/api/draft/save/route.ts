import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, reportId, data } = body;

    const client = await clientPromise;
    const db = client.db();

    const draft = {
      userId,
      reportId,
      data,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    await db.collection("drafts").updateOne(
      { userId },
      { $set: draft },
      { upsert: true }
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DRAFT SAVE ERROR:", err);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
