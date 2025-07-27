import { jwtVerify } from "jose";
import User from "../models/User";
import { cookies } from "next/headers";
import dbConnect from "./mongodb";
import mongoose from "mongoose";

export default async function auth(req) {
	console.log("[AUTH] Starting authentication check");
	console.log("[AUTH] Request cookies:", req.cookies.getAll());
	
	let token = req.cookies.get("token")?.value;
	console.log("[AUTH] Token from cookies:", token ? "EXISTS" : "MISSING");
	
	if (!token) {
		console.log("[AUTH] No token found in cookies");
		return null;
	}
	
	try {
		console.log("[AUTH] Attempting to verify token...");
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(token, secret);
		console.log("[AUTH] Token verified successfully, payload:", payload);
		
		// Handle both string and buffer userId formats (for backward compatibility)
		let userIdString;
		if (typeof payload.userId === 'string') {
			userIdString = payload.userId;
		} else if (payload.userId && payload.userId.buffer) {
			// Convert buffer to ObjectId string (for old tokens)
			const buffer = Buffer.from(Object.values(payload.userId.buffer));
			userIdString = buffer.toString('hex');
		} else {
			console.log("[AUTH] Invalid userId format in token");
			return null;
		}
		
		try {
			await dbConnect();
			// Convert userId string back to ObjectId for database query
			const userId = new mongoose.Types.ObjectId(userIdString);
			const user = await User.findById(userId);
			
			if (!user) {
				console.log("[AUTH] User not found in database for ID:", payload.userId);
				return null;
			}

			console.log("[AUTH] Authentication successful for user:", user.email);
			return user;
		} catch (dbError) {
			console.log("[AUTH] Database connection failed:", dbError.message);
			return null;
		}
	} catch (error) {
		console.log("[AUTH] Authentication failed:", error.message);
		return null;
	}
}
