import { NextResponse } from "next/server";
import { parseResumeWithGemini } from "../../../lib/gemini";

export async function POST(req) {
	const formData = await req.formData();
	const file = formData.get("resume");
	if (!file) {
		return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
	}
	// Convert file to buffer
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	// Call Gemini API helper
	try {
		const parsed = await parseResumeWithGemini(buffer);
		return NextResponse.json(parsed);
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
