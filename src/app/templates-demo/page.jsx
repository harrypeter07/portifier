"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TemplateSelector from '@/components/TemplateSelector';
import { useRouter } from 'next/navigation';

export default function TemplatesDemoPage() {
	const router = useRouter();
	const [portfolioData, setPortfolioData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [publishResult, setPublishResult] = useState(null);

	useEffect(() => {
		// Load sample portfolio data for demo
		loadSamplePortfolioData();
	}, []);

	const loadSamplePortfolioData = async () => {
		try {
			setLoading(true);
			
			// Try to get user's portfolio data first
			const response = await fetch('/api/portfolio/get');
			if (response.ok) {
				const data = await response.json();
				setPortfolioData(data.portfolio);
			} else {
				// Use sample data if no portfolio exists
				setPortfolioData({
					personal: {
						firstName: 'John',
						lastName: 'Doe',
						title: 'Full Stack Developer',
						email: 'john.doe@example.com',
						phone: '+1 (555) 123-4567',
						location: {
							city: 'San Francisco',
							state: 'CA',
							country: 'USA'
						},
						social: {
							linkedin: 'https://linkedin.com/in/johndoe',
							github: 'https://github.com/johndoe',
							portfolio: 'https://johndoe.dev'
						},
						avatar: '',
						tagline: 'Building amazing web experiences'
					},
					about: {
						summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
						bio: 'I love creating beautiful, functional web applications that solve real-world problems.',
						interests: ['Web Development', 'Machine Learning', 'Open Source'],
						personalValues: ['Innovation', 'Collaboration', 'Continuous Learning']
					},
					experience: {
						jobs: [
							{
								id: '1',
								company: 'Tech Corp',
								position: 'Senior Developer',
								location: 'San Francisco, CA',
								startDate: '2022-01',
								endDate: '',
								current: true,
								description: 'Leading development of scalable web applications',
								responsibilities: [
									'Architect and develop web applications',
									'Lead a team of 5 developers',
									'Implement best practices and code reviews'
								],
								achievements: [
									'Increased application performance by 40%',
									'Reduced deployment time by 60%'
								],
								technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS']
							}
						]
					},
					skills: {
						technical: [
							{
								category: 'Frontend',
								skills: [
									{ name: 'React', level: 'Expert', years: 4 },
									{ name: 'Vue.js', level: 'Advanced', years: 2 },
									{ name: 'TypeScript', level: 'Expert', years: 3 }
								]
							},
							{
								category: 'Backend',
								skills: [
									{ name: 'Node.js', level: 'Expert', years: 4 },
									{ name: 'Python', level: 'Advanced', years: 3 },
									{ name: 'PostgreSQL', level: 'Advanced', years: 3 }
								]
							}
						],
						soft: [
							{ name: 'Leadership', description: 'Team leadership and mentoring' },
							{ name: 'Communication', description: 'Clear technical communication' }
						]
					},
					projects: {
						items: [
							{
								id: '1',
								title: 'E-commerce Platform',
								description: 'Full-stack e-commerce solution with React and Node.js',
								category: 'Web Development',
								technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
								links: {
									live: 'https://example-store.com',
									github: 'https://github.com/johndoe/ecommerce'
								}
							}
						]
					},
					education: {
						degrees: [
							{
								id: '1',
								institution: 'University of California',
								degree: 'Bachelor of Science',
								field: 'Computer Science',
								startDate: '2016',
								endDate: '2020'
							}
						]
					}
				});
			}
		} catch (err) {
			setError('Failed to load portfolio data');
		} finally {
			setLoading(false);
		}
	};

	const handleTemplateSelect = (template) => {
		console.log('Template selected:', template);
		// You can add additional logic here if needed
	};

	const handlePublish = (result) => {
		console.log('Portfolio published:', result);
		setPublishResult(result);
		
		// Show success message and redirect
		setTimeout(() => {
			if (result.portfolioUrl) {
				window.open(result.portfolioUrl, '_blank');
			}
		}, 2000);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600 dark:text-gray-400">Loading portfolio data...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="text-red-600 text-6xl mb-4">⚠️</div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h1>
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
			{/* Header */}
			<div className="bg-white dark:bg-gray-900 shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								🎨 Template Gallery
							</h1>
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								Choose a template and preview your portfolio
							</p>
						</div>
						<div className="flex items-center space-x-4">
							<button
								onClick={() => router.push('/dashboard')}
								className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
							>
								← Back to Dashboard
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Success Message */}
			{publishResult && (
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 mx-4 mt-4 rounded-r-lg"
				>
					<div className="flex items-center">
						<div className="text-green-400 text-2xl mr-3">✅</div>
						<div>
							<h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
								Portfolio Published Successfully!
							</h3>
							<p className="text-green-700 dark:text-green-300">
								Your portfolio is now live at: <a href={publishResult.portfolioUrl} target="_blank" rel="noopener noreferrer" className="underline">{publishResult.portfolioUrl}</a>
							</p>
						</div>
					</div>
				</motion.div>
			)}

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<TemplateSelector
					portfolioData={portfolioData}
					onTemplateSelect={handleTemplateSelect}
					onPublish={handlePublish}
				/>
			</div>
		</div>
	);
}