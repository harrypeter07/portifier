"use client";
import { useLayoutStore } from "@/store/layoutStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { componentMap, componentCategories, getRecommendedLayout } from "@/data/componentMap";
import Preview from "@/components/Preview";

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
	} = useLayoutStore();
	const [localContent, setLocalContent] = useState({});
	const [localLayout, setLocalLayout] = useState({});
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState("");
	const [activeTab, setActiveTab] = useState("content"); // "content" or "components"
	const router = useRouter();

	// Prefill from resume or Zustand content
	useEffect(() => {
		// If no content but we have parsed data, restore it
		if (Object.keys(content).length === 0 && parsedData) {
			restoreFromParsed();
			return;
		}

		// Initialize layout if empty
		if (Object.keys(layout).length === 0) {
			const recommendedLayout = getRecommendedLayout(portfolioType);
			setLocalLayout(recommendedLayout);
		} else {
			setLocalLayout(layout);
		}

		const initial = {};
		Object.keys(localLayout).forEach((section) => {
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
	}, [layout, content, portfolioData, parsedData, restoreFromParsed, portfolioType, localLayout]);

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
		setLocalLayout(prev => ({
			...prev,
			[section]: componentName
		}));
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
					email: userEmail,
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
				<h1 className="text-2xl font-bold mb-4">Customize Your Portfolio</h1>
				
				{/* Tab Navigation */}
				<div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
					<button
						className={`px-4 py-2 font-medium ${
							activeTab === "content"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("content")}
					>
						Content
					</button>
					<button
						className={`px-4 py-2 font-medium ${
							activeTab === "components"
								? "text-blue-600 border-b-2 border-blue-600"
								: "text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("components")}
					>
						Components
					</button>
				</div>

				{/* Portfolio Type Selection */}
				<div className="mb-6">
					<label className="block text-sm font-medium mb-2">Portfolio Type</label>
					<select
						value={portfolioType}
						onChange={(e) => handlePortfolioTypeChange(e.target.value)}
						className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
					>
						<option value="developer">Developer</option>
						<option value="designer">Designer</option>
						<option value="marketing">Marketing</option>
						<option value="academic">Academic</option>
					</select>
				</div>

				{/* Content Tab */}
				{activeTab === "content" && (
					<form
						className="flex flex-col gap-6"
						onSubmit={(e) => {
							e.preventDefault();
							handleSave();
						}}
					>
						{Object.keys(localLayout).map((section) => (
							<div
								key={section}
								className="bg-white dark:bg-gray-900 p-4 rounded shadow"
							>
								<div className="font-semibold mb-2 capitalize">
									{section} ({localLayout[section]})
								</div>
								{FIELD_MAP[section]?.map((field) => (
									<input
										key={field.name}
										className="border p-2 rounded w-full mb-2 dark:bg-gray-800 dark:border-gray-600"
										placeholder={field.label}
										value={localContent[section]?.[field.name] || ""}
										onChange={(e) =>
											handleChange(section, field.name, e.target.value)
										}
									/>
								))}
							</div>
						))}
					</form>
				)}

				{/* Components Tab */}
				{activeTab === "components" && (
					<div className="space-y-6">
						{Object.entries(componentCategories).map(([sectionKey, category]) => (
							<div
								key={sectionKey}
								className="bg-white dark:bg-gray-900 p-4 rounded shadow"
							>
								<div className="font-semibold mb-3 capitalize">
									{category.label}
									{category.required && <span className="text-red-500 ml-1">*</span>}
								</div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
									{category.description}
								</p>
								<div className="space-y-2">
									{category.components.map((componentName) => (
										<label
											key={componentName}
											className="flex items-center space-x-2 cursor-pointer"
										>
											<input
												type="radio"
												name={sectionKey}
												value={componentName}
												checked={localLayout[sectionKey] === componentName}
												onChange={(e) => handleComponentChange(sectionKey, e.target.value)}
												className="text-blue-600"
											/>
											<span className="text-sm">{componentName}</span>
										</label>
									))}
								</div>
							</div>
						))}
					</div>
				)}

				{success && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
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
				)}
				<div className="flex gap-4">
					<button
						className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-60"
						type="button"
						onClick={handlePreview}
					>
						Preview Portfolio
					</button>
					<button
						className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
						type="button"
						onClick={handleSave}
						disabled={saving}
					>
						{saving ? "Saving..." : "Publish Portfolio"}
					</button>
				</div>
			</div>

			{/* Right side - Live Preview */}
			<div className="w-1/2 h-screen overflow-y-auto border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
				<div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
					<h2 className="text-xl font-semibold">Live Preview</h2>
				</div>
				<div className="p-4">
					<Preview layout={localLayout} content={localContent} portfolioData={portfolioData} />
				</div>
			</div>
		</div>
	);
}
