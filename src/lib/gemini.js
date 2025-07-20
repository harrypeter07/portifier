import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export async function parseResumeWithGemini(buffer) {
	if (!process.env.GEMINI_API_KEY) {
		console.log("⚠️  No Google API key found, using mock data");
		return getMockData();
	}

	try {
		console.log("🤖 Calling Gemini API for resume parsing...");

		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

		// Convert buffer to base64
		const base64Data = buffer.toString("base64");

		// Simple prompt to extract all text content
		const prompt = `
    Extract ALL text content from this resume PDF. Return the text exactly as it appears in the document, preserving the structure and formatting.

    Include ALL sections such as:
    - Personal information (name, contact details, location)
    - Summary/Objective
    - Education details
    - Work experience
    - Skills (technical and soft skills)
    - Projects
    - Achievements/Awards
    - Certifications
    - Languages
    - Hobbies/Interests
    - Any other sections present

    Return the complete text content in a clean, readable format.
    `;

		const result = await model.generateContent([
			prompt,
			{
				inlineData: {
					mimeType: "application/pdf",
					data: base64Data,
				},
			},
		]);

		const response = await result.response;
		const extractedText = response.text();

		console.log("📋 Raw Extracted Text from PDF:");
		console.log("=".repeat(50));
		console.log(extractedText);
		console.log("=".repeat(50));

		// Now parse the extracted text into structured data
		const structuredData = parseExtractedText(extractedText);

		return {
			content: structuredData,
		};
	} catch (error) {
		console.error("❌ Error calling Gemini API:", error);
		console.log("🔄 Falling back to mock data");
		return getMockData();
	}
}

function parseExtractedText(text) {
	console.log("🔍 Parsing extracted text into structured data...");

	const lines = text
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line);

	const data = {
		hero: { title: "", subtitle: "" },
		about: { summary: "" },
		experience: { jobs: [] },
		education: { degrees: [] },
		skills: { technical: [], soft: [] },
		showcase: { projects: "" },
		contact: { email: "", phone: "", location: "", linkedin: "" },
		achievements: { awards: [] },
		languages: [],
		hobbies: [],
	};

	let currentSection = "";
	let currentContent = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const upperLine = line.toUpperCase();

		// Detect sections
		if (upperLine.includes("SUMMARY") || upperLine.includes("OBJECTIVE")) {
			currentSection = "summary";
			currentContent = [];
		} else if (upperLine.includes("EDUCATION")) {
			currentSection = "education";
			currentContent = [];
		} else if (upperLine.includes("EXPERIENCE") || upperLine.includes("WORK")) {
			currentSection = "experience";
			currentContent = [];
		} else if (
			upperLine.includes("SKILLS") ||
			upperLine.includes("TECHNICAL")
		) {
			currentSection = "skills";
			currentContent = [];
		} else if (upperLine.includes("PROJECTS")) {
			currentSection = "projects";
			currentContent = [];
		} else if (
			upperLine.includes("ACHIEVEMENTS") ||
			upperLine.includes("AWARDS")
		) {
			currentSection = "achievements";
			currentContent = [];
		} else if (upperLine.includes("LANGUAGES")) {
			currentSection = "languages";
			currentContent = [];
		} else if (
			upperLine.includes("HOBBIES") ||
			upperLine.includes("INTERESTS")
		) {
			currentSection = "hobbies";
			currentContent = [];
		} else if (
			upperLine.includes("CONTACT") ||
			upperLine.includes("EMAIL") ||
			upperLine.includes("PHONE")
		) {
			currentSection = "contact";
			currentContent = [];
		} else {
			// Add content to current section
			if (currentSection && line) {
				currentContent.push(line);
			}
		}

		// Process contact information (usually at top)
		if (line.includes("@") && !data.contact.email) {
			data.contact.email = line;
		}
		if (line.match(/\d{10}/) && !data.contact.phone) {
			data.contact.phone = line;
		}
		if (
			line.includes(",") &&
			(line.includes("MH") || line.includes("Maharashtra")) &&
			!data.contact.location
		) {
			data.contact.location = line;
		}

		// Process name (usually first line or prominent)
		if (
			!data.hero.title &&
			line.length > 3 &&
			line.length < 50 &&
			!line.includes("@") &&
			!line.match(/\d/)
		) {
			data.hero.title = line;
		}
	}

	// Process collected content
	if (currentSection === "summary" && currentContent.length > 0) {
		data.about.summary = currentContent.join(" ");
	} else if (currentSection === "education" && currentContent.length > 0) {
		data.education.degrees = currentContent.map((edu) => ({
			degree: edu,
			institution: "",
			year: "",
		}));
	} else if (currentSection === "skills" && currentContent.length > 0) {
		const skillsText = currentContent.join(" ");
		const skills = skillsText
			.split(/[,•]/)
			.map((s) => s.trim())
			.filter((s) => s);
		data.skills.technical = skills;
	} else if (currentSection === "projects" && currentContent.length > 0) {
		data.showcase.projects = currentContent.join(" ");
	} else if (currentSection === "achievements" && currentContent.length > 0) {
		data.achievements.awards = currentContent;
	} else if (currentSection === "languages" && currentContent.length > 0) {
		data.languages = currentContent;
	} else if (currentSection === "hobbies" && currentContent.length > 0) {
		data.hobbies = currentContent;
	}

	console.log("📊 Parsed structured data:");
	console.log(JSON.stringify(data, null, 2));

	return data;
}

function getMockData() {
	console.log("🎭 Using mock resume data");
	return {
		content: {
			hero: {
				title: "Hi, I'm Hassan",
				subtitle: "Full Stack Developer",
			},
			about: {
				summary:
					"Experienced developer with 3+ years building web applications. Passionate about clean code and user experience.",
			},
			experience: {
				jobs: [
					{
						title: "Senior Developer",
						company: "Tech Corp",
						duration: "2022-2024",
						description:
							"Led development of multiple web applications using React and Node.js",
					},
					{
						title: "Junior Developer",
						company: "Startup Inc",
						duration: "2020-2022",
						description:
							"Built responsive websites and maintained existing codebase",
					},
				],
			},
			education: {
				degrees: [
					{
						degree: "Bachelor of Computer Science",
						institution: "University of Technology",
						year: "2020",
					},
				],
			},
			skills: {
				technical: ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
				soft: ["Team Leadership", "Problem Solving", "Communication"],
			},
			showcase: {
				projects: "E-commerce platform, Task management app, Portfolio website",
			},
			contact: {
				email: "hassan@example.com",
				phone: "+1-555-0123",
				location: "New York, NY",
				linkedin: "linkedin.com/in/hassan",
			},
		},
	};
}
