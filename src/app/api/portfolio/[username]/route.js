// This route is now legacy: only fetches the latest portfolio for a user. Use /api/portfolio/[username]/[portfolioId] for specific portfolios.
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
	await dbConnect();
	const { username } = params;

	if (!username) {
		return NextResponse.json(
			{ error: "Username is required" },
			{ status: 400 }
		);
	}

	try {
		console.log("🔍 [API] Fetching portfolio for username:", username);
		
		// First, find the user by username
		const user = await User.findOne({ username });
		if (!user) {
			console.log("❌ [API] User not found for username:", username);
			return NextResponse.json(
				{ error: "Portfolio not found" },
				{ status: 404 }
			);
		}

		console.log("✅ [API] User found:", {
			userId: user._id,
			username: user.username,
			name: user.name,
			email: user.email
		});

		// Then, find the latest public portfolio for that user
		const portfolio = await Portfolio.findOne({ userId: user._id, isPublic: true }).sort({ updatedAt: -1 });
		if (!portfolio) {
			console.log("❌ [API] Portfolio not found for user:", user._id);
			return NextResponse.json(
				{ error: "Portfolio not found" },
				{ status: 404 }
			);
		}

		console.log("✅ [API] Portfolio found:", {
			portfolioId: portfolio._id,
			hasLayout: !!portfolio.layout,
			layoutKeys: portfolio.layout ? Object.keys(portfolio.layout) : [],
			hasContent: !!portfolio.content,
			hasPortfolioData: !!portfolio.portfolioData
		});

		return NextResponse.json({
			success: true,
			portfolio: portfolio.getPublicData(),
			username: user.username,
		});
	} catch (err) {
		console.error("❌ [API] Error fetching portfolio:", err);
		return NextResponse.json(
			{ error: "Failed to fetch portfolio" },
			{ status: 500 }
		);
	}
}