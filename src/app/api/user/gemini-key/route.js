import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import User from "@/models/User";

export async function GET(req) {
	await dbConnect();
	const user = await auth();
	
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const userDoc = await User.findById(user._id).select('+geminiApiKey');
		const hasKey = !!userDoc.geminiApiKey;
		
		return NextResponse.json({
			success: true,
			hasKey,
			// Don't return the actual key for security
		});
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch API key status" }, { status: 500 });
	}
}

export async function POST(req) {
	await dbConnect();
	const user = await auth();
	
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { apiKey } = await req.json();
		
		if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
			return NextResponse.json({ error: "Valid API key is required" }, { status: 400 });
		}

		// Basic validation for Gemini API key format
		if (!apiKey.startsWith('AIza')) {
			return NextResponse.json({ error: "Invalid Gemini API key format" }, { status: 400 });
		}

		// Test the API key with a simple call
		try {
			const { GoogleGenerativeAI } = await import('@google/generative-ai');
			const genAI = new GoogleGenerativeAI(apiKey.trim());
			const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
			
			const result = await model.generateContent("Test");
			await result.response.text();
		} catch (apiError) {
			// Handle rate limiting specifically
			if (apiError.message.includes('Too Many Requests') || apiError.message.includes('429')) {
				return NextResponse.json({ 
					error: "API rate limit exceeded. Please try again in a few minutes.",
					details: "Too many requests to Gemini API. Please wait before trying again."
				}, { status: 429 });
			}
			
			return NextResponse.json({ 
				error: "Invalid API key or API service unavailable",
				details: apiError.message 
			}, { status: 400 });
		}

		// Save the validated key
		await User.findByIdAndUpdate(user._id, {
			geminiApiKey: apiKey.trim(),
			updatedAt: new Date()
		});

		return NextResponse.json({
			success: true,
			message: "API key saved successfully"
		});
	} catch (error) {
		return NextResponse.json({ error: "Failed to save API key" }, { status: 500 });
	}
}

export async function DELETE(req) {
	await dbConnect();
	const user = await auth();
	
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		await User.findByIdAndUpdate(user._id, {
			$unset: { geminiApiKey: 1 },
			updatedAt: new Date()
		});

		return NextResponse.json({
			success: true,
			message: "API key removed successfully"
		});
	} catch (error) {
		return NextResponse.json({ error: "Failed to remove API key" }, { status: 500 });
	}
}
