"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GeminiKeyModal({ isOpen, onClose, onSuccess }) {
	const [apiKey, setApiKey] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [showKey, setShowKey] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/user/gemini-key", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ apiKey: apiKey.trim() }),
			});

			const data = await response.json();

			if (response.ok) {
				setApiKey("");
				onSuccess && onSuccess();
				onClose();
			} else {
				setError(data.error || "Failed to save API key");
			}
		} catch (err) {
			setError("Failed to save API key");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setApiKey("");
		setError("");
		setShowKey(false);
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 bg-black bg-opacity-50"
						onClick={handleClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
					>
						{/* Header */}
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								Add Gemini API Key
							</h2>
							<button
								onClick={handleClose}
								className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Info */}
						<div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
							<div className="flex items-start">
								<svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<div className="text-sm text-blue-800 dark:text-blue-200">
									<p className="font-medium mb-1">Why add your own API key?</p>
									<p>Using your own Gemini API key ensures better reliability and higher rate limits. Your key is stored securely and only used for AI features.</p>
								</div>
							</div>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Gemini API Key
								</label>
								<div className="relative">
									<input
										type={showKey ? "text" : "password"}
										value={apiKey}
										onChange={(e) => setApiKey(e.target.value)}
										placeholder="AIzaSy..."
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
										required
									/>
									<button
										type="button"
										onClick={() => setShowKey(!showKey)}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
									>
										{showKey ? (
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
											</svg>
										) : (
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										)}
									</button>
								</div>
								<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
									Get your API key from{" "}
									<a
										href="https://makersuite.google.com/app/apikey"
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 dark:text-blue-400 hover:underline"
									>
										Google AI Studio
									</a>
								</p>
							</div>

							{/* Error */}
							{error && (
								<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
									<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
								</div>
							)}

							{/* Actions */}
							<div className="flex gap-3 pt-4">
								<button
									type="button"
									onClick={handleClose}
									className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
								>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isLoading || !apiKey.trim()}
									className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{isLoading ? (
										<div className="flex items-center justify-center">
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
											Saving...
										</div>
									) : (
										"Save API Key"
									)}
								</button>
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
