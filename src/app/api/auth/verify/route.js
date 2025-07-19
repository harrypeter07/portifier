// import dbConnect from "../../../../lib/mongodb";
// import User from "../../../../models/User";

// export async function GET(req) {
// 	await dbConnect();
// 	const { searchParams } = new URL(req.url);
// 	const email = searchParams.get("email");
// 	const token = searchParams.get("token");
// 	console.log("[VERIFY] Incoming email:", email, "token:", token);
//
// 	if (!email || !token) {
// 		console.error("[VERIFY] Missing email or token in query params.");
// 		return new Response("Invalid verification link.", { status: 400 });
// 	}
//
// 	let userByEmail;
// 	try {
// 		userByEmail = await User.findOne({ email });
// 		console.log("[VERIFY] Email lookup result:", userByEmail);
// 	} catch (err) {
// 		console.error("[VERIFY] Error during email lookup:", err);
// 		return new Response("Server error during verification.", { status: 500 });
// 	}
//
// 	if (!userByEmail) {
// 		console.error("[VERIFY] No user found for email:", email);
// 		return new Response("Invalid or expired verification link.", {
// 			status: 400,
// 		});
// 	}
//
// 	let user;
// 	try {
// 		user = await User.findOne({ email, verificationToken: token });
// 		console.log("[VERIFY] Token lookup result:", user);
// 	} catch (err) {
// 		console.error("[VERIFY] Error during token lookup:", err);
// 		return new Response("Server error during verification.", { status: 500 });
// 	}
//
// 	if (!user) {
// 		console.error("[VERIFY] No user found for email/token:", email, token);
// 		return new Response("Invalid or expired verification link.", {
// 			status: 400,
// 		});
// 	}
//
// 	user.verified = true;
// 	user.verificationToken = undefined;
// 	await user.save();
//
// 	const baseUrl =
// 		req.headers.get("origin") ||
// 		process.env.NEXT_PUBLIC_BASE_URL ||
// 		"http://localhost:3000";
// 	console.log(
// 		"[VERIFY] User verified successfully. Redirecting to:",
// 		`${baseUrl}/signin?verified=1`
// 	);
// 	return Response.redirect(`${baseUrl}/signin?verified=1`, 302);
// }
