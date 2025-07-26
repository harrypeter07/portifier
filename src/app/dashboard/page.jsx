"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch("/api/auth/me");
				if (res.ok) {
					const data = await res.json();
					setUser(data.user);
				} else {
					router.push("/auth/signin");
				}
			} catch (error) {
				console.error("Error fetching user:", error);
				router.push("/auth/signin");
			} finally {
				setLoading(false);
			}
		}
		fetchUser();
	}, [router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
				</div>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								Welcome back, {user.name}! 👋
							</h1>
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								Here's what's happening with your portfolios today.
							</p>
						</div>
						<Link
							href="/editor"
							className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
						>
							Create Portfolio
						</Link>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Portfolios</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
							</div>
							<div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
								<svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Portfolio Views</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">1.2k</p>
							</div>
							<div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
								<svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Clicks</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">234</p>
							</div>
							<div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
								<svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
								</svg>
							</div>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated</p>
								<p className="text-3xl font-bold text-gray-900 dark:text-white">2d</p>
							</div>
							<div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
								<svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions & Recent Portfolios */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
									href="/editor/edit-resume"
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

					{/* Recent Portfolios */}
					<div className="lg:col-span-2">
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Portfolios</h2>
								<Link
									href="/editor"
									className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
								>
									View All
								</Link>
							</div>
							
							<div className="space-y-4">
								{/* Example portfolio items */}
								<div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300">
									<div className="flex items-center">
										<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
											<span className="text-white font-semibold">M</span>
										</div>
										<div>
											<h3 className="font-semibold text-gray-900 dark:text-white">Main Portfolio</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">Last updated 2 days ago</p>
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-lg">
											Published
										</span>
										<Link
											href="/preview/live"
											className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
										>
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
										</Link>
									</div>
								</div>

								<div className="text-center py-8">
									<svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
									</svg>
									<p className="text-gray-600 dark:text-gray-400 mb-4">Ready to create your next portfolio?</p>
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
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
