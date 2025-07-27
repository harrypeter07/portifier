import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
	console.log("[LOGOUT] Incoming logout request");
	
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("token");
		
		if (token) {
			console.log("[LOGOUT] Token found, deleting cookie");
			cookieStore.delete("token");
		} else {
			console.log("[LOGOUT] No token found in cookies");
		}

		console.log("[LOGOUT] Logout successful");
		return NextResponse.json({
			message: "Logout successful"
		});

	} catch (error) {
		console.error("[LOGOUT] Error during logout:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
