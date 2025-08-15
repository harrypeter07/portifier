import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
	await dbConnect();
	const { username } = await params;
	const { searchParams } = new URL(req.url);
	const range = searchParams.get('range') || '7d';

	if (!username) {
		return NextResponse.json({ error: "Username is required" }, { status: 400 });
	}

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const portfolio = await Portfolio.findOne({ userId: user._id, isPublic: true });
		if (!portfolio) {
			return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
		}

		// Calculate date range
		const now = new Date();
		let startDate;
		switch (range) {
			case '30d':
				startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				break;
			case '90d':
				startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
				break;
			default: // 7d
				startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		}

		// Generate mock analytics data (in a real app, this would come from analytics service)
		const daysInRange = Math.ceil((now - startDate) / (24 * 60 * 60 * 1000));
		const viewsOverTime = [];
		const totalViews = portfolio.views || 0;
		
		for (let i = 0; i < daysInRange; i++) {
			const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
			viewsOverTime.push({
				date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
				views: Math.floor(Math.random() * 20) + (totalViews > 0 ? Math.floor(totalViews / daysInRange) : 0)
			});
		}

		// Mock traffic sources
		const trafficSources = [
			{ name: 'Direct', value: Math.floor(Math.random() * 40) + 30 },
			{ name: 'Google', value: Math.floor(Math.random() * 30) + 20 },
			{ name: 'LinkedIn', value: Math.floor(Math.random() * 20) + 10 },
			{ name: 'Twitter', value: Math.floor(Math.random() * 15) + 5 },
			{ name: 'Other', value: Math.floor(Math.random() * 10) + 5 }
		];

		// Mock top referrers
		const topReferrers = [
			{ source: 'linkedin.com', visits: Math.floor(Math.random() * 50) + 20 },
			{ source: 'google.com', visits: Math.floor(Math.random() * 40) + 15 },
			{ source: 'twitter.com', visits: Math.floor(Math.random() * 30) + 10 },
			{ source: 'github.com', visits: Math.floor(Math.random() * 25) + 8 },
			{ source: 'medium.com', visits: Math.floor(Math.random() * 20) + 5 }
		];

		// Mock device types
		const deviceTypes = [
			{ device: 'Desktop', visits: Math.floor(Math.random() * 60) + 40 },
			{ device: 'Mobile', visits: Math.floor(Math.random() * 40) + 30 },
			{ device: 'Tablet', visits: Math.floor(Math.random() * 20) + 10 }
		];

		// Calculate additional stats
		const uniqueVisitors = Math.floor(totalViews * 0.7); // Assume 70% unique
		const avgTimeOnPage = Math.floor(Math.random() * 180) + 60; // 1-4 minutes in seconds
		const bounceRate = Math.floor(Math.random() * 40) + 20; // 20-60%

		const stats = {
			totalViews,
			uniqueVisitors,
			avgTimeOnPage,
			bounceRate,
			viewsOverTime,
			trafficSources,
			topReferrers,
			deviceTypes
		};

		return NextResponse.json({
			success: true,
			stats
		});
	} catch (err) {
		console.error("Error fetching portfolio stats:", err);
		return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
	}
}
