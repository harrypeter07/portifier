import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const user = await User.findOne({ username: slug });
    if (!user) {
      return NextResponse.json({ available: true, suggestions: [`${slug}1`, `${slug}123`] });
    }

    const base = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const suggestions = [1, 2, 3].map((n) => `${base}${n}`);
    return NextResponse.json({ available: false, suggestions });
  } catch (err) {
    return NextResponse.json({ error: "Failed to check slug" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ ok: true, method: "POST only" }, { status: 405 });
}


