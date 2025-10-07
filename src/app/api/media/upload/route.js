import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Portfolio from "@/models/Portfolio";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req) {
  await dbConnect();
  const user = await auth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file");
    const purpose = (form.get("purpose") || "generic").toString();

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadsDir = path.join(process.cwd(), "public", "uploads", purpose);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = (file.type && file.type.split("/")[1]) || "bin";
    const base = file.name?.replace(/[^a-zA-Z0-9._-]/g, "_") || `file_${Date.now()}`;
    const fileName = `${Date.now()}_${base}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${purpose}/${fileName}`;

    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}


