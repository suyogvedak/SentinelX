import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = crypto
      .createHash("sha1")
      .update(
        `timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
      )
      .digest("hex");

    return NextResponse.json({
      timestamp,
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });

  } catch (err) {
    console.error("SIGN ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
