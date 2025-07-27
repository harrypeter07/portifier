import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  try {
    const { username, slug } = await req.json();
    if (!username || !slug) {
      return NextResponse.json({ error: "Username and slug are required" }, { status: 400 });
    }
    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Check if any portfolio for this user has the slug
    const existing = await Portfolio.findOne({ userId: user._id, slug });
    return NextResponse.json({ available: !existing });
  } catch (err) {
    return NextResponse.json({ error: "Failed to check slug" }, { status: 500 });
  }
} 