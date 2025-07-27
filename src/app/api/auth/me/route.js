import dbConnect from "@/lib/mongodb";
import auth from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await dbConnect();
		const user = await auth();

		if (!user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		return NextResponse.json({
			user: {
				id: user._id,
				name: user.name,
				username: user.username,
				email: user.email,
			}
		});

	} catch (error) {
		console.error("Auth me error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
