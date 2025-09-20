import { NextResponse } from "next/server";
import { getTemplatesApiKey } from "@/lib/serviceJwt";

// Simplified Architecture: Main App just proxies requests to Templates App
// Templates App handles all database operations and rendering logic

export async function POST(request) {
	const requestId = Math.random().toString(36).substr(2, 9);
	
	try {
		const requestData = await request.json();
		console.log(`🔍 [RENDER-PORTFOLIO-${requestId}] Starting render request`);
		console.log(`🔍 [RENDER-PORTFOLIO-${requestId}] Request data:`, {
			username: requestData.username,
			templateId: requestData.templateId,
			preview: requestData.preview,
			sampleData: requestData.sampleData,
			hasPortfolioData: !!requestData.portfolioData
		});
		
		// Get API Key for templates app
		const apiKey = getTemplatesApiKey();
		const templatesAppUrl = process.env.TEMPLATES_BASE_URL || process.env.TEMPLATES_APP_URL || "https://portumet.vercel.app";
		
		console.log(`🔍 [RENDER-PORTFOLIO-${requestId}] Templates app URL: ${templatesAppUrl}`);
		console.log(`🔍 [RENDER-PORTFOLIO-${requestId}] API Key: ${apiKey ? 'Present' : 'Missing'}`);

		// Call Templates App - it will handle all database operations
		const response = await fetch(`${templatesAppUrl}/api/render-portfolio`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestData),
			timeout: 30000 // 30 second timeout for rendering
		});

		console.log(`🔍 [RENDER-PORTFOLIO-${requestId}] Response status: ${response.status}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`❌ [RENDER-PORTFOLIO-${requestId}] Templates App error: ${response.status} - ${errorText}`);
			
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
							<p><strong>Template ID:</strong> ${requestData.templateId || 'N/A'}</p>
							<p><strong>Username:</strong> ${requestData.username || 'N/A'}</p>
							<p><strong>Preview Mode:</strong> ${requestData.preview ? 'Yes' : 'No'}</p>
							<p><strong>Error:</strong> ${response.status} - ${errorText}</p>
						</div>
						<div class="info">
							<p>This is a fallback page. The templates app needs to be deployed and configured.</p>
						</div>
					</div>
				</body>
				</html>
			`;
			
			console.log(`🔄 [RENDER-PORTFOLIO-${requestId}] Returning fallback HTML`);
			return new Response(fallbackHtml, {
				headers: {
					'Content-Type': 'text/html',
					'Cache-Control': 'no-cache'
				}
			});
		}

		// Return the response from templates app
		const result = await response.text();
		console.log(`✅ [RENDER-PORTFOLIO-${requestId}] Successfully rendered portfolio (${result.length} characters)`);
		
		return new Response(result, {
			headers: {
				'Content-Type': 'text/html',
				'Cache-Control': 'public, s-maxage=300',
				'ETag': response.headers.get('ETag') || `"${Date.now()}"`
			}
		});

	} catch (error) {
		console.error(`❌ [RENDER-PORTFOLIO-${requestId}] Render portfolio error:`, error);
		
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

// Also support GET for direct portfolio rendering
export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const username = searchParams.get('username');
	
	if (!username) {
		return NextResponse.json(
			{ error: "Username parameter is required" },
			{ status: 400 }
		);
	}

	// Use POST logic
	const postRequest = new Request(request.url, {
		method: 'POST',
		headers: request.headers,
		body: JSON.stringify({ username })
	});

	return POST(postRequest);
}