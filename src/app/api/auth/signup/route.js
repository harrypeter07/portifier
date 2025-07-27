import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
	console.log("[SIGNUP] Incoming sign-up request");
	
	try {
		await dbConnect();
		const { name, username, email, password } = await req.json();
		
		console.log("[SIGNUP] Registration attempt for:", { name, username, email });

		// Validate required fields
		if (!name || !username || !email || !password) {
			console.log("[SIGNUP] Missing required fields");
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		// Validate username format
		if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
			console.log("[SIGNUP] Invalid username format:", username);
			return NextResponse.json(
				{ error: "Username can only contain letters, numbers, hyphens, and underscores" },
				{ status: 400 }
			);
		}

		// Check for reserved usernames
		const reservedUsernames = ['signin', 'signup', 'dashboard', 'editor', 'api', 'auth', 'admin', 'preview', 'www'];
		if (reservedUsernames.includes(username.toLowerCase())) {
			console.log("[SIGNUP] Reserved username attempted:", username);
			return NextResponse.json(
				{ error: "This username is reserved" },
				{ status: 400 }
			);
		}

		// Check if email already exists
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			console.log("[SIGNUP] Email already exists:", email);
			return NextResponse.json(
				{ error: "Email already exists" },
				{ status: 409 }
			);
		}

		// Check if username already exists
		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			console.log("[SIGNUP] Username already taken:", username);
			return NextResponse.json(
				{ error: "Username already taken" },
				{ status: 409 }
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);
		console.log("[SIGNUP] Password hashed successfully");

		// Create user
		const user = new User({
			name,
			username,
			email,
			password: hashedPassword,
		});

		await user.save();
		console.log("[SIGNUP] User created successfully:", user._id);

		// Create JWT token for automatic login
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const token = await new SignJWT({ userId: user._id })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("7d")
			.sign(secret);
		
		console.log("[SIGNUP] JWT token created for automatic login");

		// Set cookie for automatic login
		const cookieStore = await cookies();
		cookieStore.set("token", token, {
			httpOnly: true,
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 7 days
			secure: process.env.NODE_ENV === "production",
		});
		console.log("[SIGNUP] Token cookie set for automatic login");

		return NextResponse.json({
			user: { 
				id: user._id,
				name: user.name, 
				email: user.email, 
				username: user.username 
			},
			message: "User created and logged in successfully"
		}, { status: 201 });

	} catch (error) {
		console.error("[SIGNUP] Error during sign up:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
