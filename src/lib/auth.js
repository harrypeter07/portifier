import jwt from "jsonwebtoken";
import User from "../models/User";

export default async function auth(req) {
	// Debug: Log all available cookies
	console.log("🍪 Available cookies:", req.cookies);
	console.log("🍪 Raw cookie header:", req.headers.get('cookie'));
	
	let token = req.cookies.get("token")?.value;
	console.log("🔑 Token extracted:", token ? "[TOKEN_PRESENT]" : "[NO_TOKEN]");
	
	if (!token) {
		console.log("❌ No token found in cookies");
		return null;
	}
	try {
		console.log("🔍 Attempting to verify token...");
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("✅ Token verified successfully. User ID:", decoded.userId);
		
		const user = await User.findById(decoded.userId);
		if (!user) {
			console.log("❌ User not found in database for ID:", decoded.userId);
			throw new Error("User not found");
		}
		
		console.log("✅ User authenticated successfully:", user.name, user.email);
		return user;
	} catch (e) {
		console.log("❌ Token verification failed:", e.message);
		return null;
	}
}
