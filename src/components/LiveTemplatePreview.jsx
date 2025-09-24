"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Preview from './Preview';

const LiveTemplatePreview = ({ 
	template, 
	portfolioData, 
	onClose, 
	onSelect,
	className = "" 
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSelect = () => {
		onSelect?.(template);
		onClose?.();
	};

	return (
		<div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 ${className}`}>
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.9 }}
				className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
					<div>
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							🎨 {template.name} Preview
						</h2>
						<p className="text-gray-600 dark:text-gray-400">
							{template.description}
						</p>
					</div>
					<div className="flex items-center space-x-3">
						<button
							onClick={onClose}
							className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
						>
							✕
						</button>
					</div>
				</div>

				{/* Live Preview Content */}
				<div className="flex-1 overflow-hidden">
					{loading && (
						<div className="flex items-center justify-center h-96">
							<div className="text-center">
								<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
								<p className="text-gray-600 dark:text-gray-400">Loading preview...</p>
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
							</div>
						</div>
					)}

					{!loading && !error && (
						<div className="h-full overflow-auto">
							<div className="transform scale-50 origin-top-left w-[200%] h-[200%]">
								<Preview 
									templateId={template.id}
									portfolioData={portfolioData}
									templateType={template.type}
									layout={template.layout}
									theme={template.theme}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
					<div className="flex items-center space-x-4">
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Template: {template.id}
						</span>
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Category: {template.category}
						</span>
						{template.remote && (
							<span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
								☁️ Remote
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
							onClick={handleSelect}
							className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
						>
							✅ Select Template
						</button>
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default LiveTemplatePreview;
