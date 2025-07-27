"use client";
import { useLayoutStore } from "@/store/layoutStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { componentMap, componentCategories, getRecommendedLayout } from "@/data/componentMap";
import Preview from "@/components/Preview";
import { motion, AnimatePresence } from "framer-motion";

// Mock parsed resume data (in real app, get from upload step or API)
const MOCK_RESUME = {
	hero: { title: "Hi, I'm Hassan", subtitle: "Web Developer" },
	about: { summary: "Experienced developer..." },
	showcase: { projects: "Acme Corp, Beta Inc" },
	contact: { email: "hassan@gmail.com" },
};

const FIELD_MAP = {
	hero: [
		{ name: "firstName", label: "First Name", path: "personal.firstName" },
		{ name: "lastName", label: "Last Name", path: "personal.lastName" },
		{ name: "subtitle", label: "Professional Title", path: "personal.subtitle" },
		{ name: "tagline", label: "Tagline", path: "personal.tagline" },
	],
	about: [{ name: "summary", label: "Bio", path: "about.summary" }],
	showcase: [{ name: "projects", label: "Projects (comma separated)", path: "projects.items" }],
	contact: [{ name: "email", label: "Contact Email", path: "personal.email" }],
};

export default function CustomizePage() {
	const {
		layout,
		content,
		portfolioData,
		setContent,
		setLayout,
		updatePortfolioData,
		parsedData,
		restoreFromParsed,
		currentTemplate,
		portfolioType,
		setPortfolioType,
		resumeId,
	} = useLayoutStore();
	const [localContent, setLocalContent] = useState({});
	const [localLayout, setLocalLayout] = useState({});
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState("");
	const [activeTab, setActiveTab] = useState("content"); // "content" or "components"
	const [selectedSection, setSelectedSection] = useState(null);
	const [hoveredComponent, setHoveredComponent] = useState(null);
	const router = useRouter();

	// Prefill from resume or Zustand content
	useEffect(() => {
		console.log("🎨 [CUSTOMIZE] useEffect triggered:", {
			hasContent: Object.keys(content).length > 0,
			hasParsedData: !!parsedData,
			hasPortfolioData: !!portfolioData,
			currentLayout: layout,
			portfolioType
		});

		// If no content but we have parsed data, restore it
		if (Object.keys(content).length === 0 && parsedData) {
			console.log("🎨 [CUSTOMIZE] Restoring from parsed data");
			restoreFromParsed();
			return;
		}

		// Initialize layout if empty
		let layoutToUse = layout;
		if (Object.keys(layout).length === 0) {
			const recommendedLayout = getRecommendedLayout(portfolioType);
			console.log("🎨 [CUSTOMIZE] Setting recommended layout:", recommendedLayout);
			layoutToUse = recommendedLayout;
			setLocalLayout(recommendedLayout);
		} else {
			console.log("🎨 [CUSTOMIZE] Using existing layout:", layout);
			setLocalLayout(layout);
		}

		const initial = {};
		Object.keys(layoutToUse).forEach((section) => {
			// Initialize section data from portfolioData or fallback to mock/content
			const sectionData = {};
			
			// Get field values from portfolioData using the field paths
			FIELD_MAP[section]?.forEach((field) => {
				const pathKeys = field.path.split('.');
				let value = portfolioData;
				for (const key of pathKeys) {
					value = value?.[key];
				}
				sectionData[field.name] = value || '';
			});
			
			initial[section] = {
				...MOCK_RESUME[section], // Mock data as fallback
				...content[section], // Legacy content
				...sectionData, // Portfolio data takes priority
			};
		});
		setLocalContent(initial);
	}, [layout, content, portfolioData, parsedData, restoreFromParsed, portfolioType]);

	function handleChange(section, field, value) {
		// Update local content for form display
		setLocalContent((prev) => ({
			...prev,
			[section]: { ...prev[section], [field]: value },
		}));
		
		// Update portfolioData in store
		const fieldMapping = FIELD_MAP[section]?.find(f => f.name === field);
		if (fieldMapping?.path) {
			updatePortfolioData(fieldMapping.path, value);
		}
	}

	function handleComponentChange(section, componentName) {
		console.log("🎨 [CUSTOMIZE] Component change triggered:", {
			section,
			componentName,
			currentLayout: localLayout,
			availableComponents: componentCategories[section]?.components
		});
		
		setSelectedSection(section);
		setLocalLayout(prev => {
			const newLayout = {
				...prev,
				[section]: componentName
			};
			console.log("🎨 [CUSTOMIZE] Updated layout:", newLayout);
			return newLayout;
		});
		
		// Clear selection after animation
		setTimeout(() => setSelectedSection(null), 1000);
	}

	function handlePortfolioTypeChange(type) {
		setPortfolioType(type);
		const recommendedLayout = getRecommendedLayout(type);
		setLocalLayout(recommendedLayout);
	}

	async function handleSave() {
		// Save layout to store
		Object.entries(localLayout).forEach(([section, component]) => {
			setLayout(section, component);
		});

		// Save to Zustand
		Object.keys(localContent).forEach((section) => {
			setContent(section, localContent[section]);
		});
		setSaving(true);
		setSuccess("");
		try {
			// Get email from contact section or use a default
			const userEmail = localContent.contact?.email || "demo@example.com";

			const res = await fetch("/api/portfolio/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					layout: localLayout, // Use the selected layout
					content: localContent,
					portfolioData, // Include the updated portfolio data
					resumeId: resumeId, // Associate with resume if available
				}),
			});
			const data = await res.json();
			if (res.ok && data.success) {
				const portfolioUrl = data.portfolioUrl;
				setSuccess(
					`🎉 Congratulations! Your portfolio is now live at: ${portfolioUrl}`
				);
				console.log("🎉 [CUSTOMIZE] Portfolio published successfully:", {
					username: data.username,
					portfolioUrl: portfolioUrl
				});
				// Optionally redirect to the portfolio URL
				// router.push(portfolioUrl);
			} else {
				setSuccess("");
				alert(data.error || "Failed to save portfolio");
			}
		} catch (err) {
			setSuccess("");
			alert("Failed to save portfolio");
		}
		setSaving(false);
	}

	function handlePreview() {
		// Save layout to store
		Object.entries(localLayout).forEach(([section, component]) => {
			setLayout(section, component);
		});

		// Save to Zustand first
		Object.keys(localContent).forEach((section) => {
			setContent(section, localContent[section]);
		});
		router.push("/preview/live");
	}

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Left side - Form */}
			<div className="w-1/2 p-8 overflow-y-auto">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
						🎨 Customize Your Portfolio
					</h1>
				</motion.div>
				
				{/* Tab Navigation */}
				<motion.div 
					className="flex mb-8 border-b border-gray-200 dark:border-gray-700"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<motion.button
						className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
							activeTab === "content"
								? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
								: "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
						}`}
						onClick={() => setActiveTab("content")}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						📝 Content
					</motion.button>
					<motion.button
						className={`px-6 py-3 font-medium rounded-t-lg transition-all duration-200 ${
							activeTab === "components"
								? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
								: "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
						}`}
						onClick={() => setActiveTab("components")}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						🎨 Components
					</motion.button>
					
					{/* Debug button */}
					<motion.button
						className="ml-auto px-4 py-2 text-xs bg-gray-200 dark:bg-gray-700 rounded"
						onClick={() => {
							console.log("🎨 [CUSTOMIZE] Debug - Current state:", {
								localLayout,
								layout,
								componentCategories: Object.keys(componentCategories),
								heroComponents: componentCategories.hero?.components
							});
						}}
					>
						🐛 Debug
					</motion.button>
				</motion.div>

				{/* Portfolio Type Selection */}
				<motion.div 
					className="mb-8"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
						🎯 Portfolio Type
					</label>
					<select
						value={portfolioType}
						onChange={(e) => handlePortfolioTypeChange(e.target.value)}
						className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
					>
						<option value="developer">👨‍💻 Developer</option>
						<option value="designer">🎨 Designer</option>
						<option value="marketing">📈 Marketing</option>
						<option value="academic">🎓 Academic</option>
					</select>
				</motion.div>

				{/* Content Tab */}
				<AnimatePresence mode="wait">
					{activeTab === "content" && (
						<motion.div
							key="content"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3 }}
							className="space-y-6"
						>
							{Object.keys(localLayout).map((section, index) => (
								<motion.div
									key={section}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
								>
									<div className="flex items-center justify-between mb-4">
										<div className="font-semibold text-lg capitalize text-gray-900 dark:text-white">
											{section} 
											<span className="text-sm text-blue-600 dark:text-blue-400 ml-2">
												({localLayout[section]})
											</span>
										</div>
										<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
											<span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
												{index + 1}
											</span>
										</div>
									</div>
									<div className="space-y-3">
										{FIELD_MAP[section]?.map((field) => (
											<motion.div
												key={field.name}
												whileHover={{ scale: 1.01 }}
												className="relative"
											>
												<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
													{field.label}
												</label>
												<input
													className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
													placeholder={field.label}
													value={localContent[section]?.[field.name] || ""}
													onChange={(e) =>
														handleChange(section, field.name, e.target.value)
													}
												/>
											</motion.div>
										))}
									</div>
								</motion.div>
							))}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Components Tab */}
				<AnimatePresence mode="wait">
					{activeTab === "components" && (
						<motion.div
							key="components"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3 }}
							className="space-y-6"
						>
							{Object.entries(componentCategories).map(([sectionKey, category], index) => (
								<motion.div
									key={sectionKey}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border-2 transition-all duration-300 ${
										selectedSection === sectionKey 
											? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/20' 
											: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
									}`}
								>
									<div className="flex items-center justify-between mb-4">
										<div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
												{category.label}
												{category.required && <span className="text-red-500 ml-1">*</span>}
											</h3>
											<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
												{category.description}
											</p>
										</div>
										{selectedSection === sectionKey && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
											>
												<svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											</motion.div>
										)}
									</div>
									
									<div className="grid grid-cols-1 gap-3">
										{category.components.map((componentName, compIndex) => (
											<motion.div
												key={componentName}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												onHoverStart={() => setHoveredComponent(componentName)}
												onHoverEnd={() => setHoveredComponent(null)}
											>
												<label 
													className={`relative block cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
														localLayout[sectionKey] === componentName
															? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
															: 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800'
													}`}
													onClick={() => handleComponentChange(sectionKey, componentName)}
												>
													<input
														type="radio"
														name={sectionKey}
														value={componentName}
														checked={localLayout[sectionKey] === componentName}
														onChange={(e) => handleComponentChange(sectionKey, e.target.value)}
														className="sr-only"
													/>
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-3">
															<div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
																localLayout[sectionKey] === componentName
																	? 'border-blue-500 bg-blue-500'
																	: 'border-gray-300 dark:border-gray-600'
															}`}>
																{localLayout[sectionKey] === componentName && (
																	<motion.div
																		initial={{ scale: 0 }}
																		animate={{ scale: 1 }}
																		className="w-2 h-2 bg-white rounded-full"
																	/>
																)}
															</div>
															<span className={`font-medium ${
																localLayout[sectionKey] === componentName
																	? 'text-blue-700 dark:text-blue-300'
																	: 'text-gray-700 dark:text-gray-300'
															}`}>
																{componentName}
															</span>
														</div>
														{localLayout[sectionKey] === componentName && (
															<motion.div
																initial={{ scale: 0, rotate: -180 }}
																animate={{ scale: 1, rotate: 0 }}
																className="text-blue-500"
															>
																<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
																	<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
																</svg>
															</motion.div>
														)}
													</div>
													
													{/* Component Preview */}
													{category.components.length > 1 && (
														<motion.div
															initial={{ opacity: 0, height: 0 }}
															animate={{ 
																opacity: hoveredComponent === componentName ? 1 : 0,
																height: hoveredComponent === componentName ? 'auto' : 0
															}}
															className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
														>
															<div className="text-xs text-gray-500 dark:text-gray-400">
																Preview: {componentName} component
															</div>
														</motion.div>
													)}
												</label>
											</motion.div>
										))}
									</div>
								</motion.div>
							))}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Success Message */}
				<AnimatePresence>
					{success && (
						<motion.div
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -20, scale: 0.95 }}
							className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6"
						>
							<div className="flex items-center space-x-2">
								<motion.div
									animate={{ rotate: 360 }}
									transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
									className="text-2xl"
								>
									🎉
								</motion.div>
								<div>
									<div className="font-bold">Success!</div>
									<div className="text-sm">{success}</div>
									{success.includes("http") && (
										<a 
											href={success.split(": ")[1]} 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-blue-600 hover:text-blue-800 underline text-sm mt-2 inline-block"
										>
											View Your Portfolio →
										</a>
									)}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Action Buttons */}
				<motion.div 
					className="flex gap-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<motion.button
						className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-60 hover:bg-green-700 transition-colors duration-200"
						onClick={handlePreview}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						👁️ Preview Portfolio
					</motion.button>
					<motion.button
						className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-60 hover:bg-blue-700 transition-colors duration-200"
						onClick={handleSave}
						disabled={saving}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						{saving ? (
							<div className="flex items-center justify-center space-x-2">
								<motion.div
									animate={{ rotate: 360 }}
									transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
									className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
								/>
								<span>Saving...</span>
							</div>
						) : (
							"🚀 Publish Portfolio"
						)}
					</motion.button>
				</motion.div>
			</div>

			{/* Right side - Live Preview */}
			<div className="w-1/2 h-screen overflow-y-auto border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
				<motion.div 
					className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 z-10"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
						👀 Live Preview
					</h2>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
						See your changes in real-time
					</p>
				</motion.div>
				<motion.div 
					className="p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<Preview layout={localLayout} content={localContent} portfolioData={portfolioData} />
				</motion.div>
			</div>
		</div>
	);
}
