"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useLayoutStore } from "@/store/layoutStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Menu, X, User, Settings, LogOut, Home, BarChart3, Palette, Edit, ChevronDown, Sun, Moon, Heart, Bug } from "lucide-react";
import BugReportModal from "@/components/BugReportModal";

const publicNavLinks = [
	{ href: "/auth/signin", label: "Sign In", icon: User },
	{ href: "/auth/signup", label: "Sign Up", icon: User },
];

const authenticatedNavLinks = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/dashboard", label: "Dashboard", icon: BarChart3 },
	{ href: "/templates-demo", label: "Templates", icon: Palette },
	{ href: "/editor", label: "Create Portfolio", icon: Edit },
	{ href: "/settings", label: "Settings", icon: Settings },
];

// Reduced nav links for normal state
const reducedNavLinks = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/dashboard", label: "Dashboard", icon: BarChart3 },
	{ href: "/editor", label: "Create", icon: Edit },
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
	const [isDark, setIsDark] = useState(false);
	const [isBugReportOpen, setIsBugReportOpen] = useState(false);
	
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

		// Cleanup on unmount
		return () => {};
	}, [pathname]);

	// Theme: initialize and persist dark mode
	useEffect(() => {
		try {
			const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
			const prefersDark = typeof window !== 'undefined' ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches : false;
			const enableDark = stored ? stored === 'dark' : prefersDark;
			setIsDark(enableDark);
			if (enableDark) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		} catch {}
	}, []);

	const toggleTheme = () => {
		const next = !isDark;
		setIsDark(next);
		if (next) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};

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
			<nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[75%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg z-50 transition-all duration-300">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 rounded-lg animate-pulse bg-white/20"></div>
							<div className="w-24 h-4 rounded animate-pulse bg-white/20"></div>
						</div>
						<div className="hidden items-center space-x-1 md:flex">
							<div className="w-20 h-8 rounded-lg animate-pulse bg-white/20"></div>
							<div className="w-20 h-8 rounded-lg animate-pulse bg-white/20"></div>
						</div>
						<div className="w-8 h-8 rounded-full animate-pulse bg-white/20"></div>
					</div>
				</div>
			</nav>
		);
	}

	return (
		<>
			{/* Main Navigation Bar */}
		<nav
			className="fixed top-4 left-1/2 transform -translate-x-1/2 w-auto px-6 rounded-2xl shadow-lg z-50 border transition-colors backdrop-blur-xl bg-white/10 border-white/20 dark:bg-black/40 dark:border-white/20"
		>
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo/Brand */}
						<Link href="/" className="flex items-center space-x-2 group">
							<div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-xl">
								<span className="text-lg font-bold text-white">P</span>
							</div>
							<span className="hidden text-xl font-bold sm:block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
								Portume
							</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden items-center space-x-1 md:flex">
						{navLinks.map((link) => {
								const IconComponent = link.icon;
								return (
									<Link
										key={link.href}
										href={link.href}
									className={`group flex items-center space-x-2 px-4 py-2 text-sm md:text-base font-medium tracking-wide uppercase rounded-lg transition-all duration-300 ${
										pathname === link.href
											? "text-white"
											: "text-white/80 hover:text-white"
									}`}
									>
									<IconComponent className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
										<span>{link.label}</span>
									</Link>
								);
							})}
							
						</div>

						{/* Right Side - User Section */}
						<div className="flex items-center space-x-4">
						{/* Theme toggle */}
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleTheme}
							title={isDark ? "Switch to light mode" : "Switch to dark mode"}
							className="bg-transparent"
						>
							{isDark ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
						</Button>
							{user ? (
								<div className="relative">
									<Button
										variant="ghost"
										onClick={() => setDropdownOpen(!dropdownOpen)}
										className="flex items-center p-2 space-x-2 h-auto bg-transparent transition-all duration-300"
									>
										{user.avatar ? (
											<img
												src={user.avatar}
												alt={user.name}
												className="object-cover w-8 h-8 rounded-full ring-2 transition-all duration-200 ring-white/30 hover:ring-white/60"
											/>
										) : (
											<div className="flex justify-center items-center w-8 h-8 rounded-full ring-2 transition-all duration-200 bg-white/20 ring-white/30 hover:ring-white/60">
												<span className="text-sm font-medium text-white">
													{user.name?.charAt(0)?.toUpperCase() || "U"}
												</span>
											</div>
										)}
										<span className="hidden text-sm font-medium text-white sm:block">
											{user.name || "User"}
										</span>
										<ChevronDown className="w-4 h-4 text-white/80" />
									</Button>

									{/* User Dropdown */}
									{dropdownOpen && (
										<Card className="absolute right-0 z-50 mt-2 w-56 animate-fade-in">
											<div className="p-4 border-b border-white dark:border-white">
												<p className="text-sm font-medium text-white">
													{user.name}
												</p>
												<p className="text-xs truncate text-white/80">
													{user.email}
												</p>
											</div>

											<div className="p-2">
												<Link
													href="/dashboard"
													className="flex items-center px-3 py-2 text-sm text-white rounded-md transition-colors duration-200 hover:bg-white/20"
												>
													<BarChart3 className="mr-3 w-4 h-4" />
													Dashboard
												</Link>

												<Link
													href="/editor"
													className="flex items-center px-3 py-2 text-sm text-white rounded-md transition-colors duration-200 hover:bg-white/20"
												>
													<Edit className="mr-3 w-4 h-4" />
													Create Portfolio
												</Link>

												<Link
													href="/settings"
													className="flex items-center px-3 py-2 text-sm text-white rounded-md transition-colors duration-200 hover:bg-white/20"
												>
													<Settings className="mr-3 w-4 h-4" />
													Settings
												</Link>

												<Separator className="my-2" />
												<Button
													variant="ghost"
													onClick={handleLogout}
													className="flex items-center px-3 py-2 w-full text-sm transition-colors duration-200 text-destructive hover:bg-destructive/10"
												>
													<LogOut className="mr-3 w-4 h-4" />
													Sign Out
												</Button>
											</div>
										</Card>
									)}
								</div>
							) : (
								<div className="flex items-center space-x-3">
									<Button asChild>
										<Link href="/auth/signup">
											Get Started
										</Link>
									</Button>
								</div>
							)}

							{/* Star on GitHub */}
							<Button asChild className="hidden md:inline-flex bg-white/20 hover:bg-white/30 text-white border border-white/30">
								<a href="https://github.com/harrypeter07/portifier" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
									<Heart className="w-4 h-4 fill-red-500 text-red-500" />
									<span>Star on GitHub</span>
								</a>
							</Button>

							{/* Bug Report Button */}
							<Button 
								onClick={() => setIsBugReportOpen(true)}
								className="hidden md:inline-flex bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30"
							>
								<Bug className="w-4 h-4 mr-2" />
								Report Bug
							</Button>

							{/* Mobile menu button */}
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="bg-transparent transition-all duration-300 md:hidden"
							>
								{mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
							</Button>
						</div>
					</div>

					{/* Mobile Navigation */}
					{mobileMenuOpen && (
						<div className="border-t backdrop-blur-xl md:hidden border-white/20 bg-white/10 animate-slide-in">
								<a href="https://github.com/harrypeter07/portifier" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 text-white">
									<Heart className="w-4 h-4 fill-white/80 text-white" />
									<span>Star on GitHub</span>
								</a>
								
								<button 
									onClick={() => {
										setIsBugReportOpen(true);
										setMobileMenuOpen(false);
									}}
									className="flex items-center justify-center gap-2 px-4 py-3 text-white hover:bg-white/10 transition-colors"
								>
									<Bug className="w-4 h-4 text-red-300" />
									<span>Report Bug</span>
								</button>
							
							<div className="px-4 py-4 space-y-2">
								{navLinks.map((link) => {
									const IconComponent = link.icon;
									return (
										<Link
											key={link.href}
											href={link.href}
											onClick={() => setMobileMenuOpen(false)}
											className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium tracking-wide uppercase rounded-lg transition-all duration-300 ${
												pathname === link.href
													? "text-white"
													: "text-white/80 hover:text-white"
											}`}
										>
											<IconComponent className="w-5 h-5" />
											<span>{link.label}</span>
										</Link>
									);
								})}

								{user && (
									<div className="pt-4 mt-4 border-t border-white dark:border-white">
										<div className="flex items-center px-3 py-2 mb-3 space-x-3">
											{user.avatar ? (
												<img
													src={user.avatar}
													alt={user.name}
													className="object-cover w-10 h-10 rounded-full"
												/>
											) : (
												<div className="flex justify-center items-center w-10 h-10 bg-black rounded-full dark:bg-white">
													<span className="font-medium text-white dark:text-black">
														{user.name?.charAt(0)?.toUpperCase() || "U"}
													</span>
												</div>
											)}
											<div>
												<p className="text-sm font-medium text-white">
													{user.name}
												</p>
												<p className="text-xs text-white/80">
													{user.email}
												</p>
											</div>
										</div>

										<Button
											variant="ghost"
											onClick={handleLogout}
											className="flex items-center px-3 py-2 space-x-3 w-full text-base font-medium rounded-lg transition-colors duration-200 text-destructive hover:bg-destructive/10"
										>
											<LogOut className="w-5 h-5" />
											<span>Sign Out</span>
										</Button>
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
						className={`fixed left-4 top-20 z-40 bg-white dark:bg-black rounded-lg shadow-lg border border-white dark:border-white transition-all duration-300 ${
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
						<Button
							size="icon"
							onClick={handleEditorNavMinimizeToggle}
							className="absolute -top-2 -right-2 z-50 w-6 h-6 rounded-full shadow-lg transition-all duration-200"
							title={isEditorNavMinimized ? "Expand" : "Minimize"}
						>
							{isEditorNavMinimized ? "🔽" : "🔼"}
						</Button>

						{isEditorNavMinimized ? (
							// Minimized state - just show current step
							<div className="flex justify-center items-center h-full">
								<div className="text-center">
									<div className="flex justify-center items-center mx-auto mb-1 w-6 h-6 text-white bg-black rounded-full dark:bg-white dark:text-black">
										<span className="text-xs">{editorSteps[currentEditorStepIndex]?.icon}</span>
									</div>
									<div className="text-[8px] font-medium text-black dark:text-white">
										{currentEditorStepIndex + 1}/{editorSteps.length}
									</div>
								</div>
							</div>
						) : (
							// Expanded state - show full navigation
							<div className="p-3">
								{/* Progress Bar */}
								<div className="mb-3">
									<div className="mb-2 text-center">
										<div className="text-xs font-medium text-black dark:text-white">
											{currentEditorStepIndex + 1}/{editorSteps.length}
										</div>
									</div>
									<div className="w-full h-1 rounded-full bg-white/20 dark:bg-white/20">
										<motion.div
											className="h-1 bg-black rounded-full dark:bg-white"
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
														? "text-black bg-white/20 dark:bg-white/20 dark:text-white"
														: isCompleted
														? "text-green-600 hover:bg-green-50"
														: isClickable
														? "text-black/80 dark:text-white/80 hover:text-black dark:text-white hover:bg-white/20 dark:bg-white/20"
														: "cursor-not-allowed text-black/80 dark:text-white/80/50"
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
														? "text-white bg-black dark:bg-white dark:text-black"
														: isCompleted
														? "text-green-600 bg-green-100"
														: "bg-white/20 dark:bg-white/20 text-black/80 dark:text-white/80"
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

			{/* Bug Report Modal */}
			<BugReportModal
				isOpen={isBugReportOpen}
				onClose={() => setIsBugReportOpen(false)}
			/>
		</>
	);
}
