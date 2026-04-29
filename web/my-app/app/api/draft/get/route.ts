import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {

  const { userId } = await req.json();
  const client = await clientPromise;
  const db = client.db();

  const draft = await db.collection("drafts").findOne({ userId });

  return NextResponse.json(draft || null);
}
