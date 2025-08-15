"use client";
import React, { useEffect, useState } from "react";
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
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
							className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
						></motion.div>
						<p className="text-gray-600 dark:text-gray-400">Loading portfolio analytics...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="text-red-600 text-6xl mb-4">⚠️</div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Portfolio Not Found</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
						<button
							onClick={() => router.push('/dashboard')}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
						>
							Back to Dashboard
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Header */}
			<div className="bg-white dark:bg-gray-900 shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								📊 Portfolio Analytics
							</h1>
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								{portfolio?.portfolioData?.personal?.firstName} {portfolio?.portfolioData?.personal?.lastName}'s Portfolio Performance
							</p>
						</div>
						<div className="flex items-center gap-4">
							{/* Time Range Selector */}
							<select
								value={timeRange}
								onChange={(e) => setTimeRange(e.target.value)}
								className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
							>
								<option value="7d">Last 7 days</option>
								<option value="30d">Last 30 days</option>
								<option value="90d">Last 90 days</option>
							</select>
							
							{/* Portfolio URL */}
							<div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
								<span className="text-sm text-gray-600 dark:text-gray-400">🔗</span>
								<a 
									href={`/${username}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
								>
									View Portfolio
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Overview Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{stats?.totalViews || portfolio?.views || 0}
								</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
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
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{stats?.uniqueVisitors || 0}
								</p>
							</div>
							<div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
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
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Time on Page</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{stats?.avgTimeOnPage ? `${Math.round(stats.avgTimeOnPage / 60)}m ${stats.avgTimeOnPage % 60}s` : '0m 0s'}
								</p>
							</div>
							<div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
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
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bounce Rate</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">
									{stats?.bounceRate ? `${Math.round(stats.bounceRate)}%` : '0%'}
								</p>
							</div>
							<div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
								<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
								</svg>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Charts Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					{/* Views Over Time */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Views Over Time</h3>
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
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Traffic Sources</h3>
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
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Top Referrers */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Referrers</h3>
						<div className="space-y-3">
							{(stats?.trafficSources || []).slice(0, 5).map((referrer, index) => (
								<div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
									<div className="flex items-center space-x-3">
										<span className="text-sm font-medium text-gray-900 dark:text-white">
											{index + 1}
										</span>
										<span className="text-sm text-gray-600 dark:text-gray-300 truncate">
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
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Types</h3>
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
