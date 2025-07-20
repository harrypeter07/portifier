import { GoogleGenAI } from "@google/genai";

// Check for API key
if (!process.env.GEMINI_API_KEY) {
	console.warn("GEMINI_API_KEY not found in environment variables");
}

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY || "dummy-key",
});

/**
 * Extracts text from a PDF buffer using Gemini API
 */
async function extractTextFromPDF(pdfBuffer) {
	try {
		const contents = [
			{ text: "Extract all text from this PDF document" },
			{
				inlineData: {
					mimeType: "application/pdf",
					data: pdfBuffer.toString("base64"),
				},
			},
		];

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: contents,
		});

		return response.text;
	} catch (error) {
		throw new Error(`Failed to parse PDF: ${error.message}`);
	}
}

/**
 * Calls Gemini API to extract structured resume data from text
 * Returns a dynamic object with fields for portfolio use
 */
export async function parseResumeWithGemini(pdfBuffer) {
	// If no API key, return mock data for testing
	if (!process.env.GEMINI_API_KEY) {
		console.log("Using mock data for testing (no GEMINI_API_KEY found)");
		return {
			raw: {
				name: "John Doe",
				title: "Software Developer",
				summary: "Experienced developer with expertise in React and Node.js",
				skills: ["React", "Node.js", "JavaScript", "TypeScript"],
				experience: [
					{
						company: "Tech Corp",
						role: "Senior Developer",
						start: "2022",
						end: "Present",
						description: "Led development team",
					},
				],
				education: [
					{
						institution: "University",
						degree: "Computer Science",
						start: "2018",
						end: "2022",
						description: "Bachelor's degree",
					},
				],
				projects: [
					{
						name: "Portfolio App",
						description: "A modern portfolio builder",
						tech: ["React", "Next.js"],
						link: "https://github.com/johndoe/portfolio",
					},
				],
				contact: {
					email: "john@example.com",
					phone: "+1234567890",
					linkedin: "https://linkedin.com/in/johndoe",
					github: "https://github.com/johndoe",
					website: "https://johndoe.dev",
				},
			},
			content: {
				hero: {
					title: "John Doe",
					subtitle: "Software Developer",
					summary: "Experienced developer with expertise in React and Node.js",
				},
				about: {
					summary: "Experienced developer with expertise in React and Node.js",
					languages: ["English", "Spanish"],
					certifications: [],
					awards: [],
				},
				skills: {
					skills: ["React", "Node.js", "JavaScript", "TypeScript"],
				},
				experience: {
					experience: [
						{
							company: "Tech Corp",
							role: "Senior Developer",
							start: "2022",
							end: "Present",
							description: "Led development team",
						},
					],
				},
				education: {
					education: [
						{
							institution: "University",
							degree: "Computer Science",
							start: "2018",
							end: "2022",
							description: "Bachelor's degree",
						},
					],
				},
				projects: {
					projects: [
						{
							name: "Portfolio App",
							description: "A modern portfolio builder",
							tech: ["React", "Next.js"],
							link: "https://github.com/johndoe/portfolio",
						},
					],
				},
				contact: {
					email: "john@example.com",
					phone: "+1234567890",
					linkedin: "https://linkedin.com/in/johndoe",
					github: "https://github.com/johndoe",
					website: "https://johndoe.dev",
				},
				footer: {
					text: "",
				},
			},
		};
	}

	// 1. Extract text from PDF using Gemini
	const pdfText = await extractTextFromPDF(pdfBuffer);

	// 2. Build a prompt for Gemini to extract structured resume data
	const prompt = `Extract all possible structured fields from this resume text as JSON. Use this schema:
{
  name: string, // Full name
  title: string, // Professional title or headline
  summary: string, // Short summary or objective
  skills: string[], // List of skills
  experience: [
    { company: string, role: string, start: string, end: string, description: string }
  ],
  education: [
    { institution: string, degree: string, start: string, end: string, description: string }
  ],
  projects: [
    { name: string, description: string, tech: string[], link: string }
  ],
  certifications: [
    { name: string, issuer: string, date: string }
  ],
  awards: [
    { name: string, issuer: string, date: string }
  ],
  languages: string[],
  contact: {
    email: string,
    phone: string,
    linkedin: string,
    github: string,
    website: string
  },
  footer: string // Any footer or additional info
}
If a field is missing, use null, empty string, or empty array. Only return valid JSON.`;

	// 3. Call Gemini API to parse the extracted text
	const result = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: [{ text: prompt + "\n\n" + pdfText }],
	});

	let jsonText = result.text;

	// 4. Parse and normalize the JSON
	let parsed;
	try {
		// Remove code block markers if present
		jsonText = jsonText.replace(/^```json|```$/g, "").trim();
		parsed = JSON.parse(jsonText);
	} catch (err) {
		throw new Error("Failed to parse Gemini response as JSON: " + err.message);
	}

	// 5. Map to dynamic portfolio format
	const content = {
		hero: {
			title: parsed.name || "",
			subtitle: parsed.title || "",
			summary: parsed.summary || "",
		},
		about: {
			summary: parsed.summary || "",
			languages: parsed.languages || [],
			certifications: parsed.certifications || [],
			awards: parsed.awards || [],
		},
		skills: {
			skills: parsed.skills || [],
		},
		experience: {
			experience: parsed.experience || [],
		},
		education: {
			education: parsed.education || [],
		},
		projects: {
			projects: parsed.projects || [],
		},
		contact: {
			email: parsed.contact?.email || "",
			phone: parsed.contact?.phone || "",
			linkedin: parsed.contact?.linkedin || "",
			github: parsed.contact?.github || "",
			website: parsed.contact?.website || "",
		},
		footer: {
			text: parsed.footer || "",
		},
	};

	return {
		raw: parsed,
		content,
	};
}
