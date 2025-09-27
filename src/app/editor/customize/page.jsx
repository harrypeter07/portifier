"use client";
import { useLayoutStore } from "@/store/layoutStore";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { componentMap, componentCategories, getRecommendedLayout } from "@/data/componentMap";
import Preview from "@/components/Preview";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/common/Modal";
import PortfolioUrlDisplay from "@/components/common/PortfolioUrlDisplay";
import debounce from "lodash.debounce";

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

// Inline MiniPreview component for live, compact previews
function MiniPreview({ Component, sectionKey, componentName, isSelected, onSelect, data }) {
  // Keyboard: select on Enter/Space
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  }
  return (
    <div
      className={`relative rounded-lg border-2 p-2 bg-gray-50 dark:bg-gray-800 transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[120px] max-h-[180px] overflow-hidden shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'}`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${componentName} for ${sectionKey}`}
      style={{ minWidth: 0, width: '140px', maxWidth: '160px' }}
    >
      <div className="absolute top-1 right-1">
        {isSelected && (
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
        {/* Render the actual component in a larger box */}
        <div className="w-full max-w-[130px] scale-95">
          <Component {...data} />
        </div>
      </div>
      <div className="mt-1 text-[11px] text-center font-medium text-gray-700 dark:text-gray-300 truncate w-full">
        {componentName}
      </div>
    </div>
  );
}

// Inline SectionSlider for horizontal sliding of component variants
function SectionSlider({ sectionKey, category, localContent, localLayout, handleComponentChange }) {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef(null);
  const total = category.components.length;
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const liveRef = useRef();

  // Keyboard navigation
  function handleKeyDown(e) {
    if (e.key === "ArrowRight") {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % total);
    } else if (e.key === "ArrowLeft") {
      setDirection(-1);
      setCurrent((prev) => (prev - 1 + total) % total);
    }
  }

  // Announce selection changes for screen readers
  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Showing ${category.components[current]} for ${category.label}`;
    }
  }, [current, category]);

  // Responsive slides to show
  let slidesToShow = 1;
  if (typeof window !== "undefined") {
    const w = window.innerWidth;
    if (w >= 1536) slidesToShow = 6;
    else if (w >= 1280) slidesToShow = 5;
    else if (w >= 1024) slidesToShow = 4;
    else if (w >= 768) slidesToShow = 3;
    else if (w >= 480) slidesToShow = 2;
  }

  // Prepare preview data for each component
  const getPreviewData = (sectionKey, componentName) => {
    if (sectionKey === "hero") {
      return { data: { personal: localContent.hero || {} } };
    } else if (sectionKey === "about") {
      return { summary: localContent.about?.summary || "", data: localContent.about };
    } else if (sectionKey === "projects") {
      return { items: localContent.projects?.items || [], data: localContent.projects };
    } else if (sectionKey === "skills") {
      return { technical: localContent.skills?.technical || [], soft: localContent.skills?.soft || [], languages: localContent.skills?.languages || [], data: localContent.skills };
    } else if (sectionKey === "achievements") {
      return { awards: localContent.achievements?.awards || [], certifications: localContent.achievements?.certifications || [], publications: localContent.achievements?.publications || [], data: localContent.achievements };
    } else if (sectionKey === "experience") {
      return { jobs: localContent.experience?.jobs || [], data: localContent.experience };
    } else if (sectionKey === "education") {
      return { degrees: localContent.education?.degrees || [], data: localContent.education };
    } else if (sectionKey === "contact") {
      return { email: localContent.contact?.email || "", phone: localContent.contact?.phone || "", linkedin: localContent.contact?.linkedin || "", data: localContent.contact };
    }
    return {};
  };

  // Calculate visible slides
  const start = Math.max(0, Math.min(current - Math.floor(slidesToShow / 2), total - slidesToShow));
  const visible = category.components.slice(start, start + slidesToShow);

  // Animation variants for sliding
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: "easeInOut" },
    },
    exit: (direction) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.25, ease: "easeInOut" },
    }),
  };

  return (
    <div className="relative" tabIndex={0} onKeyDown={handleKeyDown} aria-label={`Component variants for ${category.label}`}> 
      <div ref={liveRef} className="sr-only" aria-live="polite" />
      <div className="flex items-center justify-between mb-2">
        <button
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => { setDirection(-1); setCurrent((prev) => (prev - 1 + total) % total); }}
          aria-label="Previous variant"
        >
          <span aria-hidden="true">◀</span>
        </button>
        <div className="flex-1 flex justify-center gap-2 overflow-x-auto custom-thin-slider scrollbar-hide relative min-h-[140px] touch-pan-x" style={{ WebkitOverflowScrolling: 'touch' }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex gap-1 w-full justify-center"
              style={{ minWidth: 0 }}
            >
              {visible.map((componentName, idx) => {
                const Component = componentMap[componentName];
                const previewData = getPreviewData(sectionKey, componentName);
                const isActive = idx === Math.floor(slidesToShow / 2) || visible.length === 1;
                return (
                  <motion.div
                    key={componentName}
                    className="flex-shrink-0"
                    animate={isActive ? { scale: 1.05, opacity: 1 } : { scale: 0.95, opacity: 0.7 }}
                    transition={{ duration: 0.25 }}
                  >
                    <MiniPreview
                      Component={Component}
                      sectionKey={sectionKey}
                      componentName={componentName}
                      isSelected={localLayout[sectionKey] === componentName}
                      onSelect={() => handleComponentChange(sectionKey, componentName)}
                      data={previewData}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => { setDirection(1); setCurrent((prev) => (prev + 1) % total); }}
          aria-label="Next variant"
        >
          <span aria-hidden="true">▶</span>
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-2">
        {category.components.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-2 h-2 rounded-full ${idx === current ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            aria-label={idx === current ? 'Current slide' : undefined}
          />
        ))}
      </div>
    </div>
  );
}

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
					console.log("👤 [CUSTOMIZE] Username fetched:", data.user.username);
					setUsername(data.user.username);
					
					// Check if we're editing a specific portfolio from URL parameters
					const portfolioId = searchParams.get('portfolioId');
					const portfolioUsername = searchParams.get('username');
					
					if (portfolioId && portfolioUsername) {
						// We're editing a specific portfolio from dashboard
						console.log("🎯 [CUSTOMIZE] Editing specific portfolio from URL:", {
							portfolioId,
							portfolioUsername
						});
						
						// Fetch the specific portfolio data
						const portfolioRes = await fetch(`/api/portfolio/${portfolioUsername}`);
						if (portfolioRes.ok) {
							const portfolioData = await portfolioRes.json();
							setExistingPortfolio(portfolioData.portfolio);
							console.log("📁 [CUSTOMIZE] Found specific portfolio:", portfolioData.portfolio._id);
						}
					} else {
						// Check if user has an existing portfolio (general case)
						const portfolioRes = await fetch(`/api/portfolio/${data.user.username}`);
						if (portfolioRes.ok) {
							const portfolioData = await portfolioRes.json();
							setExistingPortfolio(portfolioData.portfolio);
							console.log("📁 [CUSTOMIZE] Found existing portfolio:", portfolioData.portfolio._id);
						}
					}
				} else {
					console.error("❌ [CUSTOMIZE] No username found in response:", data);
				}
			} catch (error) {
				console.error("❌ [CUSTOMIZE] Failed to fetch username:", error);
			}
		})();
	}, [searchParams]);

	// No slug flow; publish to /{username}

	// Suggest alternative slug
	const suggestSlug = () => {
		if (!slug) return "";
		const match = slug.match(/(.+)-(\d+)$/);
		if (match) {
			return `${match[1]}-${parseInt(match[2]) + 1}`;
		}
		return `${slug}-2`;
	};

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
			// Get current template from store
			const { currentTemplate, portfolioType } = useLayoutStore.getState();
			
			console.log("💾 [CUSTOMIZE] Saving portfolio with template:", {
				templateId: currentTemplate?.id,
				templateName: currentTemplate?.name,
				templateType: currentTemplate?.type,
				portfolioType
			});

			const res = await fetch("/api/portfolio/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					layout: localLayout, // Use the selected layout
					content: localContent,
					portfolioData, // Include the updated portfolio data
					resumeId: resumeId, // Associate with resume if available
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
			if (res.ok && data.success) {
				console.log("✅ [CUSTOMIZE] Portfolio published successfully with template:", {
					templateId: data.templateId,
					templateName: data.templateName,
					redirectUrl: `/portfolio/${data.username || username}`
				});
				// Redirect directly to analytics dashboard instead of showing success message
				const redirectUrl = `/portfolio/${data.username || username}`;
				console.log("🎯 [CUSTOMIZE] Redirecting to analytics dashboard:", redirectUrl);
				router.push(redirectUrl);
			} else {
				setSuccess("");
				setModal({
					open: true,
					title: 'Error',
					message: data.error || 'Failed to save portfolio',
					confirmText: 'OK',
					showCancel: false,
					error: true,
					onConfirm: () => setModal(m => ({ ...m, open: false })),
				});
			}
		} catch (err) {
			setSuccess("");
			setModal({
				open: true,
				title: 'Error',
				message: 'Failed to save portfolio',
				confirmText: 'OK',
				showCancel: false,
				error: true,
				onConfirm: () => setModal(m => ({ ...m, open: false })),
			});
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<div className="flex">
			{/* Left side - Form */}
			<div className="w-1/2 p-8 overflow-y-auto">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							🎨 Customize Your Portfolio
						</h1>
						
						{/* Quick Actions */}
						<div className="flex items-center space-x-2">
							<motion.button
								onClick={() => router.push("/editor/edit-resume")}
								className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								← Back to Edit
							</motion.button>
							<motion.button
								onClick={handlePreview}
								className="px-4 py-2 text-sm bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								Preview →
							</motion.button>
						</div>
					</div>
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
							{Object.keys(componentCategories).map((section, index) => (
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
												({localLayout[section] || componentCategories[section].components[0]})
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
									className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border-2 transition-all duration-300 mb-4
										${selectedSection === sectionKey 
											? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/20' 
											: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
								>
									<div className="flex items-center justify-between mb-4">
										<div>
											<h3 className="text-base font-semibold text-gray-900 dark:text-white capitalize">
												{category.label}
												{category.required && <span className="text-red-500 ml-1">*</span>}
											</h3>
											<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
												{category.description}
											</p>
										</div>
										{selectedSection === sectionKey && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
											>
												<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											</motion.div>
										)}
									</div>
									{/* Horizontal slider for component variants */}
									<SectionSlider
										sectionKey={sectionKey}
										category={category}
										localContent={localContent}
										localLayout={localLayout}
										handleComponentChange={handleComponentChange}
									/>
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

				{/* Public URL (username only) */}
				<div className="mb-6">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						🔗 Portfolio URL
					</label>
					<div className="flex items-center gap-2">
						<PortfolioUrlDisplay username={username} />
					</div>
				</div>

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
			{/* Floating Action Button for Publish */}
			<motion.div
				className="fixed bottom-6 right-6 z-50"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3, delay: 0.5 }}
			>
				<motion.button
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
					onClick={handleSave}
					disabled={saving}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					{saving ? (
						<>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
								className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
							/>
							<span>Publishing...</span>
						</>
					) : (
						<>
							<span>🚀</span>
							<span>Publish Portfolio</span>
						</>
					)}
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
		</div>
	);
}
