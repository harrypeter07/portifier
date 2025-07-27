"use client";
import { motion } from "framer-motion";

export default function ExperienceB({ jobs, data }) {
	const experienceJobs = jobs || [];

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="py-16 bg-white dark:bg-gray-900"
		>
			<div className="max-w-4xl mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
						Work Experience
					</h2>
					<div className="w-24 h-1 bg-green-600 mx-auto"></div>
				</div>

				{experienceJobs.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-600 dark:text-gray-400">
							No work experience added yet.
						</p>
					</div>
				) : (
					<div className="space-y-8">
						{experienceJobs.map((job, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="relative"
							>
								{/* Timeline line */}
								<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-green-200 dark:bg-green-800"></div>

								<div className="flex items-start space-x-6">
									{/* Timeline dot */}
									<div className="relative z-10 flex-shrink-0">
										<div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
											{index + 1}
										</div>
									</div>

									{/* Content */}
									<div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm">
										<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
											<div>
												<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
													{job.title || "Job Title"}
												</h3>
												<p className="text-green-600 dark:text-green-400 font-medium">
													{job.company || "Company Name"}
												</p>
											</div>
											<div className="mt-2 md:mt-0">
												<span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
													{job.duration || "Duration"}
												</span>
											</div>
										</div>

										{job.description && (
											<div className="prose prose-gray dark:prose-invert max-w-none">
												<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
													{job.description}
												</p>
											</div>
										)}

										{/* Skills used */}
										{job.skills && job.skills.length > 0 && (
											<div className="mt-4">
												<h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
													Skills Used:
												</h4>
												<div className="flex flex-wrap gap-2">
													{job.skills.map((skill, skillIndex) => (
														<span
															key={skillIndex}
															className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs"
														>
															{skill}
														</span>
													))}
												</div>
											</div>
										)}

										{/* Achievements */}
										{job.achievements && job.achievements.length > 0 && (
											<div className="mt-4">
												<h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
													Key Achievements:
												</h4>
												<ul className="space-y-1">
													{job.achievements.map((achievement, achievementIndex) => (
														<li
															key={achievementIndex}
															className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300"
														>
															<span className="text-green-600 dark:text-green-400 mt-1">
																•
															</span>
															<span>{achievement}</span>
														</li>
													))}
												</ul>
											</div>
										)}
									</div>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</motion.section>
	);
} 