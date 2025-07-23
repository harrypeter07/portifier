import jwt from "jsonwebtoken";
import User from "../models/User";

export default async function auth(req) {
	let token = req.cookies.get("token")?.value;
	if (!token) {
		return null;
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	} catch (e) {
		return null;
	}
}
