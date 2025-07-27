import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Portfolio from "../../../../models/Portfolio";
import User from "../../../../models/User";

export async function GET(req) {
	await dbConnect();
	const { searchParams } = new URL(req.url);
	const username = searchParams.get("username");

	if (!username) {
		return NextResponse.json({ error: "Missing username" }, { status: 400 });
	}

	// Handle common route conflicts
	const reservedUsernames = [
		"signin",
		"signup",
		"dashboard",
		"editor",
		"api",
		"auth",
		"admin",
		"preview",
	];
	if (reservedUsernames.includes(username.toLowerCase())) {
		return NextResponse.json({ error: "Username not found" }, { status: 404 });
	}

	try {
		// First find the user by username
		const user = await User.findOne({ email: username });
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Then find their portfolio
		const portfolio = await Portfolio.findOne({ userId: user._id });
		if (!portfolio) {
			return NextResponse.json(
				{ error: "Portfolio not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ portfolio });
	} catch (error) {
		console.error("Error fetching portfolio:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
