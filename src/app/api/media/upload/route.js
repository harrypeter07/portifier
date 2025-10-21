import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Portfolio from "@/models/Portfolio";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";

// Allowed file types and their MIME types
const ALLOWED_IMAGE_TYPES = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg'
};

// File size limits (in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 4096; // 4K max dimension

// Validate file type
function validateFileType(file) {
  return ALLOWED_IMAGE_TYPES[file.type] !== undefined;
}

// Validate file size
function validateFileSize(file) {
  return file.size <= MAX_FILE_SIZE;
}

// Generate unique filename
function generateFileName(originalName, fileType) {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const ext = ALLOWED_IMAGE_TYPES[fileType] || '.bin';
  const baseName = originalName
    ? originalName.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^/.]+$/, "")
    : "image";
  return `${timestamp}_${randomId}_${baseName}${ext}`;
}

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

    // Validate file type
    if (!validateFileType(file)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only images (JPEG, PNG, GIF, WebP, SVG) are allowed." 
      }, { status: 400 });
    }

    // Validate file size
    if (!validateFileSize(file)) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` 
      }, { status: 400 });
    }

    // Validate purpose parameter
    const allowedPurposes = [
      "avatars", "project-images", "project-videos", "hero-images", 
      "company-logos", "achievement-images", "generic"
    ];
    if (!allowedPurposes.includes(purpose)) {
      return NextResponse.json({ 
        error: "Invalid purpose parameter" 
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create uploads directory structure
    const uploadsDir = path.join(process.cwd(), "public", "uploads", purpose);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate secure filename
    const fileName = generateFileName(file.name, file.type);
    const filePath = path.join(uploadsDir, fileName);
    
    // Write file to disk
    fs.writeFileSync(filePath, buffer);

    // Generate public URL
    const publicUrl = `/uploads/${purpose}/${fileName}`;

    // Log successful upload for debugging
    console.log(`✅ [UPLOAD] File uploaded successfully:`, {
      fileName,
      fileSize: file.size,
      fileType: file.type,
      purpose,
      publicUrl
    });

    return NextResponse.json({ 
      success: true, 
      url: publicUrl, 
      fileName,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (err) {
    console.error("❌ [UPLOAD] Upload failed:", err);
    return NextResponse.json({ 
      error: err.message || "Upload failed" 
    }, { status: 500 });
  }
}


