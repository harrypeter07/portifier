import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Portfolio from "@/models/Portfolio";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Fetch all existing usernames from Users and Portfolios
    const [user, portfolioHit, allPortfolios] = await Promise.all([
      User.findOne({ username: slug }).select("username"),
      Portfolio.findOne({ username: slug }).select("username"),
      Portfolio.find({}).select("username -_id").limit(200),
    ]);

    const existingPortfolioUsernames = (allPortfolios || []).map((p) => p.username).filter(Boolean);
    console.log("🔍 [CHECK-SLUG] Requested:", slug);
    console.log("🔍 [CHECK-SLUG] Existing portfolio URLs (sample up to 200):", existingPortfolioUsernames);

    const taken = !!user || !!portfolioHit;
    if (!taken) {
      console.log("✅ [CHECK-SLUG] Available:", slug);
      return NextResponse.json({ available: true, suggestions: [`${slug}1`, `${slug}123`] });
    }

    const base = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const suggestions = [1, 2, 3].map((n) => `${base}${n}`);
    console.log("❌ [CHECK-SLUG] Taken:", slug, "→ suggestions:", suggestions);
    return NextResponse.json({ available: false, suggestions, takenBy: user ? "user" : "portfolio" });
  } catch (err) {
    console.error("❌ [CHECK-SLUG] Error:", err?.message);
    return NextResponse.json({ error: "Failed to check slug" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ ok: true, method: "POST only" }, { status: 405 });
}


