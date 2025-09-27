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
import { Menu, X, User, Settings, LogOut, Home, BarChart3, Palette, Edit, ChevronDown } from "lucide-react";

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
			<nav className="bg-white/95 dark:bg-black/95 backdrop-blur-lg border-b border-white dark:border-white sticky top-0 z-50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-white/20 dark:bg-white/20 rounded-lg animate-pulse"></div>
							<div className="w-24 h-4 bg-white/20 dark:bg-white/20 rounded animate-pulse"></div>
						</div>
						<div className="hidden md:flex items-center space-x-1">
							<div className="w-20 h-8 bg-white/20 dark:bg-white/20 rounded-lg animate-pulse"></div>
							<div className="w-20 h-8 bg-white/20 dark:bg-white/20 rounded-lg animate-pulse"></div>
						</div>
						<div className="w-8 h-8 bg-white/20 dark:bg-white/20 rounded-full animate-pulse"></div>
					</div>
				</div>
			</nav>
		);
	}

	return (
		<>
			{/* Main Navigation Bar */}
			<nav className="bg-white/95 dark:bg-black/95 backdrop-blur-lg border-b border-white dark:border-white sticky top-0 z-50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo/Brand */}
						<Link href="/" className="flex items-center space-x-2 group">
							<div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
								<span className="text-white dark:text-black font-bold text-sm">P</span>
							</div>
							<span className="font-bold text-xl text-black dark:text-white hidden sm:block">
								Portfolio Maker
							</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-1">
							{navLinks.map((link) => {
								const IconComponent = link.icon;
								return (
									<Link
										key={link.href}
										href={link.href}
										className={`group flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 backdrop-blur-sm ${
											pathname === link.href
												? "bg-white/10 dark:bg-white/10 text-white dark:text-white shadow-lg shadow-white/20 border border-white/20"
												: "text-white/80 dark:text-white/80 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 hover:shadow-lg hover:shadow-white/20 hover:border hover:border-white/20"
										}`}
									>
										<IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
										<span>{link.label}</span>
									</Link>
								);
							})}
							
							{/* Current Template Indicator */}
							{currentTemplate && (
								<Badge variant="secondary" className="ml-4">
									<Palette className="w-3 h-3 mr-1" />
									{currentTemplate.name}
								</Badge>
							)}
						</div>

						{/* Right Side - User Section */}
						<div className="flex items-center space-x-4">
							{user ? (
								<div className="relative">
									<Button
										variant="ghost"
										onClick={() => setDropdownOpen(!dropdownOpen)}
										className="flex items-center space-x-2 p-2 h-auto bg-transparent hover:bg-white/10 dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-white/20 hover:border hover:border-white/20"
									>
										{user.avatar ? (
											<img
												src={user.avatar}
												alt={user.name}
												className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30 hover:ring-white/60 transition-all duration-200"
											/>
										) : (
											<div className="w-8 h-8 bg-white/20 dark:bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/30 hover:ring-white/60 transition-all duration-200">
												<span className="text-white dark:text-white font-medium text-sm">
													{user.name?.charAt(0)?.toUpperCase() || "U"}
												</span>
											</div>
										)}
										<span className="hidden sm:block text-sm font-medium text-white dark:text-white">
											{user.name || "User"}
										</span>
										<ChevronDown className="w-4 h-4 text-white/70 dark:text-white/70" />
									</Button>

									{/* User Dropdown */}
									{dropdownOpen && (
										<Card className="absolute right-0 mt-2 w-56 z-50 animate-fade-in">
											<div className="p-4 border-b border-white dark:border-white">
												<p className="text-sm font-medium text-black dark:text-white">
													{user.name}
												</p>
												<p className="text-xs text-black/70 dark:text-white/70 truncate">
													{user.email}
												</p>
											</div>

											<div className="p-2">
												<Link
													href="/dashboard"
													className="flex items-center px-3 py-2 text-sm text-black dark:text-white hover:bg-white/20 dark:bg-white/20 rounded-md transition-colors duration-200"
												>
													<BarChart3 className="w-4 h-4 mr-3" />
													Dashboard
												</Link>

												<Link
													href="/editor"
													className="flex items-center px-3 py-2 text-sm text-black dark:text-white hover:bg-white/20 dark:bg-white/20 rounded-md transition-colors duration-200"
												>
													<Edit className="w-4 h-4 mr-3" />
													Create Portfolio
												</Link>

												<Link
													href="/settings"
													className="flex items-center px-3 py-2 text-sm text-black dark:text-white hover:bg-white/20 dark:bg-white/20 rounded-md transition-colors duration-200"
												>
													<Settings className="w-4 h-4 mr-3" />
													Settings
												</Link>

												<Separator className="my-2" />
												<Button
													variant="ghost"
													onClick={handleLogout}
													className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200"
												>
													<LogOut className="w-4 h-4 mr-3" />
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

							{/* Mobile menu button */}
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="md:hidden bg-transparent hover:bg-white/10 dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-white/20 hover:border hover:border-white/20"
							>
								{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
							</Button>
						</div>
					</div>

					{/* Mobile Navigation */}
					{mobileMenuOpen && (
						<div className="md:hidden border-t border-white dark:border-white bg-white dark:bg-black animate-slide-in">
							{/* Current Template Indicator for Mobile */}
							{currentTemplate && (
								<div className="px-4 py-3 border-b border-white dark:border-white">
									<div className="flex items-center space-x-2">
										<span className="text-sm font-medium text-black dark:text-white">Current Template:</span>
										<Badge variant="secondary">
											<Palette className="w-3 h-3 mr-1" />
											{currentTemplate.name}
										</Badge>
									</div>
								</div>
							)}
							
							<div className="px-4 py-4 space-y-2">
								{navLinks.map((link) => {
									const IconComponent = link.icon;
									return (
										<Link
											key={link.href}
											href={link.href}
											onClick={() => setMobileMenuOpen(false)}
											className={`flex items-center space-x-3 px-3 py-2 text-base font-medium rounded-lg transition-all duration-300 backdrop-blur-sm ${
												pathname === link.href
													? "bg-white/10 dark:bg-white/10 text-white dark:text-white shadow-lg shadow-white/20 border border-white/20"
													: "text-white/80 dark:text-white/80 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10 hover:shadow-lg hover:shadow-white/20 hover:border hover:border-white/20"
											}`}
										>
											<IconComponent className="w-5 h-5" />
											<span>{link.label}</span>
										</Link>
									);
								})}

								{user && (
									<div className="border-t border-white dark:border-white pt-4 mt-4">
										<div className="flex items-center space-x-3 px-3 py-2 mb-3">
											{user.avatar ? (
												<img
													src={user.avatar}
													alt={user.name}
													className="w-10 h-10 rounded-full object-cover"
												/>
											) : (
												<div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
													<span className="text-white dark:text-black font-medium">
														{user.name?.charAt(0)?.toUpperCase() || "U"}
													</span>
												</div>
											)}
											<div>
												<p className="text-sm font-medium text-black dark:text-white">
													{user.name}
												</p>
												<p className="text-xs text-black/70 dark:text-white/70">
													{user.email}
												</p>
											</div>
										</div>

										<Button
											variant="ghost"
											onClick={handleLogout}
											className="flex items-center space-x-3 w-full px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200"
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
							className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-lg transition-all duration-200 z-50"
							title={isEditorNavMinimized ? "Expand" : "Minimize"}
						>
							{isEditorNavMinimized ? "🔽" : "🔼"}
						</Button>

						{isEditorNavMinimized ? (
							// Minimized state - just show current step
							<div className="flex items-center justify-center h-full">
								<div className="text-center">
									<div className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-1 mx-auto">
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
									<div className="text-center mb-2">
										<div className="text-xs font-medium text-black dark:text-white">
											{currentEditorStepIndex + 1}/{editorSteps.length}
										</div>
									</div>
									<div className="w-full bg-white/20 dark:bg-white/20 rounded-full h-1">
										<motion.div
											className="bg-black dark:bg-white h-1 rounded-full"
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
														? "bg-white/20 dark:bg-white/20 text-black dark:text-white"
														: isCompleted
														? "text-green-600 hover:bg-green-50"
														: isClickable
														? "text-black/70 dark:text-white/70 hover:text-black dark:text-white hover:bg-white/20 dark:bg-white/20"
														: "text-black/70 dark:text-white/70/50 cursor-not-allowed"
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
														? "bg-black dark:bg-white text-white dark:text-black"
														: isCompleted
														? "bg-green-100 text-green-600"
														: "bg-white/20 dark:bg-white/20 text-black/70 dark:text-white/70"
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
