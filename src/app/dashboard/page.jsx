"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLayoutStore } from "@/store/layoutStore";
import ExportButton from "@/components/ExportButton";

export default function Dashboard() {
	const [user, setUser] = useState(null);
	const [dashboardData, setDashboardData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("overview");
	const router = useRouter();
	const { setAllContent, setParsedData, setResumeId } = useLayoutStore();

	useEffect(() => {
		async function fetchData() {
			try {
				// Fetch user data
				const userRes = await fetch("/api/auth/me");
				if (!userRes.ok) {
					router.push("/auth/signin");
					return;
				}
				const userData = await userRes.json();
				setUser(userData.user);

				// Fetch dashboard data
				const dashboardRes = await fetch("/api/user/dashboard");
				if (dashboardRes.ok) {
					const dashboardData = await dashboardRes.json();
					setDashboardData(dashboardData.data);
				}
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				router.push("/auth/signin");
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
						className="w-16 h-16 border-4 border-muted border-t-primary rounded-full mx-auto mb-4"
					></motion.div>
					<p className="text-muted-foreground">Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	if (!user) return null;

	const { resumes, portfolios } = dashboardData || { resumes: { list: [], stats: {} }, portfolios: { list: [], stats: {} } };

	async function handleResumeClick(resume) {
		if (resume.status !== "parsed") {
			alert("This resume is not yet parsed and cannot be loaded.");
			return;
		}
		try {
			const res = await fetch(`/api/resume/${resume._id}`);
			if (!res.ok) throw new Error("Failed to fetch resume data");
			const data = await res.json();
			if (!data.resume || !data.resume.parsedData) throw new Error("No parsed data found");
			setAllContent(data.resume.parsedData);
			setParsedData(data.resume.parsedData);
			setResumeId(resume._id);
			router.push("/editor/edit-resume");
		} catch (err) {
			alert("Error loading resume: " + err.message);
		}
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-foreground">
								Welcome back, {user.name}! 👋
							</h1>
							<p className="text-muted-foreground mt-1">
								Manage your resumes and portfolios
							</p>
						</div>
						<Link
							href="/editor"
							className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
						>
							Create Portfolio
						</Link>
					</div>
				</motion.div>

				{/* Stats Grid */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
				>
					<div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Portfolios</p>
								<p className="text-3xl font-bold text-foreground">{portfolios.stats.total}</p>
							</div>
							<div className="p-3 bg-accent rounded-xl">
								<svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Uploaded Resumes</p>
								<p className="text-3xl font-bold text-foreground">{resumes.stats.total}</p>
							</div>
							<div className="p-3 bg-accent rounded-xl">
								<svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Published</p>
								<p className="text-3xl font-bold text-foreground">{portfolios.stats.public}</p>
							</div>
							<div className="p-3 bg-accent rounded-xl">
								<svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Complete</p>
								<p className="text-3xl font-bold text-foreground">{portfolios.stats.complete}</p>
							</div>
							<div className="p-3 bg-accent rounded-xl">
								<svg className="w-6 h-6 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Tab Navigation */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="flex mb-8 border-b border-border"
				>
					<button
						className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
							activeTab === "overview"
								? "text-primary border-b-2 border-primary bg-accent"
								: "text-muted-foreground hover:text-foreground hover:bg-accent"
						}`}
						onClick={() => setActiveTab("overview")}
					>
						📊 Overview
					</button>
					<button
						className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
							activeTab === "resumes"
								? "text-primary border-b-2 border-primary bg-accent"
								: "text-muted-foreground hover:text-foreground hover:bg-accent"
						}`}
						onClick={() => setActiveTab("resumes")}
					>
						📄 Resumes ({resumes.stats.total})
					</button>
					<button
						className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
							activeTab === "portfolios"
								? "text-primary border-b-2 border-primary bg-accent"
								: "text-muted-foreground hover:text-foreground hover:bg-accent"
						}`}
						onClick={() => setActiveTab("portfolios")}
					>
						🎨 Portfolios ({portfolios.stats.total})
					</button>
				</motion.div>

				{/* Tab Content */}
				<AnimatePresence mode="wait">
					{activeTab === "overview" && (
						<motion.div
							key="overview"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3 }}
							className="grid grid-cols-1 lg:grid-cols-3 gap-8"
						>
							{/* Quick Actions */}
							<div className="lg:col-span-1">
								<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
									<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
									<div className="space-y-4">
										<Link
											href="/editor"
											className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-300 group"
										>
											<div className="p-2 bg-blue-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
												</svg>
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 dark:text-white">Create New Portfolio</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">Start building your portfolio</p>
											</div>
										</Link>

										<Link
											href="/editor"
											className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-300 group"
										>
											<div className="p-2 bg-green-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
												</svg>
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 dark:text-white">Upload Resume</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">Auto-generate from resume</p>
											</div>
										</Link>

										<Link
											href="/editor/customize"
											className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300 group"
										>
											<div className="p-2 bg-purple-500 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300">
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4" />
												</svg>
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 dark:text-white">Browse Templates</h3>
												<p className="text-sm text-gray-600 dark:text-gray-400">Explore beautiful designs</p>
											</div>
										</Link>
									</div>
								</div>
							</div>

							{/* Recent Activity */}
							<div className="lg:col-span-2">
								<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
									<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
									
									{portfolios.list.length > 0 || resumes.list.length > 0 ? (
										<div className="space-y-4">
											{/* Recent Portfolios */}
											{portfolios.list.slice(0, 3).map((portfolio, index) => (
												<motion.div
													key={portfolio._id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: index * 0.1 }}
													className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
												>
													<div className="flex items-center">
														<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
															<span className="text-white font-semibold">
																{portfolio.portfolioData?.personal?.firstName?.[0] || 'P'}
															</span>
														</div>
														<div>
															<h3 className="font-semibold text-gray-900 dark:text-white">
																{portfolio.portfolioData?.personal?.firstName} {portfolio.portfolioData?.personal?.lastName} Portfolio
															</h3>
															<p className="text-sm text-gray-600 dark:text-gray-400">
																{portfolio.portfolioType} • {portfolio.completeness}% complete
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<span className={`px-2 py-1 text-xs font-medium rounded-lg ${
															portfolio.isPublic 
																? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
																: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
														}`}>
															{portfolio.isPublic ? 'Published' : 'Draft'}
														</span>
														<Link
															href={portfolio.portfolioUrl}
															target="_blank"
															className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
														>
															<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
															</svg>
														</Link>
													</div>
												</motion.div>
											))}

											{/* Recent Resumes */}
											{resumes.list.slice(0, 2).map((resume, index) => (
												<motion.div
													key={resume._id}
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: (index + 3) * 0.1 }}
													className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer"
													onClick={() => handleResumeClick(resume)}
												>
													<div className="flex items-center">
														<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
															<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
															</svg>
														</div>
														<div>
															<h3 className="font-semibold text-gray-900 dark:text-white">{resume.originalName}</h3>
															<p className="text-sm text-gray-600 dark:text-gray-400">
																{(resume.fileSize / 1024).toFixed(1)} KB • {resume.status}
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-2">
														<span className={`px-2 py-1 text-xs font-medium rounded-lg ${
															resume.status === 'parsed' 
																? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
																: resume.status === 'processing'
																? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
																: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
														}`}>
															{resume.status}
														</span>
													</div>
												</motion.div>
											))}
										</div>
									) : (
										<div className="text-center py-8">
											<svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
											</svg>
											<p className="text-gray-600 dark:text-gray-400 mb-4">No activity yet. Start by creating your first portfolio!</p>
											<Link
												href="/editor"
												className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
											>
												<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
												</svg>
												Create Portfolio
											</Link>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					)}

					{activeTab === "resumes" && (
						<motion.div
							key="resumes"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3 }}
							className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
						>
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Resumes</h2>
								<Link
									href="/editor"
									className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
								>
									Upload New
								</Link>
							</div>
							
							{resumes.list.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{resumes.list.map((resume, index) => (
										<motion.div
											key={resume._id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1 }}
											className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
										>
											<div className="flex items-center mb-4">
												<div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
													<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
													</svg>
												</div>
												<div className="flex-1">
													<h3 className="font-semibold text-gray-900 dark:text-white truncate">{resume.originalName}</h3>
													<p className="text-sm text-gray-600 dark:text-gray-400">
														{(resume.fileSize / 1024).toFixed(1)} KB
													</p>
												</div>
											</div>
											
											<div className="space-y-2 mb-4">
												<div className="flex items-center justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
													<span className={`px-2 py-1 text-xs font-medium rounded-lg ${
														resume.status === 'parsed' 
															? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
															: resume.status === 'processing'
															? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
															: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
													}`}>
														{resume.status}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">Portfolio:</span>
													<span className={`px-2 py-1 text-xs font-medium rounded-lg ${
														resume.portfolioId 
															? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
															: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
													}`}>
														{resume.portfolioId ? 'Created' : 'Not used'}
													</span>
												</div>
											</div>
											
											<div className="text-xs text-gray-500 dark:text-gray-400">
												Uploaded {new Date(resume.createdAt).toLocaleDateString()}
											</div>
										</motion.div>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<p className="text-gray-600 dark:text-gray-400 mb-4">No resumes uploaded yet</p>
									<Link
										href="/editor"
										className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
									>
										Upload Resume
									</Link>
								</div>
							)}
						</motion.div>
					)}

					{activeTab === "portfolios" && (
						<motion.div
							key="portfolios"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3 }}
							className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
						>
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Portfolios</h2>
								<Link
									href="/editor"
									className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
								>
									Create New
								</Link>
							</div>
							
							{portfolios.list.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{portfolios.list.map((portfolio, index) => (
										<motion.div
											key={portfolio._id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1 }}
											className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300"
										>
											<div className="flex items-center mb-4">
												<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
													<span className="text-white font-semibold">
														{portfolio.portfolioData?.personal?.firstName?.[0] || 'P'}
													</span>
												</div>
												<div className="flex-1">
													<h3 className="font-semibold text-gray-900 dark:text-white">
														{portfolio.portfolioData?.personal?.firstName} {portfolio.portfolioData?.personal?.lastName}
													</h3>
													<p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
														{portfolio.portfolioType} Portfolio
													</p>
												</div>
											</div>
											
											<div className="space-y-2 mb-4">
												<div className="flex items-center justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">Completeness:</span>
													<span className={`px-2 py-1 text-xs font-medium rounded-lg ${
														portfolio.completeness >= 80 
															? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
															: portfolio.completeness >= 50
															? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
															: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
													}`}>
														{portfolio.completeness}%
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
													<span className={`px-2 py-1 text-xs font-medium rounded-lg ${
														portfolio.isPublic 
															? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
															: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
													}`}>
														{portfolio.isPublic ? 'Published' : 'Draft'}
													</span>
												</div>
											</div>
											
											<div className="flex items-center justify-between">
												<div className="text-xs text-gray-500 dark:text-gray-400">
													Updated {new Date(portfolio.updatedAt).toLocaleDateString()}
												</div>
												<div className="flex items-center space-x-2">
													<ExportButton
														portfolioId={portfolio._id}
														username={portfolio.username}
														className="p-2 text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
													/>
													<Link
														href={portfolio.portfolioUrl}
														target="_blank"
														className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
														title="View Portfolio"
													>
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
														</svg>
													</Link>
													<Link
														href={`/editor/customize?portfolioId=${portfolio._id}&username=${portfolio.username}`}
														className="p-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
														title="Edit Portfolio"
													>
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
														</svg>
													</Link>
													<Link
														href={`/templates-demo?portfolioId=${portfolio._id}&username=${portfolio.username}`}
														className="p-2 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
														title="Change Template"
													>
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v.01" />
														</svg>
													</Link>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
									</svg>
									<p className="text-gray-600 dark:text-gray-400 mb-4">No portfolios created yet</p>
									<Link
										href="/editor"
										className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
									>
										Create Portfolio
									</Link>
								</div>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
