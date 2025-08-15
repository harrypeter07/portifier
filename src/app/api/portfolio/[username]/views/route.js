import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await dbConnect();
  const { username } = await params;
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: user._id, isPublic: true },
      { $inc: { views: 1 }, $set: { updatedAt: new Date() } },
      { new: true }
    );
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, views: portfolio.views });
  } catch (err) {
    return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
  }
}


