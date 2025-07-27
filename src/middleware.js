import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
	const { pathname } = request.nextUrl;

	// Define protected routes
	const protectedRoutes = ["/dashboard", "/editor"];
	const authRoutes = ["/auth/signin", "/auth/signup"];

	const isProtectedRoute = protectedRoutes.some(route => 
		pathname.startsWith(route)
	);
	const isAuthRoute = authRoutes.some(route => 
		pathname.startsWith(route)
	);

	// Get token from cookie
	const token = request.cookies.get("token")?.value;
	console.log(`[MIDDLEWARE] ${pathname} - Token:`, token ? "EXISTS" : "MISSING");

	// Verify token
	let isAuthenticated = false;
	if (token) {
		try {
			// Verify JWT token using jose
			const secret = new TextEncoder().encode(process.env.JWT_SECRET);
			const { payload } = await jwtVerify(token, secret);
			
			// Check if userId is a valid string (not a buffer)
			if (payload.userId && typeof payload.userId === 'string') {
				isAuthenticated = true;
				console.log(`[MIDDLEWARE] Token verified for user:`, payload.userId);
			} else {
				console.log(`[MIDDLEWARE] Invalid userId format in token:`, payload.userId);
				throw new Error("Invalid userId format");
			}
		} catch (error) {
			// Token is invalid, clear it
			console.log(`[MIDDLEWARE] Token verification failed:`, error.message);
			const response = NextResponse.redirect(
				new URL("/auth/signin", request.url)
			);
			response.cookies.delete("token");
			return response;
		}
	}

	// Redirect unauthenticated users from protected routes
	if (isProtectedRoute && !isAuthenticated) {
		console.log(`[MIDDLEWARE] Redirecting unauthenticated user from protected route: ${pathname}`);
		return NextResponse.redirect(
			new URL("/auth/signin", request.url)
		);
	}

	// Redirect authenticated users away from auth routes
	if (isAuthRoute && isAuthenticated) {
		console.log(`[MIDDLEWARE] Redirecting authenticated user from auth route: ${pathname}`);
		return NextResponse.redirect(
			new URL("/editor", request.url)
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/editor/:path*",
		"/auth/signin",
		"/auth/signup",
	],
};
