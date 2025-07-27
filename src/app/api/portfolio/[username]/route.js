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

		// Then, find the portfolio for that user
		const portfolio = await Portfolio.findOne({ userId: user._id });
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
			hasPortfolioData: !!portfolio.portfolioData,
			personalData: portfolio.portfolioData?.personal ? {
				firstName: portfolio.portfolioData.personal.firstName,
				lastName: portfolio.portfolioData.personal.lastName,
				subtitle: portfolio.portfolioData.personal.subtitle,
				email: portfolio.portfolioData.personal.email
			} : null
		});

		return NextResponse.json({
			success: true,
			portfolio: {
				layout: portfolio.layout,
				content: portfolio.content,
				portfolioData: portfolio.portfolioData,
				username: user.username,
				name: user.name
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