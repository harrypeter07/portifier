import { NextResponse } from "next/server";
import { parseResumeWithGemini, createPortfolioSchema } from "@/lib/gemini";
import dbConnect from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Health check endpoint
export async function GET() {
	try {
		if (!process.env.GEMINI_API_KEY) {
			return NextResponse.json({
				status: "warning",
				message: "No Gemini API key configured",
				available: false
			});
		}

		// Simple test to check if Gemini API is accessible
		const { GoogleGenerativeAI } = await import("@google/generative-ai");
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		// Try a simple test call
		const result = await model.generateContent("Hello");
		const response = await result.response;
		const text = response.text();

		return NextResponse.json({
			status: "healthy",
			message: "Gemini API is accessible",
			available: true,
			testResponse: text.substring(0, 50) + "..."
		});
	} catch (error) {
		console.error("❌ Gemini API health check failed:", error);
		return NextResponse.json({
			status: "unhealthy",
			message: "Gemini API is not accessible",
			available: false,
			error: error.message
		}, { status: 503 });
	}
}

export async function POST(req) {
	try {
		await dbConnect();
		
		// Get authenticated user
		const user = await auth();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await req.formData();
		const file = formData.get("resume");
		const schemaType = formData.get("portfolioType") || "developer"; // developer, designer, marketing, etc.
		const customSchemaJson = formData.get("customSchema"); // Optional custom schema

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Create unique filename
		const timestamp = Date.now();
		const originalName = file.name;
		const fileExtension = path.extname(originalName);
		const fileName = `resume_${user._id}_${timestamp}${fileExtension}`;
		
		// Create uploads directory if it doesn't exist
		const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
		await mkdir(uploadsDir, { recursive: true });
		
		// Save file to disk
		const filePath = path.join(uploadsDir, fileName);
		await writeFile(filePath, buffer);

		// Create resume record in database
		const resume = new Resume({
			userId: user._id,
			originalName: originalName,
			fileName: fileName,
			fileSize: buffer.length,
			fileType: file.type,
			filePath: `/uploads/resumes/${fileName}`,
			status: 'processing'
		});

		await resume.save();

		// Determine which schema to use
		let schema;
		if (customSchemaJson) {
			try {
				schema = JSON.parse(customSchemaJson);
			} catch (error) {
				console.error("❌ Invalid custom schema JSON:", error);
				schema = createPortfolioSchema(schemaType);
			}
		} else {
			schema = createPortfolioSchema(schemaType);
		}

		const result = await parseResumeWithGemini(buffer, schema);

		// Update resume with parsed data
		resume.parsedData = result.content;
		resume.status = 'parsed';
		await resume.save();

		// Enhanced logging based on actual schema structure
		console.log("\n🎯 EXTRACTED RESUME DATA:");
		console.log("=".repeat(50));

		logExtractedData(result.content, result.schema);

		console.log("\n" + "=".repeat(50));
		console.log("✅ Resume parsing completed successfully!");
		console.log(
			"📊 Schema fields processed:",
			countSchemaFields(result.schema)
		);

		// Check if we used mock data (indicated by specific mock values)
		const usedMockData = result.content?.hero?.title === "Hassan Ahmed" && 
							result.content?.contact?.email === "hassan@example.com";

		return NextResponse.json({
			success: true,
			content: result.content,
			schema: result.schema,
			resumeId: resume._id,
			metadata: {
				fileName: file.name,
				fileSize: buffer.length,
				portfolioType: schemaType,
				fieldsExtracted: countNonEmptyFields(result.content),
				usedMockData: usedMockData,
				message: usedMockData ? 
					"AI service temporarily unavailable. Using sample data for demonstration." : 
					"Resume parsed successfully using AI."
			},
		});
	} catch (error) {
		console.error("❌ Error parsing resume:", error);
		
		// Update resume status to failed if we have a resume record
		if (error.resumeId) {
			try {
				await Resume.findByIdAndUpdate(error.resumeId, {
					status: 'failed',
					error: {
						message: error.message,
						details: error.stack
					}
				});
			} catch (updateError) {
				console.error("❌ Error updating resume status:", updateError);
			}
		}
		
		return NextResponse.json(
			{
				success: false,
				error: error.message,
				details:
					process.env.NODE_ENV === "development" ? error.stack : undefined,
			},
			{ status: 500 }
		);
	}
}

// Helper function to log extracted data based on schema
function logExtractedData(data, schema, prefix = "") {
	for (const [key, value] of Object.entries(schema)) {
		const dataValue = data[key];

		if (typeof value === "object" && !Array.isArray(value)) {
			if (dataValue && typeof dataValue === "object") {
				logExtractedData(dataValue, value, prefix + "   ");
			} else {
				console.log(`${prefix}   No data found`);
			}
		} else if (Array.isArray(value)) {
			if (Array.isArray(dataValue) && dataValue.length > 0) {
				dataValue.forEach((item, index) => {
					if (typeof item === "object") {
						console.log(
							`${prefix}   ${index + 1}.`,
							JSON.stringify(item, null, 2)
						);
					} else {
						console.log(`${prefix}   ${index + 1}. ${item}`);
					}
				});
			} else {
				console.log(`${prefix}   No items found`);
			}
		} else {
			console.log(`${prefix}📝 ${key}:`, dataValue || "Not found");
		}
	}
}

// Count total schema fields
function countSchemaFields(schema) {
	let count = 0;

	function countFields(obj) {
		for (const value of Object.values(obj)) {
			if (typeof value === "object" && !Array.isArray(value)) {
				countFields(value);
			} else {
				count++;
			}
		}
	}

	countFields(schema);
	return count;
}

// Count non-empty fields in extracted data
function countNonEmptyFields(data) {
	let count = 0;

	function countNonEmpty(obj) {
		for (const value of Object.values(obj)) {
			if (value === null || value === undefined || value === "") {
				continue;
			} else if (Array.isArray(value)) {
				if (value.length > 0) count++;
			} else if (typeof value === "object") {
				countNonEmpty(value);
			} else {
				count++;
			}
		}
	}

	countNonEmpty(data);
	return count;
}
