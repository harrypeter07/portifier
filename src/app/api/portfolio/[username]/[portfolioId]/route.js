import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();
  const { username, portfolioId } = params;

  if (!username || !portfolioId) {
    return NextResponse.json(
      { error: "Username and portfolioId are required" },
      { status: 400 }
    );
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find the portfolio by userId and _id
    const portfolio = await Portfolio.findOne({ userId: user._id, _id: portfolioId });
    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      portfolio: portfolio.getPublicData(),
      username: user.username,
      portfolioId: portfolio._id,
      slug: portfolio.slug,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
} 