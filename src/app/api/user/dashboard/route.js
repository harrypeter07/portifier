import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Resume from "@/models/Resume";
import Portfolio from "@/models/Portfolio";

export async function GET(req) {
	try {
		await dbConnect();
		
		// Get authenticated user
		const user = await auth();
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Fetch user's resumes
		const resumes = await Resume.find({ userId: user._id })
			.sort({ createdAt: -1 })
			.select('originalName fileSize fileType status parsedData portfolioId createdAt')
			.lean();

		// Fetch user's portfolios
		const portfolios = await Portfolio.find({ userId: user._id })
			.sort({ updatedAt: -1 })
			.select('username slug templateName portfolioType layout portfolioData isPublic createdAt updatedAt')
			.lean();

		// Calculate portfolio completeness
		const portfoliosWithCompleteness = portfolios.map(portfolio => {
			const data = portfolio.portfolioData;
			const sections = [
				{ section: 'personal', weight: 20, complete: !!(data.personal?.firstName && data.personal?.lastName && data.personal?.email) },
				{ section: 'about', weight: 15, complete: !!(data.about?.summary) },
				{ section: 'experience', weight: 20, complete: !!(data.experience?.jobs && data.experience.jobs.length > 0) },
				{ section: 'skills', weight: 15, complete: !!(data.skills?.technical && data.skills.technical.length > 0) },
				{ section: 'projects', weight: 20, complete: !!(data.projects?.items && data.projects.items.length > 0) },
				{ section: 'contact', weight: 10, complete: !!(data.personal?.email || data.contact?.email) }
			];

			const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
			const completedWeight = sections.reduce((sum, s) => sum + (s.complete ? s.weight : 0), 0);
			const completeness = Math.round((completedWeight / totalWeight) * 100);

			return {
				...portfolio,
				completeness,
				portfolioUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${portfolio.username}`
			};
		});

		// Group resumes by status
		const resumeStats = {
			total: resumes.length,
			parsed: resumes.filter(r => r.status === 'parsed').length,
			processing: resumes.filter(r => r.status === 'processing').length,
			failed: resumes.filter(r => r.status === 'failed').length,
			withPortfolio: resumes.filter(r => r.portfolioId).length
		};

		// Group portfolios by status
		const portfolioStats = {
			total: portfolios.length,
			public: portfolios.filter(p => p.isPublic).length,
			private: portfolios.filter(p => !p.isPublic).length,
			complete: portfoliosWithCompleteness.filter(p => p.completeness >= 80).length,
			incomplete: portfoliosWithCompleteness.filter(p => p.completeness < 80).length
		};

		return NextResponse.json({
			success: true,
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					username: user.username
				},
				resumes: {
					list: resumes,
					stats: resumeStats
				},
				portfolios: {
					list: portfoliosWithCompleteness,
					stats: portfolioStats
				}
			}
		});
	} catch (error) {
		console.error("❌ Error fetching dashboard data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch dashboard data" },
			{ status: 500 }
		);
	}
} 