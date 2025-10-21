import { motion } from "framer-motion";
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";
import ExportButton from "@/components/ExportButton";

export default function CreativeFull({ data = EMPTY_PORTFOLIO, portfolioId, username }) {
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
		<div className="min-h-screen bg-black text-white">
			{/* Export Button - Floating Action Button */}
			{portfolioId && username && (
				<div className="fixed bottom-6 right-6 z-50">
					<ExportButton 
						portfolioId={portfolioId} 
						username={username}
						className="shadow-lg"
					/>
				</div>
			)}
			
			{/* Hero Section */}
			<section className="min-h-screen flex items-center justify-center relative overflow-hidden">
				{/* Animated Background */}
				<div className="absolute inset-0">
					<motion.div
						className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.6, 0.3],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
					<motion.div
						className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
						animate={{
							scale: [1.2, 1, 1.2],
							opacity: [0.6, 0.3, 0.6],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 2,
						}}
					/>
				</div>
				
				<div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
					{/* Profile Avatar */}
					{personal.avatar && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8, delay: 0.1 }}
							className="mb-8 flex justify-center"
						>
							<img
								src={personal.avatar}
								alt={`${fullName} profile`}
								className="w-32 h-32 rounded-full border-4 border-purple-500/30 shadow-2xl object-cover"
							/>
						</motion.div>
					)}
					<motion.h1 
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
						style={{
							backgroundSize: "200% 200%",
						}}
					>
						{fullName}
					</motion.h1>
					{subtitle && (
						<motion.h2 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className="text-2xl md:text-3xl text-gray-300 mb-8 font-light"
						>
							{subtitle}
						</motion.h2>
					)}
					{tagline && (
						<motion.p 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.6 }}
							className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
						>
							{tagline}
						</motion.p>
					)}
				</div>
			</section>

			{/* About Section */}
			{about.summary && (
				<section className="py-20 bg-gradient-to-br from-gray-900 to-black">
					<div className="max-w-4xl mx-auto px-6">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
								About Me
							</h2>
							<div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700"
						>
							<p className="text-lg text-gray-300 leading-relaxed">
								{about.summary}
							</p>
						</motion.div>
					</div>
				</section>
			)}

			{/* Experience Section */}
			{experience.jobs && experience.jobs.length > 0 && (
				<section className="py-20 bg-black">
					<div className="max-w-4xl mx-auto px-6">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
								Experience
							</h2>
							<div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
						</motion.div>
						<div className="space-y-8">
							{experience.jobs.map((job, index) => (
								<motion.div
									key={job.id || index}
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700"
								>
									<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
										<div>
											<h3 className="text-2xl font-semibold text-white">
												{job.position}
											</h3>
											<p className="text-lg text-purple-400">
												{job.company}
											</p>
										</div>
										<div className="text-gray-400 mt-2 md:mt-0">
											{job.startDate} - {job.current ? "Present" : job.endDate}
										</div>
									</div>
									<p className="text-gray-300 mb-4">
										{job.description}
									</p>
									{job.technologies && job.technologies.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{job.technologies.map((tech, techIndex) => (
												<span
													key={techIndex}
													className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
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
				<section className="py-20 bg-gradient-to-br from-gray-900 to-black">
					<div className="max-w-4xl mx-auto px-6">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
								Skills
							</h2>
							<div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700"
						>
							<div className="grid md:grid-cols-2 gap-8">
								{skills.technical.map((category, index) => (
									<div key={index}>
										<h3 className="text-xl font-semibold text-white mb-4">
											{category.category}
										</h3>
										<div className="flex flex-wrap gap-2">
											{category.skills.map((skill, skillIndex) => (
												<span
													key={skillIndex}
													className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium"
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
				<section className="py-20 bg-black">
					<div className="max-w-6xl mx-auto px-6">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="text-center mb-12"
						>
							<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
								Projects
							</h2>
							<div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
						</motion.div>
						<div className="grid md:grid-cols-2 gap-8">
							{projects.items.map((project, index) => (
								<motion.div
									key={project.id || index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 hover:border-purple-500/50 transition-colors"
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
									<h3 className="text-2xl font-semibold text-white mb-4">
										{project.title}
									</h3>
									<p className="text-gray-300 mb-4">
										{project.description}
									</p>
									{project.technologies && project.technologies.length > 0 && (
										<div className="flex flex-wrap gap-2 mb-4">
											{project.technologies.map((tech, techIndex) => (
												<span
													key={techIndex}
													className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
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
													className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
												>
													Live Demo
												</a>
											)}
											{project.links.github && (
												<a
													href={project.links.github}
													target="_blank"
													rel="noopener noreferrer"
													className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:border-purple-500 hover:text-white transition-colors"
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
			<section className="py-20 bg-gradient-to-br from-gray-900 to-black">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="mb-12"
					>
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
							Get In Touch
						</h2>
						<div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700"
					>
						<div className="space-y-4">
							{email && (
								<div className="flex items-center justify-center space-x-2">
									<svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
									<a href={`mailto:${email}`} className="text-purple-400 hover:text-purple-300 transition-colors">
										{email}
									</a>
								</div>
							)}
							{phone && (
								<div className="flex items-center justify-center space-x-2">
									<svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
										<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
									</svg>
									<a href={`tel:${phone}`} className="text-purple-400 hover:text-purple-300 transition-colors">
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