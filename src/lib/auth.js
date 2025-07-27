import jwt from "jsonwebtoken";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "./mongodb";

export default async function auth(req) {
	let token = req.cookies.get("token")?.value;
	if (!token) {
		return null;
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
