import dbConnect from "@/lib/mongodb";
import PortfolioView from "@/models/PortfolioView";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import UAParser from "ua-parser-js";

export async function POST(req) {
  await dbConnect();

  try {
    const { eventType, data, timestamp, sessionId, url, referrer } = await req.json();

    // Get request headers
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
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
    if (referrer) {
      try {
        const urlObj = new URL(referrer);
        referrerDomain = urlObj.hostname;
      } catch (e) {
        referrerDomain = referrer;
      }
    }

    // Create analytics event record
    const analyticsEvent = {
      eventType,
      data,
      timestamp: new Date(timestamp),
      sessionId,
      url,
      referrer,
      referrerDomain,
      ipAddress,
      userAgent,
      deviceType,
      browser: uaResult.browser.name || 'Unknown',
      os: uaResult.os.name || 'Unknown',
      createdAt: new Date()
    };

    // Store in PortfolioView collection (we can create a separate collection later if needed)
    await PortfolioView.create(analyticsEvent);

    return NextResponse.json({
      success: true,
      message: "Event tracked successfully"
    });

  } catch (err) {
    console.error("Error tracking analytics event:", err);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const portfolioId = searchParams.get('portfolioId');
  const eventType = searchParams.get('eventType');
  const range = searchParams.get('range') || '7d';

  if (!portfolioId) {
    return NextResponse.json({ error: "Portfolio ID is required" }, { status: 400 });
  }

  try {
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

    // Build query
    const query = {
      portfolioId,
      createdAt: { $gte: startDate }
    };

    if (eventType) {
      query.eventType = eventType;
    }

    // Get events
    const events = await PortfolioView.find(query)
      .sort({ createdAt: -1 })
      .limit(1000);

    // Group events by type
    const eventsByType = events.reduce((acc, event) => {
      if (!acc[event.eventType]) {
        acc[event.eventType] = [];
      }
      acc[event.eventType].push(event);
      return acc;
    }, {});

    // Calculate metrics
    const metrics = {
      totalEvents: events.length,
      eventsByType: Object.keys(eventsByType).map(type => ({
        type,
        count: eventsByType[type].length
      })),
      uniqueSessions: new Set(events.map(e => e.sessionId)).size,
      uniqueVisitors: new Set(events.map(e => e.ipAddress)).size,
      deviceTypes: events.reduce((acc, event) => {
        acc[event.deviceType] = (acc[event.deviceType] || 0) + 1;
        return acc;
      }, {}),
      browsers: events.reduce((acc, event) => {
        acc[event.browser] = (acc[event.browser] || 0) + 1;
        return acc;
      }, {}),
      referrers: events.reduce((acc, event) => {
        if (event.referrerDomain) {
          acc[event.referrerDomain] = (acc[event.referrerDomain] || 0) + 1;
        }
        return acc;
      }, {})
    };

    return NextResponse.json({
      success: true,
      events: events.slice(0, 100), // Return last 100 events
      metrics
    });

  } catch (err) {
    console.error("Error fetching analytics events:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
