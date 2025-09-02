import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { auth } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    
    const { portfolioId, format = 'pdf' } = await req.json();
    
    if (!portfolioId) {
      return NextResponse.json({ error: "Portfolio ID is required" }, { status: 400 });
    }

    // Get authenticated user (optional - for private portfolios)
    const user = await auth();
    
    // Find portfolio
    const portfolio = await Portfolio.findById(portfolioId)
      .populate('userId', 'name email username')
      .lean();

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Check if user has access to this portfolio
    if (!portfolio.isPublic && (!user || user._id.toString() !== portfolio.userId._id.toString())) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // For now, return portfolio data for client-side PDF generation
    // In a full implementation, you would use a library like puppeteer or jsPDF
    return NextResponse.json({
      success: true,
      portfolio: portfolio,
      format: format,
      message: "Portfolio data ready for export"
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export portfolio" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const format = searchParams.get('format') || 'pdf';
    
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Find public portfolio
    const portfolio = await Portfolio.findOne({ 
      username, 
      isPublic: true 
    }).populate('userId', 'name email username').lean();

    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      portfolio: portfolio,
      format: format,
      message: "Portfolio data ready for export"
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export portfolio" }, { status: 500 });
  }
}
