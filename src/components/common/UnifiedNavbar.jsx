"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useLayoutStore } from "@/store/layoutStore";
import { motion, AnimatePresence } from "framer-motion";

const publicNavLinks = [
	{ href: "/auth/signin", label: "Sign In", icon: "🚪" },
	{ href: "/auth/signup", label: "Sign Up", icon: "📝" },
];

const authenticatedNavLinks = [
	{ href: "/", label: "Home", icon: "🏠" },
	{ href: "/dashboard", label: "Dashboard", icon: "📊" },
	{ href: "/templates-demo", label: "Templates", icon: "🎨" },
	{ href: "/editor", label: "Create Portfolio", icon: "✏️" },
	{ href: "/settings", label: "Settings", icon: "⚙️" },
];

const editorSteps = [
  { 
    href: "/editor", 
    label: "Upload", 
    icon: "📄",
    description: "Upload resume"
  },
  { 
    href: "/editor/edit-resume", 
    label: "Edit", 
    icon: "✏️",
    description: "Edit details"
  },
  { 
    href: "/editor/customize", 
    label: "Customize", 
    icon: "🎨",
    description: "Choose templates"
  },
  { 
    href: "/preview/live", 
    label: "Preview", 
    icon: "👁️",
    description: "Preview portfolio"
  }
];

export default function UnifiedNavbar() {
	const pathname = usePathname();
	const router = useRouter();
	const { currentTemplate } = useLayoutStore();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	
	// Editor navbar states
	const [isEditorNavVisible, setIsEditorNavVisible] = useState(true);
	const [isEditorNavMinimized, setIsEditorNavMinimized] = useState(false);
	const [isEditorNavHovered, setIsEditorNavHovered] = useState(false);
	const editorNavTimeoutRef = useRef(null);
	const lastScrollY = useRef(0);

	// Check authentication status
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch("/api/auth/me", {
					credentials: "include",
				});

				if (response.ok) {
					const userData = await response.json();
					setUser(userData.user);
				} else {
					setUser(null);
				}
			} catch (error) {
				console.log("Auth check failed:", error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, [pathname]);

	// Editor navbar auto-hide functionality
	useEffect(() => {
		// Only apply editor navbar logic on editor-related pages
		if (!pathname.startsWith('/editor') && !pathname.startsWith('/preview')) {
			return;
		}

		const handleMouseMove = () => {
			setIsEditorNavVisible(true);
			if (editorNavTimeoutRef.current) {
				clearTimeout(editorNavTimeoutRef.current);
			}
			editorNavTimeoutRef.current = setTimeout(() => {
				if (!isEditorNavHovered) {
					setIsEditorNavVisible(false);
				}
			}, 3000);
		};

		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
			
			if (scrollDelta > 10) {
				setIsEditorNavVisible(true);
				if (editorNavTimeoutRef.current) {
					clearTimeout(editorNavTimeoutRef.current);
				}
				editorNavTimeoutRef.current = setTimeout(() => {
					if (!isEditorNavHovered) {
						setIsEditorNavVisible(false);
					}
				}, 2000);
			}
			
			lastScrollY.current = currentScrollY;
		};

		const handleTouchStart = () => {
			setIsEditorNavVisible(true);
			if (editorNavTimeoutRef.current) {
				clearTimeout(editorNavTimeoutRef.current);
			}
			editorNavTimeoutRef.current = setTimeout(() => {
				if (!isEditorNavHovered) {
					setIsEditorNavVisible(false);
				}
			}, 3000);
		};

		// Set initial timeout
		editorNavTimeoutRef.current = setTimeout(() => {
			if (!isEditorNavHovered) {
				setIsEditorNavVisible(false);
			}
		}, 3000);

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('scroll', handleScroll);
		document.addEventListener('touchstart', handleTouchStart);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('scroll', handleScroll);
			document.removeEventListener('touchstart', handleTouchStart);
			if (editorNavTimeoutRef.current) {
				clearTimeout(editorNavTimeoutRef.current);
			}
		};
	}, [isEditorNavHovered, pathname]);

	// Hide Navbar for public portfolio pages (single segment, not app routes)
	const isPortfolioPage =
		/^\/[a-zA-Z0-9_-]+$/.test(pathname) &&
		!['/dashboard', '/editor', '/settings', '/auth', '/templates-demo', '/preview'].some(prefix => pathname.startsWith(prefix));

	if (isPortfolioPage) return null;

	const handleLogout = async () => {
		try {
			await fetch("/api/auth/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch (error) {
			console.error("Logout API error:", error);
		} finally {
			setUser(null);
			setDropdownOpen(false);
			router.push("/");
		}
	};

	const handleEditorNavMinimizeToggle = () => {
		setIsEditorNavMinimized(!isEditorNavMinimized);
		setIsEditorNavVisible(true);
		if (editorNavTimeoutRef.current) {
			clearTimeout(editorNavTimeoutRef.current);
		}
		editorNavTimeoutRef.current = setTimeout(() => {
			if (!isEditorNavHovered) {
				setIsEditorNavVisible(false);
			}
		}, 3000);
	};

	const navLinks = user ? authenticatedNavLinks : publicNavLinks;
	const currentEditorStepIndex = editorSteps.findIndex(step => pathname === step.href);

	if (loading) {
		return (
			<nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
				<div className="container">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
							<div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
						</div>
						<div className="hidden md:flex items-center space-x-1">
							<div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
							<div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
						</div>
						<div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
					</div>
				</div>
			</nav>
		);
	}

	return (
		<>
			{/* Main Navigation Bar */}
			<nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo/Brand */}
						<Link href="/" className="flex items-center space-x-2 group">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
								<span className="text-white font-bold text-sm">P</span>
							</div>
							<span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
								Portfolio Maker
							</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-1">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`group flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
										pathname === link.href
											? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 shadow-sm"
											: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
									}`}
								>
									<span className="group-hover:scale-110 transition-transform duration-200">
										{link.icon}
									</span>
									<span>{link.label}</span>
								</Link>
							))}
							
							{/* Current Template Indicator */}
							{currentTemplate && (
								<div className="ml-4 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
									<span className="text-xs font-medium text-purple-700 dark:text-purple-300">
										🎨 {currentTemplate.name}
									</span>
								</div>
							)}
						</div>

						{/* Right Side - User Section */}
						<div className="flex items-center space-x-4">
							{user ? (
								<div className="relative">
									<button
										onClick={() => setDropdownOpen(!dropdownOpen)}
										className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
									>
										{user.avatar ? (
											<img
												src={user.avatar}
												alt={user.name}
												className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-blue-500 transition-all duration-200"
											/>
										) : (
											<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-600 group-hover:ring-blue-500 transition-all duration-200">
												<span className="text-white font-medium text-sm">
													{user.name?.charAt(0)?.toUpperCase() || "U"}
												</span>
											</div>
										)}
										<span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
											{user.name || "User"}
										</span>
										<svg
											className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-all duration-200"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>

									{/* User Dropdown */}
									{dropdownOpen && (
										<div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
											<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{user.name}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400 truncate">
													{user.email}
												</p>
											</div>

											<Link
												href="/dashboard"
												className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
											>
												<span className="mr-3">📊</span>
												Dashboard
											</Link>

											<Link
												href="/editor"
												className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
											>
												<span className="mr-3">✏️</span>
												Create Portfolio
											</Link>

											<Link
												href="/settings"
												className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
											>
												<span className="mr-3">⚙️</span>
												Settings
											</Link>

											<div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
												<button
													onClick={handleLogout}
													className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
												>
													<span className="mr-3">🚪</span>
													Sign Out
												</button>
											</div>
										</div>
									)}
								</div>
							) : (
								<div className="flex items-center space-x-3">
									<Link
										href="/auth/signup"
										className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
									>
										Get Started
									</Link>
								</div>
							)}

							{/* Mobile menu button */}
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d={
											mobileMenuOpen
												? "M6 18L18 6M6 6l12 12"
												: "M4 6h16M4 12h16M4 18h16"
										}
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Mobile Navigation */}
					{mobileMenuOpen && (
						<div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 animate-in slide-in-from-top-5 duration-200">
							{/* Current Template Indicator for Mobile */}
							{currentTemplate && (
								<div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
									<div className="flex items-center space-x-2">
										<span className="text-sm font-medium text-gray-900 dark:text-white">Current Template:</span>
										<span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded text-xs font-medium text-purple-700 dark:text-purple-300">
											🎨 {currentTemplate.name}
										</span>
									</div>
								</div>
							)}
							
							<div className="px-4 py-4 space-y-2">
								{navLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										onClick={() => setMobileMenuOpen(false)}
										className={`flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
											pathname === link.href
												? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200"
												: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
										}`}
									>
										<span>{link.icon}</span>
										<span>{link.label}</span>
									</Link>
								))}

								{user && (
									<div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
										<div className="flex items-center space-x-3 px-3 py-2 mb-3">
											{user.avatar ? (
												<img
													src={user.avatar}
													alt={user.name}
													className="w-10 h-10 rounded-full object-cover"
												/>
											) : (
												<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
													<span className="text-white font-medium">
														{user.name?.charAt(0)?.toUpperCase() || "U"}
													</span>
												</div>
											)}
											<div>
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{user.name}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{user.email}
												</p>
											</div>
										</div>

										<button
											onClick={handleLogout}
											className="flex items-center space-x-3 w-full px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
										>
											<span>🚪</span>
											<span>Sign Out</span>
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</nav>

			{/* Editor Navigation Bar - Only show on editor-related pages */}
			{(pathname.startsWith('/editor') || pathname.startsWith('/preview') || pathname.startsWith('/templates-demo')) && (
				<AnimatePresence>
					<motion.div
						className={`fixed left-4 top-20 z-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
							isEditorNavMinimized ? 'w-12 h-12' : 'w-16 md:w-20'
						}`}
						initial={{ opacity: 0, x: -20 }}
						animate={{ 
							opacity: isEditorNavVisible ? 1 : 0.3,
							x: 0
						}}
						transition={{ 
							duration: 0.5,
							ease: "easeInOut"
						}}
						onMouseEnter={() => {
							setIsEditorNavHovered(true);
							setIsEditorNavVisible(true);
							if (editorNavTimeoutRef.current) {
								clearTimeout(editorNavTimeoutRef.current);
							}
						}}
						onMouseLeave={() => {
							setIsEditorNavHovered(false);
							editorNavTimeoutRef.current = setTimeout(() => {
								setIsEditorNavVisible(false);
							}, 1000);
						}}
						onTouchStart={() => {
							setIsEditorNavVisible(true);
							if (editorNavTimeoutRef.current) {
								clearTimeout(editorNavTimeoutRef.current);
							}
						}}
					>
						{/* Minimize/Maximize Button */}
						<button
							onClick={handleEditorNavMinimizeToggle}
							className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-all duration-200 z-50"
							title={isEditorNavMinimized ? "Expand" : "Minimize"}
						>
							{isEditorNavMinimized ? "🔽" : "🔼"}
						</button>

						{isEditorNavMinimized ? (
							// Minimized state - just show current step
							<div className="flex items-center justify-center h-full">
								<div className="text-center">
									<div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1 mx-auto">
										<span className="text-xs">{editorSteps[currentEditorStepIndex]?.icon}</span>
									</div>
									<div className="text-[8px] font-medium text-gray-900 dark:text-white">
										{currentEditorStepIndex + 1}/{editorSteps.length}
									</div>
								</div>
							</div>
						) : (
							// Expanded state - show full navigation
							<div className="p-3">
								{/* Progress Bar */}
								<div className="mb-3">
									<div className="text-center mb-2">
										<div className="text-xs font-medium text-gray-900 dark:text-white">
											{currentEditorStepIndex + 1}/{editorSteps.length}
										</div>
									</div>
									<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
										<motion.div
											className="bg-blue-600 h-1 rounded-full"
											initial={{ width: 0 }}
											animate={{ width: `${((currentEditorStepIndex + 1) / editorSteps.length) * 100}%` }}
											transition={{ duration: 0.5 }}
										/>
									</div>
								</div>

								{/* Step Navigation - Vertical */}
								<div className="flex flex-col space-y-2">
									{editorSteps.map((step, index) => {
										const isActive = pathname === step.href;
										const isCompleted = index < currentEditorStepIndex;
										const isClickable = index <= currentEditorStepIndex + 1;

										return (
											<Link
												key={step.href}
												href={step.href}
												className={`group flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
													isActive
														? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200"
														: isCompleted
														? "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
														: isClickable
														? "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
														: "text-gray-400 dark:text-gray-500 cursor-not-allowed"
												}`}
												onClick={(e) => {
													if (!isClickable) {
														e.preventDefault();
													}
												}}
												title={`${step.label}: ${step.description}`}
											>
												<div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 transition-all duration-200 ${
													isActive
														? "bg-blue-600 text-white"
														: isCompleted
														? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
														: "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
												}`}>
													{isCompleted ? (
														<span className="text-xs">✓</span>
													) : (
														<span className="text-xs">{step.icon}</span>
													)}
												</div>
												<span className="text-[10px] font-medium text-center leading-tight">{step.label}</span>
											</Link>
										);
									})}
								</div>
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			)}
		</>
	);
}
