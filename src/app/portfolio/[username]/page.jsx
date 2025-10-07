"use client";
import React, { useEffect, useState } from "react";
import AnalyticsGrid from "@/components/backgrounds/AnalyticsGrid";
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
	const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
	// URL/slug management
	const [slug, setSlug] = useState('');
	const [slugStatus, setSlugStatus] = useState("");

	useEffect(() => {
		async function fetchPortfolioAndStats() {
			try {
				// Track view first
				await fetch(`/api/portfolio/${username}/views`, {
					method: 'POST'
				});

				// Fetch portfolio data
				const portfolioRes = await fetch(`/api/portfolio/${username}`);
				const portfolioData = await portfolioRes.json();
				
				if (!portfolioRes.ok) {
					setError(portfolioData.error || "Portfolio not found");
					return;
				}

				setPortfolio(portfolioData.portfolio);
				setSlug(portfolioData.portfolio?.username || username);

				// Fetch detailed stats
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
    <div className="overflow-hidden relative min-h-screen">
        {/* Background grid (custom) */}
        <AnalyticsGrid className="pointer-events-none" color="#60A5FA" />
				<div className="flex justify-center items-center min-h-screen">
					<div className="text-center">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
							className="mx-auto mb-4 w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600"
						></motion.div>
						<p className="text-gray-600 dark:text-gray-400">Loading portfolio analytics...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="overflow-hidden relative min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				{/* Background grid */}
            <AnalyticsGrid className="pointer-events-none" color="#60A5FA" />
				<div className="flex justify-center items-center min-h-screen">
					<div className="text-center">
						<div className="mb-4 text-6xl text-red-600">⚠️</div>
						<h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Portfolio Not Found</h1>
						<p className="mb-4 text-gray-600 dark:text-gray-400">{error}</p>
						<button
							onClick={() => router.push('/dashboard')}
							className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
						>
							Back to Dashboard
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="overflow-hidden relative min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Background grid */}
            <AnalyticsGrid className="pointer-events-none" color="#60A5FA" />
			{/* Header */}
			<div className="bg-white border-b shadow-sm dark:bg-gray-900">
				<div className="px-4 py-6 mx-auto max-w-7xl">
					<div className="flex flex-col gap-4 justify-between items-start md:flex-row md:items-center">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								📊 Portfolio Analytics
							</h1>
							<p className="mt-1 text-gray-600 dark:text-gray-400">
								{portfolio?.portfolioData?.personal?.firstName} {portfolio?.portfolioData?.personal?.lastName}'s Portfolio Performance
							</p>
						</div>
					<div className="flex gap-4 items-center">
							{/* Time Range Selector */}
							<select
								value={timeRange}
								onChange={(e) => setTimeRange(e.target.value)}
								className="px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							>
								<option value="7d">Last 7 days</option>
								<option value="30d">Last 30 days</option>
								<option value="90d">Last 90 days</option>
							</select>
							
						{/* Portfolio URL */}
						<div className="flex gap-2 items-center px-4 py-2 bg-gray-100 rounded-lg dark:bg-gray-800">
							<span className="text-sm text-gray-600 dark:text-gray-400">🔗</span>
							<a 
								href={`/${portfolio?.username || username}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
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
				<div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200 dark:from-purple-900/20 dark:to-blue-900/20 dark:border-purple-700">
					<div className="px-4 py-4 mx-auto max-w-7xl">
						<div className="flex flex-col gap-4 justify-between items-start md:flex-row md:items-center">
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<span className="text-2xl">🎨</span>
									<div>
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
											Current Template: {portfolio.currentTemplate?.name || portfolio.templateName || portfolio.templateId || "Default"}
										</h3>
										<div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
											<span>ID: {portfolio.templateId || portfolio.templateName || "cleanfolio"}</span>
											<span>•</span>
											<span>Type: {portfolio.templateType || "component"}</span>
											<span>•</span>
											<span>Category: {portfolio.portfolioType || "developer"}</span>
										</div>
									</div>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<button
									onClick={() => router.push('/templates-demo')}
									className="px-4 py-2 font-medium text-purple-600 bg-white rounded-lg border border-purple-200 transition-colors dark:bg-gray-800 dark:text-purple-400 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30"
								>
									🔄 Change Template
								</button>
								<button
									onClick={() => router.push('/editor/customize')}
									className="px-4 py-2 font-medium text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700"
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
				<div className="px-4 py-6 mx-auto max-w-7xl">
					<div className="p-4 bg-white rounded-xl border shadow-sm dark:bg-gray-900">
						<h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Public URL</h3>
						<div className="flex flex-col gap-3 items-start md:flex-row md:items-end">
							<div className="flex-1 w-full">
								<label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Slug</label>
								<input
									value={slug}
									onChange={(e) => setSlug(e.target.value.trim())}
									className="px-3 py-2 w-full text-gray-900 bg-white rounded-md border dark:bg-gray-800 dark:text-white"
									placeholder="your-portfolio-url"
								/>
								<p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Preview: {typeof window !== 'undefined' ? `${window.location.origin}/${slug || username}` : `/${slug || username}`}</p>
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
								className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
							>
								Check & Save
							</button>
						</div>
						{slugStatus && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{slugStatus}</p>}
					</div>
				</div>
			)}

			{/* Main Content */}
			<div className="px-4 py-8 mx-auto max-w-7xl">
				{/* Overview Stats */}
				<div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-900"
					>
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{stats?.totalViews || portfolio?.views || 0}
								</p>
							</div>
							<div className="flex justify-center items-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900/30">
								<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
						className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-900"
					>
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{stats?.uniqueVisitors || 0}
								</p>
							</div>
							<div className="flex justify-center items-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900/30">
								<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
								</svg>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-900"
					>
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Time on Page</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{stats?.avgTimeOnPage ? `${Math.round(stats.avgTimeOnPage / 60)}m ${stats.avgTimeOnPage % 60}s` : '0m 0s'}
								</p>
							</div>
							<div className="flex justify-center items-center w-12 h-12 bg-yellow-100 rounded-lg dark:bg-yellow-900/30">
								<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-900"
					>
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bounce Rate</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{stats?.bounceRate ? `${Math.round(stats.bounceRate)}%` : '0%'}
								</p>
							</div>
							<div className="flex justify-center items-center w-12 h-12 bg-red-100 rounded-lg dark:bg-red-900/30">
								<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
								</svg>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Charts Grid */}
				<div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
					{/* Views Over Time */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-900"
					>
						<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Views Over Time</h3>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={stats?.viewsOverTime || []}>
								<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
								<XAxis 
									dataKey="date" 
									stroke="#6B7280"
									tick={{ fill: '#6B7280' }}
								/>
								<YAxis 
									stroke="#6B7280"
									tick={{ fill: '#6B7280' }}
								/>
								<Tooltip 
									contentStyle={{ 
										backgroundColor: '#1F2937', 
										border: 'none',
										borderRadius: '8px',
										color: '#F9FAFB'
									}}
								/>
								<Line 
									type="monotone" 
									dataKey="views" 
									stroke="#3B82F6" 
									strokeWidth={2}
									dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</motion.div>

					{/* Traffic Sources */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-900"
					>
						<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Traffic Sources</h3>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={stats?.trafficSources || []}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
									outerRadius={80}
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
										color: '#F9FAFB'
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					</motion.div>
				</div>

				{/* Additional Analytics */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					{/* Top Referrers */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-900"
					>
						<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Top Referrers</h3>
						<div className="space-y-3">
							{(stats?.trafficSources || []).slice(0, 5).map((referrer, index) => (
								<div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
									<div className="flex items-center space-x-3">
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											{index + 1}
										</span>
										<span className="text-sm text-gray-600 truncate dark:text-gray-300">
											{referrer.name}
										</span>
									</div>
									<span className="text-sm font-semibold text-gray-900 dark:text-white">
										{referrer.value}
									</span>
								</div>
							))}
						</div>
					</motion.div>

					{/* Device Types */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="p-6 bg-white rounded-xl shadow-lg dark:bg-gray-900"
					>
						<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Device Types</h3>
						<ResponsiveContainer width="100%" height={200}>
							<BarChart data={stats?.deviceTypes || []}>
								<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
								<XAxis 
									dataKey="device" 
									stroke="#6B7280"
									tick={{ fill: '#6B7280' }}
								/>
								<YAxis 
									stroke="#6B7280"
									tick={{ fill: '#6B7280' }}
								/>
								<Tooltip 
									contentStyle={{ 
										backgroundColor: '#1F2937', 
										border: 'none',
										borderRadius: '8px',
										color: '#F9FAFB'
									}}
								/>
								<Bar dataKey="visits" fill="#3B82F6" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
