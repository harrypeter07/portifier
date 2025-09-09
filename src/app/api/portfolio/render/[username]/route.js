import { NextResponse } from "next/server";
import { renderRemoteTemplate } from "@/lib/templatesRender";

async function fetchPortfolioByUsername(username, origin) {
	try {
		const base = origin || process.env.NEXT_PUBLIC_BASE_URL || "";
		const url = base ? `${base}/api/portfolio/${username}` : `/api/portfolio/${username}`;
		const res = await fetch(url, { cache: "no-store" });
		const data = await res.json();
		if (res.ok && data?.success) return data.portfolio;
		return null;
	} catch {
		return null;
	}
}

export async function GET(request, { params }) {
	if (!process.env.REMOTE_TEMPLATES_ENABLED || process.env.REMOTE_TEMPLATES_ENABLED === "false") {
		return new NextResponse(null, { status: 204 });
	}
	const { username } = params;
	const { origin } = new URL(request.url);
	const portfolio = await fetchPortfolioByUsername(username, origin);
	if (!portfolio) return NextResponse.json({ error: "Not found" }, { status: 404 });
	const result = await renderRemoteTemplate({ portfolio });
	if (!result) return new NextResponse(null, { status: 204 });
	return NextResponse.json(result);
}


