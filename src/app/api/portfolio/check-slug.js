import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  try {
    // We no longer support per-portfolio slugs. URL is username only.
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    const user = await User.findOne({ username: slug });
    if (!user) {
      // available → suggest small variants
      return NextResponse.json({ available: true, suggestions: [`${slug}1`, `${slug}123`] });
    }
    // Username taken → suggest a few alternatives
    const base = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const suggestions = [1, 2, 3].map(n => `${base}${n}`);
    return NextResponse.json({ available: false, suggestions });
  } catch (err) {
    return NextResponse.json({ error: "Failed to check slug" }, { status: 500 });
  }
} 