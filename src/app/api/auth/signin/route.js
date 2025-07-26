import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
	console.log("[SIGNIN] Incoming sign-in request");
	const body = await req.json();
	console.log("[SIGNIN] Request body:", body);
	await dbConnect();
	const { email, password } = body;
	if (!email || !password) {
		console.log("[SIGNIN] Missing email or password");
		return new Response(JSON.stringify({ error: "Missing fields" }), {
			status: 400,
		});
	}
	const user = await User.findOne({ email });
	console.log("[SIGNIN] User lookup result:", user ? user._id : null);
	if (!user) {
		console.log("[SIGNIN] User not found for email:", email);
		return new Response(JSON.stringify({ error: "User not found" }), {
			status: 404,
		});
	}
	const valid = await bcrypt.compare(password, user.password);
	console.log("[SIGNIN] Password valid:", valid);
	if (!valid) {
		console.log("[SIGNIN] Invalid password for user:", email);
		return new Response(JSON.stringify({ error: "Invalid credentials" }), {
			status: 401,
		});
	}
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
	console.log("[SIGNIN] JWT token created:", token ? token.substring(0, 20) + "..." : null);

	// Await cookies() as required by Next.js dynamic API
	const cookieStore = await cookies();
	cookieStore.set("token", token, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		secure: process.env.NODE_ENV === "production",
	});
	console.log("[SIGNIN] Token cookie set for user:", user.email);

	return new Response(
		JSON.stringify({
			user: { name: user.name, email: user.email, verified: user.verified },
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
}
