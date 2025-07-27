import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		await dbConnect();
		const { email, password } = await req.json();

		// Validate required fields
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		// Create JWT token
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		// Create response with cookie
		const response = NextResponse.json({
			message: "Signin successful",
			user: {
				id: user._id,
				name: user.name,
				username: user.username,
				email: user.email,
			}
		});
		
		// Set cookie using response.cookies
		response.cookies.set({
			name: "token",
			value: token,
			httpOnly: true,
			secure: false, // Set to false for development
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});
		
		console.log("[SIGNIN] Cookie set successfully for user:", user.email);
		
		return response;

	} catch (error) {
		console.error("Signin error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
