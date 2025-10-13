import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function ColorfullFull({ data = EMPTY_PORTFOLIO }) {
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
		<div className="min-h-screen bg-slate-900 text-slate-100 relative">
			{/* Background Effects */}
			<div className="absolute inset-0 -z-50 max-h-screen background-gradient"></div>
			<div className="absolute pointer-events-none inset-0 -z-40 h-full bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"></div>
			
			{/* Hero Section */}
			<section className="min-h-screen flex items-center justify-center px-6">
				<div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-2 items-center max-w-6xl mx-auto">
					{/* Hero Content */}
					<div className="col-start-1 md:row-start-1">
						<HeroContent 
							firstName={personal.firstName || "Your"}
							lastName={personal.lastName || "Name"}
							tagline={tagline || "Full Stack Developer"}
						/>
					</div>
					
					{/* Hero Visual - Simple animated shapes without Three.js */}
					<div className="flex justify-center">
						<SimpleAnimatedShapes />
					</div>
				</div>
			</section>

			{/* About Section */}
			{about.summary && (
				<section className="py-20 px-6" id="about">
					<div className="max-w-6xl mx-auto">
						<div className="grid gap-x-8 gap-y-6 md:grid-cols-[2fr, 1fr]">
							<div className="col-start-1">
								<motion.h2
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6 }}
									viewport={{ once: true }}
									className="mb-6 text-4xl font-bold text-slate-100"
								>
									About Me
								</motion.h2>
								<div className="prose prose-xl prose-slate prose-invert mb-8">
									<p className="text-lg leading-relaxed text-slate-300">
										{about.summary}
									</p>
									{about.bio && (
										<p className="text-lg leading-relaxed text-slate-300">
											{about.bio}
										</p>
									)}
								</div>
								<motion.button
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.2 }}
									viewport={{ once: true }}
									className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300"
								>
									View My Work
								</motion.button>
							</div>

							<div className="col-start-2 row-start-1">
								{personal.avatar && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.6, delay: 0.3 }}
										viewport={{ once: true }}
										className="max-w-sm rounded-[12px] overflow-hidden"
									>
										<img 
											src={personal.avatar} 
											alt={`${fullName} avatar`}
											className="w-full h-auto"
										/>
									</motion.div>
								)}
							</div>
						</div>
					</div>
				</section>
			)}

			{/* Skills Section */}
			{skills.technical && skills.technical.length > 0 && (
				<section className="py-20 px-6 bg-slate-800/50">
					<div className="max-w-6xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="mb-12 text-center"
						>
							<h2 className="mb-4 text-4xl font-bold text-slate-100">
								Technologies I Work With
							</h2>
						</motion.div>
						
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							{skills.technical.map((category, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="p-6 bg-slate-700/50 rounded-lg backdrop-blur-sm"
								>
									<h3 className="mb-4 text-xl font-semibold text-slate-100">
										{category.category}
									</h3>
									<div className="flex flex-wrap gap-2">
										{category.skills.map((skill, skillIndex) => (
											<span
												key={skillIndex}
												className="px-3 py-1 text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-full font-medium"
											>
												{skill.name}
											</span>
										))}
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Experience Section */}
			{experience.jobs && experience.jobs.length > 0 && (
				<section className="py-20 px-6">
					<div className="max-w-6xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="mb-12 text-center"
						>
							<h2 className="mb-4 text-4xl font-bold text-slate-100">
								Experience
							</h2>
						</motion.div>
						
						<div className="space-y-8">
							{experience.jobs.map((job, index) => (
								<motion.div
									key={job.id || index}
									initial={{ opacity: 0, x: -30 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="p-8 bg-slate-700/30 rounded-lg backdrop-blur-sm"
								>
									<div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between">
										<div>
											<h3 className="text-2xl font-semibold text-slate-100">
												{job.position}
											</h3>
											<p className="text-lg text-yellow-400">
												{job.company}
											</p>
										</div>
										<div className="mt-2 text-slate-400 md:mt-0">
											{job.startDate} - {job.current ? "Present" : job.endDate}
										</div>
									</div>
									<p className="mb-4 text-slate-300">
										{job.description}
									</p>
									{job.technologies && job.technologies.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{job.technologies.map((tech, techIndex) => (
												<span
													key={techIndex}
													className="px-3 py-1 text-sm text-slate-900 bg-yellow-400 rounded-full"
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

			{/* Projects Section */}
			{projects.items && projects.items.length > 0 && (
				<section className="py-20 px-6 bg-slate-800/50">
					<div className="max-w-6xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							viewport={{ once: true }}
							className="mb-12 text-center"
						>
							<h2 className="mb-4 text-4xl font-bold text-slate-100">
								Featured Projects
							</h2>
							<p className="text-lg text-slate-300">
								Here are some of my recent projects that showcase my skills and experience.
							</p>
						</motion.div>
						
						<div className="grid gap-8 md:grid-cols-2">
							{projects.items.map((project, index) => (
								<motion.div
									key={project.id || index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: index * 0.1 }}
									viewport={{ once: true }}
									className="p-8 bg-slate-700/30 rounded-lg backdrop-blur-sm"
								>
									<h3 className="mb-4 text-2xl font-semibold text-slate-100">
										{project.title}
									</h3>
									<p className="mb-4 text-slate-300">
										{project.description}
									</p>
									{project.technologies && project.technologies.length > 0 && (
										<div className="flex flex-wrap gap-2 mb-4">
											{project.technologies.map((tech, techIndex) => (
												<span
													key={techIndex}
													className="px-3 py-1 text-sm text-slate-900 bg-yellow-400 rounded-full"
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
													className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300"
												>
													Live Demo
												</a>
											)}
											{project.links.github && (
												<a
													href={project.links.github}
													target="_blank"
													rel="noopener noreferrer"
													className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition-all duration-300"
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
			<section className="py-20 px-6">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="mb-12"
					>
						<h2 className="mb-4 text-4xl font-bold text-slate-100">
							Get In Touch
						</h2>
						<div className="prose prose-xl prose-slate prose-invert">
							<p className="text-lg text-slate-300">
								I'm always interested in new opportunities and collaborations. Whether you have a project in mind or just want to connect, feel free to reach out!
							</p>
							<p className="text-lg text-slate-300">
								You can find me on social media or send me an email. I'd love to hear from you!
							</p>
						</div>
					</motion.div>
					
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						viewport={{ once: true }}
						className="space-y-4"
					>
						{email && (
							<div className="flex justify-center items-center space-x-2">
								<svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
									<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
								</svg>
								<a href={`mailto:${email}`} className="text-yellow-400 hover:text-yellow-300 hover:underline">
									{email}
								</a>
							</div>
						)}
						{phone && (
							<div className="flex justify-center items-center space-x-2">
								<svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
								</svg>
								<a href={`tel:${phone}`} className="text-yellow-400 hover:text-yellow-300 hover:underline">
									{phone}
								</a>
							</div>
						)}
					</motion.div>
				</div>
			</section>
		</div>
	);
}

// Hero Content Component
function HeroContent({ firstName, lastName, tagline }) {
	const component = useRef(null);

	useEffect(() => {
		let ctx = gsap.context(() => {
			const tl = gsap.timeline();

			tl.fromTo(
				".name-animation",
				{
					x: -100,
					opacity: 0,
					rotate: -10,
				},
				{
					x: 0,
					opacity: 1,
					rotate: 0,
					ease: "elastic.out(1,0.3)",
					duration: 1,
					transformOrigin: "left top",
					delay: 0.5,
					stagger: {
						each: 0.1,
						from: "random",
					},
				}
			);

			tl.fromTo(
				".job-title",
				{
					y: 20,
					opacity: 0,
					scale: 1.2,
				},
				{
					opacity: 1,
					y: 0,
					duration: 1,
					scale: 1,
					ease: "elastic.out(1,0.3)",
				}
			);
		}, component);

		return () => ctx.revert();
	}, []);

	const renderLetters = (name, key) => {
		if (!name) return;
		return name.split("").map((letter, index) => (
			<span
				key={index}
				className={`name-animation name-animation-${key} inline-block`}
			>
				{letter}
			</span>
		));
	};

	return (
		<div ref={component}>
			<h1
				className="mb-8 text-[clamp(3rem,15vmin,10rem)] font-extrabold leading-none"
				aria-label={`${firstName} ${lastName}`}
			>
				<span className="block text-slate-300">
					{renderLetters(firstName, "first")}
				</span>
				<span className="-mt-[.2em] block text-slate-500">
					{renderLetters(lastName, "last")}
				</span>
				<span className="job-title block bg-gradient-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-2xl font-bold uppercase tracking-[.2em] text-transparent opacity-1 md:text-4xl">
					{tagline}
				</span>
			</h1>
		</div>
	);
}

// Simple Animated Shapes Component (without Three.js)
function SimpleAnimatedShapes() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return <div className="w-96 h-96"></div>;
	}

	return (
		<div className="relative w-96 h-96">
			{/* Animated geometric shapes using CSS */}
			<div className="absolute inset-0 flex items-center justify-center">
				{/* Circle */}
				<div className="absolute w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full animate-pulse opacity-80"></div>
				
				{/* Square */}
				<div className="absolute w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 transform rotate-45 animate-spin opacity-70" style={{ animationDuration: '3s' }}></div>
				
				{/* Triangle */}
				<div className="absolute w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-gradient-to-br border-b-purple-400 animate-bounce opacity-60"></div>
				
				{/* Hexagon */}
				<div className="absolute w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 transform rotate-12 animate-pulse opacity-50" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}></div>
				
				{/* Diamond */}
				<div className="absolute w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 transform rotate-45 animate-pulse opacity-60" style={{ animationDelay: '0.5s' }}></div>
			</div>
		</div>
	);
}
