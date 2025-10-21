import { motion } from "framer-motion";
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function CleanfolioFull({ data = EMPTY_PORTFOLIO }) {
	const personal = data?.personal || {};
	const about = data?.about || {};
	const experience = data?.experience || {};
	const education = data?.education || {};
	const skills = data?.skills || {};
	const projects = data?.projects || {};
	const achievements = data?.achievements || {};
	const contact = data?.contact || {};

	const fullName = personal.firstName && personal.lastName
		? `${personal.firstName} ${personal.lastName}`
		: personal.title || "Your Name";
	const subtitle = personal.subtitle || "";
	const tagline = personal.tagline || "";
	const email = personal.email || contact.email || "";
	const phone = personal.phone || contact.phone || "";

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			{/* Hero Section */}
			<section className="flex relative justify-center items-center min-h-screen text-white bg-gradient-to-br from-blue-600 to-purple-600">
				{/* Hero Background Image */}
				{personal.heroImage && (
					<div className="absolute inset-0 z-0">
						<img
							src={personal.heroImage}
							alt="Hero background"
							className="w-full h-full object-cover opacity-20"
						/>
					</div>
				)}
				<div className="px-6 mx-auto max-w-4xl text-center relative z-10">
					{/* Profile Avatar */}
					{personal.avatar && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="mb-8 flex justify-center"
						>
							<img
								src={personal.avatar}
								alt={`${fullName} profile`}
								className="w-32 h-32 rounded-full border-4 border-white/30 shadow-2xl object-cover"
							/>
						</motion.div>
					)}
					<motion.h1 
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="mb-6 text-5xl font-bold md:text-7xl"
					>
						{fullName}
					</motion.h1>
					{subtitle && (
						<motion.h2 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="mb-4 text-xl text-blue-100 md:text-2xl"
						>
							{subtitle}
						</motion.h2>
					)}
					{tagline && (
						<motion.p 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="mx-auto max-w-2xl text-lg text-blue-50"
						>
							{tagline}
						</motion.p>
					)}
				</div>
			</section>

			{/* About Section */}
			{about.summary && (
				<section className="py-20 bg-gray-50 dark:bg-gray-800">
					<div className="px-6 mx-auto max-w-4xl">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="mb-12 text-center"
						>
							<h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
								About Me
							</h2>
							<div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="p-8 bg-white rounded-2xl shadow-xl dark:bg-gray-700"
						>
							<p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
								{about.summary}
							</p>
						</motion.div>
					</div>
				</section>
			)}

			{/* Experience Section */}
			{experience.jobs && experience.jobs.length > 0 && (
				<section className="py-20 bg-white dark:bg-gray-900">
					<div className="px-6 mx-auto max-w-4xl">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="mb-12 text-center"
						>
							<h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
								Experience
							</h2>
							<div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
						</motion.div>
						<div className="space-y-8">
							{experience.jobs.map((job, index) => (
								<motion.div
									key={job.id || index}
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="p-8 bg-gray-50 rounded-2xl shadow-lg dark:bg-gray-800"
								>
									<div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between">
										<div>
											<h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
												{job.position}
											</h3>
											<p className="text-lg text-blue-600 dark:text-blue-400">
												{job.company}
											</p>
										</div>
										<div className="mt-2 text-gray-600 dark:text-gray-400 md:mt-0">
											{job.startDate} - {job.current ? "Present" : job.endDate}
										</div>
									</div>
									<p className="mb-4 text-gray-600 dark:text-gray-300">
										{job.description}
									</p>
									{job.technologies && job.technologies.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{job.technologies.map((tech, techIndex) => (
												<span
													key={techIndex}
													className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200"
												>
													{tech}
												</span>
											))}
										</div>
									)}
								</motion.div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Skills Section */}
			{skills.technical && skills.technical.length > 0 && (
				<section className="py-20 bg-gray-50 dark:bg-gray-800">
					<div className="px-6 mx-auto max-w-4xl">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="mb-12 text-center"
						>
							<h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
								Skills
							</h2>
							<div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="p-8 bg-white rounded-2xl shadow-xl dark:bg-gray-700"
						>
							<div className="grid gap-8 md:grid-cols-2">
								{skills.technical.map((category, index) => (
									<div key={index}>
										<h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
											{category.category}
										</h3>
										<div className="flex flex-wrap gap-2">
											{category.skills.map((skill, skillIndex) => (
												<span
													key={skillIndex}
													className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
												>
													{skill.name}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						</motion.div>
					</div>
				</section>
			)}

			{/* Projects Section */}
			{projects.items && projects.items.length > 0 && (
				<section className="py-20 bg-white dark:bg-gray-900">
					<div className="px-6 mx-auto max-w-6xl">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="mb-12 text-center"
						>
							<h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
								Projects
							</h2>
							<div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
						</motion.div>
						<div className="grid gap-8 md:grid-cols-2">
							{projects.items.map((project, index) => (
								<motion.div
									key={project.id || index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="p-8 bg-gray-50 rounded-2xl shadow-xl dark:bg-gray-800"
								>
									{/* Project Image */}
									{(project.images?.[0] || project.image) && (
										<div className="mb-6">
											<img
												src={project.images?.[0] || project.image}
												alt={project.title}
												className="w-full h-48 object-cover rounded-xl shadow-lg"
											/>
										</div>
									)}
									<h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
										{project.title}
									</h3>
									<p className="mb-4 text-gray-600 dark:text-gray-300">
										{project.description}
									</p>
									{project.technologies && project.technologies.length > 0 && (
										<div className="flex flex-wrap gap-2 mb-4">
											{project.technologies.map((tech, techIndex) => (
												<span
													key={techIndex}
													className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200"
												>
													{tech}
												</span>
											))}
										</div>
									)}
									{project.links && (
										<div className="flex gap-4">
											{project.links.live && (
												<a
													href={project.links.live}
													target="_blank"
													rel="noopener noreferrer"
													className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
												>
													Live Demo
												</a>
											)}
											{project.links.github && (
												<a
													href={project.links.github}
													target="_blank"
													rel="noopener noreferrer"
													className="px-4 py-2 text-gray-700 rounded-lg border border-gray-300 transition-colors dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
												>
													GitHub
												</a>
											)}
										</div>
									)}
								</motion.div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Contact Section */}
			<section className="py-20 bg-gray-50 dark:bg-gray-800">
				<div className="px-6 mx-auto max-w-4xl text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="mb-12"
					>
						<h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
							Get In Touch
						</h2>
						<div className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="p-8 bg-white rounded-2xl shadow-xl dark:bg-gray-700"
					>
						<div className="space-y-4">
							{email && (
								<div className="flex justify-center items-center space-x-2">
									<svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
									<a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
										{email}
									</a>
								</div>
							)}
							{phone && (
								<div className="flex justify-center items-center space-x-2">
									<svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
									</svg>
									<a href={`tel:${phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
										{phone}
									</a>
								</div>
							)}
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
} 