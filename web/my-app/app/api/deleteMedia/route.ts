import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { publicId } = await req.json();

    await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE MEDIA ERROR:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
