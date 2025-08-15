import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import PortfolioView from "@/models/PortfolioView";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export async function POST(req, { params }) {
  await dbConnect();
  const { username } = await params;

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // Get user and portfolio
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const portfolio = await Portfolio.findOne({ userId: user._id, isPublic: true });
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Get request headers
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const referer = headersList.get('referer') || '';
    const xForwardedFor = headersList.get('x-forwarded-for');
    const xRealIp = headersList.get('x-real-ip');
    
    // Get IP address
    const ipAddress = xForwardedFor?.split(',')[0] || xRealIp || 'unknown';
    
    // Parse user agent
    const parser = new UAParser(userAgent);
    const uaResult = parser.getResult();
    
    // Determine device type
    let deviceType = 'desktop';
    if (uaResult.device.type === 'mobile') deviceType = 'mobile';
    else if (uaResult.device.type === 'tablet') deviceType = 'tablet';
    
    // Parse referrer
    let referrerDomain = '';
    if (referer) {
      try {
        const url = new URL(referer);
        referrerDomain = url.hostname;
      } catch (e) {
        referrerDomain = referer;
      }
    }
    
    // Generate session ID (simple hash of IP + User Agent + timestamp)
    const sessionId = Buffer.from(`${ipAddress}-${userAgent}-${Date.now()}`).toString('base64').slice(0, 16);
    
    // Check if this is a new visitor (based on IP + User Agent combination)
    const visitorId = `${ipAddress}-${userAgent}`;
    const existingView = await PortfolioView.findOne({
      portfolioId: portfolio._id,
      ipAddress,
      userAgent
    }).sort({ createdAt: -1 });
    
    // Create or update view record
    const viewData = {
      portfolioId: portfolio._id,
      userId: user._id,
      sessionId,
      ipAddress,
      userAgent,
      referrer: referer,
      referrerDomain,
      deviceType,
      browser: uaResult.browser.name || 'Unknown',
      os: uaResult.os.name || 'Unknown',
      lastVisit: new Date()
    };
    
    if (existingView) {
      // Update existing view (same visitor, new session)
      await PortfolioView.findByIdAndUpdate(existingView._id, {
        sessionId,
        lastVisit: new Date(),
        pagesViewed: existingView.pagesViewed + 1,
        isBounce: false // Not a bounce since they're returning
      });
    } else {
      // Create new view record
      await PortfolioView.create(viewData);
    }
    
    // Update portfolio view count
    await Portfolio.findByIdAndUpdate(portfolio._id, {
      $inc: { views: 1 }
    });
    
    return NextResponse.json({
      success: true,
      message: "View tracked successfully"
    });
    
  } catch (err) {
    console.error("Error tracking portfolio view:", err);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await dbConnect();
  const { username } = await params;
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '7d';

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const portfolio = await Portfolio.findOne({ userId: user._id, isPublic: true });
    if (!portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (range) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get real analytics data
    const views = await PortfolioView.find({
      portfolioId: portfolio._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Calculate daily views
    const dailyViews = {};
    views.forEach(view => {
      const date = view.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    });

    const viewsOverTime = Object.entries(dailyViews).map(([date, count]) => ({
      date,
      views: count
    }));

    // Calculate unique visitors
    const uniqueVisitors = await PortfolioView.distinct('ipAddress', {
      portfolioId: portfolio._id,
      createdAt: { $gte: startDate }
    });

    // Calculate traffic sources
    const trafficSources = await PortfolioView.aggregate([
      {
        $match: {
          portfolioId: portfolio._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$referrerDomain',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Calculate device types
    const deviceTypes = await PortfolioView.aggregate([
      {
        $match: {
          portfolioId: portfolio._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$deviceType',
          visits: { $sum: 1 }
        }
      }
    ]);

    // Calculate average time on page
    const avgTimeOnPage = await PortfolioView.aggregate([
      {
        $match: {
          portfolioId: portfolio._id,
          createdAt: { $gte: startDate },
          timeOnPage: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$timeOnPage' }
        }
      }
    ]);

    // Calculate bounce rate
    const totalSessions = await PortfolioView.countDocuments({
      portfolioId: portfolio._id,
      createdAt: { $gte: startDate }
    });

    const bounceSessions = await PortfolioView.countDocuments({
      portfolioId: portfolio._id,
      createdAt: { $gte: startDate },
      isBounce: true
    });

    const bounceRate = totalSessions > 0 ? (bounceSessions / totalSessions) * 100 : 0;

    const stats = {
      totalViews: portfolio.views || 0,
      uniqueVisitors: uniqueVisitors.length,
      avgTimeOnPage: Math.round(avgTimeOnPage[0]?.avgTime || 0),
      bounceRate: Math.round(bounceRate),
      viewsOverTime,
      trafficSources: trafficSources.map(source => ({
        name: source._id || 'Direct',
        value: source.count
      })),
      deviceTypes: deviceTypes.map(device => ({
        device: device._id.charAt(0).toUpperCase() + device._id.slice(1),
        visits: device.visits
      }))
    };

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (err) {
    console.error("Error fetching portfolio stats:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}


