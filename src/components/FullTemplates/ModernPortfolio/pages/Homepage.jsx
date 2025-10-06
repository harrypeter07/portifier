"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";

import ProjectCard from "../app/components/SkateBoard";
import { getProjectData } from "../data/skateboardData";
import TextAndImage from "../app/components/TextAndImage";
import ParallaxSection from "../app/components/ParallaxSection";
import TextType from "../app/components/TextType";
import ContactForm from "../app/components/ContactForm";
import Footer from "../app/components/Footer";

// Heading replaced by TextType for typing animation

const Hero = ({ portfolioData, fullName }) => {
	const personal = portfolioData?.personal || {};
	const title = personal.subtitle || "Full Stack Engineer & UI Specialist";
	const description = portfolioData?.about?.summary || 
		"I build robust, scalable web applications and beautiful user interfaces. Let's create something amazing together!";
	
	return (
	<section className="overflow-hidden relative m-0 border-none hero h-dvh text-zinc-800">
		<div className="grid absolute inset-0 mx-auto mt-16 max-w-6xl grid-rows-[1fr,auto] place-items-end px-6 ~py-10/16 w-full h-full">
			<div className="flex flex-col-reverse gap-8 justify-between items-center w-full h-full lg:flex-row">
				<div className="flex flex-col flex-1 justify-center">
					<div className="relative place-self-start max-w-2xl">
						<span className="block mb-2 font-sans text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
							<TextType
								as="span"
								text={["Hi, my name is"]}
								typingSpeed={60}
								pauseDuration={1200}
								showCursor={false}
								className="text-white"
							/>
						</span>
						<span
							className="block pl-2 font-sans text-2xl font-extrabold tracking-tight uppercase drop-shadow-lg md:text-5xl lg:text-6xl"
							style={{ left: "-10px", position: "relative" }}
						>
							<TextType
								as="span"
								text={[fullName.toUpperCase()]}
								typingSpeed={80}
								pauseDuration={3000}
								showCursor={true}
								className=""
								textColors={["#000"]}
							/>
						</span>
					</div>
					<TextType
						as="span"
						text={[title]}
						className="block mt-6 text-3xl font-bold text-brand-purple"
						typingSpeed={60}
						pauseDuration={2000}
						showCursor={false}
					/>
					<div className="relative flex flex-col w-full items-center justify-between ~gap-2/4 lg:flex-row mt-6">
						<div className="max-w-[45ch] font-semibold ~text-lg/xl">
							<p>
								{description}
							</p>
						</div>
						<a
							href="#projects"
							className="z-20 mt-2 button-cutout group mx-4 inline-flex items-center bg-gradient-to-b from-25% to-75% bg-[length:100%_400%] font-bold transition-[filter,background-position] duration-300 hover:bg-bottom from-brand-purple to-brand-lime text-white hover:text-black ~text-lg/2xl ~gap-3/4 ~px-1/2 ~py-3/4"
						>
							<span className="flex size-6 items-center justify-center transition-transform group-hover:-rotate-[25deg]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									width="24"
									height="24"
								>
									<path fill="currentColor" d="M12 5v14m7-7H5" />
								</svg>
							</span>
							<div className="self-stretch w-px bg-black/25" />
							View Projects
						</a>
					</div>
				</div>
				{/* Right side image with hover interaction - moved up and right */}
				<div
					className="flex-1 w-full max-w-xl h-[300px] min-h-[200px] max-h-[350px] flex items-start justify-end relative z-30"
					style={{ marginTop: "-40px", marginRight: "-40px" }}
				>
					<div
						className="group w-[90%] h-[90%] flex items-center justify-center cursor-pointer transition-transform duration-300"
						style={{ perspective: "1200px" }}
					>
						<Image
							src={personal.avatar || "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"}
							alt={`${fullName} - Professional Photo`}
							width={350}
							height={350}
							className="rounded-2xl shadow-2xl object-cover w-full h-full max-h-[350px] max-w-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"
							style={{ willChange: "transform" }}
							priority
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
	);
};


const ProductGrid = ({ projectData }) => {
	const sectionRef = useRef(null);
	const cardsContainerRef = useRef(null);

	useEffect(() => {
		// Register ScrollTrigger plugin
		gsap.registerPlugin(ScrollTrigger);

		if (!sectionRef.current || !cardsContainerRef.current) return;

		// Calculate the total width needed for all projects
		const totalProjects = projectData.length;
		const cardWidth = 400; // Approximate width of each card including gap
		const gapWidth = 32; // Gap between cards (gap-8 = 32px)
		const totalWidth = (totalProjects * cardWidth) + ((totalProjects - 1) * gapWidth);
		const viewportWidth = window.innerWidth;
		const maxScrollDistance = Math.max(0, totalWidth - viewportWidth);
		
		// Calculate the percentage to move (ensures all projects are reachable)
		// Add extra padding to ensure last project is fully visible
		const scrollPercentage = ((maxScrollDistance + 200) / viewportWidth) * 100;

		// Create the horizontal scroll animation with consistent speed
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef.current,
				start: "top top", // Start when top of section hits top of viewport
				end: "+=600%", // Much more scroll distance to ensure all projects are visible
				scrub: 1, // Smooth scrubbing with consistent speed
				pin: true, // Pin the section during animation
				anticipatePin: 1, // Prevent glitchy pinning
				markers: false, // Disable markers for production
				fastScrollEnd: true, // Better performance for fast scrolling
				preventOverlaps: true, // Prevent overlapping triggers
			}
		});

		// Animate the cards container horizontally with linear easing for consistent speed
		tl.to(cardsContainerRef.current, {
			x: `-${scrollPercentage}%`, // Move based on calculated percentage
			ease: "none", // Linear easing for consistent speed throughout
			duration: 1
		});

		// Cleanup function
		return () => {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			className="overflow-hidden relative px-4 py-16 transition-all duration-500 text-zinc-800 max-sm:mb-32 max-md:mb-32"
			id="projects"
			style={{
				borderRadius: "2rem",
				boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
				minHeight: "100vh", // Full viewport height for GSAP animation
			}}
		>
			{/* Animated Background */}
			<div
				className="absolute inset-0 animate-scroll-left"
				style={{
					backgroundImage: "url('/background-9509852_1280.webp')",
					backgroundSize: "200% 100%",
					backgroundPosition: "0% center",
					backgroundRepeat: "repeat-x",
				}}
			/>

			{/* Overlay for better text readability */}
			<div className="absolute inset-0 rounded-2xl bg-black/20" />

			{/* Content */}
			<div className="flex relative z-10 flex-col justify-center items-center">
				<TextType
					as="h2"
					text={["PROJECTS"]}
					className="mb-3 font-sans text-4xl tracking-tight text-center text-white uppercase drop-shadow-lg md:text-5xl lg:text-6xl"
					typingSpeed={60}
					pauseDuration={2000}
					showCursor={false}
				/>
				<TextType
					as="div"
					text={["Explore some of my recent work and creative projects."]}
					className="mb-8 text-2xl font-semibold text-center drop-shadow md:text-3xl text-white/90"
					typingSpeed={40}
					pauseDuration={2000}
					showCursor={false}
				/>
				
				{/* Horizontal scroll container */}
				<div className="overflow-hidden py-8 w-full">
					<div 
						ref={cardsContainerRef}
						className="flex gap-8"
					>
						{projectData.map((project, index) => (
							<div key={index} className="flex-shrink-0 w-full max-w-md">
								<ProjectCard
									title={project.title}
									image={project.image}
									description={project.description}
									link={project.link}
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes scroll-left {
					0% {
						background-position: 0% center;
					}
					100% {
						background-position: -200% center;
					}
				}

				.animate-scroll-left {
					animation: scroll-left 30s linear infinite;
				}
			`}</style>
		</section>
	);
};

const Homepage = ({ portfolioData, projectData, navigationData }) => {
	// Extract dynamic data from portfolio
	const personal = portfolioData?.personal || {};
	const about = portfolioData?.about || {};
	const experience = portfolioData?.experience || {};
	const education = portfolioData?.education || {};
	const skills = portfolioData?.skills || {};
	const contact = portfolioData?.contact || {};
	
	// Calculate fullName for use throughout the component
	const fullName = personal.firstName && personal.lastName
		? `${personal.firstName} ${personal.lastName}`
		: personal.title || "Professional";
	
	// Build dynamic about text
	const aboutText = about.summary || about.bio || "A passionate professional with expertise in technology and design.";
	const contactInfo = personal.email || contact.email || "";
	const phoneInfo = personal.phone || contact.phone || "";
	const locationInfo = personal.location?.city && personal.location?.state 
		? `${personal.location.city}, ${personal.location.state}`
		: contact.location || "";
	
	// Build experience summary
	const experienceYears = experience.jobs?.length > 0 ? `${experience.jobs.length}+ years` : "Experienced";
	const educationInfo = education.degrees?.[0]?.degree || "Professional";
	const interests = about.interests?.join(", ") || "Technology, Design, Innovation";
	
	const fullAboutText = `${aboutText}\n\nContact: ${contactInfo} | ${phoneInfo}\nLocation: ${locationInfo}\nExperience: ${experienceYears} in professional work\nEducation: ${educationInfo}\nInterests: ${interests}`;

	return (
		<div className="bg-texture bg-brand-pink">
			<Hero portfolioData={portfolioData} fullName={fullName} />
			<ProductGrid projectData={projectData} />
			<ParallaxSection>
				{/* About Section - Dynamic */}
				<TextAndImage
					variation="right"
					theme="orange"
					heading="About Me"
					text={fullAboutText}
					buttonText="Download Resume"
					buttonLink="/resume.pdf"
					imageForeground={personal.avatar || "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"}
					imageBackground="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
				/>

				{/* Skills Section - Structured & Animated */}
				<section className="px-4 py-16 bg-brand-blue bg-texture">
					<div className="grid grid-cols-1 gap-12 items-center mx-auto max-w-6xl md:grid-cols-2 md:gap-24">
						<div className="flex flex-col gap-8 animate-fade-in-up">
							<TextType
								as="h2"
								text={["Skills"]}
								className="mb-2 text-4xl font-bold text-white"
								typingSpeed={60}
								pauseDuration={2000}
								showCursor={false}
							/>
							<div className="mb-4 max-w-md text-lg text-white/90">
								A quick overview of my technical skills and tools I use daily.
							</div>
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
								{(() => {
									// Transform portfolio skills to template format
									const skillGroups = [];
									
									// Technical skills
									if (skills.technical && skills.technical.length > 0) {
										skills.technical.forEach(category => {
											if (category.skills && category.skills.length > 0) {
												skillGroups.push({
													group: category.category || "Technical",
													skills: category.skills.map(skill => skill.name || skill)
												});
											}
										});
									}
									
									// Soft skills
									if (skills.soft && skills.soft.length > 0) {
										skillGroups.push({
											group: "Soft Skills",
											skills: skills.soft.map(skill => skill.name || skill)
										});
									}
									
									// Languages
									if (skills.languages && skills.languages.length > 0) {
										skillGroups.push({
											group: "Languages",
											skills: skills.languages.map(lang => lang.name || lang)
										});
									}
									
									// Fallback to default skills if no data
									if (skillGroups.length === 0) {
										skillGroups.push(
											{
												group: "Frontend",
												skills: ["React", "Next.js", "JavaScript", "CSS3", "HTML5"]
											},
											{
												group: "Backend", 
												skills: ["Node.js", "Express", "MongoDB", "REST APIs"]
											},
											{
												group: "Tools",
												skills: ["Git", "VS Code", "Figma", "Vercel"]
											}
										);
									}
									
									return skillGroups.map(({ group, skills }) => (
										<div
											key={group}
											className="p-4 rounded-xl border shadow-lg bg-white/10 border-white/10 animate-fade-in-up"
										>
											<div className="mb-2 font-bold text-brand-lime">
												{group}
											</div>
											<ul className="space-y-1">
												{skills.map((skill) => (
													<li key={skill} className="flex gap-2 items-center">
														<span className="inline-block w-2 h-2 rounded-full animate-pulse bg-brand-lime" />
														<span className="font-medium text-white/90">
															{skill}
														</span>
													</li>
												))}
											</ul>
										</div>
									));
								})()}
							</div>
						</div>
						<div className="flex justify-center items-center animate-fade-in-up">
							<Image
								src={personal.avatar || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"}
								alt={`${fullName} - Professional Skills`}
								width={300}
								height={400}
								className="w-full max-w-xs rounded-2xl shadow-2xl"
								priority
							/>
						</div>
					</div>
				</section>
				{/* Dynamic Contact Section */}
				<section className="bg-brand-lime bg-texture py-16 px-4 min-h-[90vh]">
					<div className="grid grid-cols-1 gap-12 items-center mx-auto max-w-6xl md:grid-cols-2 md:gap-24">
						<div className="flex flex-col gap-8 items-center text-center md:items-start md:text-left animate-fade-in-up">
							<TextType
								as="h2"
								text={["Contact"]}
								className="text-4xl font-bold text-white"
								typingSpeed={60}
								pauseDuration={2000}
								showCursor={false}
							/>
							<div className="max-w-md text-lg text-white">
								{contact.availability || "Interested in working together, collaborating, or just want to say hi? I'm always open to new opportunities and creative projects. Let's connect!"}
							</div>
							{/* Dynamic contact info */}
							<div className="space-y-2 text-white/90">
								{contactInfo && <p>Email: {contactInfo}</p>}
								{phoneInfo && <p>Phone: {phoneInfo}</p>}
								{locationInfo && <p>Location: {locationInfo}</p>}
								{contact.timezone && <p>Timezone: {contact.timezone}</p>}
								{contact.workingHours && <p>Hours: {contact.workingHours}</p>}
							</div>
						</div>
						<div className="flex justify-center items-center animate-fade-in-up">
							<ContactForm />
						</div>
					</div>
				</section>
			</ParallaxSection>
			<Footer />
		</div>
	);
};

export default Homepage;
