import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // 🔥 Clear admin session cookie
  response.cookies.set("admin_session", "", {
    path: "/admin",
    expires: new Date(0),
  });

  return response;
}
