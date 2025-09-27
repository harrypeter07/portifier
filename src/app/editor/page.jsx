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
import GeminiKeyModal from "@/components/common/GeminiKeyModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
	const [isDragOver, setIsDragOver] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [success, setSuccess] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [apiKeyStatus, setApiKeyStatus] = useState({ hasKey: false, loading: true });

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

	useEffect(() => {
		checkApiKeyStatus();
	}, []);

	const checkApiKeyStatus = async () => {
		try {
			const res = await fetch("/api/user/gemini-key");
			const data = await res.json();
			if (res.ok) {
				setApiKeyStatus({ hasKey: data.hasKey, loading: false });
			}
		} catch (error) {
			setApiKeyStatus({ hasKey: false, loading: false });
		}
	};

	const handleApiKeySuccess = () => {
		setApiKeyStatus({ hasKey: true, loading: false });
		setSuccess("API key added successfully! You can now parse resumes.");
		setTimeout(() => setSuccess(""), 3000);
	};

	async function handleFileChange(e) {
		const selectedFile = e.target.files[0];
		console.log("📁 File selected:", {
			name: selectedFile?.name,
			size: selectedFile?.size,
			type: selectedFile?.type
		});
		setFile(selectedFile);
		setParsed(null);
		setError("");
	}

	async function handleUpload() {
		console.log("🚀 Upload triggered with file:", {
			hasFile: !!file,
			fileName: file?.name,
			fileSize: file?.size,
			fileType: file?.type
		});
		
		if (!file) {
			console.error("❌ No file selected");
			setError("Please select a file first");
			return;
		}
		
		// Check if user has API key before proceeding
		if (!apiKeyStatus.hasKey) {
			setIsModalOpen(true);
			return;
		}
		
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
		console.log("📤 Adding file to FormData:", file.name);
		formData.append("file", file);
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
			
			// Check if it's an API key related error
			if (err.message?.includes("requiresApiKey") || err.message?.includes("API key")) {
				setIsModalOpen(true);
				errorMessage = "Please add your Gemini API key to continue.";
			} else if (err.name === "TypeError" && err.message.includes("fetch")) {
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
		<div className="min-h-screen bg-background">
			<div className="flex flex-col-reverse md:flex-row">
			{/* Left Panel - Upload and Navigation */}
			<div className={`transition-all duration-500 ${parsed ? 'w-full md:w-1/2' : 'w-full'} p-4 md:p-8 overflow-y-auto order-2 md:order-1`}>
				<h1 className="text-3xl font-extrabold mb-4 text-foreground">Start Your Portfolio</h1>
				<div className="mb-6 text-muted-foreground text-base">
					Upload your resume (PDF) to auto-fill your portfolio, or use the navigation below to explore different editing options.
				</div>
				<Card className="mb-6">
					<CardContent className="p-4">
						{/* API Status Indicator */}
						<Badge variant={apiStatus.available ? "default" : "destructive"} className="mb-3">
							<div className={`w-2 h-2 rounded-full mr-2 ${apiStatus.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
							{apiStatus.message}
						</Badge>
						
						<input
							type="file"
							accept="application/pdf"
							onChange={handleFileChange}
							disabled={loading}
							className="mb-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
						/>
						<Button
							onClick={handleUpload}
							disabled={!file || loading || !apiStatus.available}
							className="w-full"
						>
							{loading ? "Parsing..." : "Upload & Parse Resume"}
						</Button>
						{error && <div className="text-destructive mb-2">{error}</div>}
						{!file && !parsedData && (
							<div className="text-xs text-muted-foreground bg-muted border rounded p-2 mt-1">
								Tip: You can also start with the navigation options below!
							</div>
						)}
					</CardContent>
				</Card>

				{/* Navigation Buttons */}
				<div className="mt-8">
					<div className="font-semibold text-foreground mb-4">Portfolio Editor Options:</div>
					<div className="grid gap-4 md:grid-cols-3">
						<Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
							<CardContent 
								className="p-6 flex flex-col items-center justify-center min-h-[120px]"
								onClick={handleNavigateToCustomize}
							>
								<div className="text-2xl mb-2">🎨</div>
								<div className="font-bold text-lg mb-1">Customize</div>
								<div className="text-sm text-muted-foreground text-center">
									Choose and customize individual components
								</div>
							</CardContent>
						</Card>

						<Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
							<CardContent 
								className="p-6 flex flex-col items-center justify-center min-h-[120px]"
								onClick={handleNavigateToEditResume}
							>
								<div className="text-2xl mb-2">✏️</div>
								<div className="font-bold text-lg mb-1">Edit Resume</div>
								<div className="text-sm text-muted-foreground text-center">
									Edit your resume content and details
								</div>
							</CardContent>
						</Card>

						<Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
							<CardContent 
								className="p-6 flex flex-col items-center justify-center min-h-[120px]"
								onClick={handleNavigateToTemplatesDemo}
							>
								<div className="text-2xl mb-2">📋</div>
								<div className="font-bold text-lg mb-1">Templates</div>
								<div className="text-sm text-muted-foreground text-center">
									Browse all available templates
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			{/* Right Panel - Live Preview (hidden until parsed) */}
			{parsed && (
				<div ref={previewRef} className="w-full md:w-1/2 h-[60vh] md:h-screen overflow-y-auto custom-thin-slider border-t md:border-t-0 md:border-l border-border bg-card fixed md:static top-0 right-0 z-30 transition-all duration-500 order-1 md:order-2">
					<div className="sticky top-0 bg-card p-4 border-b border-border z-10">
						<h2 className="text-xl font-semibold text-foreground">Live Preview</h2>
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
			<GeminiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleApiKeySuccess} />
			</div>
		</div>
	);
}
