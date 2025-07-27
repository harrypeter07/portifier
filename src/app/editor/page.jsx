"use client";
import { useState } from "react";
import { useLayoutStore } from "@/store/layoutStore";
import { useRouter } from "next/navigation";
import { componentMap } from "@/data/componentMap";
import Preview from "@/components/Preview";

const PREBUILT_TEMPLATES = [
	{
		name: "Professional Portfolio",
		layout: {
			hero: "HeroA",
			about: "AboutA",
			experience: "ExperienceA",
			education: "EducationA",
			skills: "SkillsA",
			projects: "ShowcaseA",
			achievements: "AchievementsA",
			contact: "ContactFormA",
		},
		content: {
			hero: { title: "Your Name", subtitle: "Your Professional Title" },
			about: { summary: "Your professional summary..." },
			experience: { jobs: [] },
			education: { degrees: [] },
			skills: { technical: [], soft: [], languages: [] },
			projects: { items: [] },
			achievements: { awards: [], certifications: [], publications: [] },
			contact: { email: "", phone: "", linkedin: "", github: "" },
		},
	},
	// Add more templates as needed
];

export default function ResumeUploadPage() {
	const [file, setFile] = useState(null);
	const [parsed, setParsed] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [portfolioType, setPortfolioType] = useState("developer");
	const {
		reset,
		setLayout,
		setContent,
		setParsedData,
		setAllContent,
		setAllLayout,
		applyTemplate,
		setCurrentTemplate,
		setResumeId,
		parsedData,
		content,
		portfolioData,
		layout,
		restoreFromParsed,
	} = useLayoutStore();
	const router = useRouter();

	async function handleFileChange(e) {
		setFile(e.target.files[0]);
		setParsed(null);
		setError("");
	}

	async function handleUpload() {
		if (!file) return;
		setLoading(true);
		setError("");
		setParsed(null);
		const formData = new FormData();
		formData.append("resume", file);
		formData.append("portfolioType", portfolioType);
		try {
			const res = await fetch("/api/parse-resume", {
				method: "POST",
				body: formData,
			});
			if (!res.ok) throw new Error("Failed to parse resume");
			const data = await res.json();

			// Check if parsing was successful
			if (!data.success) {
				throw new Error(data.error || "Failed to parse resume");
			}

			setParsed(data);

			// Store resume ID for later association
			if (data.resumeId) {
				setResumeId(data.resumeId);
				console.log("📄 [EDITOR] Resume ID stored:", data.resumeId);
			}

			// Log metadata for debugging
			console.log("📊 Parsing metadata:", data.metadata);

			// Store parsed info in Zustand for later steps
			reset();

			// Set default layout
			const defaultTemplate = PREBUILT_TEMPLATES[0];
			setAllLayout(defaultTemplate.layout);
			setCurrentTemplate(defaultTemplate);

			// Store parsed content and backup
			if (data.content) {
				console.log("📝 [EDITOR] Storing parsed content:", {
					contentKeys: Object.keys(data.content),
					heroData: data.content.hero,
					personalData: data.content.personal,
					contactData: data.content.contact,
					aboutData: data.content.about,
					experienceJobs: data.content.experience?.jobs?.length || 0,
					educationDegrees: data.content.education?.degrees?.length || 0,
					skillsData: data.content.skills,
					projectsItems: data.content.projects?.items?.length || 0
				});
				
				setAllContent(data.content);
				setParsedData(data.content); // Backup for later restoration
				
				console.log("📝 [EDITOR] Content stored in both content and parsedData");
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	function handleTemplateSelect(template) {
		// Apply template while preserving parsed data
		applyTemplate(template);
		router.push("/editor/customize");
	}

	function handleCustomBuilder() {
		router.push("/editor/components");
	}

	function handlePreview() {
		router.push("/preview/live");
	}

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Left Panel - Upload and Template Selection */}
			<div className="w-full md:w-1/2 p-4 md:p-8 overflow-y-auto">
				<h1 className="text-2xl font-bold mb-4">Upload Your Resume (PDF)</h1>
				{parsedData && (
					<div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4">
						<p className="text-green-800 dark:text-green-200 text-sm">
							📁 Your resume data is saved and will persist across pages.
						</p>
					</div>
				)}

				{/* Portfolio Type Selector */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
						Portfolio Type
					</label>
					<select
						value={portfolioType}
						onChange={(e) => setPortfolioType(e.target.value)}
						className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
						disabled={loading}
					>
						<option value="developer">👨‍💻 Developer/Engineer</option>
						<option value="designer">🎨 Designer/Creative</option>
						<option value="marketing">📈 Marketing/Business</option>
					</select>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
						Choose the type that best matches your profession for optimized
						parsing
					</p>
				</div>

				<input
					type="file"
					accept="application/pdf"
					onChange={handleFileChange}
					disabled={loading}
					className="mb-4"
				/>
				<button
					className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60 mb-4 block"
					onClick={handleUpload}
					disabled={!file || loading}
				>
					{loading ? "Parsing..." : "Upload & Parse"}
				</button>
				{error && <div className="text-red-600 mb-4">{error}</div>}
				{parsed && (
					<div className="bg-white dark:bg-gray-900 p-6 rounded shadow">
						<h2 className="text-lg font-semibold mb-4">
							Resume Parsed!
							{parsed.metadata && (
								<span className="text-sm font-normal text-green-600 dark:text-green-400">
									({parsed.metadata.fieldsExtracted} fields extracted)
								</span>
							)}
						</h2>
						<div className="flex flex-col gap-4">
							<div className="flex gap-4">
								<button
									className="bg-amber-600 text-white px-4 py-2 rounded font-semibold flex-1"
									onClick={() => router.push("/editor/edit-resume")}
								>
									Edit Details
								</button>
								<button
									className="bg-green-600 text-white px-4 py-2 rounded font-semibold flex-1"
									onClick={handlePreview}
								>
									Preview Portfolio
								</button>
								<button
									className="bg-blue-600 text-white px-4 py-2 rounded font-semibold flex-1"
									onClick={handleCustomBuilder}
								>
									Custom Builder
								</button>
							</div>
							<div className="font-semibold text-gray-700 dark:text-gray-200 mt-4">
								Or use a prebuilt template:
							</div>
							<div className="grid grid-cols-2 gap-4">
								{PREBUILT_TEMPLATES.map((tpl) => (
									<div
										key={tpl.name}
										className="border rounded p-4 flex flex-col items-center bg-gray-50 dark:bg-gray-800"
									>
										<div className="font-bold mb-2">{tpl.name}</div>
										<button
											className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
											onClick={() => handleTemplateSelect(tpl)}
										>
											Use Template
										</button>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Right Panel - Live Preview */}
			<div className="w-full md:w-1/2 h-[60vh] md:h-screen overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
				<div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
					<h2 className="text-xl font-semibold">Live Preview</h2>
				</div>
				<div className="p-4">
					{parsed && layout && Object.keys(layout).length > 0 ? (
						<>
							{console.log("📝 [EDITOR] Rendering Preview component with:", {
								hasLayout: !!layout,
								layoutKeys: Object.keys(layout),
								hasContent: !!content,
								contentKeys: content ? Object.keys(content) : [],
								hasPortfolioData: !!portfolioData,
								portfolioDataKeys: portfolioData ? Object.keys(portfolioData) : [],
								personalData: portfolioData?.personal ? {
									firstName: portfolioData.personal.firstName,
									lastName: portfolioData.personal.lastName,
									subtitle: portfolioData.personal.subtitle,
									email: portfolioData.personal.email
								} : null
							})}
							<Preview 
								layout={layout}
								content={content}
								portfolioData={portfolioData}
							/>
						</>
					) : (
						<div className="text-center text-gray-500 dark:text-gray-400 py-8">
							<p>Upload a resume to see the preview</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
