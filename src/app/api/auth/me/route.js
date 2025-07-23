import dbConnect from "@/lib/mongodb";
import auth from "@/lib/auth";

export async function GET(req) {
	await dbConnect();
	const user = await auth(req);
	if (!user) return new Response("Unauthorized", { status: 401 });
	return new Response(
		JSON.stringify({ user: { name: user.name, email: user.email } }),
		{ status: 200, headers: { "Content-Type": "application/json" } }
	);
}
