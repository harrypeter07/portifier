"use client";
import React, { useEffect, useState } from "react";
import { FlickeringGrid } from "@/components/backgrounds/FlickeringGrid";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
	BarChart, 
	Bar, 
	XAxis, 
	YAxis, 
	CartesianGrid, 
	Tooltip, 
	ResponsiveContainer,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function PortfolioDashboardPage({ params }) {
	const { username } = React.use(params);
	const router = useRouter();
	const [portfolio, setPortfolio] = useState(null);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [timeRange, setTimeRange] = useState('7d');
	const [slug, setSlug] = useState('');
	const [slugStatus, setSlugStatus] = useState("");

	useEffect(() => {
		async function fetchPortfolioAndStats() {
			try {
				await fetch(`/api/portfolio/${username}/views`, {
					method: 'POST'
				});

				const portfolioRes = await fetch(`/api/portfolio/${username}`);
				const portfolioData = await portfolioRes.json();
				
				if (!portfolioRes.ok) {
					setError(portfolioData.error || "Portfolio not found");
					return;
				}

				setPortfolio(portfolioData.portfolio);
				setSlug(portfolioData.portfolio?.username || username);

				const statsRes = await fetch(`/api/portfolio/${username}/views?range=${timeRange}`);
				const statsData = await statsRes.json();
				
				if (statsRes.ok) {
					setStats(statsData.stats);
				}

			} catch (err) {
				setError("Failed to load portfolio dashboard");
			} finally {
				setLoading(false);
			}
		}

		if (username) {
			fetchPortfolioAndStats();
		}
	}, [username, timeRange]);

	if (loading) {
		return (
			<div className="overflow-hidden relative min-h-screen bg-white dark:bg-gray-950">
				{/* FlickeringGrid Background */}
				<div className="fixed inset-0 z-0">
					<FlickeringGrid
						className="w-full h-full"
						squareSize={4}
						gridGap={6}
						color="#60A5FA"
						maxOpacity={0.3}
						flickerChance={0.3}
					/>
				</div>
				
				<div className="flex relative z-10 justify-center items-center min-h-screen">
					<div className="text-center">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
							className="mx-auto mb-4 w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600"
						/>
						<p className="text-sm text-gray-600 dark:text-gray-400">Loading portfolio analytics...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="overflow-hidden relative min-h-screen bg-white dark:bg-gray-950">
				<div className="fixed inset-0 z-0">
					<FlickeringGrid
						className="w-full h-full"
						squareSize={4}
						gridGap={6}
						color="#60A5FA"
						maxOpacity={0.3}
						flickerChance={0.3}
					/>
				</div>
				
				<div className="flex relative z-10 justify-center items-center px-4 min-h-screen">
					<div className="text-center">
						<div className="mb-4 text-5xl text-red-600">⚠️</div>
						<h1 className="mb-2 text-xl font-bold text-gray-900 md:text-2xl dark:text-white">Portfolio Not Found</h1>
						<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{error}</p>
						<button
							onClick={() => router.push('/dashboard')}
							className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
						>
							Back to Dashboard
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="overflow-hidden relative min-h-screen bg-white dark:bg-gray-950">
			{/* FlickeringGrid Background - Fixed position */}
			<div className="fixed inset-0 z-0">
				<FlickeringGrid
					className="w-full h-full"
					squareSize={4}
					gridGap={6}
					color="#60A5FA"
					maxOpacity={0.3}
					flickerChance={0.3}
				/>
			</div>
			
			{/* Content wrapper with higher z-index */}
			<div className="relative z-10">
				{/* Header */}
				<div className="border-b shadow-sm backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
					<div className="px-4 py-4 mx-auto max-w-7xl md:py-6">
						<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<div>
								<h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
									📊 Portfolio Analytics
								</h1>
								<p className="mt-1 text-xs text-gray-600 md:text-sm dark:text-gray-400">
									{portfolio?.portfolioData?.personal?.firstName} {portfolio?.portfolioData?.personal?.lastName}'s Portfolio Performance
								</p>
							</div>
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
								<select
									value={timeRange}
									onChange={(e) => setTimeRange(e.target.value)}
									className="px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
								>
									<option value="7d">Last 7 days</option>
									<option value="30d">Last 30 days</option>
									<option value="90d">Last 90 days</option>
								</select>
								
								<div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg dark:bg-gray-800">
									<span className="text-xs text-gray-600 dark:text-gray-400">🔗</span>
									<a 
										href={`/${portfolio?.username || username}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
									>
										View Portfolio
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Template Information Section */}
				{portfolio && (
					<div className="backdrop-blur-sm bg-blue-50/80 dark:bg-blue-900/20">
						<div className="px-4 py-3 mx-auto max-w-7xl md:py-4">
							<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
								<div className="flex items-start space-x-3">
									<span className="text-xl md:text-2xl">🎨</span>
									<div>
										<h3 className="text-sm font-semibold text-gray-900 md:text-base dark:text-white">
											{portfolio.currentTemplate?.name || portfolio.templateName || portfolio.templateId || "Default"}
										</h3>
										<div className="flex flex-wrap gap-y-1 gap-x-3 items-center text-xs text-gray-600 dark:text-gray-400">
											<span>ID: {portfolio.templateId || "cleanfolio"}</span>
											<span className="hidden sm:inline">•</span>
											<span>Type: {portfolio.templateType || "component"}</span>
											<span className="hidden sm:inline">•</span>
											<span>Category: {portfolio.portfolioType || "developer"}</span>
										</div>
									</div>
								</div>
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
									<button
										onClick={() => router.push('/templates-demo')}
										className="px-3 py-1.5 text-xs font-medium text-purple-600 transition-colors bg-white border border-purple-200 rounded-lg dark:bg-gray-800 dark:text-purple-400 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30"
									>
										🔄 Change Template
									</button>
									<button
										onClick={() => router.push('/editor/customize')}
										className="px-3 py-1.5 text-xs font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
									>
										✏️ Customize
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* URL / Slug Management */}
				{portfolio && (
					<div className="px-4 py-4 mx-auto max-w-7xl md:py-6">
						<div className="p-4 rounded-xl border shadow-sm backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
							<h3 className="mb-3 text-sm font-semibold text-gray-900 md:text-base dark:text-white">Public URL</h3>
							<div className="flex flex-col gap-2 md:flex-row md:items-end">
								<div className="flex-1">
									<label className="block mb-1 text-xs text-gray-700 md:text-sm dark:text-gray-300">Slug</label>
									<input
										value={slug}
										onChange={(e) => setSlug(e.target.value.trim())}
										className="px-3 py-2 w-full text-sm text-gray-900 bg-white rounded-md border dark:bg-gray-800 dark:text-white"
										placeholder="your-portfolio-url"
									/>
									<p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
										Preview: {typeof window !== 'undefined' ? `${window.location.origin}/${slug || username}` : `/${slug || username}`}
									</p>
								</div>
								<button
									onClick={async () => {
										setSlugStatus("Checking...");
										try {
											const r = await fetch("/api/portfolio/check-slug", {
												method: "POST",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({ slug }),
											});
											const j = await r.json();
											if (!j?.available) {
												setSlugStatus("This URL is taken. Try another.");
												return;
											}

											setSlugStatus("Saving...");
											const save = await fetch("/api/portfolio/save", {
												method: "POST",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({
													username: slug,
													layout: portfolio.layout,
													portfolioData: portfolio.portfolioData,
													currentTemplate: portfolio.currentTemplate,
													templateId: portfolio.templateId,
													templateType: portfolio.templateType,
													isNewPortfolio: false,
												}),
											});
											if (save.ok) {
												setSlugStatus("Saved! Your portfolio is now at /" + slug);
											} else {
												setSlugStatus("Failed to save. Try again.");
											}
										} catch (e) {
											setSlugStatus("Network error. Try again.");
										}
									}}
									className="px-4 py-2 text-xs text-white whitespace-nowrap bg-blue-600 rounded-md transition-colors md:text-sm hover:bg-blue-700"
								>
									Check & Save
								</button>
							</div>
							{slugStatus && <p className="mt-2 text-xs text-gray-700 md:text-sm dark:text-gray-300">{slugStatus}</p>}
						</div>
					</div>
				)}

				{/* Main Content */}
				<div className="px-4 py-4 mx-auto max-w-7xl md:py-8">
					{/* Overview Stats - Compact cards */}
					<div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4 md:gap-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Views</p>
									<p className="mt-1 text-xl font-bold text-gray-900 truncate md:text-2xl dark:text-white">
										{stats?.totalViews || portfolio?.views || 0}
									</p>
								</div>
								<div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-blue-100 rounded-lg md:w-10 md:h-10 dark:bg-blue-900/30">
									<svg className="w-4 h-4 text-blue-600 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-gray-600 dark:text-gray-400">Unique Visitors</p>
									<p className="mt-1 text-xl font-bold text-gray-900 truncate md:text-2xl dark:text-white">
										{stats?.uniqueVisitors || 0}
									</p>
								</div>
								<div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-green-100 rounded-lg md:w-10 md:h-10 dark:bg-green-900/30">
									<svg className="w-4 h-4 text-green-600 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
									</svg>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-gray-600 dark:text-gray-400">Avg. Time</p>
									<p className="mt-1 text-xl font-bold text-gray-900 truncate md:text-2xl dark:text-white">
										{stats?.avgTimeOnPage ? `${Math.round(stats.avgTimeOnPage / 60)}m` : '0m'}
									</p>
								</div>
								<div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-yellow-100 rounded-lg md:w-10 md:h-10 dark:bg-yellow-900/30">
									<svg className="w-4 h-4 text-yellow-600 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80"
						>
							<div className="flex justify-between items-start">
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-gray-600 dark:text-gray-400">Bounce Rate</p>
									<p className="mt-1 text-xl font-bold text-gray-900 truncate md:text-2xl dark:text-white">
										{stats?.bounceRate ? `${Math.round(stats.bounceRate)}%` : '0%'}
									</p>
								</div>
								<div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-red-100 rounded-lg md:w-10 md:h-10 dark:bg-red-900/30">
									<svg className="w-4 h-4 text-red-600 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
									</svg>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Charts Grid */}
					<div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2 md:gap-6">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 md:p-6"
						>
							<h3 className="mb-3 text-sm font-semibold text-gray-900 md:text-base md:mb-4 dark:text-white">Views Over Time</h3>
							<ResponsiveContainer width="100%" height={250}>
								<LineChart data={stats?.viewsOverTime || []}>
									<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
									<XAxis 
										dataKey="date" 
										stroke="#6B7280"
										tick={{ fill: '#6B7280', fontSize: 12 }}
									/>
									<YAxis 
										stroke="#6B7280"
										tick={{ fill: '#6B7280', fontSize: 12 }}
									/>
									<Tooltip 
										contentStyle={{ 
											backgroundColor: '#1F2937', 
											border: 'none',
											borderRadius: '8px',
											color: '#F9FAFB',
											fontSize: '12px'
										}}
									/>
									<Line 
										type="monotone" 
										dataKey="views" 
										stroke="#3B82F6" 
										strokeWidth={2}
										dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 md:p-6"
						>
							<h3 className="mb-3 text-sm font-semibold text-gray-900 md:text-base md:mb-4 dark:text-white">Traffic Sources</h3>
							<ResponsiveContainer width="100%" height={250}>
								<PieChart>
									<Pie
										data={stats?.trafficSources || []}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
										outerRadius={70}
										fill="#8884d8"
										dataKey="value"
									>
										{(stats?.trafficSources || []).map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip 
										contentStyle={{ 
											backgroundColor: '#1F2937', 
											border: 'none',
											borderRadius: '8px',
											color: '#F9FAFB',
											fontSize: '12px'
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</motion.div>
					</div>

					{/* Additional Analytics */}
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-6">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 md:p-6"
						>
							<h3 className="mb-3 text-sm font-semibold text-gray-900 md:text-base md:mb-4 dark:text-white">Top Referrers</h3>
							<div className="space-y-2">
								{(stats?.trafficSources || []).slice(0, 5).map((referrer, index) => (
									<div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg md:p-3 dark:bg-gray-800">
										<div className="flex flex-1 items-center space-x-2 min-w-0 md:space-x-3">
											<span className="text-xs font-medium text-gray-900 md:text-sm dark:text-white">
												{index + 1}
											</span>
											<span className="text-xs text-gray-600 truncate md:text-sm dark:text-gray-300">
												{referrer.name}
											</span>
										</div>
										<span className="text-xs font-semibold text-gray-900 md:text-sm dark:text-white">
											{referrer.value}
										</span>
									</div>
								))}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 md:p-6"
						>
							<h3 className="mb-3 text-sm font-semibold text-gray-900 md:text-base md:mb-4 dark:text-white">Device Types</h3>
							<ResponsiveContainer width="100%" height={200}>
								<BarChart data={stats?.deviceTypes || []}>
									<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
									<XAxis 
										dataKey="device" 
										stroke="#6B7280"
										tick={{ fill: '#6B7280', fontSize: 12 }}
									/>
									<YAxis 
										stroke="#6B7280"
										tick={{ fill: '#6B7280', fontSize: 12 }}
									/>
									<Tooltip 
										contentStyle={{ 
											backgroundColor: '#1F2937', 
											border: 'none',
											borderRadius: '8px',
											color: '#F9FAFB',
											fontSize: '12px'
										}}
									/>
									<Bar dataKey="visits" fill="#3B82F6" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}