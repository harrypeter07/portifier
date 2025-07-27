import { jwtVerify } from "jose";
import User from "../models/User";

export default async function auth(req) {
	let token = req.cookies.get("token")?.value;
	if (!token) {
		return null;
	}
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET);
		const { payload } = await jwtVerify(token, secret);
		const user = await User.findById(payload.userId);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	} catch (e) {
		return null;
	}
}
