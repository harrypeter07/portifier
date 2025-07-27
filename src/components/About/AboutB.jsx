"use client";
import { motion } from "framer-motion";

export default function AboutB({ summary, data }) {
	const aboutData = data?.about || {};
	const personalData = data?.personal || {};

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
		>
			<div className="max-w-4xl mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
						About Me
					</h2>
					<div className="w-24 h-1 bg-blue-600 mx-auto"></div>
				</div>

				<div className="grid md:grid-cols-2 gap-8 items-center">
					{/* Left side - Image placeholder */}
					<div className="text-center">
						<div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-6xl font-bold mb-4">
							{personalData.firstName?.[0] || "P"}
						</div>
						<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
							{personalData.firstName} {personalData.lastName}
						</h3>
						<p className="text-blue-600 dark:text-blue-400 font-medium">
							{personalData.subtitle || "Professional"}
						</p>
					</div>

					{/* Right side - Content */}
					<div className="space-y-6">
						{/* Professional Summary */}
						{summary && (
							<div>
								<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
									Professional Summary
								</h4>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
									{summary}
								</p>
							</div>
						)}

						{/* Bio */}
						{aboutData.bio && (
							<div>
								<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
									Bio
								</h4>
								<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
									{aboutData.bio}
								</p>
							</div>
						)}

						{/* Interests */}
						{aboutData.interests && aboutData.interests.length > 0 && (
							<div>
								<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
									Interests
								</h4>
								<div className="flex flex-wrap gap-2">
									{aboutData.interests.map((interest, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
										>
											{interest}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Personal Values */}
						{aboutData.personalValues && aboutData.personalValues.length > 0 && (
							<div>
								<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
									Personal Values
								</h4>
								<div className="grid grid-cols-2 gap-2">
									{aboutData.personalValues.map((value, index) => (
										<div
											key={index}
											className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
										>
											<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
											<span className="text-sm">{value}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Fun Facts */}
						{aboutData.funFacts && aboutData.funFacts.length > 0 && (
							<div>
								<h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
									Fun Facts
								</h4>
								<div className="space-y-2">
									{aboutData.funFacts.map((fact, index) => (
										<div
											key={index}
											className="flex items-start space-x-2 text-gray-700 dark:text-gray-300"
										>
											<span className="text-blue-600 dark:text-blue-400 text-sm mt-1">
												•
											</span>
											<span className="text-sm">{fact}</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.section>
	);
} 