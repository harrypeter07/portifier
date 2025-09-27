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
			
			// Try to get authenticated user's data first
			const meResponse = await fetch('/api/auth/me');
			if (meResponse.ok) {
				const userData = await meResponse.json();
				console.log('👤 [TEMPLATES-DEMO] Authenticated user:', {
					userId: userData._id,
					username: userData.username,
					email: userData.email
				});
				
				// Try to get user's portfolio data
				const portfolioResponse = await fetch(`/api/portfolio/${userData.username || userData.email.split('@')[0]}`);
				if (portfolioResponse.ok) {
					const portfolioData = await portfolioResponse.json();
					console.log('📄 [TEMPLATES-DEMO] Found portfolio data:', {
						hasPortfolio: !!portfolioData.portfolio,
						hasPortfolioData: !!portfolioData.portfolio?.portfolioData,
						personalName: portfolioData.portfolio?.portfolioData?.personal?.firstName + ' ' + portfolioData.portfolio?.portfolioData?.personal?.lastName
					});
					setPortfolioData(portfolioData.portfolio.portfolioData || portfolioData.portfolio.content);
					return;
				}
			}
			
			// Fallback to sample data if no user data found
			console.log('⚠️ [TEMPLATES-DEMO] No user data found, using sample data');
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
		} catch (err) {
			setError('Failed to load portfolio data');
		} finally {
			setLoading(false);
		}
	};

	const handleTemplateSelect = (template) => {
		console.log('Template selected:', template);
		// Handle template selection logic here
	};

	const handlePreview = async (template) => {
		try {
			const response = await fetch('/api/templates/preview', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					templateId: template.id,
					portfolioData: portfolioData
				})
			});

			if (response.ok) {
				const result = await response.json();
				if (result.previewUrl) {
					window.open(result.fullPreviewUrl || result.previewUrl, '_blank');
				}
			} else {
				console.error('Preview failed:', response.statusText);
			}
		} catch (error) {
			console.error('Preview error:', error);
		}
	};

	const handlePublish = async (template) => {
		try {
			setPublishResult({ loading: true });
			
			const response = await fetch('/api/portfolio/save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					templateId: template.id,
					portfolioData: portfolioData,
					layout: template.layout || {}
				})
			});

			if (response.ok) {
				const result = await response.json();
				setPublishResult({ 
					success: true, 
					portfolioUrl: result.portfolioUrl,
					message: 'Portfolio published successfully!'
				});
			} else {
				const error = await response.json();
				setPublishResult({ 
					success: false, 
					error: error.error || 'Failed to publish portfolio'
				});
			}
		} catch (error) {
			setPublishResult({ 
				success: false, 
				error: 'Network error occurred'
			});
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600 dark:text-gray-400">Loading templates...</p>
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
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Templates</h1>
						<p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						🎨 Portfolio Templates
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-400">
						Choose a template and preview your portfolio
					</p>
				</div>

				{portfolioData && (
					<div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
							📄 Current Portfolio Data
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h3 className="font-medium text-gray-900 dark:text-white">Personal Info</h3>
								<p className="text-gray-600 dark:text-gray-400">
									{portfolioData.personal?.firstName} {portfolioData.personal?.lastName}
								</p>
								<p className="text-gray-600 dark:text-gray-400">
									{portfolioData.personal?.email}
								</p>
							</div>
							<div>
								<h3 className="font-medium text-gray-900 dark:text-white">Experience</h3>
								<p className="text-gray-600 dark:text-gray-400">
									{portfolioData.experience?.jobs?.length || 0} job(s)
								</p>
							</div>
						</div>
					</div>
				)}

				<TemplateSelector
					onTemplateSelect={handleTemplateSelect}
					onPreview={handlePreview}
					onPublish={handlePublish}
					portfolioData={portfolioData}
				/>

				{publishResult && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mt-8 p-6 rounded-xl shadow-lg"
						style={{
							backgroundColor: publishResult.success ? '#10B981' : '#EF4444',
							color: 'white'
						}}
					>
						{publishResult.loading ? (
							<div className="flex items-center">
								<div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
								Publishing portfolio...
							</div>
						) : publishResult.success ? (
							<div>
								<h3 className="text-xl font-semibold mb-2">✅ Portfolio Published!</h3>
								<p className="mb-4">{publishResult.message}</p>
								{publishResult.portfolioUrl && (
									<a
										href={publishResult.portfolioUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
									>
										View Portfolio
									</a>
								)}
							</div>
						) : (
							<div>
								<h3 className="text-xl font-semibold mb-2">❌ Publishing Failed</h3>
								<p>{publishResult.error}</p>
							</div>
						)}
					</motion.div>
				)}
			</div>
		</div>
	);
}
