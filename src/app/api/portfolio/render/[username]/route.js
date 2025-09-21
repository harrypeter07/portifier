// Direct Portfolio Rendering Route for Templates App Integration
// This route fetches portfolio data and renders it using the templates app
import { NextResponse } from "next/server";
import { getTemplatesApiKey } from "@/lib/serviceJwt";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";

export async function GET(request, { params }) {
	const requestId = Math.random().toString(36).substr(2, 9);
	
	try {
		const { username } = await params;
		
		if (!username) {
			return NextResponse.json(
				{ error: "Username is required" },
				{ status: 400 }
			);
		}

		console.log(`🔍 [PORTFOLIO-RENDER-${requestId}] Starting portfolio render for username: ${username}`);
		
		// Get API Key for templates app
		const apiKey = getTemplatesApiKey();
		const templatesAppUrl = process.env.TEMPLATES_BASE_URL || process.env.TEMPLATES_APP_URL || "https://portumet.vercel.app";
		
		console.log(`🔍 [PORTFOLIO-RENDER-${requestId}] Templates app URL: ${templatesAppUrl}`);
		console.log(`🔍 [PORTFOLIO-RENDER-${requestId}] API Key: ${apiKey ? 'Present' : 'Missing'}`);

		// Connect to database and fetch portfolio data
		await dbConnect();
		
		// Check if this is a numbered username (e.g., iitz_hassan-2)
		const isNumberedUsername = username.includes('-') && /-\d+$/.test(username);
		
		let portfolio;
		let user;
		
		if (isNumberedUsername) {
			// For numbered usernames, find portfolio directly by username
			console.log(`🔍 [PORTFOLIO-RENDER-${requestId}] Numbered username detected, searching portfolio directly`);
			portfolio = await Portfolio.findOne({ username, isPublic: true });
			
			if (!portfolio) {
				console.log(`❌ [PORTFOLIO-RENDER-${requestId}] Portfolio not found for numbered username: ${username}`);
				return new Response(`
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Portfolio Not Found</title>
						<style>
							body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
							.container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
							.error { color: #e74c3c; text-align: center; }
						</style>
					</head>
					<body>
						<div class="container">
							<div class="error">
								<h1>📄 Portfolio Not Found</h1>
								<p>The portfolio for username "${username}" was not found.</p>
								<p>Please check the username and try again.</p>
							</div>
						</div>
					</body>
					</html>
				`, {
					headers: { 'Content-Type': 'text/html' },
					status: 404
				});
			}
			
			// Get user info from portfolio's userId
			user = await User.findById(portfolio.userId);
			if (!user) {
				console.log(`❌ [PORTFOLIO-RENDER-${requestId}] User not found for portfolio userId: ${portfolio.userId}`);
				return new Response(`
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Portfolio Not Found</title>
						<style>
							body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
							.container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
							.error { color: #e74c3c; text-align: center; }
						</style>
					</head>
					<body>
						<div class="container">
							<div class="error">
								<h1>📄 Portfolio Not Found</h1>
								<p>The portfolio for username "${username}" was not found.</p>
								<p>Please check the username and try again.</p>
							</div>
						</div>
					</body>
					</html>
				`, {
					headers: { 'Content-Type': 'text/html' },
					status: 404
				});
			}
		} else {
			// For regular usernames, find user first then portfolio
			user = await User.findOne({ username });
			if (!user) {
				console.log(`❌ [PORTFOLIO-RENDER-${requestId}] User not found for username: ${username}`);
				return new Response(`
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Portfolio Not Found</title>
						<style>
							body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
							.container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
							.error { color: #e74c3c; text-align: center; }
						</style>
					</head>
					<body>
						<div class="container">
							<div class="error">
								<h1>📄 Portfolio Not Found</h1>
								<p>The portfolio for username "${username}" was not found.</p>
								<p>Please check the username and try again.</p>
							</div>
						</div>
					</body>
					</html>
				`, {
					headers: { 'Content-Type': 'text/html' },
					status: 404
				});
			}

			console.log(`✅ [PORTFOLIO-RENDER-${requestId}] User found:`, {
				userId: user._id,
				username: user.username,
				name: user.name,
				email: user.email
			});

			// Find the latest public portfolio for that user
			portfolio = await Portfolio.findOne({ userId: user._id, isPublic: true }).sort({ updatedAt: -1 });
			if (!portfolio) {
				console.log(`❌ [PORTFOLIO-RENDER-${requestId}] Portfolio not found for user: ${user._id}`);
				return new Response(`
					<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Portfolio Not Found</title>
						<style>
							body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
							.container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
							.error { color: #e74c3c; text-align: center; }
						</style>
					</head>
					<body>
						<div class="container">
							<div class="error">
								<h1>📄 Portfolio Not Found</h1>
								<p>The portfolio for username "${username}" was not found.</p>
								<p>Please check the username and try again.</p>
							</div>
						</div>
					</body>
					</html>
				`, {
					headers: { 'Content-Type': 'text/html' },
					status: 404
				});
			}
		}

		console.log(`✅ [PORTFOLIO-RENDER-${requestId}] Portfolio found:`, {
			portfolioId: portfolio._id,
			hasLayout: !!portfolio.layout,
			layoutKeys: portfolio.layout ? Object.keys(portfolio.layout) : [],
			hasContent: !!portfolio.content,
			hasPortfolioData: !!portfolio.portfolioData,
			portfolioDataKeys: portfolio.portfolioData ? Object.keys(portfolio.portfolioData) : [],
			personalData: portfolio.portfolioData?.personal,
			personalKeys: portfolio.portfolioData?.personal ? Object.keys(portfolio.portfolioData.personal) : []
		});

		// Get portfolio data
		const portfolioData = portfolio.getPublicData();

		// Prepare minimal data for Templates App
		const templatesAppData = {
			username: portfolio.username || username,
			templateId: portfolio.templateId || 'cleanfolio',
			options: {
				draft: false,
				version: 'v1'
			},
			portfolioData
		};

		console.log(`🔍 [PORTFOLIO-RENDER-${requestId}] Sending to Templates App:`, {
			username: templatesAppData.username,
			templateId: templatesAppData.templateId,
			hasPortfolioData: !!templatesAppData.portfolioData
		});

		// Call Templates App with minimal data
		const response = await fetch(`${templatesAppUrl}/api/render`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(templatesAppData),
			timeout: 30000 // 30 second timeout for rendering
		});

		console.log(`🔍 [PORTFOLIO-RENDER-${requestId}] Templates App response status: ${response.status}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`❌ [PORTFOLIO-RENDER-${requestId}] Templates App error: ${response.status} - ${errorText}`);
			
			// Return a fallback HTML page if templates app is not available
			const fallbackHtml = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Portfolio Preview</title>
					<style>
						body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
						.container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
						.error { color: #e74c3c; text-align: center; }
						.info { color: #7f8c8d; text-align: center; margin-top: 20px; }
						.template-info { background: #ecf0f1; padding: 20px; border-radius: 4px; margin: 20px 0; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="error">
							<h1>🚧 Templates App Unavailable</h1>
							<p>The templates service is currently unavailable. Please try again later.</p>
						</div>
						<div class="template-info">
							<h3>Request Details:</h3>
							<p><strong>Template ID:</strong> ${templatesAppData.templateId || 'N/A'}</p>
							<p><strong>Username:</strong> ${templatesAppData.username || 'N/A'}</p>
							<p><strong>Preview Mode:</strong> ${templatesAppData.options?.draft ? 'Yes' : 'No'}</p>
							<p><strong>Error:</strong> ${response.status} - ${errorText}</p>
						</div>
						<div class="info">
							<p>This is a fallback page. The templates app needs to be deployed and configured.</p>
						</div>
					</div>
				</body>
				</html>
			`;
			
			console.log(`🔄 [PORTFOLIO-RENDER-${requestId}] Returning fallback HTML`);
			return new Response(fallbackHtml, {
				headers: {
					'Content-Type': 'text/html',
					'Cache-Control': 'no-cache'
				}
			});
		}

		// Return the response from templates app
		const result = await response.text();
		console.log(`✅ [PORTFOLIO-RENDER-${requestId}] Successfully rendered portfolio (${result.length} characters)`);
		
		return new Response(result, {
			headers: {
				'Content-Type': 'text/html',
				'Cache-Control': 'public, s-maxage=300',
				'ETag': response.headers.get('ETag') || `"${Date.now()}"`
			}
		});

	} catch (error) {
		console.error(`❌ [PORTFOLIO-RENDER-${requestId}] Portfolio render error:`, error);
		
		// Return error HTML page
		const errorHtml = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Portfolio Error</title>
				<style>
					body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
					.container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
					.error { color: #e74c3c; text-align: center; }
					.info { color: #7f8c8d; text-align: center; margin-top: 20px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="error">
						<h1>❌ Portfolio Render Error</h1>
						<p>An error occurred while rendering the portfolio.</p>
						<p><strong>Error:</strong> ${error.message}</p>
					</div>
					<div class="info">
						<p>Please check the console logs for more details.</p>
					</div>
				</div>
			</body>
			</html>
		`;
		
		return new Response(errorHtml, {
			headers: {
				'Content-Type': 'text/html',
				'Cache-Control': 'no-cache'
			}
		});
	}
}