import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import mongoose from "mongoose";

export async function POST(req) {
	await dbConnect();
	let userId = null;
	try {
		// Get user from JWT cookie
		const cookie = cookies().get("token")?.value;
		if (!cookie) throw new Error("No auth token");
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(cookie, secret);
		// Convert userId string to ObjectId for database query
		userId = new mongoose.Types.ObjectId(payload.userId);
	} catch (err) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { layout, content, portfolioData } = await req.json();
	if (!layout || !content) {
		return NextResponse.json(
			{ error: "Missing layout or content" },
			{ status: 400 }
		);
	}

	try {
		// Get user info for username
		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		console.log("💾 [SAVE] Saving portfolio for user:", {
			userId: user._id,
			username: user.username,
			name: user.name,
			hasLayout: !!layout,
			layoutKeys: layout ? Object.keys(layout) : [],
			hasContent: !!content,
			hasPortfolioData: !!portfolioData,
			personalData: portfolioData?.personal ? {
				firstName: portfolioData.personal.firstName,
				lastName: portfolioData.personal.lastName,
				subtitle: portfolioData.personal.subtitle,
				email: portfolioData.personal.email
			} : null
		});

		// Upsert portfolio for user (username-only URL)
		const portfolio = await Portfolio.findOneAndUpdate(
			{ userId },
			{ 
				layout, 
				content, 
				portfolioData,
				username: user.username,
				isPublic: true
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		console.log("✅ [SAVE] Portfolio saved successfully:", {
			portfolioId: portfolio._id,
			username: user.username,
			portfolioUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${user.username}`
		});

		return NextResponse.json({ 
			success: true, 
			portfolio,
			username: user.username,
			portfolioUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${user.username}`
		});
	} catch (err) {
		console.error("❌ [SAVE] Error saving portfolio:", err);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
