import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();
  let userId = null;
  try {
    // Get user from JWT cookie
    const cookie = cookies().get("token")?.value;
    if (!cookie) throw new Error("No auth token");
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { layout, content } = await req.json();
  if (!layout || !content) {
    return NextResponse.json({ error: "Missing layout or content" }, { status: 400 });
  }

  try {
    // Upsert portfolio for user
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId },
      { layout, content },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, portfolio });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 