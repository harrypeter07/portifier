"use client";
import { useState, useEffect } from "react";
import { useLayoutStore } from "@/store/layoutStore";
import { useRouter } from "next/navigation";
import { componentMap } from "@/data/componentMap";
import Preview from "@/components/Preview";
import AISuggestionInline from "@/components/AISuggestionInline";

export default function EditResumePage() {
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
		
		// Ask user if they want to publish now or continue editing
		const shouldPublish = window.confirm("Do you want to publish your portfolio now? Click OK to publish, Cancel to continue editing.");
		
		if (shouldPublish) {
			// Publish the portfolio
			try {
				console.log("🚀 [EDIT-RESUME] Publishing portfolio...");
				
				const res = await fetch("/api/portfolio/save", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						layout: { hero: "HeroA", about: "AboutA", experience: "ExperienceA", education: "EducationA", skills: "SkillsA", projects: "ShowcaseA", achievements: "AchievementsA", contact: "ContactFormA" },
						content: formData,
						portfolioData: newPortfolioData,
					}),
				});

				const data = await res.json();
				if (res.ok && data.success) {
					const portfolioUrl = data.portfolioUrl;
					console.log("🎉 [EDIT-RESUME] Portfolio published successfully:", {
						username: data.username,
						portfolioUrl: portfolioUrl
					});
					
					// Show success message and redirect
					alert(`🎉 Congratulations! Your portfolio is now live at: ${portfolioUrl}`);
					router.push(portfolioUrl);
				} else {
					alert(data.error || "Failed to publish portfolio");
					router.push("/editor/customize");
				}
			} catch (err) {
				console.error("❌ [EDIT-RESUME] Error publishing portfolio:", err);
				alert("Failed to publish portfolio");
				router.push("/editor/customize");
			}
		} else {
			// Navigate to customize page
			router.push("/editor/customize");
		}
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

	// AI Suggestion functionality
	const [aiSuggestions, setAiSuggestions] = useState({});
	const [aiLoading, setAiLoading] = useState({});
	const [activeAiField, setActiveAiField] = useState(null);

	async function getAISuggestions(section, field, value, label) {
		const fieldKey = `${section}-${field}`;
		setAiLoading(prev => ({ ...prev, [fieldKey]: true }));
		setActiveAiField(fieldKey);

		try {
			const response = await fetch("/api/ai-suggestions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					inputField: field,
					fieldName: field,
					resumeType: "developer", // You can make this dynamic
					resumeData: formData,
					currentValue: value
				}),
			});

			const data = await response.json();
			
			if (data.success) {
				setAiSuggestions(prev => ({ ...prev, [fieldKey]: data.suggestions }));
			} else {
				console.error("AI suggestion failed:", data.error);
				setAiSuggestions(prev => ({ ...prev, [fieldKey]: [] }));
			}
		} catch (error) {
			console.error("Error getting AI suggestions:", error);
			setAiSuggestions(prev => ({ ...prev, [fieldKey]: [] }));
		} finally {
			setAiLoading(prev => ({ ...prev, [fieldKey]: false }));
		}
	}

	function handleAISuggestionSelect(suggestion, section, field) {
		// Handle different field types
		if (field === "interests" || field === "personalValues" || field === "funFacts" || field === "technical" || field === "soft" || field === "languages") {
			// For array fields, split by commas and clean up
			const items = suggestion.split(",").map(s => s.trim()).filter(s => s);
			handleInputChange(section, field, items);
		} else {
			// For regular text fields
			handleInputChange(section, field, suggestion);
		}
		// Close suggestions for this field
		setActiveAiField(null);
	}

	function AIHelpButton({ section, field, value, label }) {
		return (
			<button
				type="button"
				onClick={() => getAISuggestions(section, field, value, label)}
				title={`Get AI suggestion for ${label || field}`}
				className="inline-flex items-center px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
			>
				<span className="mr-1">🤖</span>
				AI Help
			</button>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">

			
			<div className="flex">
				{/* Left Panel - Form */}
				<div className="w-1/2 p-6 overflow-y-auto h-screen">
					<h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
						Edit Resume Details
					</h1>

					{/* Personal Information */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Personal Information</h2>
						<div className="grid grid-cols-1 gap-4">
							<div>
								<div className="flex items-center gap-2">
									<input
										type="text"
										placeholder="Full Name"
										value={formData.hero?.title || ""}
										onChange={(e) =>
											handleInputChange("hero", "title", e.target.value)
										}
										className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
									/>
									<AIHelpButton
										section="hero"
										field="title"
										value={formData.hero?.title || ""}
										label="Full Name"
									/>
								</div>
								{aiModalOpen && currentAiSection === "hero" && currentAiField === "title" && (
									<AISuggestionInline
										isOpen={true}
										onClose={() => setAiModalOpen(false)}
										suggestions={aiSuggestions}
										onSelectSuggestion={handleAISuggestionSelect}
										fieldName={currentAiLabel || currentAiField}
										loading={aiLoading}
									/>
								)}
							</div>
							<div className="flex items-center gap-2">
								<input
									type="text"
									placeholder="Professional Title (e.g., Software Developer)"
									value={formData.hero?.subtitle || ""}
									onChange={(e) =>
										handleInputChange("hero", "subtitle", e.target.value)
									}
									className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
								/>
								<AIHelpButton
									section="hero"
									field="subtitle"
									value={formData.hero?.subtitle || ""}
									label="Professional Title"
								/>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="text"
									placeholder="Tagline (e.g., Passionate Coder, Creative Designer)"
									value={formData.hero?.tagline || ""}
									onChange={(e) => handleInputChange("hero", "tagline", e.target.value)}
									className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
								/>
								<AIHelpButton
									section="hero"
									field="tagline"
									value={formData.hero?.tagline || ""}
									label="Tagline"
								/>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="text"
									placeholder="Availability (e.g., Open to work, Freelance only)"
									value={formData.hero?.availability || ""}
									onChange={(e) => handleInputChange("hero", "availability", e.target.value)}
									className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
								/>
								<AIHelpButton
									section="hero"
									field="availability"
									value={formData.hero?.availability || ""}
									label="Availability"
								/>
							</div>
						</div>
					</div>

					{/* Contact Information */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Contact Information</h2>
						<div className="grid grid-cols-1 gap-4">
							<div className="flex items-center gap-2">
								<input
									type="email"
									placeholder="Email Address"
									value={formData.contact?.email || ""}
									onChange={(e) => {
										handleInputChange("contact", "email", e.target.value);
									}}
									className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
								/>
								<AIHelpButton
									section="contact"
									field="email"
									value={formData.contact?.email || ""}
									label="Email Address"
								/>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="tel"
									placeholder="Phone Number"
									value={formData.contact?.phone || ""}
									onChange={(e) =>
										handleInputChange("contact", "phone", e.target.value)
									}
									className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
								/>
								<AIHelpButton
									section="contact"
									field="phone"
									value={formData.contact?.phone || ""}
									label="Phone Number"
								/>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="text"
									placeholder="Location (City, Country)"
									value={formData.contact?.location || ""}
									onChange={(e) =>
										handleInputChange("contact", "location", e.target.value)
									}
									className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
								/>
								<AIHelpButton
									section="contact"
									field="location"
									value={formData.contact?.location || ""}
									label="Location"
								/>
							</div>
							<div className="flex items-center gap-2">
								<input
									type="url"
									placeholder="LinkedIn Profile"
									value={formData.contact?.linkedin || ""}
									onChange={(e) =>
										handleInputChange("contact", "linkedin", e.target.value)
									}
									className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
								/>
								<AIHelpButton
									section="contact"
									field="linkedin"
									value={formData.contact?.linkedin || ""}
									label="LinkedIn Profile"
								/>
							</div>
						</div>
					</div>

					{/* Professional Summary & About */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Professional Summary & About</h2>
						<div className="flex items-start gap-2">
							<textarea
								placeholder="Write a brief professional summary about yourself..."
								value={formData.about?.summary || ""}
								onChange={(e) =>
									handleInputChange("about", "summary", e.target.value)
								}
								rows={4}
								className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<AIHelpButton
								section="about"
								field="summary"
								value={formData.about?.summary || ""}
								label="Professional Summary"
							/>
						</div>
						<div className="flex items-start gap-2 mt-4">
							<textarea
								placeholder="Bio (detailed background, story, or philosophy)"
								value={formData.about?.bio || ""}
								onChange={(e) => handleInputChange("about", "bio", e.target.value)}
								rows={3}
								className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<AIHelpButton
								section="about"
								field="bio"
								value={formData.about?.bio || ""}
								label="Bio"
							/>
						</div>
						<div className="flex items-center gap-2 mt-4">
							<input
								type="text"
								placeholder="Interests (comma-separated)"
								value={(formData.about?.interests || []).join(", ")}
								onChange={(e) => handleInputChange("about", "interests", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
								className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<AIHelpButton
								section="about"
								field="interests"
								value={(formData.about?.interests || []).join(", ")}
								label="Interests"
							/>
						</div>
						<div className="flex items-center gap-2 mt-4">
							<input
								type="text"
								placeholder="Personal Values (comma-separated)"
								value={(formData.about?.personalValues || []).join(", ")}
								onChange={(e) => handleInputChange("about", "personalValues", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
								className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<AIHelpButton
								section="about"
								field="personalValues"
								value={(formData.about?.personalValues || []).join(", ")}
								label="Personal Values"
							/>
						</div>
						<div className="flex items-center gap-2 mt-4">
							<input
								type="text"
								placeholder="Fun Facts (comma-separated)"
								value={(formData.about?.funFacts || []).join(", ")}
								onChange={(e) => handleInputChange("about", "funFacts", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
								className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<AIHelpButton
								section="about"
								field="funFacts"
								value={(formData.about?.funFacts || []).join(", ")}
								label="Fun Facts"
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
									<div className="flex items-center gap-2">
										<input
											type="text"
											placeholder="Job Title"
											value={job?.title || ""}
											onChange={(e) =>
												handleArrayChange("experience", "jobs", index, {
													...job,
													title: e.target.value,
												})
											}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="experience"
											field="title"
											value={job?.title || ""}
											label="Job Title"
										/>
									</div>
									<div className="flex items-center gap-2">
										<input
											type="text"
											placeholder="Company Name"
											value={job?.company || ""}
											onChange={(e) =>
												handleArrayChange("experience", "jobs", index, {
													...job,
													company: e.target.value,
												})
											}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="experience"
											field="company"
											value={job?.company || ""}
											label="Company Name"
										/>
									</div>
									<div className="flex items-center gap-2">
										<input
											type="text"
											placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
											value={job?.duration || ""}
											onChange={(e) =>
												handleArrayChange("experience", "jobs", index, {
													...job,
													duration: e.target.value,
												})
											}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="experience"
											field="duration"
											value={job?.duration || ""}
											label="Duration"
										/>
									</div>
									<div className="flex items-start gap-2">
										<textarea
											placeholder="Job Description"
											value={job?.description || ""}
											onChange={(e) =>
												handleArrayChange("experience", "jobs", index, {
													...job,
													description: e.target.value,
												})
											}
											rows={3}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="experience"
											field="description"
											value={job?.description || ""}
											label="Job Description"
										/>
									</div>
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
									<div className="flex items-center gap-2">
										<input
											type="text"
											placeholder="Degree (e.g., Bachelor of Computer Science)"
											value={degree?.degree || ""}
											onChange={(e) =>
												handleArrayChange("education", "degrees", index, {
													...degree,
													degree: e.target.value,
												})
											}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="education"
											field="degree"
											value={degree?.degree || ""}
											label="Degree"
										/>
									</div>
									<div className="flex items-center gap-2">
										<input
											type="text"
											placeholder="Institution Name"
											value={degree?.institution || ""}
											onChange={(e) =>
												handleArrayChange("education", "degrees", index, {
													...degree,
													institution: e.target.value,
												})
											}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="education"
											field="institution"
											value={degree?.institution || ""}
											label="Institution Name"
										/>
									</div>
									<div className="flex items-center gap-2">
										<input
											type="text"
											placeholder="Year (e.g., 2020-2024)"
											value={degree?.year || ""}
											onChange={(e) =>
												handleArrayChange("education", "degrees", index, {
													...degree,
													year: e.target.value,
												})
											}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="education"
											field="year"
											value={degree?.year || ""}
											label="Year"
										/>
									</div>
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
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">
								Technical Skills (comma-separated)
							</label>
							<div className="flex items-start gap-2">
								<textarea
									placeholder="e.g., JavaScript, React, Python, SQL"
									value={(formData.skills?.technical || []).join(", ")}
									onChange={(e) =>
										handleInputChange(
											"skills",
											"technical",
											e.target.value
												.split(",")
												.map((s) => s.trim())
												.filter((s) => s)
										)
									}
									rows={3}
									className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
								/>
								<AIHelpButton
									section="skills"
									field="technical"
									value={(formData.skills?.technical || []).join(", ")}
									label="Technical Skills"
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">
								Soft Skills (comma-separated)
							</label>
							<div className="flex items-start gap-2">
								<textarea
									placeholder="e.g., Team Leadership, Communication, Problem Solving"
									value={(formData.skills?.soft || []).join(", ")}
									onChange={(e) =>
										handleInputChange(
											"skills",
											"soft",
											e.target.value
												.split(",")
												.map((s) => s.trim())
												.filter((s) => s)
										)
									}
									rows={3}
									className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
								/>
								<AIHelpButton
									section="skills"
									field="soft"
									value={(formData.skills?.soft || []).join(", ")}
									label="Soft Skills"
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
									<div className="flex items-center gap-2">
										<input
											type="text"
											placeholder="Project Title"
											value={project?.title || ""}
											onChange={(e) =>
												handleProjectChange(index, "title", e.target.value)
											}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="projects"
											field="title"
											value={project?.title || ""}
											label="Project Title"
										/>
									</div>
									<div className="flex items-start gap-2">
										<textarea
											placeholder="Project Description"
											value={project?.description || ""}
											onChange={(e) =>
												handleProjectChange(index, "description", e.target.value)
											}
											rows={2}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="projects"
											field="description"
											value={project?.description || ""}
											label="Project Description"
										/>
									</div>
									<div className="flex items-center gap-2">
										<input
											type="url"
											placeholder="GitHub Link"
											value={project?.github || ""}
											onChange={(e) =>
												handleProjectChange(index, "github", e.target.value)
											}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="projects"
											field="github"
											value={project?.github || ""}
											label="GitHub Link"
										/>
									</div>
									<div className="flex items-center gap-2">
										<input
											type="url"
											placeholder="Live URL"
											value={project?.url || ""}
											onChange={(e) =>
												handleProjectChange(index, "url", e.target.value)
											}
											className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
										/>
										<AIHelpButton
											section="projects"
											field="url"
											value={project?.url || ""}
											label="Live URL"
										/>
									</div>
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
						<div className="flex items-start gap-2">
							<textarea
								placeholder="Languages you speak (comma-separated) e.g., English, Hindi, Spanish"
								value={(formData.languages || []).join(", ")}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										languages: e.target.value
											.split(",")
											.map((s) => s.trim())
											.filter((s) => s),
									}))
								}
								rows={2}
								className="flex-1 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<AIHelpButton
								section="languages"
								field="languages"
								value={(formData.languages || []).join(", ")}
								label="Languages"
							/>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-4 mb-8">
						<button
							onClick={handleSave}
							className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
						>
							Save Changes
						</button>
						<button
							onClick={handlePreview}
							className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
						>
							Preview Portfolio
						</button>
						<button
							onClick={() => router.push("/editor")}
							className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold"
						>
							Back to Upload
						</button>
					</div>
				</div>

				{/* Right Panel - Live Preview */}
				<div className="w-1/2 h-screen overflow-y-auto border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
					<div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
						<h2 className="text-xl font-semibold">Live Preview</h2>
					</div>
					<div className="p-4">
										{layout && Object.entries(layout).length > 0 ? (
					Object.entries(layout).map(([section, componentName]) => {
						console.log(`👁️ [EDIT-RESUME-PREVIEW] Rendering section: ${section} with component: ${componentName}`);
						
						const Component = componentMap[componentName];
						if (!Component) return null;
								let componentProps = formData[section] || {};
								// Ensure no null values for inputs
								if (componentProps && typeof componentProps === "object") {
									Object.keys(componentProps).forEach((key) => {
										if (
											componentProps[key] === null ||
											componentProps[key] === undefined
										) {
											componentProps[key] = "";
										}
									});
								}
								// For projects section, handle the new schema structure
								if (section === "projects" && formData[section]?.items) {
									// Map 'title' to 'name' for ShowcaseA compatibility
									componentProps = {
										items: formData[section].items.map((item) => ({
											...item,
											name: item.title || "",
										})),
									};
								}
								// For skills section, flatten the structure
								if (section === "skills" && formData[section]) {
									componentProps = {
										technical: formData[section].technical || [],
										soft: formData[section].soft || [],
										languages: formData.languages || [],
									};
								}
								// For achievements section, flatten the structure
								if (section === "achievements" && formData[section]) {
									componentProps = {
										awards: formData[section].awards || [],
										certifications: formData[section].certifications || [],
										publications: formData[section].publications || [],
									};
								}
								// For experience section, flatten the structure
								if (section === "experience" && formData[section]?.jobs) {
									componentProps = { jobs: formData[section].jobs };
								}
								// For education section, flatten the structure
								if (section === "education" && formData[section]?.degrees) {
									componentProps = { degrees: formData[section].degrees };
								}
																				if (section === "hero") {
									const heroData = formData.hero || {};
									const nameParts = (heroData.title || "").split(" ");
									const personalData = {
										firstName: nameParts[0] || "",
										lastName: nameParts.slice(1).join(" ") || "",
										title: heroData.subtitle || "",
										subtitle: heroData.subtitle || "",
										tagline: heroData.tagline || "",
										availability: heroData.availability || "",
									};
									
									console.log("👁️ [EDIT-RESUME-PREVIEW] Hero section data:", {
										originalHeroData: heroData,
										nameParts,
										personalData,
										hasFirstName: !!personalData.firstName,
										hasLastName: !!personalData.lastName,
										hasTitle: !!personalData.title,
										hasTagline: !!personalData.tagline
									});
									
									return (
										<div key={section} className="mb-8 last:mb-0">
											<Component data={{ personal: personalData }} />
										</div>
									);
								}
								if (section === "about") {
									const aboutData = formData.about || {};
									return (
										<div key={section} className="mb-8 last:mb-0">
											<Component
												summary={aboutData.summary || ""}
												data={{ about: aboutData }}
											/>
										</div>
									);
								}
								return (
									<div key={section} className="mb-8 last:mb-0">
										<Component {...componentProps} />
									</div>
								);
							})
						) : (
							<div className="text-center py-12">
								<p className="text-gray-500">
									No layout selected. Please go back and choose a template
									first.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
