import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";

export async function DELETE(request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		const { portfolioId, username, confirmationText } = await request.json();

		// Validate required fields
		if (!portfolioId || !username || !confirmationText) {
			return NextResponse.json({ 
				success: false, 
				error: "Missing required fields: portfolioId, username, and confirmationText" 
			}, { status: 400 });
		}

		// Validate confirmation text
		const expectedConfirmation = `delete my portfolio`;
		if (confirmationText.toLowerCase().trim() !== expectedConfirmation) {
			return NextResponse.json({ 
				success: false, 
				error: "Confirmation text does not match. Please type 'delete my portfolio' exactly." 
			}, { status: 400 });
		}

		await connectDB();

		// Find the portfolio and verify ownership
		const portfolio = await Portfolio.findOne({
			_id: portfolioId,
			userId: session.user.id
		});

		if (!portfolio) {
			return NextResponse.json({ 
				success: false, 
				error: "Portfolio not found or you don't have permission to delete it" 
			}, { status: 404 });
		}

		// Verify username matches
		if (portfolio.username !== username) {
			return NextResponse.json({ 
				success: false, 
				error: "Username does not match the portfolio" 
			}, { status: 400 });
		}

		// Delete the portfolio
		await Portfolio.findByIdAndDelete(portfolioId);

		// Update user's username if it matches the deleted portfolio's username
		// This ensures the username becomes available for reuse
		const user = await User.findById(session.user.id);
		if (user && user.username === username) {
			// Clear the username to make it available for reuse
			user.username = null;
			await user.save();
		}

		// TODO: Clean up any other related data (analytics, views, etc.)
		// This could include:
		// - Analytics data
		// - View tracking data
		// - Any cached data
		// - File uploads associated with this portfolio

		return NextResponse.json({ 
			success: true, 
			message: "Portfolio deleted successfully" 
		});

	} catch (error) {
		console.error("Error deleting portfolio:", error);
		return NextResponse.json({ 
			success: false, 
			error: "Internal server error" 
		}, { status: 500 });
	}
}
