"use client";
import { useLayoutStore } from "@/store/layoutStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { componentMap } from "@/data/componentMap";

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
		{ name: "title", label: "Professional Title", path: "personal.title" },
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
		updatePortfolioData,
		parsedData,
		restoreFromParsed,
		currentTemplate,
	} = useLayoutStore();
	const [localContent, setLocalContent] = useState({});
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState("");
	const router = useRouter();

	// Prefill from resume or Zustand content
	useEffect(() => {
		// If no content but we have parsed data, restore it
		if (Object.keys(content).length === 0 && parsedData) {
			restoreFromParsed();
			return;
		}

		const initial = {};
		Object.keys(layout).forEach((section) => {
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
	}, [layout, content, portfolioData, parsedData, restoreFromParsed]);

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

	async function handleSave() {
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
				layout,
				content: localContent,
				portfolioData, // Include the updated portfolio data
				email: userEmail,
			}),
		});
			const data = await res.json();
			if (res.ok && data.success) {
				setSuccess(
					"Portfolio saved! View your portfolio on your profile page."
				);
				// Optionally: router.push(`/dashboard`);
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
				<form
					className="flex flex-col gap-6"
					onSubmit={(e) => {
						e.preventDefault();
						handleSave();
					}}
				>
					{Object.keys(layout).map((section) => (
						<div
							key={section}
							className="bg-white dark:bg-gray-900 p-4 rounded shadow"
						>
							<div className="font-semibold mb-2 capitalize">
								{section} ({layout[section]})
							</div>
							{FIELD_MAP[section]?.map((field) => (
								<input
									key={field.name}
									className="border p-2 rounded w-full mb-2"
									placeholder={field.label}
									value={localContent[section]?.[field.name] || ""}
									onChange={(e) =>
										handleChange(section, field.name, e.target.value)
									}
								/>
							))}
						</div>
					))}
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
							type="submit"
							disabled={saving}
						>
							{saving ? "Saving..." : "Save & Finish"}
						</button>
					</div>
					{success && <div className="text-green-600">{success}</div>}
				</form>
			</div>

			{/* Right side - Live Preview */}
			<div className="w-1/2 h-screen overflow-y-auto border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
				<div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
					<h2 className="text-xl font-semibold">Live Preview</h2>
				</div>
				<div className="p-4">
					{Object.entries(layout).map(([section, componentName]) => {
						const Component = componentMap[componentName];
						if (!Component) return null;

						let componentProps = localContent[section] || {};

						// For hero section, always use portfolioData
						if (section === "hero") {
							componentProps = { data: portfolioData };
						}

						// For projects section, handle the new schema structure
						if (section === "projects" && localContent[section]?.items) {
							componentProps = { items: localContent[section].items };
						}

						// For skills section, flatten the structure
						if (section === "skills" && localContent[section]) {
							componentProps = {
								technical: localContent[section].technical || [],
								soft: localContent[section].soft || [],
								languages: localContent[section].languages || [],
							};
						}

						// For achievements section, flatten the structure
						if (section === "achievements" && localContent[section]) {
							componentProps = {
								awards: localContent[section].awards || [],
								certifications: localContent[section].certifications || [],
								publications: localContent[section].publications || [],
							};
						}

						// For experience section, flatten the structure
						if (section === "experience" && localContent[section]?.jobs) {
							componentProps = { jobs: localContent[section].jobs };
						}

						// For education section, flatten the structure
						if (section === "education" && localContent[section]?.degrees) {
							componentProps = { degrees: localContent[section].degrees };
						}

						return (
							<div key={section} className="mb-8 last:mb-0">
								<Component {...componentProps} />
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
