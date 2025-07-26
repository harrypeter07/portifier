import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request) {
	const { pathname } = request.nextUrl;

	// Define protected routes and auth-only routes
	const protectedRoutes = ["/dashboard", "/editor"];
	const authRoutes = ["/signin", "/signup"];

	const isProtected = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	const token = request.cookies.get("token")?.value;

	// Validate token if present
	let isValidToken = false;
	if (token) {
		try {
			// Verify JWT token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			isValidToken = !!decoded.userId;
		} catch (error) {
			// Token is invalid or expired
			isValidToken = false;

			// Clear invalid token and redirect to signin
			const response = NextResponse.redirect(new URL("/signin", request.url));
			response.cookies.delete("token");
			return response;
		}
	}

	// Redirect unauthenticated users from protected routes
	if (isProtected && !isValidToken) {
		const url = request.nextUrl.clone();
		url.pathname = "/signin";
		return NextResponse.redirect(url);
	}

	// Redirect authenticated users away from auth routes
	if (isAuthRoute && isValidToken) {
		const url = request.nextUrl.clone();
		url.pathname = "/dashboard";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard",
		"/editor",
		"/signin",
		"/signup",
		"/api/auth/me",
		"/api/auth/logout"
	],
};
