"use client";
import { useState, useEffect, Suspense } from "react";
import { useLayoutStore } from "@/store/layoutStore";
import { useRouter, useSearchParams } from "next/navigation";
import { componentMap } from "@/data/componentMap";
import Preview from "@/components/Preview";
import AICompanionField from "@/components/AICompanionField";
import { isAIEnabled, getAILabel } from "@/data/aiFieldConfig";
import Modal from "@/components/common/Modal";
import PortfolioUrlDisplay from "@/components/common/PortfolioUrlDisplay";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";

function EditResumeContent() {
	const {
		content,
		setContent,
		layout,
		parsedData,
		restoreFromParsed,
		setAllContent,
		portfolioData,
		updatePortfolioData,
		setPortfolioData,
		resumeId,
		currentTemplate,
	} = useLayoutStore();
	const [formData, setFormData] = useState({
		hero: { title: "", subtitle: "", tagline: "", availability: "" },
		about: { summary: "", bio: "", interests: [], personalValues: [], funFacts: [] },
		contact: { email: "", phone: "", location: "", linkedin: "" },
		experience: { jobs: [] },
		education: { degrees: [] },
		skills: { technical: [], soft: [] },
		projects: { items: [] },
		achievements: { awards: [] },
		languages: [],
		hobbies: [],
	});
	const router = useRouter();
	const [modal, setModal] = useState({ open: false, title: '', message: '', onConfirm: null, onCancel: null, confirmText: 'OK', cancelText: 'Cancel', showCancel: false, error: false });
	const [username, setUsername] = useState("");
	const [existingPortfolio, setExistingPortfolio] = useState(null);
	const searchParams = useSearchParams();

	// Fetch username on mount
	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (res.ok && data.user?.username) {
					console.log("👤 [EDIT-RESUME] Username fetched:", data.user.username);
					setUsername(data.user.username);
					
					// Check if we're editing a specific portfolio from URL parameters
					const portfolioId = searchParams.get('portfolioId');
					const portfolioUsername = searchParams.get('username');
					
					if (portfolioId && portfolioUsername) {
						// We're editing a specific portfolio from dashboard
						console.log("🎯 [EDIT-RESUME] Editing specific portfolio from URL:", {
							portfolioId,
							portfolioUsername
						});
						
						// Fetch the specific portfolio data
						const portfolioRes = await fetch(`/api/portfolio/${portfolioUsername}`);
						if (portfolioRes.ok) {
							const portfolioData = await portfolioRes.json();
							setExistingPortfolio(portfolioData.portfolio);
							console.log("📁 [EDIT-RESUME] Found specific portfolio:", portfolioData.portfolio._id);
						}
					} else {
						// Check if user has an existing portfolio (general case)
						const portfolioRes = await fetch(`/api/portfolio/${data.user.username}`);
						if (portfolioRes.ok) {
							const portfolioData = await portfolioRes.json();
							setExistingPortfolio(portfolioData.portfolio);
							console.log("📁 [EDIT-RESUME] Found existing portfolio:", portfolioData.portfolio._id);
						}
					}
				} else {
					console.error("❌ [EDIT-RESUME] No username found in response:", data);
				}
			} catch (error) {
				console.error("❌ [EDIT-RESUME] Failed to fetch username:", error);
			}
		})();
	}, [searchParams]);

	// No slug flow; publish to /{username}

	useEffect(() => {
		console.log("📝 [EDIT-RESUME] useEffect triggered:", {
			hasContent: Object.keys(content).length > 0,
			hasParsedData: !!parsedData,
			hasPortfolioData: !!portfolioData,
			contentKeys: Object.keys(content),
			portfolioDataKeys: portfolioData ? Object.keys(portfolioData) : []
		});

		// If no content but we have parsed data, restore it first
		if (Object.keys(content).length === 0 && parsedData) {
			console.log("📝 [EDIT-RESUME] Restoring from parsed data");
			restoreFromParsed();
			return;
		}
		
		// Initialize with existing portfolioData or content (for backwards compatibility)
		const data = portfolioData || content;
		console.log("📝 [EDIT-RESUME] Using data source:", {
			source: portfolioData ? "portfolioData" : "content",
			dataKeys: Object.keys(data),
			hasPersonal: !!data.personal,
			hasHero: !!data.hero,
			hasAbout: !!data.about,
			hasContact: !!data.contact
		});
		
		const formDataToSet = {
			hero: {
				title: data.personal?.firstName && data.personal?.lastName 
					? `${data.personal.firstName} ${data.personal.lastName}`.trim()
					: data.hero?.title || "",
				subtitle: data.personal?.subtitle || data.hero?.subtitle || "",
				tagline: data.personal?.tagline || data.hero?.tagline || "",
				availability: data.personal?.availability || data.hero?.availability || "",
			},
			about: {
				summary: data.about?.summary || "",
				bio: data.about?.bio || "",
				interests: data.about?.interests || [],
				personalValues: data.about?.personalValues || [],
				funFacts: data.about?.funFacts || [],
			},
			contact: {
				email: data.personal?.email || data.contact?.email || "",
				phone: data.personal?.phone || data.contact?.phone || "",
				location: data.personal?.location?.city && data.personal?.location?.state
					? `${data.personal.location.city}, ${data.personal.location.state}`
					: data.contact?.location || "",
				linkedin: data.personal?.social?.linkedin || data.contact?.linkedin || "",
			},
			experience: data.experience || { jobs: [] },
			education: data.education || { degrees: [] },
			skills: data.skills || { technical: [], soft: [] },
			projects: data.projects || { items: [] },
			achievements: data.achievements || { awards: [] },
			languages: data.skills?.languages?.map(l => l.name) || 
				(Array.isArray(data.languages)
					? data.languages.map(String)
					: typeof data.languages === "string"
					? data.languages
							.split(",")
							.map((s) => s.trim())
							.filter(Boolean)
					: []),
			hobbies: data.hobbies || [],
		};

		console.log("📝 [EDIT-RESUME] Setting form data:", {
			hero: {
				title: formDataToSet.hero.title,
				subtitle: formDataToSet.hero.subtitle,
				tagline: formDataToSet.hero.tagline,
				availability: formDataToSet.hero.availability
			},
			contact: {
				email: formDataToSet.contact.email,
				phone: formDataToSet.contact.phone,
				location: formDataToSet.contact.location,
				linkedin: formDataToSet.contact.linkedin
			},
			about: {
				summary: formDataToSet.about.summary,
				bio: formDataToSet.about.bio
			},
			experienceJobs: formDataToSet.experience.jobs?.length || 0,
			educationDegrees: formDataToSet.education.degrees?.length || 0,
			skillsTechnical: formDataToSet.skills.technical?.length || 0,
			projectsItems: formDataToSet.projects.items?.length || 0,
			languages: formDataToSet.languages?.length || 0
		});

		setFormData(formDataToSet);
	}, [content, portfolioData, parsedData, restoreFromParsed]);

	const handleInputChange = (section, field, value) => {
		setFormData((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: value,
			},
		}));
	};

	const handleArrayChange = (section, field, index, value) => {
		setFormData((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: prev[section][field].map((item, i) =>
					i === index ? value : item
				),
			},
		}));
	};

	const addArrayItem = (section, field, defaultValue = "") => {
		setFormData((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: [...prev[section][field], defaultValue],
			},
		}));
	};

	const removeArrayItem = (section, field, index) => {
		setFormData((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: prev[section][field].filter((_, i) => i !== index),
			},
		}));
	};

	const addJob = () => {
		addArrayItem("experience", "jobs", {
			title: "",
			company: "",
			duration: "",
			description: "",
		});
	};

	const addDegree = () => {
		addArrayItem("education", "degrees", {
			degree: "",
			institution: "",
			year: "",
		});
	};

	const handleProjectChange = (index, field, value) => {
		setFormData((prev) => ({
			...prev,
			projects: {
				...prev.projects,
				items: prev.projects.items.map((item, i) =>
					i === index ? { ...item, [field]: value } : item
				),
			},
		}));
	};
	const addProject = () => {
		setFormData((prev) => ({
			...prev,
			projects: {
				...prev.projects,
				items: [
					...prev.projects.items,
					{
						title: "",
						description: "",
						github: "",
						url: "",
					},
				],
			},
		}));
	};
	const removeProject = (index) => {
		setFormData((prev) => ({
			...prev,
			projects: {
				...prev.projects,
				items: prev.projects.items.filter((_, i) => i !== index),
			},
		}));
	};

	const handleSave = async () => {
		console.log("💾 [EDIT-RESUME] Save triggered with form data:", {
			hero: formData.hero,
			contact: formData.contact,
			about: formData.about,
			experienceJobs: formData.experience?.jobs?.length || 0,
			educationDegrees: formData.education?.degrees?.length || 0,
			skillsTechnical: formData.skills?.technical?.length || 0,
			projectsItems: formData.projects?.items?.length || 0,
			languages: formData.languages?.length || 0
		});

		// Save all form data to new schema format
		const newPortfolioData = { ...portfolioData };
		
		// Transform form data to new schema
		if (formData.hero) {
			const nameParts = (formData.hero.title || "").split(" ");
			newPortfolioData.personal.firstName = nameParts[0] || "";
			newPortfolioData.personal.lastName = nameParts.slice(1).join(" ") || "";
			newPortfolioData.personal.subtitle = formData.hero.subtitle || "";
			newPortfolioData.personal.tagline = formData.hero.tagline || "";
			newPortfolioData.personal.availability = formData.hero.availability || "";

			console.log("💾 [EDIT-RESUME] Transformed hero data:", {
				originalTitle: formData.hero.title,
				nameParts,
				firstName: newPortfolioData.personal.firstName,
				lastName: newPortfolioData.personal.lastName,
				subtitle: newPortfolioData.personal.subtitle,
				tagline: newPortfolioData.personal.tagline,
				availability: newPortfolioData.personal.availability
			});
		}
		
		if (formData.about) {
			newPortfolioData.about.summary = formData.about.summary || "";
			newPortfolioData.about.bio = formData.about.bio || "";
			newPortfolioData.about.interests = formData.about.interests || [];
			newPortfolioData.about.personalValues = formData.about.personalValues || [];
			newPortfolioData.about.funFacts = formData.about.funFacts || [];
		}
		
		if (formData.contact) {
			newPortfolioData.personal.email = formData.contact.email || "";
			newPortfolioData.personal.phone = formData.contact.phone || "";
			newPortfolioData.personal.social.linkedin = formData.contact.linkedin || "";
			
			if (formData.contact.location) {
				const locationParts = formData.contact.location.split(",").map(p => p.trim());
				newPortfolioData.personal.location.city = locationParts[0] || "";
				newPortfolioData.personal.location.state = locationParts[1] || "";
				newPortfolioData.personal.location.country = locationParts[2] || "";
			}
		}
		
		if (formData.experience) {
			newPortfolioData.experience.jobs = formData.experience.jobs || [];
		}
		
		if (formData.education) {
			newPortfolioData.education.degrees = formData.education.degrees || [];
		}
		
		if (formData.skills) {
			newPortfolioData.skills.technical = formData.skills.technical || [];
			newPortfolioData.skills.soft = formData.skills.soft || [];
		}
		
		if (formData.projects) {
			newPortfolioData.projects.items = formData.projects.items || [];
		}
		
		if (formData.achievements) {
			newPortfolioData.achievements.awards = formData.achievements.awards || [];
		}
		
		if (formData.languages) {
			newPortfolioData.skills.languages = formData.languages.map(lang => ({
				name: lang,
				proficiency: "conversational",
				certification: ""
			}));
		}
		
		console.log("💾 [EDIT-RESUME] Final portfolio data to save:", {
			personal: {
				firstName: newPortfolioData.personal.firstName,
				lastName: newPortfolioData.personal.lastName,
				subtitle: newPortfolioData.personal.subtitle,
				email: newPortfolioData.personal.email,
				phone: newPortfolioData.personal.phone
			},
			about: {
				summary: newPortfolioData.about.summary,
				bio: newPortfolioData.about.bio
			},
			experienceJobs: newPortfolioData.experience.jobs?.length || 0,
			educationDegrees: newPortfolioData.education.degrees?.length || 0,
			skillsTechnical: newPortfolioData.skills.technical?.length || 0,
			projectsItems: newPortfolioData.projects.items?.length || 0,
			languages: newPortfolioData.skills.languages?.length || 0
		});

		// Save to store
		setPortfolioData(newPortfolioData);
		
		// Also save to legacy content for backwards compatibility
		Object.entries(formData).forEach(([section, data]) => {
			setContent(section, data);
		});

		console.log("💾 [EDIT-RESUME] Data saved to both portfolioData and content stores");
		
		// Show confirmation modal instead of window.confirm
		setModal({
			open: true,
			title: 'Publish Portfolio?',
			message: 'Do you want to publish your portfolio now? Click OK to publish, Cancel to continue editing.',
			confirmText: 'Publish',
			cancelText: 'Continue Editing',
			showCancel: true,
			error: false,
			onConfirm: async () => {
				setModal(m => ({ ...m, open: false }));
				console.log("🚀 [EDIT-RESUME] Publishing portfolio with username:", username);
				try {
					// Get current template from store
					const { currentTemplate, portfolioType } = useLayoutStore.getState();
					
					console.log("💾 [EDIT-RESUME] Publishing portfolio with template:", {
						templateId: currentTemplate?.id,
						templateName: currentTemplate?.name,
						templateType: currentTemplate?.type,
						portfolioType
					});

					const res = await fetch("/api/portfolio/save", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							layout: layout,
							content: formData,
							portfolioData: newPortfolioData,
							resumeId: resumeId,
							username,
							portfolioId: existingPortfolio?._id, // Add portfolio ID if editing existing portfolio
							// Include template information
							templateName: currentTemplate?.id || currentTemplate?.name || "cleanfolio",
							templateId: currentTemplate?.id || "cleanfolio",
							templateType: currentTemplate?.type || "component",
							portfolioType: portfolioType || "developer",
							currentTemplate: currentTemplate, // Include full template object
						}),
					});
					const data = await res.json();
					console.log("📊 [EDIT-RESUME] Save response:", { success: data.success, portfolioUrl: data.portfolioUrl, templateId: data.templateId, templateName: data.templateName, error: data.error });
					if (res.ok && data.success) {
						console.log("✅ [EDIT-RESUME] Portfolio published successfully with template:", {
							templateId: data.templateId,
							templateName: data.templateName,
							redirectUrl: `/portfolio/${data.username || username}`
						});
						// Redirect directly to analytics dashboard instead of showing modal
						const redirectUrl = `/portfolio/${data.username || username}`;
						console.log("🎯 [EDIT-RESUME] Redirecting to analytics dashboard:", redirectUrl);
						router.push(redirectUrl);
					} else {
						// Slug errors are not applicable anymore
						setModal({
							open: true,
							title: 'Error',
							message: data.error || 'Failed to publish portfolio',
							confirmText: 'OK',
							showCancel: false,
							error: true,
							onConfirm: () => { setModal(m => ({ ...m, open: false })); router.push("/editor/customize"); },
						});
					}
				} catch (err) {
					setModal({
						open: true,
						title: 'Error',
						message: 'Failed to publish portfolio',
						confirmText: 'OK',
						showCancel: false,
						error: true,
						onConfirm: () => { setModal(m => ({ ...m, open: false })); router.push("/editor/customize"); },
					});
				}
			},
			onCancel: () => {
				setModal(m => ({ ...m, open: false }));
				router.push("/editor/customize");
			},
		});
	};

	const handlePreview = () => {
		console.log("👁️ [EDIT-RESUME] Preview triggered with form data:", {
			hero: formData.hero,
			contact: formData.contact,
			about: formData.about,
			experienceJobs: formData.experience?.jobs?.length || 0,
			educationDegrees: formData.education?.degrees?.length || 0,
			skillsTechnical: formData.skills?.technical?.length || 0,
			projectsItems: formData.projects?.items?.length || 0,
			languages: formData.languages?.length || 0
		});

		// Save data first (same logic as handleSave)
		const newPortfolioData = { ...portfolioData };
		
		// Transform form data to new schema
		if (formData.hero) {
			const nameParts = (formData.hero.title || "").split(" ");
			newPortfolioData.personal.firstName = nameParts[0] || "";
			newPortfolioData.personal.lastName = nameParts.slice(1).join(" ") || "";
			newPortfolioData.personal.title = formData.hero.subtitle || "";
			newPortfolioData.personal.tagline = formData.hero.tagline || "";
			newPortfolioData.personal.availability = formData.hero.availability || "";
		}
		
		if (formData.about) {
			newPortfolioData.about.summary = formData.about.summary || "";
			newPortfolioData.about.bio = formData.about.bio || "";
			newPortfolioData.about.interests = formData.about.interests || [];
			newPortfolioData.about.personalValues = formData.about.personalValues || [];
			newPortfolioData.about.funFacts = formData.about.funFacts || [];
		}
		
		if (formData.contact) {
			newPortfolioData.personal.email = formData.contact.email || "";
			newPortfolioData.personal.phone = formData.contact.phone || "";
			newPortfolioData.personal.social.linkedin = formData.contact.linkedin || "";
			
			if (formData.contact.location) {
				const locationParts = formData.contact.location.split(",").map(p => p.trim());
				newPortfolioData.personal.location.city = locationParts[0] || "";
				newPortfolioData.personal.location.state = locationParts[1] || "";
				newPortfolioData.personal.location.country = locationParts[2] || "";
			}
		}
		
		if (formData.experience) {
			newPortfolioData.experience.jobs = formData.experience.jobs || [];
		}
		
		if (formData.education) {
			newPortfolioData.education.degrees = formData.education.degrees || [];
		}
		
		if (formData.skills) {
			newPortfolioData.skills.technical = formData.skills.technical || [];
			newPortfolioData.skills.soft = formData.skills.soft || [];
		}
		
		if (formData.projects) {
			newPortfolioData.projects.items = formData.projects.items || [];
		}
		
		if (formData.achievements) {
			newPortfolioData.achievements.awards = formData.achievements.awards || [];
		}
		
		if (formData.languages) {
			newPortfolioData.skills.languages = formData.languages.map(lang => ({
				name: lang,
				proficiency: "conversational",
				certification: ""
			}));
		}
		
		// Save to store
		setPortfolioData(newPortfolioData);
		
		// Also save to legacy content for backwards compatibility
		Object.entries(formData).forEach(([section, data]) => {
			setContent(section, data);
		});

		console.log("👁️ [EDIT-RESUME] Data saved, navigating to preview");
		// Navigate to preview
		router.push("/preview/live");
	};



	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<div className="flex flex-col-reverse md:flex-row">
				{/* Left Panel - Form */}
				<div className="w-full md:w-1/2 p-4 md:p-6 overflow-y-auto h-auto md:h-screen">
					<div className="flex items-center justify-between mb-4 md:mb-6">
						<h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
							Edit Resume Details
						</h1>
						
						{/* Quick Actions */}
						<div className="flex items-center space-x-2">
							<motion.button
								onClick={() => router.push("/editor")}
								className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								← Back to Upload
							</motion.button>
							<motion.button
								onClick={() => router.push("/editor/customize")}
								className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Customize →
							</motion.button>
						</div>
					</div>

					{/* Personal Information */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Personal Information</h2>
						<div className="grid grid-cols-1 gap-4">
							<AICompanionField
								type="input"
								placeholder="Full Name"
								value={formData.hero?.title || ""}
								onChange={(value) => handleInputChange("hero", "title", value)}
								aiEnabled={isAIEnabled("hero", "title")}
								aiSection="hero"
								aiField="title"
								aiLabel={getAILabel("hero", "title")}
								resumeData={formData}
							/>
							<AICompanionField
								type="input"
								placeholder="Professional Title (e.g., Software Developer)"
								value={formData.hero?.subtitle || ""}
								onChange={(value) => handleInputChange("hero", "subtitle", value)}
								aiEnabled={isAIEnabled("hero", "subtitle")}
								aiSection="hero"
								aiField="subtitle"
								aiLabel={getAILabel("hero", "subtitle")}
								resumeData={formData}
							/>
							<AICompanionField
								type="input"
								placeholder="Tagline (e.g., Passionate Coder, Creative Designer)"
								value={formData.hero?.tagline || ""}
								onChange={(value) => handleInputChange("hero", "tagline", value)}
								aiEnabled={isAIEnabled("hero", "tagline")}
								aiSection="hero"
								aiField="tagline"
								aiLabel={getAILabel("hero", "tagline")}
								resumeData={formData}
							/>
							<AICompanionField
								type="input"
								placeholder="Availability (e.g., Open to work, Freelance only)"
								value={formData.hero?.availability || ""}
								onChange={(value) => handleInputChange("hero", "availability", value)}
								aiEnabled={isAIEnabled("hero", "availability")}
								aiSection="hero"
								aiField="availability"
								aiLabel={getAILabel("hero", "availability")}
								resumeData={formData}
							/>
						</div>
					</div>

					{/* Contact Information */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Contact Information</h2>
						<div className="grid grid-cols-1 gap-4">
							<AICompanionField
								type="email"
								placeholder="Email Address"
								value={formData.contact?.email || ""}
								onChange={(value) => handleInputChange("contact", "email", value)}
								aiEnabled={isAIEnabled("contact", "email")}
								aiSection="contact"
								aiField="email"
								aiLabel={getAILabel("contact", "email")}
								resumeData={formData}
							/>
							<AICompanionField
								type="tel"
								placeholder="Phone Number"
								value={formData.contact?.phone || ""}
								onChange={(value) => handleInputChange("contact", "phone", value)}
								aiEnabled={isAIEnabled("contact", "phone")}
								aiSection="contact"
								aiField="phone"
								aiLabel={getAILabel("contact", "phone")}
								resumeData={formData}
							/>
							<AICompanionField
								type="input"
								placeholder="Location (City, Country)"
								value={formData.contact?.location || ""}
								onChange={(value) => handleInputChange("contact", "location", value)}
								aiEnabled={isAIEnabled("contact", "location")}
								aiSection="contact"
								aiField="location"
								aiLabel={getAILabel("contact", "location")}
								resumeData={formData}
							/>
							<AICompanionField
								type="url"
								placeholder="LinkedIn Profile"
								value={formData.contact?.linkedin || ""}
								onChange={(value) => handleInputChange("contact", "linkedin", value)}
								aiEnabled={isAIEnabled("contact", "linkedin")}
								aiSection="contact"
								aiField="linkedin"
								aiLabel={getAILabel("contact", "linkedin")}
								resumeData={formData}
							/>
						</div>
					</div>

					{/* Professional Summary & About */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Professional Summary & About</h2>
						<div className="space-y-4">
							<AICompanionField
								type="textarea"
								placeholder="Write a brief professional summary about yourself..."
								value={formData.about?.summary || ""}
								onChange={(value) => handleInputChange("about", "summary", value)}
								rows={4}
								aiEnabled={isAIEnabled("about", "summary")}
								aiSection="about"
								aiField="summary"
								aiLabel={getAILabel("about", "summary")}
								resumeData={formData}
							/>
							<AICompanionField
								type="textarea"
								placeholder="Bio (detailed background, story, or philosophy)"
								value={formData.about?.bio || ""}
								onChange={(value) => handleInputChange("about", "bio", value)}
								rows={3}
								aiEnabled={isAIEnabled("about", "bio")}
								aiSection="about"
								aiField="bio"
								aiLabel={getAILabel("about", "bio")}
								resumeData={formData}
							/>
							<AICompanionField
								type="input"
								placeholder="Interests (comma-separated)"
								value={(formData.about?.interests || []).join(", ")}
								onChange={(value) => {
									if (Array.isArray(value)) {
										handleInputChange("about", "interests", value);
									} else if (typeof value === 'string') {
										handleInputChange("about", "interests", value.split(",").map(s => s.trim()).filter(Boolean));
									} else {
										handleInputChange("about", "interests", []);
									}
								}}
								aiEnabled={isAIEnabled("about", "interests")}
								aiSection="about"
								aiField="interests"
								aiLabel={getAILabel("about", "interests")}
								resumeData={formData}
							/>
							<AICompanionField
								type="input"
								placeholder="Personal Values (comma-separated)"
								value={(formData.about?.personalValues || []).join(", ")}
								onChange={(value) => {
									if (Array.isArray(value)) {
										handleInputChange("about", "personalValues", value);
									} else if (typeof value === 'string') {
										handleInputChange("about", "personalValues", value.split(",").map(s => s.trim()).filter(Boolean));
									} else {
										handleInputChange("about", "personalValues", []);
									}
								}}
								aiEnabled={isAIEnabled("about", "personalValues")}
								aiSection="about"
								aiField="personalValues"
								aiLabel={getAILabel("about", "personalValues")}
								resumeData={formData}
							/>
							<AICompanionField
								type="input"
								placeholder="Fun Facts (comma-separated)"
								value={(formData.about?.funFacts || []).join(", ")}
								onChange={(value) => {
									if (Array.isArray(value)) {
										handleInputChange("about", "funFacts", value);
									} else if (typeof value === 'string') {
										handleInputChange("about", "funFacts", value.split(",").map(s => s.trim()).filter(Boolean));
									} else {
										handleInputChange("about", "funFacts", []);
									}
								}}
								aiEnabled={isAIEnabled("about", "funFacts")}
								aiSection="about"
								aiField="funFacts"
								aiLabel={getAILabel("about", "funFacts")}
								resumeData={formData}
							/>
						</div>
					</div>

					{/* Experience */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Work Experience</h2>
						{(formData.experience?.jobs || []).map((job, index) => (
							<div
								key={index}
								className="mb-6 p-4 border rounded-lg dark:border-gray-600"
							>
								<div className="grid grid-cols-1 gap-3 mb-3">
									<AICompanionField
										type="input"
										placeholder="Job Title"
										value={job?.title || ""}
										onChange={(value) =>
											handleArrayChange("experience", "jobs", index, {
												...job,
												title: value,
											})
										}
										aiEnabled={isAIEnabled("experience", "title")}
										aiSection="experience"
										aiField="title"
										aiLabel={getAILabel("experience", "title")}
										resumeData={formData}
									/>
									<AICompanionField
										type="input"
										placeholder="Company Name"
										value={job?.company || ""}
										onChange={(value) =>
											handleArrayChange("experience", "jobs", index, {
												...job,
												company: value,
											})
										}
										aiEnabled={isAIEnabled("experience", "company")}
										aiSection="experience"
										aiField="company"
										aiLabel={getAILabel("experience", "company")}
										resumeData={formData}
									/>
									<AICompanionField
										type="input"
										placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
										value={job?.duration || ""}
										onChange={(value) =>
											handleArrayChange("experience", "jobs", index, {
												...job,
												duration: value,
											})
										}
										aiEnabled={isAIEnabled("experience", "duration")}
										aiSection="experience"
										aiField="duration"
										aiLabel={getAILabel("experience", "duration")}
										resumeData={formData}
									/>
									<AICompanionField
										type="textarea"
										placeholder="Job Description"
										value={job?.description || ""}
										onChange={(value) =>
											handleArrayChange("experience", "jobs", index, {
												...job,
												description: value,
											})
										}
										rows={3}
										aiEnabled={isAIEnabled("experience", "description")}
										aiSection="experience"
										aiField="description"
										aiLabel={getAILabel("experience", "description")}
										resumeData={formData}
									/>
								</div>
								<button
									type="button"
									onClick={() => removeArrayItem("experience", "jobs", index)}
									className="text-red-600 hover:text-red-800"
								>
									Remove Job
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={addJob}
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Add Job
						</button>
					</div>

					{/* Education */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Education</h2>
						{(formData.education?.degrees || []).map((degree, index) => (
							<div
								key={index}
								className="mb-4 p-4 border rounded-lg dark:border-gray-600"
							>
								<div className="grid grid-cols-1 gap-3 mb-3">
									<AICompanionField
										type="input"
										placeholder="Degree (e.g., Bachelor of Computer Science)"
										value={degree?.degree || ""}
										onChange={(value) =>
											handleArrayChange("education", "degrees", index, {
												...degree,
												degree: value,
											})
										}
										aiEnabled={isAIEnabled("education", "degree")}
										aiSection="education"
										aiField="degree"
										aiLabel={getAILabel("education", "degree")}
										resumeData={formData}
									/>
									<AICompanionField
										type="input"
										placeholder="Institution Name"
										value={degree?.institution || ""}
										onChange={(value) =>
											handleArrayChange("education", "degrees", index, {
												...degree,
												institution: value,
											})
										}
										aiEnabled={isAIEnabled("education", "institution")}
										aiSection="education"
										aiField="institution"
										aiLabel={getAILabel("education", "institution")}
										resumeData={formData}
									/>
									<AICompanionField
										type="input"
										placeholder="Year (e.g., 2020-2024)"
										value={degree?.year || ""}
										onChange={(value) =>
											handleArrayChange("education", "degrees", index, {
												...degree,
												year: value,
											})
										}
										aiEnabled={isAIEnabled("education", "year")}
										aiSection="education"
										aiField="year"
										aiLabel={getAILabel("education", "year")}
										resumeData={formData}
									/>
								</div>
								<button
									type="button"
									onClick={() => removeArrayItem("education", "degrees", index)}
									className="text-red-600 hover:text-red-800"
								>
									Remove Education
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={addDegree}
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Add Education
						</button>
					</div>

					{/* Skills */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Skills</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Technical Skills (comma-separated)
								</label>
								<AICompanionField
									type="textarea"
									placeholder="e.g., JavaScript, React, Python, SQL"
									value={(formData.skills?.technical || []).join(", ")}
									onChange={(value) => {
										if (Array.isArray(value)) {
											handleInputChange("skills", "technical", value);
										} else if (typeof value === 'string') {
											handleInputChange("skills", "technical", value.split(",").map(s => s.trim()).filter(Boolean));
										} else {
											handleInputChange("skills", "technical", []);
										}
									}}
									rows={3}
									aiEnabled={isAIEnabled("skills", "technical")}
									aiSection="skills"
									aiField="technical"
									aiLabel={getAILabel("skills", "technical")}
									resumeData={formData}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-2">
									Soft Skills (comma-separated)
								</label>
								<AICompanionField
									type="textarea"
									placeholder="e.g., Team Leadership, Communication, Problem Solving"
									value={(formData.skills?.soft || []).join(", ")}
									onChange={(value) => {
										if (Array.isArray(value)) {
											handleInputChange("skills", "soft", value);
										} else if (typeof value === 'string') {
											handleInputChange("skills", "soft", value.split(",").map(s => s.trim()).filter(Boolean));
										} else {
											handleInputChange("skills", "soft", []);
										}
									}}
									rows={3}
									aiEnabled={isAIEnabled("skills", "soft")}
									aiSection="skills"
									aiField="soft"
									aiLabel={getAILabel("skills", "soft")}
									resumeData={formData}
								/>
							</div>
						</div>
					</div>

					{/* Projects */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Projects</h2>
						{(formData.projects?.items || []).map((project, index) => (
							<div
								key={index}
								className="mb-6 p-4 border rounded-lg dark:border-gray-600"
							>
								<div className="grid grid-cols-1 gap-3 mb-3">
									<AICompanionField
										type="input"
										placeholder="Project Title"
										value={project?.title || ""}
										onChange={(value) =>
											handleProjectChange(index, "title", value)
										}
										aiEnabled={isAIEnabled("projects", "title")}
										aiSection="projects"
										aiField="title"
										aiLabel={getAILabel("projects", "title")}
										resumeData={formData}
									/>
									<AICompanionField
										type="textarea"
										placeholder="Project Description"
										value={project?.description || ""}
										onChange={(value) =>
											handleProjectChange(index, "description", value)
										}
										rows={2}
										aiEnabled={isAIEnabled("projects", "description")}
										aiSection="projects"
										aiField="description"
										aiLabel={getAILabel("projects", "description")}
										resumeData={formData}
									/>
									<AICompanionField
										type="url"
										placeholder="GitHub Link"
										value={project?.github || ""}
										onChange={(value) =>
											handleProjectChange(index, "github", value)
										}
										aiEnabled={isAIEnabled("projects", "github")}
										aiSection="projects"
										aiField="github"
										aiLabel={getAILabel("projects", "github")}
										resumeData={formData}
									/>
									<AICompanionField
										type="url"
										placeholder="Live URL"
										value={project?.url || ""}
										onChange={(value) =>
											handleProjectChange(index, "url", value)
										}
										aiEnabled={isAIEnabled("projects", "url")}
										aiSection="projects"
										aiField="url"
										aiLabel={getAILabel("projects", "url")}
										resumeData={formData}
									/>
								</div>
								<button
									type="button"
									onClick={() => removeProject(index)}
									className="text-red-600 hover:text-red-800"
								>
									Remove Project
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={addProject}
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Add Project
						</button>
					</div>

					{/* Languages */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Languages</h2>
						<AICompanionField
							type="textarea"
							placeholder="Languages you speak (comma-separated) e.g., English, Hindi, Spanish"
							value={(formData.languages || []).join(", ")}
							onChange={(value) => {
								if (Array.isArray(value)) {
									setFormData((prev) => ({ ...prev, languages: value }));
								} else if (typeof value === 'string') {
									setFormData((prev) => ({ ...prev, languages: value.split(",").map(s => s.trim()).filter(Boolean) }));
								} else {
									setFormData((prev) => ({ ...prev, languages: [] }));
								}
							}}
							rows={2}
							aiEnabled={isAIEnabled("languages", "languages")}
							aiSection="languages"
							aiField="languages"
							aiLabel={getAILabel("languages", "languages")}
							resumeData={formData}
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-8">
						{/* Public URL (username only) */}
						<div className="mb-6">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								🔗 Portfolio URL
							</label>
							<div className="flex items-center gap-2">
								<PortfolioUrlDisplay username={username} />
							</div>
						</div>
						<button
							onClick={handleSave}
							className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 font-semibold"
						>
							Save Changes
						</button>
						<button
							onClick={handlePreview}
							className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-green-700 font-semibold"
						>
							Preview Portfolio
						</button>
						<button
							onClick={() => router.push("/editor")}
							className="bg-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-700 font-semibold"
						>
							Back to Upload
						</button>
					</div>
				</div>

				{/* Right Panel - Live Preview */}
				<div className="w-full md:w-1/2 h-auto md:h-screen overflow-x-auto overflow-y-auto custom-thin-slider border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
					<div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
						<h2 className="text-lg md:text-xl font-semibold">Live Preview</h2>
					</div>
					<div className="p-2 md:p-4">
						{layout && Object.entries(layout).length > 0 ? (
							<Preview 
								layout={layout} 
								content={formData} 
								portfolioData={portfolioData}
								currentTemplate={currentTemplate}
							/>
						) : (
							<div className="text-center py-8 md:py-12">
								<p className="text-gray-500">
									No layout selected. Please go back and choose a template
									first.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
			{/* Floating Action Button for Save */}
			<motion.div
				className="fixed bottom-6 right-6 z-50"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.5 }}
			>
				<motion.button
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
					onClick={handleSave}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<span>💾</span>
					<span>Save & Continue</span>
				</motion.button>
			</motion.div>

			<Modal
				open={modal.open}
				title={modal.title}
				message={modal.message}
				confirmText={modal.confirmText}
				cancelText={modal.cancelText}
				showCancel={modal.showCancel}
				error={modal.error}
				onConfirm={modal.onConfirm}
				onCancel={modal.onCancel}
			/>
		</div>
	);
}

export default function EditResumePage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<EditResumeContent />
		</Suspense>
	);
}
