import dbConnect from "@/lib/mongodb";
import auth from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
	console.log("[ME] Incoming /me request");
	
	try {
		await dbConnect();
		const user = await auth(req);

		if (!user) {
			console.log("[ME] No authenticated user found");
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		console.log("[ME] Returning user data for:", user.email);
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
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
