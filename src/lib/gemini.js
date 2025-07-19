import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";

// You should set GEMINI_API_KEY in your environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Extracts text from a PDF buffer using pdf-parse
 */
async function extractTextFromPDF(pdfBuffer) {
	const data = await pdfParse(pdfBuffer);
	return data.text;
}

/**
 * Calls Gemini API to extract structured resume data from text
 * Returns a dynamic object with fields for portfolio use
 */
export async function parseResumeWithGemini(pdfBuffer) {
	// 1. Extract text from PDF
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

	// 3. Call Gemini API
	const result = await model.generateContent([
		{ role: "user", parts: [prompt, pdfText] },
	]);
	let jsonText = result.response.text();

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
