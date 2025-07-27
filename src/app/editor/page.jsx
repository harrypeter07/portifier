"use client";
import { useState, useRef, useEffect } from "react";
import { useLayoutStore } from "@/store/layoutStore";
import { useRouter } from "next/navigation";
import { componentMap } from "@/data/componentMap";
import Preview from "@/components/Preview";
import { motion } from "framer-motion";
import gsap from "gsap";
// Add import for custom slider styles
import "@/styles/customSlider.css";

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
	const [selectedTemplate, setSelectedTemplate] = useState(PREBUILT_TEMPLATES[0]);
	const previewRef = useRef(null);

	useEffect(() => {
		if (parsed && previewRef.current) {
			gsap.fromTo(
				previewRef.current,
				{ x: "100vw", opacity: 0 },
				{ x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
			);
		}
	}, [parsed]);

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

	function handlePreview() {
		router.push("/preview/live");
	}

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Left Panel - Upload and Template Selection */}
			<div className="w-full md:w-1/2 p-4 md:p-8 overflow-y-auto">
				<h1 className="text-3xl font-extrabold mb-4 text-blue-700 dark:text-blue-200">Start Your Portfolio</h1>
				<div className="mb-6 text-gray-700 dark:text-gray-300 text-base">
					Upload your resume (PDF) to auto-fill your portfolio, or pick a template to start from scratch. You can always customize everything later!
				</div>
				<div className="flex flex-col gap-2 mb-6 p-4 border-2 border-blue-300 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-900 shadow-md">
					<input
						type="file"
						accept="application/pdf"
						onChange={handleFileChange}
						disabled={loading}
						className="mb-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
					<button
						className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60 block font-bold text-lg"
						onClick={handleUpload}
						disabled={!file || loading}
					>
						{loading ? "Parsing..." : "Upload & Parse Resume"}
					</button>
					{error && <div className="text-red-600 mb-2">{error}</div>}
					{!file && !parsedData && (
						<div className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded p-2 mt-1">
							Tip: You can also start with a prebuilt template below!
						</div>
					)}
				</div>
				{/* Prebuilt Portfolio Templates Grid */}
				<div className="mt-4">
					<div className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Available Templates:</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{PREBUILT_TEMPLATES.map((tpl) => (
							<motion.div
								key={tpl.name}
								className={`border-2 rounded-xl bg-white dark:bg-gray-900 shadow transition-all flex flex-col items-center p-3 group cursor-pointer ${selectedTemplate.name === tpl.name ? 'border-blue-500 ring-2 ring-blue-300' : 'border-blue-200 dark:border-blue-700'}`}
								whileHover={{ scale: 1.03 }}
								onClick={() => setSelectedTemplate(tpl)}
								tabIndex={0}
								role="button"
								aria-pressed={selectedTemplate.name === tpl.name}
								aria-label={`Select template ${tpl.name}`}
							>
								<div className="font-bold mb-2 text-blue-700 dark:text-blue-300 text-center w-full">{tpl.name}</div>
								<div
									className="w-full max-w-[400px] h-[200px] rounded overflow-x-auto border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center custom-thin-slider"
									style={{ minWidth: 0 }}
								>
									<Preview layout={tpl.layout} content={tpl.content} portfolioData={tpl.content} />
								</div>
								<button
									className="bg-blue-600 text-white px-3 py-1 rounded mt-2 w-full font-semibold group-hover:bg-blue-700 transition-colors"
									onClick={(e) => { e.stopPropagation(); handleTemplateSelect(tpl); }}
								>
									Use Template
								</button>
							</motion.div>
						))}
					</div>
				</div>
			</div>
			{/* Right Panel - Live Preview (hidden until parsed) */}
			{parsed && (
				<div ref={previewRef} className="w-full md:w-1/2 h-[60vh] md:h-screen overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 fixed md:static top-0 right-0 z-30">
					<div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
						<h2 className="text-xl font-semibold">Live Preview</h2>
					</div>
					<div className="p-4">
						{layout && Object.keys(layout).length > 0 ? (
							<Preview 
								layout={layout}
								content={content}
								portfolioData={portfolioData}
							/>
						) : (
							<div className="text-center text-gray-500 dark:text-gray-400 py-8">
								<p>Upload a resume to see the preview</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
