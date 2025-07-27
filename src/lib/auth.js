import User from "../models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "./mongodb";

export default async function auth() {
	try {
		await dbConnect();
		const cookieStore = await cookies();
		const token = cookieStore.get("token")?.value;
		
		console.log("[AUTH] Token from cookie:", token ? "EXISTS" : "MISSING");
		
		if (!token) {
			console.log("[AUTH] No token found");
			return null;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("[AUTH] Token decoded successfully for userId:", decoded.userId);
		
		const user = await User.findById(decoded.userId);
		
		if (!user) {
			console.log("[AUTH] User not found in database");
			return null;
		}

		console.log("[AUTH] Authentication successful for user:", user.email);
		return user;
	} catch (error) {
		console.log("[AUTH] Authentication failed:", error.message);
		return null;
	}
}
