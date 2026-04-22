import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("sentinelx");

    const sos = await db
      .collection("sos_events")
      .findOne({ _id: new ObjectId(params.id) });

    if (!sos) {
      return NextResponse.json(
        { error: "SOS not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(sos);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch SOS" },
      { status: 500 }
    );
  }
}
