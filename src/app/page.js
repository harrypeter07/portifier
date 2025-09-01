import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
			<Navbar />
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
					<div className="text-center">
						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8">
							Create Your Dream
							<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
								Portfolio
							</span>
						</h1>
						<p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
							Build stunning, professional portfolios in minutes. Choose from beautiful templates, 
							customize with ease, and showcase your work to the world.
						</p>
						
						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
							<Link
								href="/auth/signup"
								className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
							>
								<span className="relative z-10">Get Started Free</span>
								<div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</Link>
							<Link
								href="/auth/signin"
								className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-lg font-semibold rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
							>
								Sign In
							</Link>
						</div>

						{/* Features Grid */}
						<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
							<div className="group p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
								<p className="text-gray-600 dark:text-gray-300">Create stunning portfolios in minutes, not hours. Our intuitive builder makes it effortless.</p>
							</div>

							<div className="group p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
								<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Beautiful Templates</h3>
								<p className="text-gray-600 dark:text-gray-300">Choose from professionally designed templates that make your work shine.</p>
							</div>

							<div className="group p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
								<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Mobile Ready</h3>
								<p className="text-gray-600 dark:text-gray-300">Your portfolio looks perfect on every device, from desktop to mobile.</p>
							</div>
						</div>
					</div>
				</div>

				{/* Background decoration */}
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
			</div>
		</div>
	);
}
