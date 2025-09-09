import { SignJWT } from "jose";

export async function makeServiceJWT(payload = {}) {
	const secret = process.env.SHARED_JWT_SECRET || "";
	if (!secret) {
		throw new Error("SHARED_JWT_SECRET is not set");
	}
	const encSecret = new TextEncoder().encode(secret);
	const now = Math.floor(Date.now() / 1000);
	const jwt = await new SignJWT({ ...payload, iat: now })
		.setProtectedHeader({ alg: "HS256", typ: "JWT" })
		.setExpirationTime("5m")
		.sign(encSecret);
	return jwt;
}

export default makeServiceJWT;


