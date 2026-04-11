import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const client = await clientPromise;
  const db = client.db("admin_db");

  const admin = await db.collection("admins").findOne({ username, password });

  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_session", "true", {
    httpOnly: true,
    sameSite: "strict",
    path: "/admin",
  });

  return res;
}
