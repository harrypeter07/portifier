"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TemplatePreview = ({ 
	templateId, 
	portfolioData, 
	onClose, 
	onPublish,
	className = "" 
}) => {
	const [loading, setLoading] = useState(false);
	const [previewData, setPreviewData] = useState(null);
	const [error, setError] = useState(null);
	const [previewMode, setPreviewMode] = useState('iframe'); // 'iframe' or 'redirect'

	useEffect(() => {
		if (templateId && portfolioData) {
			generatePreview();
		}
	}, [templateId, portfolioData]);

	const generatePreview = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch('/api/templates/preview', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					templateId,
					portfolioData,
					options: {
						preview: true,
						version: 'v1'
					}
				})
			});

			const result = await response.json();

			if (result.success) {
				setPreviewData(result);
			} else {
				setError(result.error || 'Failed to generate preview');
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handlePublish = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch('/api/templates/publish', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: portfolioData.personal?.email?.split('@')[0] || 'user',
					templateId,
					templateName: templateId,
					templateType: 'component',
					templateSource: 'local',
					isRemoteTemplate: false,
					portfolioData,
					layout: {},
					options: {
						publish: true,
						version: 'v1'
					}
				})
			});

			const result = await response.json();

			if (result.success) {
				onPublish?.(result);
			} else {
				setError(result.error || 'Failed to publish portfolio');
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handlePreviewRedirect = () => {
		if (previewData?.fullPreviewUrl) {
			window.open(previewData.fullPreviewUrl, '_blank');
		}
	};

	return (
		<div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${className}`}>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
					<div>
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							🎨 Template Preview
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							Preview your portfolio with the {templateId} template
						</p>
					</div>
					<div className="flex items-center space-x-3">
						<button
							onClick={generatePreview}
							disabled={loading}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
						>
							{loading ? '🔄' : '🔄'} Refresh
						</button>
						<button
							onClick={onClose}
							className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						>
							✕
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-hidden">
					{loading && (
						<div className="flex items-center justify-center h-96">
							<div className="text-center">
								<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
								<p className="text-gray-600 dark:text-gray-400">Generating preview...</p>
							</div>
						</div>
					)}

					{error && (
						<div className="flex items-center justify-center h-96">
							<div className="text-center">
								<div className="text-red-600 text-6xl mb-4">⚠️</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
									Preview Error
								</h3>
								<p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
								<button
									onClick={generatePreview}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
								>
									Try Again
								</button>
							</div>
						</div>
					)}

					{previewData && !loading && (
						<div className="h-full flex flex-col">
							{/* Preview Mode Toggle */}
							<div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-700">
								<div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
									<button
										onClick={() => setPreviewMode('iframe')}
										className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
											previewMode === 'iframe'
												? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
												: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
										}`}
									>
										📱 Inline Preview
									</button>
									<button
										onClick={() => setPreviewMode('redirect')}
										className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
											previewMode === 'redirect'
												? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
												: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
										}`}
									>
										🔗 Open in New Tab
									</button>
								</div>
							</div>

							{/* Preview Content */}
							<div className="flex-1 overflow-hidden">
								{previewMode === 'iframe' ? (
									<iframe
										src={previewData.fullPreviewUrl || previewData.previewUrl}
										className="w-full h-full border-0"
										title="Portfolio Preview"
										sandbox="allow-scripts allow-same-origin allow-forms"
									/>
								) : (
									<div className="flex items-center justify-center h-full">
										<div className="text-center">
											<div className="text-6xl mb-4">🔗</div>
											<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
												Preview Ready
											</h3>
											<p className="text-gray-600 dark:text-gray-400 mb-6">
												Click the button below to open the preview in a new tab
											</p>
											<button
												onClick={handlePreviewRedirect}
												className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
											>
												🚀 Open Preview
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				{previewData && !loading && (
					<div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-600 dark:text-gray-400">
								Template: {templateId}
							</span>
							{previewData.expiresAt && (
								<span className="text-sm text-gray-600 dark:text-gray-400">
									Expires: {new Date(previewData.expiresAt).toLocaleString()}
								</span>
							)}
						</div>
						<div className="flex items-center space-x-3">
							<button
								onClick={onClose}
								className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
							>
								Cancel
							</button>
							<button
								onClick={handlePublish}
								disabled={loading}
								className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
							>
								{loading ? '🔄 Publishing...' : '🚀 Publish Portfolio'}
							</button>
						</div>
					</div>
				)}
			</motion.div>
		</div>
	);
};

export default TemplatePreview;
