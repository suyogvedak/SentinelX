import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("sentinelx");

  const chats = await db
    .collection("chat_messages")
    .aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$sessionId",
          lastMessage: { $first: "$message" },
          isEmergency: { $max: "$isEmergency" },
          updatedAt: { $first: "$createdAt" },
        },
      },
      {
        $sort: { updatedAt: -1 },
      },
    ])
    .toArray();

  return NextResponse.json(
    chats.map((c) => ({
      sessionId: c._id,
      lastMessage: c.lastMessage,
      isEmergency: c.isEmergency,
      updatedAt: c.updatedAt,
    }))
  );
}
