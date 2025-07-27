import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
	try {
		await dbConnect();
		const { name, username, email, password } = await req.json();

		// Validate required fields
		if (!name || !username || !email || !password) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		// Validate username format
		if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
			return NextResponse.json(
				{ error: "Username can only contain letters, numbers, hyphens, and underscores" },
				{ status: 400 }
			);
		}

		// Check for reserved usernames
		const reservedUsernames = ['signin', 'signup', 'dashboard', 'editor', 'api', 'auth', 'admin', 'preview', 'www'];
		if (reservedUsernames.includes(username.toLowerCase())) {
			return NextResponse.json(
				{ error: "This username is reserved" },
				{ status: 400 }
			);
		}

		// Check if email already exists
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return NextResponse.json(
				{ error: "Email already exists" },
				{ status: 409 }
			);
		}

		// Check if username already exists
		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			return NextResponse.json(
				{ error: "Username already taken" },
				{ status: 409 }
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create user
		const user = new User({
			name,
			username,
			email,
			password: hashedPassword,
		});

		await user.save();

		return NextResponse.json(
			{ message: "User created successfully" },
			{ status: 201 }
		);

	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
