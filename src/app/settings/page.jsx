"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GeminiKeyModal from "@/components/common/GeminiKeyModal";

export default function SettingsPage() {
	const [user, setUser] = useState(null);
	const [apiKeyStatus, setApiKeyStatus] = useState({ hasKey: false, loading: true });
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const [message, setMessage] = useState({ type: "", text: "" });

	useEffect(() => {
		fetchUserData();
		fetchApiKeyStatus();
	}, []);

	const fetchUserData = async () => {
		try {
			const res = await fetch("/api/auth/me");
			const data = await res.json();
			if (res.ok) {
				setUser(data);
			}
		} catch (error) {
			console.error("Failed to fetch user data:", error);
		}
	};

	const fetchApiKeyStatus = async () => {
		try {
			const res = await fetch("/api/user/gemini-key");
			const data = await res.json();
			if (res.ok) {
				setApiKeyStatus({ hasKey: data.hasKey, loading: false });
			}
		} catch (error) {
			setApiKeyStatus({ hasKey: false, loading: false });
		}
	};

	const handleRemoveApiKey = async () => {
		if (!confirm("Are you sure you want to remove your API key? AI features will be disabled.")) {
			return;
		}

		setIsRemoving(true);
		try {
			const res = await fetch("/api/user/gemini-key", {
				method: "DELETE",
			});
			const data = await res.json();

			if (res.ok) {
				setApiKeyStatus({ hasKey: false, loading: false });
				setMessage({ type: "success", text: "API key removed successfully" });
			} else {
				setMessage({ type: "error", text: data.error || "Failed to remove API key" });
			}
		} catch (error) {
			setMessage({ type: "error", text: "Failed to remove API key" });
		} finally {
			setIsRemoving(false);
		}
	};

	const handleApiKeySuccess = () => {
		setApiKeyStatus({ hasKey: true, loading: false });
		setMessage({ type: "success", text: "API key saved successfully" });
	};

	// Clear message after 3 seconds
	useEffect(() => {
		if (message.text) {
			const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
			return () => clearTimeout(timer);
		}
	}, [message]);

	if (!user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600 dark:text-gray-300">Loading settings...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Header */}
			<div className="bg-white dark:bg-gray-900 shadow-sm border-b">
				<div className="max-w-4xl mx-auto px-4 py-6">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account and preferences</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Message */}
				{message.text && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className={`mb-6 p-4 rounded-lg ${
							message.type === "success"
								? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
								: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
						}`}
					>
						<p className={`text-sm ${
							message.type === "success"
								? "text-green-600 dark:text-green-400"
								: "text-red-600 dark:text-red-400"
						}`}>
							{message.text}
						</p>
					</motion.div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Account Information */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
							Account Information
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
									Username
								</label>
								<p className="text-gray-900 dark:text-white font-medium">@{user.username}</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
									Email
								</label>
								<p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
									Name
								</label>
								<p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
									Member Since
								</label>
								<p className="text-gray-900 dark:text-white font-medium">
									{new Date(user.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>
					</motion.div>

					{/* AI Settings */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
					>
						<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
							AI Settings
						</h2>
						
						{/* Gemini API Key Status */}
						<div className="mb-6">
							<div className="flex items-center justify-between mb-4">
								<div>
									<h3 className="text-lg font-medium text-gray-900 dark:text-white">
										Gemini API Key
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Use your own API key for better reliability
									</p>
								</div>
								<div className="flex items-center">
									{apiKeyStatus.loading ? (
										<div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
									) : apiKeyStatus.hasKey ? (
										<div className="flex items-center text-green-600 dark:text-green-400">
											<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
											<span className="text-sm font-medium">Configured</span>
										</div>
									) : (
										<div className="flex items-center text-yellow-600 dark:text-yellow-400">
											<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
											</svg>
											<span className="text-sm font-medium">Not Configured</span>
										</div>
									)}
								</div>
							</div>

							{apiKeyStatus.hasKey ? (
								<div className="space-y-3">
									<div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
										<p className="text-sm text-green-600 dark:text-green-400">
											✅ Your Gemini API key is configured and working
										</p>
									</div>
									<button
										onClick={handleRemoveApiKey}
										disabled={isRemoving}
										className="w-full px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
									>
										{isRemoving ? "Removing..." : "Remove API Key"}
									</button>
								</div>
							) : (
								<div className="space-y-3">
									<div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
										<p className="text-sm text-yellow-600 dark:text-yellow-400">
											⚠️ Add your Gemini API key to enable AI features
										</p>
									</div>
									<button
										onClick={() => setIsModalOpen(true)}
										className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
									>
										Add API Key
									</button>
								</div>
							)}
						</div>

						{/* AI Features Info */}
						<div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
							<h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
								AI Features
							</h4>
							<ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
								<li>• Resume parsing and data extraction</li>
								<li>• AI-powered content suggestions</li>
								<li>• Smart field completion</li>
								<li>• Professional content optimization</li>
							</ul>
						</div>
					</motion.div>
				</div>

				{/* Additional Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mt-8 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
				>
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
						Quick Actions
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<button
							onClick={() => window.location.href = "/dashboard"}
							className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
						>
							<div className="flex items-center">
								<svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
								<div>
									<h3 className="font-medium text-gray-900 dark:text-white">Dashboard</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">View your portfolios</p>
								</div>
							</div>
						</button>
						<button
							onClick={() => window.location.href = "/editor"}
							className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
						>
							<div className="flex items-center">
								<svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								<div>
									<h3 className="font-medium text-gray-900 dark:text-white">Create Portfolio</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">Start a new portfolio</p>
								</div>
							</div>
						</button>
						<button
							onClick={() => window.location.href = "/auth/logout"}
							className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
						>
							<div className="flex items-center">
								<svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
								<div>
									<h3 className="font-medium text-gray-900 dark:text-white">Sign Out</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">Log out of your account</p>
								</div>
							</div>
						</button>
					</div>
				</motion.div>
			</div>

			{/* Gemini Key Modal */}
			<GeminiKeyModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={handleApiKeySuccess}
			/>
		</div>
	);
}
