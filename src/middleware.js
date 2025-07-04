import { NextResponse } from "next/server";

export function middleware(request) {
	const { pathname } = request.nextUrl;
	const protectedRoutes = ["/dashboard", "/editor"];
	const isProtected = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);
	const token = request.cookies.get("token");

	if (isProtected && !token) {
		const url = request.nextUrl.clone();
		url.pathname = "/signin";
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/editor"],
};
