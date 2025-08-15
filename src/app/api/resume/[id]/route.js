import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Resume from "@/models/Resume";

export async function GET(req, { params }) {
  await dbConnect();
  const user = await auth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing resume ID" }, { status: 400 });
  }
  try {
    const resume = await Resume.findOne({ _id: id, userId: user._id }).lean();
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json({ resume });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
} 