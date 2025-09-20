import { NextResponse } from "next/server";
import { getTemplatesApiKey } from "@/lib/serviceJwt";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";

async function getPortfolioFromDB(username) {
	try {
		await dbConnect();
		
		// Find user by username
		const user = await User.findOne({ username });
		if (!user) {
			throw new Error("User not found");
		}

		// Find the latest public portfolio for that user
		const portfolio = await Portfolio.findOne({ 
			userId: user._id, 
			isPublic: true 
		}).sort({ updatedAt: -1 });
		
		if (!portfolio) {
			throw new Error("Portfolio not found");
		}

		return {
			username: user.username,
			templateId: portfolio.templateId || portfolio.templateName || "modern-resume",
			portfolioData: portfolio.portfolioData || {},
			...portfolio.getPublicData()
		};
	} catch (error) {
		console.error("Error fetching portfolio:", error);
		return null;
	}
}

export async function POST(request) {
	try {
		const { username } = await request.json();
		
		if (!username) {
			return NextResponse.json(
				{ error: "Username is required" },
				{ status: 400 }
			);
		}

		// 1. Get portfolio data from database
		const portfolioData = await getPortfolioFromDB(username);
		if (!portfolioData) {
			return NextResponse.json(
				{ error: "Portfolio not found" },
				{ status: 404 }
			);
		}

		// 2. Get API Key for templates app
		const apiKey = getTemplatesApiKey();

		// 3. Call Templates App
		const templatesAppUrl = process.env.TEMPLATES_BASE_URL || process.env.TEMPLATES_APP_URL || "https://portumet.vercel.app";
		const response = await fetch(`${templatesAppUrl}/api/render`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				templateId: portfolioData.templateId,
				data: portfolioData
			})
		});

		if (!response.ok) {
			console.error(`Templates App error: ${response.status}`, await response.text());
			return NextResponse.json(
				{ error: `Templates App error: ${response.status}` },
				{ status: response.status }
			);
		}

		const result = await response.json();

		// 4. Return HTML/CSS to client with proper headers
		return new Response(result.html, {
			headers: {
				'Content-Type': 'text/html',
				'Cache-Control': 'public, s-maxage=300',
				'ETag': response.headers.get('ETag') || `"${Date.now()}"`
			}
		});

	} catch (error) {
		console.error("Render portfolio error:", error);
		return NextResponse.json(
			{ error: "Render failed" },
			{ status: 500 }
		);
	}
}

// Also support GET for direct portfolio rendering
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get('username');
	
	if (!username) {
		return NextResponse.json(
			{ error: "Username parameter is required" },
			{ status: 400 }
		);
	}

	// Use POST logic
	const postRequest = new Request(request.url, {
		method: 'POST',
		headers: request.headers,
		body: JSON.stringify({ username })
	});

	return POST(postRequest);
}
