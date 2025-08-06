import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
import { motion } from "framer-motion";

export default function AboutC({ data = EMPTY_PORTFOLIO, summary = "", ...props }) {
	const about = data?.about || {};
	const personal = data?.personal || {};
	
	const actualSummary = summary || about.summary || "";
	const bio = about.bio || "";
	const interests = about.interests || [];
	const personalValues = about.personalValues || [];
	const funFacts = about.funFacts || [];

	return (
		<section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-6xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
						About Me
					</h2>
					<div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-12 items-start">
					{/* Main Content */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="space-y-6"
					>
						{actualSummary && (
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
								<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
									Professional Summary
								</h3>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
									{actualSummary}
								</p>
							</div>
						)}

						{bio && (
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
								<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
									My Story
								</h3>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
									{bio}
								</p>
							</div>
						)}
					</motion.div>

					{/* Side Content */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
						viewport={{ once: true }}
						className="space-y-6"
					>
						{/* Interests */}
						{interests.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
								<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
									Interests
								</h3>
								<div className="flex flex-wrap gap-2">
									{interests.map((interest, index) => (
										<motion.span
											key={index}
											initial={{ opacity: 0, scale: 0.8 }}
											whileInView={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
											viewport={{ once: true }}
											className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium"
										>
											{interest}
										</motion.span>
									))}
								</div>
							</div>
						)}

						{/* Personal Values */}
						{personalValues.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
								<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
									Values
								</h3>
								<div className="space-y-3">
									{personalValues.map((value, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: 20 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
											viewport={{ once: true }}
											className="flex items-center space-x-3"
										>
											<div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
											<span className="text-gray-600 dark:text-gray-300">{value}</span>
										</motion.div>
									))}
								</div>
							</div>
						)}

						{/* Fun Facts */}
						{funFacts.length > 0 && (
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
								<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
									Fun Facts
								</h3>
								<div className="space-y-3">
									{funFacts.map((fact, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: 20 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
											viewport={{ once: true }}
											className="flex items-center space-x-3"
										>
											<div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
											<span className="text-gray-600 dark:text-gray-300">{fact}</span>
										</motion.div>
									))}
								</div>
							</div>
						)}
					</motion.div>
				</div>
			</div>
		</section>
	);
} 