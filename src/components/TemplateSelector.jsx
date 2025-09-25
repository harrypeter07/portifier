"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplatePreview from './TemplatePreview';
import LiveTemplatePreview from './LiveTemplatePreview';

const TemplateSelector = ({ 
	portfolioData, 
	onTemplateSelect, 
	onPublish,
	className = "" 
}) => {
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [showPreview, setShowPreview] = useState(false);
	const [showLivePreview, setShowLivePreview] = useState(false);
	const [source, setSource] = useState('all'); // 'local', 'remote', 'all'
	const [category, setCategory] = useState('all');

	useEffect(() => {
		fetchTemplates();
	}, [source, category]);

	const fetchTemplates = async () => {
		try {
			setLoading(true);
			setError(null);

			const params = new URLSearchParams();
			if (source !== 'all') params.append('source', source);
			if (category !== 'all') params.append('category', category);

            const response = await fetch(`/api/templates?${params}`);
            const result = await response.json();

            if (result.success) {
                // De-duplicate templates by composite key (id+source+version)
                const seen = new Set();
                const deduped = [];
                for (const t of result.templates || []) {
                    const compositeKey = `${t.id}:${t.source || (t.remote ? 'remote' : 'local')}:${t.version || '0'}`;
                    if (seen.has(compositeKey)) continue;
                    seen.add(compositeKey);
                    deduped.push(t);
                }
                setTemplates(deduped);
            } else {
				setError(result.error || 'Failed to fetch templates');
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleTemplateSelect = (template) => {
		setSelectedTemplate(template);
		onTemplateSelect?.(template);
	};

	const handlePreview = (template) => {
		setSelectedTemplate(template);
		setShowPreview(true);
	};

	const handleLivePreview = (template) => {
		setSelectedTemplate(template);
		setShowLivePreview(true);
	};

	const handlePublish = (result) => {
		setShowPreview(false);
		onPublish?.(result);
	};

	const categories = [
		{ id: 'all', name: 'All Templates', icon: '🎨' },
		{ id: 'developer', name: 'Developer', icon: '💻' },
		{ id: 'designer', name: 'Designer', icon: '🎨' },
		{ id: 'marketing', name: 'Marketing', icon: '📈' },
		{ id: 'academic', name: 'Academic', icon: '🎓' }
	];

	const sources = [
		{ id: 'all', name: 'All Sources', icon: '📦' },
		{ id: 'local', name: 'Local', icon: '🏠' },
		{ id: 'remote', name: 'Remote', icon: '☁️' }
	];

	return (
		<div className={`w-full ${className}`}>
			{/* Header */}
			<div className="mb-6">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					🎨 Choose Your Template
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					Select a template to preview and publish your portfolio
				</p>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-4 mb-6">
				{/* Category Filter */}
				<div className="flex items-center space-x-2">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
						Category:
					</label>
					<select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
					>
						{categories.map(cat => (
							<option key={cat.id} value={cat.id}>
								{cat.icon} {cat.name}
							</option>
						))}
					</select>
				</div>

				{/* Source Filter */}
				<div className="flex items-center space-x-2">
					<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
						Source:
					</label>
					<select
						value={source}
						onChange={(e) => setSource(e.target.value)}
						className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
					>
						{sources.map(src => (
							<option key={src.id} value={src.id}>
								{src.icon} {src.name}
							</option>
						))}
					</select>
				</div>

				{/* Refresh Button */}
				<button
					onClick={fetchTemplates}
					disabled={loading}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? '🔄' : '🔄'} Refresh
				</button>
			</div>

			{/* Loading State */}
			{loading && (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600 dark:text-gray-400">Loading templates...</p>
					</div>
				</div>
			)}

			{/* Error State */}
			{error && (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="text-red-600 text-6xl mb-4">⚠️</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							Failed to Load Templates
						</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
						<button
							onClick={fetchTemplates}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
						>
							Try Again
						</button>
					</div>
				</div>
			)}

			{/* Templates Grid */}
			{!loading && !error && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<AnimatePresence>
                        {templates.map((template, index) => (
							<motion.div
                                key={`${template.id}-${template.source || (template.remote ? 'remote' : 'local')}-${template.version || '0'}-${index}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ delay: index * 0.1 }}
								className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
							>
								{/* Live Template Preview */}
								<div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative group">
									<div className="text-center">
										<div className="text-6xl text-gray-400 mb-2">
											{template.category === 'developer' ? '💻' : 
											 template.category === 'designer' ? '🎨' : 
											 template.category === 'marketing' ? '📈' : '🎓'}
										</div>
										<button
											onClick={() => handleLivePreview(template)}
											className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
										>
											👁️ Live Preview
										</button>
									</div>
								</div>

								{/* Template Info */}
								<div className="p-6">
									<div className="flex items-start justify-between mb-3">
										<div>
											<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
												{template.name}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												by {template.author}
											</p>
										</div>
										<div className="flex items-center space-x-2">
											{template.remote && (
												<span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
													☁️ Remote
												</span>
											)}
											<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full">
												{template.category}
											</span>
										</div>
									</div>

									<p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
										{template.description}
									</p>

									<div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
										<span>v{template.version}</span>
										<span>{template.source}</span>
									</div>

									{/* Action Buttons */}
									<div className="flex space-x-2">
										<button
											onClick={() => handlePreview(template)}
											className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
										>
											👁️ Preview
										</button>
										<button
											onClick={() => handleTemplateSelect(template)}
											className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
										>
											✅ Select
										</button>
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			)}

			{/* Empty State */}
			{!loading && !error && templates.length === 0 && (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<div className="text-6xl text-gray-400 mb-4">📦</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							No Templates Found
						</h3>
						<p className="text-gray-600 dark:text-gray-400">
							No templates match your current filters
						</p>
					</div>
				</div>
			)}

			{/* Template Preview Modal */}
			<AnimatePresence>
				{showPreview && selectedTemplate && (
					<TemplatePreview
						templateId={selectedTemplate.id}
						portfolioData={portfolioData}
						onClose={() => setShowPreview(false)}
						onPublish={handlePublish}
					/>
				)}
			</AnimatePresence>

			{/* Live Template Preview Modal */}
			<AnimatePresence>
				{showLivePreview && selectedTemplate && (
					<LiveTemplatePreview
						template={selectedTemplate}
						portfolioData={portfolioData}
						onClose={() => setShowLivePreview(false)}
						onSelect={handleTemplateSelect}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

export default TemplateSelector;