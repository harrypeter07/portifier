import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
	try {
		const { 
			inputField, 
			fieldName, 
			resumeType = "developer", 
			resumeData, 
			currentValue 
		} = await req.json();

		if (!process.env.GEMINI_API_KEY) {
			return NextResponse.json({
				success: false,
				error: "AI service not configured"
			}, { status: 500 });
		}

		if (!inputField || !fieldName) {
			return NextResponse.json({
				success: false,
				error: "Missing required fields"
			}, { status: 400 });
		}

		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

		// Calculate target length based on current value
		const currentLength = currentValue ? currentValue.length : 0;
		const targetLength = currentLength > 0 ? Math.max(currentLength * 0.8, currentLength * 1.2) : 100; // 80-120% of current length
		
		// Create context-aware prompt based on field type with length constraints
		const fieldPrompts = {
			title: `Generate 4 professional job titles for a ${resumeType} role. Keep each title around ${Math.min(50, targetLength)} characters. Make them ATS-friendly and industry-standard. Return only the titles, one per line.`,
			subtitle: `Generate 4 professional subtitles/taglines for a ${resumeType} professional. Keep each subtitle around ${Math.min(80, targetLength)} characters. Make them compelling and ATS-friendly. Return only the subtitles, one per line.`,
			tagline: `Generate 4 catchy professional taglines for a ${resumeType} portfolio. Keep each tagline around ${Math.min(60, targetLength)} characters. Make them memorable and professional. Return only the taglines, one per line.`,
			availability: `Generate 4 professional availability statuses. Keep each around ${Math.min(30, targetLength)} characters. Examples: "Open to opportunities", "Freelance available". Return only the statuses, one per line.`,
			summary: `Generate 4 professional summary sentences for a ${resumeType} with ${resumeData?.experience?.jobs?.length || 0} years of experience. Keep each summary around ${Math.min(120, targetLength)} characters. Make them ATS-friendly with relevant keywords. Return only the summaries, one per line.`,
			bio: `Generate 4 professional bio sentences for a ${resumeType}. Keep each bio around ${Math.min(100, targetLength)} characters. Make them engaging and personal while maintaining professionalism. Return only the bios, one per line.`,
			description: `Generate 4 professional job description sentences for the role of "${currentValue || 'Software Developer'}". Keep each description around ${Math.min(150, targetLength)} characters. Include quantifiable achievements and ATS-friendly keywords. Return only the descriptions, one per line.`,
			company: `Generate 4 professional company name suggestions for a ${resumeType} role. Keep each name around ${Math.min(40, targetLength)} characters. Return only the company names, one per line.`,
			duration: `Generate 4 professional date range formats for work experience. Keep each around ${Math.min(25, targetLength)} characters. Examples: "January 2022 - Present", "2020-2023". Return only the date ranges, one per line.`,
			degree: `Generate 4 professional degree names for a ${resumeType} career path. Keep each degree name around ${Math.min(60, targetLength)} characters. Return only the degree names, one per line.`,
			institution: `Generate 4 professional university/college names. Keep each name around ${Math.min(50, targetLength)} characters. Return only the institution names, one per line.`,
			year: `Generate 4 professional year formats for education. Keep each around ${Math.min(15, targetLength)} characters. Examples: "2020-2024", "2020". Return only the years, one per line.`,
			technical: `Generate 4 lists of technical skills relevant for a ${resumeType} role. Keep each list around ${Math.min(80, targetLength)} characters. Include current industry-standard technologies and tools. Return only the skill lists, one per line.`,
			soft: `Generate 4 lists of soft skills relevant for a ${resumeType} role. Keep each list around ${Math.min(80, targetLength)} characters. Focus on leadership, communication, and problem-solving skills. Return only the skill lists, one per line.`,
			languages: `Generate 4 lists of spoken languages with proficiency levels. Keep each list around ${Math.min(60, targetLength)} characters. Examples: "English (Native)", "Spanish (Conversational)". Return only the language lists, one per line.`,
			interests: `Generate 4 lists of professional interests and hobbies relevant for a ${resumeType} role. Keep each list around ${Math.min(80, targetLength)} characters. Return only the interest lists, one per line.`,
			personalValues: `Generate 4 lists of professional values and principles relevant for a ${resumeType} role. Keep each list around ${Math.min(80, targetLength)} characters. Return only the value lists, one per line.`,
			funFacts: `Generate 4 lists of interesting professional fun facts that could be conversation starters in interviews. Keep each list around ${Math.min(80, targetLength)} characters. Return only the fun fact lists, one per line.`,
			projectTitle: `Generate 4 professional project titles for a ${resumeType} portfolio. Keep each title around ${Math.min(60, targetLength)} characters. Make them descriptive and impressive. Return only the project titles, one per line.`,
			projectDescription: `Generate 4 professional project description sentences for a ${resumeType} project. Keep each description around ${Math.min(120, targetLength)} characters. Include technologies used and impact achieved. Return only the descriptions, one per line.`,
			email: `Generate 4 professional email address suggestions based on the name "${currentValue || 'John Doe'}". Keep each email around ${Math.min(40, targetLength)} characters. Return only the email addresses, one per line.`,
			phone: `Generate 4 professional phone number formats. Keep each around ${Math.min(20, targetLength)} characters. Examples: "+1 (555) 123-4567". Return only the phone numbers, one per line.`,
			location: `Generate 4 professional location formats. Keep each around ${Math.min(30, targetLength)} characters. Examples: "New York, NY", "San Francisco, CA". Return only the locations, one per line.`,
			linkedin: `Generate 4 professional LinkedIn profile URL suggestions based on the name "${currentValue || 'John Doe'}". Keep each URL around ${Math.min(50, targetLength)} characters. Return only the URLs, one per line.`,
			github: `Generate 4 professional GitHub profile URL suggestions based on the name "${currentValue || 'John Doe'}". Keep each URL around ${Math.min(50, targetLength)} characters. Return only the URLs, one per line.`,
		};

		const prompt = fieldPrompts[fieldName] || `Generate 4 professional alternatives for the ${fieldName} field in a ${resumeType} resume. Keep each suggestion around ${targetLength} characters. Make them ATS-friendly and industry-standard.`;

		// Add context from resume data and current value for better suggestions
		let contextPrompt = prompt;
		if (resumeData || currentValue) {
			contextPrompt += `\n\nContext:\n- Current value: "${currentValue || 'Not provided'}" (${currentLength} characters)\n- Target length: around ${Math.round(targetLength)} characters\n- Experience: ${resumeData?.experience?.jobs?.length || 0} jobs\n- Education: ${resumeData?.education?.degrees?.length || 0} degrees\n- Skills: ${resumeData?.skills?.technical?.length || 0} technical skills`;
			
			// Add specific context for better suggestions
			if (currentValue && currentValue.length > 10) {
				contextPrompt += `\n- Maintain similar context and meaning as the current value\n- Keep the same professional tone and style`;
			}
		}

		const result = await model.generateContent(contextPrompt);
		const response = await result.response;
		let suggestions = response.text();

		// Parse the response to extract 4 suggestions
		// The AI might return numbered lists, bullet points, or paragraphs
		let parsedSuggestions = [];
		
		// Try to extract numbered or bulleted items
		const lines = suggestions.split('\n').filter(line => line.trim());
		for (const line of lines) {
			const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim();
			if (cleanLine && cleanLine.length > 5) {
				parsedSuggestions.push(cleanLine);
			}
		}

		// If we couldn't parse numbered items, split by sentences or paragraphs
		if (parsedSuggestions.length < 2) {
			const sentences = suggestions.split(/[.!?]+/).filter(s => s.trim().length > 10);
			parsedSuggestions = sentences.slice(0, 4).map(s => s.trim());
		}

		// Ensure we have exactly 4 suggestions
		while (parsedSuggestions.length < 4) {
			parsedSuggestions.push(`Professional ${fieldName} suggestion ${parsedSuggestions.length + 1}`);
		}

		parsedSuggestions = parsedSuggestions.slice(0, 4);

		return NextResponse.json({
			success: true,
			suggestions: parsedSuggestions,
			fieldName,
			originalValue: currentValue
		});

	} catch (error) {
		console.error("❌ Error generating AI suggestions:", error);
		return NextResponse.json({
			success: false,
			error: "Failed to generate suggestions",
			details: process.env.NODE_ENV === "development" ? error.message : undefined
		}, { status: 500 });
	}
} 