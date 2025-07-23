import { NextResponse } from "next/server";
import { parseResumeWithGemini, createPortfolioSchema } from "@/lib/gemini";

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("resume");
		const schemaType = formData.get("portfolioType") || "developer"; // developer, designer, marketing, etc.
		const customSchemaJson = formData.get("customSchema"); // Optional custom schema

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

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

		return NextResponse.json({
			success: true,
			content: result.content,
			schema: result.schema,
			metadata: {
				fileName: file.name,
				fileSize: buffer.length,
				portfolioType: schemaType,
				fieldsExtracted: countNonEmptyFields(result.content),
			},
		});
	} catch (error) {
		console.error("❌ Error parsing resume:", error);
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
