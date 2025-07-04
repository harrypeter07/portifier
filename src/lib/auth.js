import jwt from "jsonwebtoken";
import User from "../models/User";

export default async function auth(req) {
	// Get cookies from the request headers
	let token = null;
	const cookieHeader = req.headers.get
		? req.headers.get("cookie")
		: req.headers.cookie;
	if (cookieHeader) {
		token = cookieHeader
			.split("; ")
			.find((c) => c.startsWith("token="))
			?.split("=")[1];
	}
	if (!token) {
		return null;
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId);
		if (!user) throw new Error("User not found");
		return user;
	} catch (e) {
		return null;
	}
}
