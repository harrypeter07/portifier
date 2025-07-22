import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
	await dbConnect();
	let userId = null;

	try {
		const { layout, content, email } = await req.json();

		if (!layout || !content) {
			return NextResponse.json(
				{ error: "Missing layout or content" },
				{ status: 400 }
			);
		}

		// Find user by email (since we skipped email verification)
		if (email) {
			const user = await User.findOne({ email });
			if (user) {
				userId = user._id;
			} else {
				// Create a temporary user if not found (for demo purposes)
				console.log(
					"⚠️  User not found, creating temporary user for email:",
					email
				);
				const newUser = new User({
					email,
					name: email.split("@")[0],
					password: "demo" + Date.now(), // Temporary password
					verified: true, // Skip verification for demo
				});
				await newUser.save();
				userId = newUser._id;
			}
		} else {
			// Fallback: use a default user ID for demo
			console.log("⚠️  No email provided, using demo user");
			const demoUser = await User.findOne({ email: "demo@example.com" });
			if (demoUser) {
				userId = demoUser._id;
			} else {
				const newDemoUser = new User({
					email: "demo@example.com",
					name: "Demo User",
					password: "demo" + Date.now(), // Temporary password
					verified: true,
				});
				await newDemoUser.save();
				userId = newDemoUser._id;
			}
		}

		// Upsert portfolio for user
		const portfolio = await Portfolio.findOneAndUpdate(
			{ userId },
			{ layout, content },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		console.log("✅ Portfolio saved successfully for user:", userId);
		return NextResponse.json({ success: true, portfolio });
	} catch (err) {
		console.error("❌ Error saving portfolio:", err);
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
