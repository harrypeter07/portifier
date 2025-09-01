import dbConnect from "@/lib/mongodb";
import auth from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
	console.log("[ME] Incoming /me request");
	try {
		// Try to connect to database with better error handling
		try {
			await dbConnect();
			console.log("[ME] Database connected successfully");
		} catch (dbError) {
			console.error("[ME] Database connection failed:", dbError.message);
			// For /me endpoint, we can still try auth without DB if it's a connection issue
			if (dbError.message?.includes("timeout") || dbError.message?.includes("ETIMEDOUT")) {
				console.log("[ME] Database timeout, attempting auth without DB operations");
			} else {
				return NextResponse.json(
					{ 
						error: "Database connection failed. Please try again in a few moments.",
						details: process.env.NODE_ENV === "development" ? dbError.message : undefined
					},
					{ status: 503 }
				);
			}
		}
		
		const user = await auth();
		if (!user) {
			console.log("[ME] No authenticated user found");
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}
		console.log("[ME] Returning user data for:", user.email || user.name);
		return NextResponse.json({
			user: {
				id: user._id,
				name: user.name,
				username: user.username,
				email: user.email,
			}
		});
	} catch (error) {
		console.error("[ME] Error during /me request:", error);
		
		// Provide more specific error messages
		let errorMessage = "Internal server error";
		let statusCode = 500;
		
		if (error.message?.includes("timeout") || error.message?.includes("ETIMEDOUT")) {
			errorMessage = "Database connection timeout. Please try again.";
			statusCode = 503;
		} else if (error.message?.includes("Unauthorized") || error.message?.includes("invalid token")) {
			errorMessage = "Authentication failed";
			statusCode = 401;
		}
		
		return NextResponse.json(
			{ 
				error: errorMessage,
				details: process.env.NODE_ENV === "development" ? error.message : undefined
			},
			{ status: statusCode }
		);
	}
}
