import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGeminiModel, checkUserApiKey } from "@/lib/gemini";
import dbConnect from "@/lib/mongodb";

export async function POST(req) {
	await dbConnect();
	const user = await auth();
	
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const formData = await req.formData();
		console.log("📥 API received formData fields:", Array.from(formData.keys()));
		
		const file = formData.get("file");
		console.log("📥 File received:", {
			hasFile: !!file,
			fileName: file?.name,
			fileSize: file?.size,
			fileType: file?.type
		});

		if (!file) {
			console.error("❌ No file provided in request");
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Check if user has API key configured
		const apiKeyStatus = await checkUserApiKey(user._id);
		
		if (!apiKeyStatus.hasKey && !process.env.GEMINI_API_KEY) {
			return NextResponse.json({
				error: "No Gemini API key available. Please add your API key in settings.",
				requiresApiKey: true
			}, { status: 400 });
		}

		// Convert file to base64
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const base64 = buffer.toString("base64");

		// Prepare the prompt for resume parsing
		const prompt = `
		Please parse this resume and extract the following information in JSON format:
		{
			"personal": {
				"firstName": "",
				"lastName": "",
				"email": "",
				"phone": "",
				"location": {
					"city": "",
					"state": "",
					"country": ""
				},
				"social": {
					"linkedin": "",
					"github": ""
				}
			},
			"about": {
				"summary": "",
				"bio": ""
			},
			"experience": {
				"jobs": [
					{
						"title": "",
						"company": "",
						"duration": "",
						"description": ""
					}
				]
			},
			"education": {
				"degrees": [
					{
						"degree": "",
						"institution": "",
						"year": ""
					}
				]
			},
			"skills": {
				"technical": [],
				"soft": []
			},
			"projects": {
				"items": [
					{
						"title": "",
						"description": "",
						"github": "",
						"url": ""
					}
				]
			}
		}

		Extract as much information as possible from the resume. If a field is not found, leave it as an empty string or empty array.
		`;

		// Use user's API key if available, otherwise fall back to environment variable
		const model = await getGeminiModel(user._id, "gemini-1.5-flash");

		// Generate content with image
		const result = await model.generateContent([
			prompt,
			{
				inlineData: {
					mimeType: file.type,
					data: base64,
				},
			},
		]);

		const response = await result.response;
		const text = response.text();

		// Try to parse the JSON response
		let parsedData;
		try {
			// Extract JSON from the response (in case there's extra text)
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				parsedData = JSON.parse(jsonMatch[0]);
			} else {
				parsedData = JSON.parse(text);
			}
		} catch (parseError) {
			console.error("Failed to parse AI response:", parseError);
			return NextResponse.json({
				error: "Failed to parse AI response. Please try again.",
				rawResponse: text
			}, { status: 500 });
		}

		// Transform the parsed data to match the expected structure
		const transformedData = {
			hero: {
				title: `${parsedData.personal?.firstName || ''} ${parsedData.personal?.lastName || ''}`.trim(),
				subtitle: parsedData.personal?.subtitle || '',
				tagline: parsedData.personal?.tagline || '',
				availability: parsedData.personal?.availability || ''
			},
			about: {
				summary: parsedData.about?.summary || '',
				bio: parsedData.about?.bio || '',
				interests: parsedData.about?.interests || [],
				personalValues: parsedData.about?.personalValues || [],
				funFacts: parsedData.about?.funFacts || []
			},
			contact: {
				email: parsedData.personal?.email || '',
				phone: parsedData.personal?.phone || '',
				location: `${parsedData.personal?.location?.city || ''}, ${parsedData.personal?.location?.state || ''}, ${parsedData.personal?.location?.country || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, ''),
				linkedin: parsedData.personal?.social?.linkedin || ''
			},
			experience: {
				jobs: parsedData.experience?.jobs || []
			},
			education: {
				degrees: parsedData.education?.degrees || []
			},
			skills: {
				technical: parsedData.skills?.technical || [],
				soft: parsedData.skills?.soft || []
			},
			projects: {
				items: parsedData.projects?.items || []
			},
			achievements: {
				awards: parsedData.achievements?.awards || []
			},
			languages: parsedData.skills?.languages?.map(lang => lang.name) || []
		};

		return NextResponse.json({
			success: true,
			content: transformedData,
			data: transformedData,
			message: "Resume parsed successfully"
		});

	} catch (error) {
		console.error("Resume parsing error:", error);
		
		// Check if it's an API key related error
		if (error.message.includes("API key") || error.message.includes("authentication")) {
			return NextResponse.json({
				error: "Invalid API key. Please check your Gemini API key in settings.",
				requiresApiKey: true
			}, { status: 400 });
		}

		return NextResponse.json({
			error: "Failed to parse resume. Please try again.",
			details: error.message
		}, { status: 500 });
	}
}

export async function GET(req) {
	// Health check endpoint
	try {
		const envCheck = {
			GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
			JWT_SECRET: !!process.env.JWT_SECRET,
			MONGODB_URI: !!process.env.MONGODB_URI,
		};

		console.log("🔍 [HEALTH-CHECK] Environment variables:", envCheck);

		// Try a simple test call
		const model = await getGeminiModel(null, "gemini-1.5-flash");
		const result = await model.generateContent("Hello");
		const response = await result.response;
		const text = response.text();

		return NextResponse.json({
			status: "healthy",
			available: true,
			envCheck
		});
	} catch (error) {
		console.error("❌ Gemini API health check failed:", error);
		return NextResponse.json({
			status: "unhealthy",
			available: false,
			error: error.message,
			envCheck: {
				GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
				JWT_SECRET: !!process.env.JWT_SECRET,
				MONGODB_URI: !!process.env.MONGODB_URI,
			}
		}, { status: 503 });
	}
}
