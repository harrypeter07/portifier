// This route is now legacy: only fetches the latest portfolio for a user. Use /api/portfolio/[username]/[portfolioId] for specific portfolios.
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
	await dbConnect();
	const { username } = await params;

	if (!username) {
		return NextResponse.json(
			{ error: "Username is required" },
			{ status: 400 }
		);
	}

	try {
		console.log("🔍 [API] Fetching portfolio for username:", username);
		
		// Check if this is a numbered username (e.g., iitz_hassan-2)
		const isNumberedUsername = username.includes('-') && /-\d+$/.test(username);
		
		let portfolio;
		let user;
		
		if (isNumberedUsername) {
			// For numbered usernames, find portfolio directly by username
			console.log("🔍 [API] Numbered username detected, searching portfolio directly");
			portfolio = await Portfolio.findOne({ username, isPublic: true });
			
			if (!portfolio) {
				console.log("❌ [API] Portfolio not found for numbered username:", username);
				return NextResponse.json(
					{ error: "Portfolio not found" },
					{ status: 404 }
				);
			}
			
			// Get user info from portfolio's userId
			user = await User.findById(portfolio.userId);
			if (!user) {
				console.log("❌ [API] User not found for portfolio userId:", portfolio.userId);
				return NextResponse.json(
					{ error: "Portfolio not found" },
					{ status: 404 }
				);
			}
		} else {
			// For regular usernames, find user first then portfolio
			user = await User.findOne({ username });
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

			// Find the latest public portfolio for that user
			portfolio = await Portfolio.findOne({ userId: user._id, isPublic: true }).sort({ updatedAt: -1 });
			if (!portfolio) {
				console.log("❌ [API] Portfolio not found for user:", user._id);
				return NextResponse.json(
					{ error: "Portfolio not found" },
					{ status: 404 }
				);
			}
		}

		console.log("✅ [API] Portfolio found:", {
			portfolioId: portfolio._id,
			hasLayout: !!portfolio.layout,
			layoutKeys: portfolio.layout ? Object.keys(portfolio.layout) : [],
			hasContent: !!portfolio.content,
			hasPortfolioData: !!portfolio.portfolioData,
			portfolioDataKeys: portfolio.portfolioData ? Object.keys(portfolio.portfolioData) : [],
			personalData: portfolio.portfolioData?.personal,
			personalKeys: portfolio.portfolioData?.personal ? Object.keys(portfolio.portfolioData.personal) : []
		});

		return NextResponse.json({
			success: true,
			portfolio: portfolio.getPublicData(),
			username: portfolio.username, // Use portfolio username (could be numbered)
			user: {
				name: user.name,
				email: user.email,
				username: user.username
			}
		});
	} catch (err) {
		console.error("❌ [API] Error fetching portfolio:", err);
		return NextResponse.json(
			{ error: "Failed to fetch portfolio" },
			{ status: 500 }
		);
	}
}