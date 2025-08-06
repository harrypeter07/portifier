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
import { sampleDataCleanfolio } from "@/data/samplePortfolioData";

const FULL_LAYOUT = {
  hero: "HeroA",
  about: "AboutB",
  experience: "ExperienceA",
  education: "EducationA",
  skills: "SkillsA",
  projects: "ShowcaseA",
  achievements: "AchievementsA",
  contact: "ContactFormA",
};

const PREBUILT_TEMPLATES = [
  {
    name: "Professional Portfolio (A/B Mix)",
    layout: FULL_LAYOUT,
    content: sampleDataCleanfolio,
  },
  {
    name: "Modern Developer (All A)",
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
    content: sampleDataCleanfolio,
  },
  {
    name: "Creative Mix (All B)",
    layout: {
      hero: "HeroB",
      about: "AboutB",
      experience: "ExperienceB",
      education: "EducationA",
      skills: "SkillsA",
      projects: "ShowcaseA",
      achievements: "AchievementsA",
      contact: "ContactFormA",
    },
    content: sampleDataCleanfolio,
  },
  {
    name: "Classic Resume (A Hero, B About, B Experience)",
    layout: {
      hero: "HeroA",
      about: "AboutB",
      experience: "ExperienceB",
      education: "EducationA",
      skills: "SkillsA",
      projects: "ShowcaseA",
      achievements: "AchievementsA",
      contact: "ContactFormA",
    },
    content: sampleDataCleanfolio,
  },
  {
    name: "Showcase First (B Hero, A About, A Experience)",
    layout: {
      hero: "HeroB",
      about: "AboutA",
      experience: "ExperienceA",
      education: "EducationA",
      skills: "SkillsA",
      projects: "ShowcaseA",
      achievements: "AchievementsA",
      contact: "ContactFormA",
    },
    content: sampleDataCleanfolio,
  },
  {
    name: "Balanced Portfolio (A Hero, B About, A Experience, B Hero)",
    layout: {
      hero: "HeroA",
      about: "AboutB",
      experience: "ExperienceA",
      education: "EducationA",
      skills: "SkillsA",
      projects: "ShowcaseA",
      achievements: "AchievementsA",
      contact: "ContactFormA",
    },
    content: sampleDataCleanfolio,
  },
];

export default function ResumeUploadPage() {
	const [file, setFile] = useState(null);
	const [parsed, setParsed] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [portfolioType, setPortfolioType] = useState("developer");
	const [apiStatus, setApiStatus] = useState({ available: true, message: "AI service available" });
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

	// Check API status on component mount
	useEffect(() => {
		async function checkApiStatus() {
			try {
				const healthCheck = await fetch("/api/parse-resume", { method: "GET" });
				const healthData = await healthCheck.json();
				setApiStatus({
					available: healthData.available,
					message: healthData.message
				});
			} catch (error) {
				setApiStatus({
					available: false,
					message: "Unable to connect to AI service"
				});
			}
		}
		
		checkApiStatus();
	}, []);

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
		
		try {
			// First, check if the API is healthy
			console.log("🔍 Checking API health...");
			const healthCheck = await fetch("/api/parse-resume", { method: "GET" });
			const healthData = await healthCheck.json();
			
			if (!healthData.available) {
				throw new Error(healthData.message || "AI service is not available");
			}
			
			console.log("✅ API health check passed:", healthData.message);
		} catch (healthError) {
			console.error("❌ API health check failed:", healthError);
			setError(`AI service unavailable: ${healthError.message}. Please try again later.`);
			setLoading(false);
			return;
		}
		
		const formData = new FormData();
		formData.append("resume", file);
		formData.append("portfolioType", portfolioType);
		try {
			const res = await fetch("/api/parse-resume", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			
			if (!res.ok) {
				// Show specific error message from API
				const errorMessage = data.error || `Server error (${res.status}): ${res.statusText}`;
				throw new Error(errorMessage);
			}

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
			console.error("❌ Resume parsing error:", err);
			
			// Enhanced error message handling
			let errorMessage = err.message || "Failed to parse resume";
			
			// If it's a fetch error, try to get more details
			if (err.name === "TypeError" && err.message.includes("fetch")) {
				errorMessage = "Network error: Unable to connect to the server. Please check your internet connection and try again.";
			}
			
			setError(errorMessage);
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

	function handleNavigateToCustomize() {
		router.push("/editor/customize");
	}

	function handleNavigateToEditResume() {
		router.push("/editor/edit-resume");
	}

	function handleNavigateToTemplatesDemo() {
		router.push("/templates-demo");
	}

	return (
		<div className="min-h-screen flex flex-col-reverse md:flex-row bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Left Panel - Upload and Navigation */}
			<div className={`transition-all duration-500 ${parsed ? 'w-full md:w-1/2' : 'w-full'} p-4 md:p-8 overflow-y-auto order-2 md:order-1`}>
				<h1 className="text-3xl font-extrabold mb-4 text-blue-700 dark:text-blue-200">Start Your Portfolio</h1>
				<div className="mb-6 text-gray-700 dark:text-gray-300 text-base">
					Upload your resume (PDF) to auto-fill your portfolio, or use the navigation below to explore different editing options.
				</div>
				<div className="flex flex-col gap-2 mb-6 p-4 border-2 border-blue-300 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-900 shadow-md">
					{/* API Status Indicator */}
					<div className={`flex items-center gap-2 mb-3 p-2 rounded text-sm ${
						apiStatus.available 
							? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700' 
							: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
					}`}>
						<div className={`w-2 h-2 rounded-full ${apiStatus.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
						<span>{apiStatus.message}</span>
					</div>
					
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
						disabled={!file || loading || !apiStatus.available}
					>
						{loading ? "Parsing..." : "Upload & Parse Resume"}
					</button>
					{error && <div className="text-red-600 mb-2">{error}</div>}
					{!file && !parsedData && (
						<div className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded p-2 mt-1">
							Tip: You can also start with the navigation options below!
						</div>
					)}
				</div>

				{/* Navigation Buttons */}
				<div className="mt-8">
					<div className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Portfolio Editor Options:</div>
					<div className="grid gap-4 md:grid-cols-3">
						<motion.button
							onClick={handleNavigateToCustomize}
							className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] group"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<div className="text-2xl mb-2">🎨</div>
							<div className="font-bold text-lg mb-1">Customize</div>
							<div className="text-sm text-blue-100 text-center">
								Choose and customize individual components
							</div>
						</motion.button>

						<motion.button
							onClick={handleNavigateToEditResume}
							className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] group"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<div className="text-2xl mb-2">✏️</div>
							<div className="font-bold text-lg mb-1">Edit Resume</div>
							<div className="text-sm text-green-100 text-center">
								Edit your resume content and details
							</div>
						</motion.button>

						<motion.button
							onClick={handleNavigateToTemplatesDemo}
							className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center min-h-[120px] group"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<div className="text-2xl mb-2">📋</div>
							<div className="font-bold text-lg mb-1">Templates</div>
							<div className="text-sm text-purple-100 text-center">
								Browse all available templates
							</div>
						</motion.button>
					</div>
				</div>
			</div>
			{/* Right Panel - Live Preview (hidden until parsed) */}
			{parsed && (
				<div ref={previewRef} className="w-full md:w-1/2 h-[60vh] md:h-screen overflow-y-auto custom-thin-slider border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 fixed md:static top-0 right-0 z-30 transition-all duration-500 order-1 md:order-2">
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
