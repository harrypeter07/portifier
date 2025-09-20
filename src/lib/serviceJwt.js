// API Key Authentication for Templates App
// This replaces JWT authentication with simpler API Key approach

export function getTemplatesApiKey() {
	const apiKey = process.env.TEMPLATES_API_KEY || "";
	if (!apiKey) {
		throw new Error("TEMPLATES_API_KEY is not set");
	}
	return apiKey;
}

// Legacy JWT function for backward compatibility
import { SignJWT } from "jose";

export async function makeServiceJWT(payload = {}) {
	const secret = process.env.SHARED_JWT_SECRET || process.env.JWT_SECRET || "";
	if (!secret) {
		throw new Error("SHARED_JWT_SECRET or JWT_SECRET is not set");
	}
	const encSecret = new TextEncoder().encode(secret);
	const now = Math.floor(Date.now() / 1000);
	const jwt = await new SignJWT({ ...payload, iat: now })
		.setProtectedHeader({ alg: "HS256", typ: "JWT" })
		.setExpirationTime("5m")
		.sign(encSecret);
	return jwt;
}

export default getTemplatesApiKey;


