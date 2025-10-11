"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeletePortfolioModal({ 
	isOpen, 
	onClose, 
	portfolio, 
	onDelete 
}) {
	const [usernameInput, setUsernameInput] = useState("");
	const [confirmationInput, setConfirmationInput] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState("");

	const handleDelete = async () => {
		if (!usernameInput.trim() || !confirmationInput.trim()) {
			setError("Please fill in both fields");
			return;
		}

		if (usernameInput.trim() !== portfolio.username) {
			setError("Username does not match");
			return;
		}

		if (confirmationInput.toLowerCase().trim() !== "delete my portfolio") {
			setError("Confirmation text does not match");
			return;
		}

		setIsDeleting(true);
		setError("");

		try {
			await onDelete(portfolio._id, portfolio.username, confirmationInput);
			onClose();
		} catch (err) {
			setError(err.message || "Failed to delete portfolio");
		} finally {
			setIsDeleting(false);
		}
	};

	const handleClose = () => {
		if (!isDeleting) {
			setUsernameInput("");
			setConfirmationInput("");
			setError("");
			onClose();
		}
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
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={handleClose}
					/>
					
					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
					>
						{/* Header */}
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center">
								<div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3">
									<svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
									</svg>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
										Delete Portfolio
									</h3>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										This action cannot be undone
									</p>
								</div>
							</div>
							<button
								onClick={handleClose}
								disabled={isDeleting}
								className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Portfolio Info */}
						<div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
							<div className="flex items-center">
								<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
									<span className="text-white font-semibold text-sm">
										{portfolio?.portfolioData?.personal?.firstName?.[0] || 'P'}
									</span>
								</div>
								<div>
									<p className="font-medium text-gray-900 dark:text-white">
										{portfolio?.portfolioData?.personal?.firstName} {portfolio?.portfolioData?.personal?.lastName}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										@{portfolio?.username}
									</p>
								</div>
							</div>
						</div>

						{/* Warning */}
						<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
							<p className="text-sm text-red-800 dark:text-red-200">
								<strong>Warning:</strong> This will permanently delete your portfolio and all associated data including analytics, views, and any uploaded files.
							</p>
						</div>

						{/* Confirmation Fields */}
						<div className="space-y-4 mb-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Type the portfolio username: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{portfolio?.username}</span>
								</label>
								<input
									type="text"
									value={usernameInput}
									onChange={(e) => setUsernameInput(e.target.value)}
									placeholder="Enter portfolio username"
									disabled={isDeleting}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Type: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">delete my portfolio</span>
								</label>
								<input
									type="text"
									value={confirmationInput}
									onChange={(e) => setConfirmationInput(e.target.value)}
									placeholder="Type: delete my portfolio"
									disabled={isDeleting}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
								/>
							</div>
						</div>

						{/* Error Message */}
						{error && (
							<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
								<p className="text-sm text-red-800 dark:text-red-200">{error}</p>
							</div>
						)}

						{/* Actions */}
						<div className="flex space-x-3">
							<button
								onClick={handleClose}
								disabled={isDeleting}
								className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								disabled={isDeleting || !usernameInput.trim() || !confirmationInput.trim()}
								className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
							>
								{isDeleting ? (
									<>
										<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										Deleting...
									</>
								) : (
									"Delete Portfolio"
								)}
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
