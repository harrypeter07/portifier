import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  try {
    // We no longer support per-portfolio slugs. URL is username only.
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }
    const user = await User.findOne({ username });
    if (!user) {
      // username available → suggest username1 fallback
      return NextResponse.json({ available: true, suggestions: [`${username}1`, `${username}123`] });
    }
    // Username taken → suggest a few alternatives
    const base = username.toLowerCase().replace(/[^a-z0-9]/g, "");
    const suggestions = [1, 2, 3].map(n => `${base}${n}`);
    return NextResponse.json({ available: false, suggestions });
  } catch (err) {
    return NextResponse.json({ error: "Failed to check slug" }, { status: 500 });
  }
} 