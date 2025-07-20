import { NextResponse } from "next/server";
import { parseResumeWithGemini } from "@/lib/gemini";

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("resume");

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		console.log("📄 Processing PDF resume...");
		console.log("📊 File size:", buffer.length, "bytes");
		console.log("📋 File name:", file.name);

		const result = await parseResumeWithGemini(buffer);

		console.log("\n🎯 EXTRACTED RESUME DATA:");
		console.log("=".repeat(50));
		console.log("📝 Personal Information:");
		console.log("   Name:", result.content?.hero?.title || "Not found");
		console.log("   Title:", result.content?.hero?.subtitle || "Not found");
		console.log("   Email:", result.content?.contact?.email || "Not found");
		console.log("   Phone:", result.content?.contact?.phone || "Not found");
		console.log(
			"   Location:",
			result.content?.contact?.location || "Not found"
		);
		console.log(
			"   LinkedIn:",
			result.content?.contact?.linkedin || "Not found"
		);

		console.log("\n💼 Professional Summary:");
		console.log("   Bio:", result.content?.about?.summary || "Not found");

		console.log("\n🏆 Experience:");
		if (
			result.content?.experience?.jobs &&
			result.content.experience.jobs.length > 0
		) {
			result.content.experience.jobs.forEach((job, index) => {
				console.log(
					`   ${index + 1}. ${job.title} at ${job.company} (${job.duration})`
				);
				console.log(`      ${job.description}`);
			});
		} else {
			console.log("   No experience data found");
		}

		console.log("\n🎓 Education:");
		if (
			result.content?.education?.degrees &&
			result.content.education.degrees.length > 0
		) {
			result.content.education.degrees.forEach((degree, index) => {
				console.log(
					`   ${index + 1}. ${degree.degree} from ${degree.institution} (${
						degree.year
					})`
				);
			});
		} else {
			console.log("   No education data found");
		}

		console.log("\n🛠️ Skills:");
		if (
			result.content?.skills?.technical &&
			result.content.skills.technical.length > 0
		) {
			console.log("   Technical:", result.content.skills.technical.join(", "));
		}
		if (result.content?.skills?.soft && result.content.skills.soft.length > 0) {
			console.log("   Soft Skills:", result.content.skills.soft.join(", "));
		}

		console.log("\n🚀 Projects:");
		if (result.content?.showcase?.projects) {
			console.log("   Projects:", result.content.showcase.projects);
		} else {
			console.log("   No projects data found");
		}

		console.log("\n🏅 Achievements:");
		if (
			result.content?.achievements?.awards &&
			result.content.achievements.awards.length > 0
		) {
			result.content.achievements.awards.forEach((award, index) => {
				console.log(`   ${index + 1}. ${award}`);
			});
		} else {
			console.log("   No achievements data found");
		}

		console.log("\n🗣️ Languages:");
		if (result.content?.languages && result.content.languages.length > 0) {
			console.log("   Languages:", result.content.languages.join(", "));
		} else {
			console.log("   No languages data found");
		}

		console.log("\n🎨 Hobbies:");
		if (result.content?.hobbies && result.content.hobbies.length > 0) {
			console.log("   Hobbies:", result.content.hobbies.join(", "));
		} else {
			console.log("   No hobbies data found");
		}

		console.log("\n" + "=".repeat(50));
		console.log("✅ Resume parsing completed successfully!");
		console.log(
			"📊 Total sections extracted:",
			Object.keys(result.content || {}).length
		);

		return NextResponse.json(result);
	} catch (error) {
		console.error("❌ Error parsing resume:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
