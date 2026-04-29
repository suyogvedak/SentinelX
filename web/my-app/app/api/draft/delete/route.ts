import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    await db.collection("drafts").deleteOne({ userId });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
