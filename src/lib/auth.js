import { jwtVerify } from "jose";
import User from "../models/User";
import { cookies } from "next/headers";
import dbConnect from "./mongodb";

export default async function auth(req) {
	let token = req.cookies.get("token")?.value;
	if (!token) {
		console.log("[AUTH] No token found in cookies");
		return null;
	}
	
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(token, secret);
		
		await dbConnect();
		const user = await User.findById(payload.userId);
		
		if (!user) {
			console.log("[AUTH] User not found in database for ID:", payload.userId);
			return null;
		}

		console.log("[AUTH] Authentication successful for user:", user.email);
		return user;
	} catch (error) {
		console.log("[AUTH] Authentication failed:", error.message);
		return null;
	}
}
