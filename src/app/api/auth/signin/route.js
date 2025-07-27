import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
	console.log("[SIGNIN] Incoming sign-in request");
	
	try {
		const body = await req.json();
		console.log("[SIGNIN] Request body:", { email: body.email, password: body.password ? "PROVIDED" : "MISSING" });
		
		await dbConnect();
		const { email, password } = body;
		
		if (!email || !password) {
			console.log("[SIGNIN] Missing email or password");
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}
		
		const user = await User.findOne({ email });
		console.log("[SIGNIN] User lookup result:", user ? `Found user: ${user._id}` : "User not found");
		
		if (!user) {
			console.log("[SIGNIN] User not found for email:", email);
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}
		
		const valid = await bcrypt.compare(password, user.password);
		console.log("[SIGNIN] Password validation:", valid ? "SUCCESS" : "FAILED");
		
		if (!valid) {
			console.log("[SIGNIN] Invalid password for user:", email);
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}
		
		// Create JWT token using jose
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const token = await new SignJWT({ userId: user._id.toString() })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("7d")
			.sign(secret);
		
		console.log("[SIGNIN] JWT token created successfully");

		// Set cookie
		const cookieStore = await cookies();
		cookieStore.set("token", token, {
			httpOnly: true,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
			secure: process.env.NODE_ENV === "production",
		});
		console.log("[SIGNIN] Token cookie set for user:", user.email);

		return NextResponse.json({
			user: { 
				id: user._id,
				name: user.name, 
				email: user.email, 
				username: user.username 
			},
			message: "Sign in successful"
		}, { status: 200 });
		
	} catch (error) {
		console.error("[SIGNIN] Error during sign in:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
