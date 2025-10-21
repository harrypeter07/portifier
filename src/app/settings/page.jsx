"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LottieLoading from "@/components/LottieLoading";
import GeminiKeyModal from "@/components/common/GeminiKeyModal";
import ContactForm from "@/components/ContactForm";
import BugReportModal from "@/components/BugReportModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bug, Mail, MessageSquare } from "lucide-react";

export default function SettingsPage() {
	const [user, setUser] = useState(null);
	const [apiKeyStatus, setApiKeyStatus] = useState({ hasKey: false, loading: true });
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const [message, setMessage] = useState({ type: "", text: "" });
	const [isBugReportOpen, setIsBugReportOpen] = useState(false);
	const [isContactSectionOpen, setIsContactSectionOpen] = useState(false);

	useEffect(() => {
		fetchUserData();
		fetchApiKeyStatus();
	}, []);

	const fetchUserData = async () => {
		try {
			const res = await fetch("/api/auth/me");
			const data = await res.json();
			if (res.ok) {
				console.log("User data received:", data);
				// Handle different response structures
				if (data.user) {
					setUser(data.user);
				} else if (data.username || data.email) {
					setUser(data);
				} else {
					console.error("Unexpected user data structure:", data);
					setUser(null);
				}
			} else {
				console.error("Failed to fetch user data:", data.error);
				setUser(null);
			}
		} catch (error) {
			console.error("Failed to fetch user data:", error);
			setUser(null);
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
			<div className="min-h-screen">
				<div className="flex justify-center items-center min-h-screen">
					<LottieLoading size="xxlarge" showMessage={false} fullScreen={true} inline={false} />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen pt-20 page-container">
			{/* Header */}
			<div className="border-b shadow-sm backdrop-blur-xl border-white/20 bg-white/10 dark:bg-white/10">
				<div className="px-4 py-6 mx-auto max-w-4xl">
					<h1 className="text-3xl font-bold text-black dark:text-white">Settings</h1>
					<p className="mt-2 text-black/80 dark:text-white/80">Manage your account and preferences</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="px-4 py-8 mx-auto max-w-4xl">
				{/* Message */}
				{message.text && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className={`mb-6 p-4 rounded-lg backdrop-blur-xl border ${
							message.type === "success"
								? "bg-green-500/20 border-green-500/30"
								: "bg-red-500/20 border-red-500/30"
						}`}
					>
						<p className={`text-sm ${
							message.type === "success"
								? "text-green-600"
								: "text-red-600"
						}`}>
							{message.text}
						</p>
					</motion.div>
				)}

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
					{/* Account Information */}
					<Card className="backdrop-blur-xl bg-white/10 border-white/20">
						<CardHeader>
							<CardTitle>Account Information</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div>
									<Label className="mb-1 text-sm font-medium text-black/80 dark:text-white/80">
										Username
									</Label>
									<p className="font-medium text-black dark:text-white">@{user.username}</p>
								</div>
								<div>
									<Label className="mb-1 text-sm font-medium text-black/80 dark:text-white/80">
										Email
									</Label>
									<p className="font-medium text-black dark:text-white">{user.email}</p>
								</div>
								<div>
									<Label className="mb-1 text-sm font-medium text-black/80 dark:text-white/80">
										Name
									</Label>
									<p className="font-medium text-black dark:text-white">{user.name}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* AI Settings */}
					<Card className="backdrop-blur-xl bg-white/10 border-white/20">
						<CardHeader>
							<CardTitle>AI Settings</CardTitle>
						</CardHeader>
						<CardContent>
						
							{/* Gemini API Key Status */}
							<div className="mb-6">
								<div className="flex justify-between items-center mb-4">
									<div>
										<h3 className="text-lg font-medium text-black dark:text-white">
											Gemini API Key
										</h3>
										<p className="text-sm text-black/70 dark:text-white/70">
											Use your own API key for better reliability
										</p>
									</div>
                                    <div className="flex items-center">
                                        {apiKeyStatus.loading ? (
                                            <LottieLoading size="small" message="" inline={true} />
                                        ) : apiKeyStatus.hasKey ? (
											<Badge variant="default" className="flex items-center">
												<svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
												</svg>
												Configured
											</Badge>
										) : (
											<Badge variant="secondary" className="flex items-center">
												<svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
												</svg>
												Not Configured
											</Badge>
										)}
									</div>
								</div>

								{apiKeyStatus.hasKey ? (
									<div className="space-y-3">
										<div className="p-3 bg-green-50 rounded-lg border border-green-200">
											<p className="text-sm text-green-600">
												✅ Your Gemini API key is configured and working
											</p>
										</div>
										<Button
											onClick={handleRemoveApiKey}
											disabled={isRemoving}
											variant="destructive"
											className="w-full"
										>
											{isRemoving ? "Removing..." : "Remove API Key"}
										</Button>
									</div>
								) : (
									<div className="space-y-3">
										<div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
											<p className="text-sm text-yellow-600">
												⚠️ Add your Gemini API key to enable AI features
											</p>
										</div>
										<Button
											onClick={() => setIsModalOpen(true)}
											className="w-full"
										>
											Add API Key
										</Button>
									</div>
								)}
							</div>

							{/* AI Features Info */}
							<div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
								<h4 className="mb-2 text-sm font-medium text-black dark:text-white">
									AI Features
								</h4>
								<ul className="space-y-1 text-sm text-black/70 dark:text-white/70">
									<li>• Resume parsing and data extraction</li>
									<li>• AI-powered content suggestions</li>
									<li>• Smart field completion</li>
									<li>• Professional content optimization</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Bug Reporting Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mt-8"
				>
					<Card className="backdrop-blur-xl bg-white/10 border-white/20">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-2xl">
								<Bug className="w-6 h-6 text-red-500" />
								Report Issues & Get Help
							</CardTitle>
							<CardDescription className="text-lg">
								Help us improve Portifier by reporting bugs or getting support
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Bug Report Button */}
							<Button
								onClick={() => setIsBugReportOpen(!isBugReportOpen)}
								className="h-auto p-6 text-left justify-start bg-red-500/10 hover:bg-red-500/20 border-red-500/20 w-full"
								variant="outline"
							>
								<div className="flex items-start gap-4 flex-wrap min-w-0 w-full">
									<Bug className="w-8 h-8 text-red-500 mt-1 flex-shrink-0" />
									<div className="min-w-0 w-full">
										<h3 className="text-lg font-semibold text-red-700 dark:text-red-400 break-words">
											Report a Bug
										</h3>
										<p className="text-sm text-red-600 dark:text-red-300 mt-1 break-words whitespace-normal">
											Found an issue? Report it with screenshots and details
										</p>
									</div>
								</div>
							</Button>
						</div>

						{/* Bug Report Section */}
						{isBugReportOpen && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
								className="mt-4 overflow-hidden"
							>
								<div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
									<h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
										🐛 Report a Bug
									</h4>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-red-800 dark:text-red-200 mb-2">
												Bug Title *
											</label>
											<input
												type="text"
												placeholder="Brief description of the issue"
												className="w-full px-4 py-2 border-2 border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-red-800 dark:text-red-200 mb-2">
												Priority
											</label>
											<select className="w-full px-4 py-2 border-2 border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent">
												<option value="low">Low</option>
												<option value="medium" selected>Medium</option>
												<option value="high">High</option>
												<option value="critical">Critical</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-red-800 dark:text-red-200 mb-2">
												Description *
											</label>
											<textarea
												rows={4}
												placeholder="Describe the bug in detail..."
												className="w-full px-4 py-2 border-2 border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-red-800 dark:text-red-200 mb-2">
												Email (Optional)
											</label>
											<input
												type="email"
												placeholder="your@email.com (for follow-up)"
												className="w-full px-4 py-2 border-2 border-red-300 dark:border-red-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
											/>
										</div>
										<div className="flex gap-3">
											<Button className="bg-red-600 hover:bg-red-700 text-white">
												Submit Bug Report
											</Button>
											<Button 
												variant="outline" 
												onClick={() => setIsBugReportOpen(false)}
												className="border-red-300 text-red-700 hover:bg-red-50"
											>
												Cancel
											</Button>
										</div>
									</div>
								</div>
							</motion.div>
						)}

							{/* Contact Support Button */}
							<Button
								onClick={() => setIsContactSectionOpen(!isContactSectionOpen)}
								className="h-auto p-6 text-left justify-start bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 w-full"
								variant="outline"
							>
								<div className="flex items-start gap-4 flex-wrap min-w-0 w-full">
									<Mail className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
									<div className="min-w-0 w-full">
										<h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 break-words">
											Contact Support
										</h3>
										<p className="text-sm text-blue-600 dark:text-blue-300 mt-1 break-words whitespace-normal">
											Need help? Send us an email for direct support
										</p>
									</div>
								</div>
							</Button>
						</div>

						{/* Contact Section */}
						{isContactSectionOpen && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3 }}
								className="mt-4 overflow-hidden"
							>
								<div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
									<h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
										📧 Contact Us
									</h4>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
												Your Email
											</label>
											<input
												type="email"
												placeholder="your@email.com"
												className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
												Subject
											</label>
											<input
												type="text"
												placeholder="What's this about?"
												className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
												Message
											</label>
											<textarea
												rows={4}
												placeholder="Tell us what you need help with..."
												className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
											/>
										</div>
										<div className="flex gap-3">
											<Button className="bg-blue-600 hover:bg-blue-700 text-white">
												Send Message
											</Button>
											<Button 
												variant="outline" 
												onClick={() => setIsContactSectionOpen(false)}
												className="border-blue-300 text-blue-700 hover:bg-blue-50"
											>
												Cancel
											</Button>
										</div>
									</div>
								</div>
							</motion.div>
						)}

							{/* Additional Help Info */}
							<div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
								<h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
									Before Reporting
								</h4>
								<ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
									<li>• Check if the issue has been reported before</li>
									<li>• Try refreshing the page or clearing your browser cache</li>
									<li>• Include steps to reproduce the issue</li>
									<li>• Attach screenshots or screen recordings if possible</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Additional Settings */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="p-6 mt-8 rounded-xl shadow-lg glass"
				>
					<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
						Quick Actions
					</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<button
							onClick={() => window.location.href = "/dashboard"}
							className="p-4 text-left rounded-lg border border-gray-200 transition-colors dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							<div className="flex items-center">
								<svg className="mr-3 w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
								<div>
									<h3 className="font-medium text-gray-900 dark:text-white">Dashboard</h3>
									<p className="text-sm text-black/70 dark:text-white/70">View your portfolios</p>
								</div>
							</div>
						</button>
						<button
							onClick={() => window.location.href = "/editor"}
							className="p-4 text-left rounded-lg border border-gray-200 transition-colors dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							<div className="flex items-center">
								<svg className="mr-3 w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								<div>
									<h3 className="font-medium text-gray-900 dark:text-white">Create Portfolio</h3>
									<p className="text-sm text-black/70 dark:text-white/70">Start a new portfolio</p>
								</div>
							</div>
						</button>
						<button
							onClick={() => window.location.href = "/auth/logout"}
							className="p-4 text-left rounded-lg border border-gray-200 transition-colors dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
						>
							<div className="flex items-center">
								<svg className="mr-3 w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
								<div>
									<h3 className="font-medium text-gray-900 dark:text-white">Sign Out</h3>
									<p className="text-sm text-black/70 dark:text-white/70">Log out of your account</p>
								</div>
							</div>
						</button>
					</div>
				</motion.div>
			</div>

			{/* Contact Form Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="mb-8"
			>
				<div className="mb-6 text-center">
					<h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
						Get in Touch
					</h2>
					<p className="text-gray-600 dark:text-gray-400">
						Have questions or suggestions? We'd love to hear from you!
					</p>
				</div>
				<ContactForm />
			</motion.div>

			{/* Gemini Key Modal */}
			<GeminiKeyModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={handleApiKeySuccess}
			/>

			{/* Bug Report Modal */}
			<BugReportModal
				isOpen={isBugReportOpen}
				onClose={() => setIsBugReportOpen(false)}
			/>
		</div>
	);
}
