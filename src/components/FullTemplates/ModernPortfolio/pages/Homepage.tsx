"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";

import ProjectCard from "@/app/components/SkateBoard";
import { getProjectData } from "../data/skateboardData";
import TextAndImage from "@/app/components/TextAndImage";
import ParallaxSection from "@/app/components/ParallaxSection";
import TextType from "@/app/components/TextType";

// Heading replaced by TextType for typing animation

const Hero = () => (
	<section className="hero relative h-dvh overflow-hidden text-zinc-800 m-0 border-none">
		<div className="grid absolute inset-0 mx-auto mt-16 max-w-6xl grid-rows-[1fr,auto] place-items-end px-6 ~py-10/16 w-full h-full">
			<div className="flex flex-col-reverse lg:flex-row w-full h-full items-center justify-between gap-8">
				<div className="flex-1 flex flex-col justify-center">
					<div className="relative max-w-2xl place-self-start">
						<span className="block font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
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
							className="block font-sans uppercase text-2xl md:text-5xl lg:text-6xl font-extrabold  drop-shadow-lg tracking-tight pl-2"
							style={{ left: "-10px", position: "relative" }}
						>
							<TextType
								as="span"
								text={["HASSAN MANSURI"]}
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
						text={["Full Stack Engineer & UI Specialist"]}
						className="mt-6 block text-3xl font-bold text-brand-purple"
						typingSpeed={60}
						pauseDuration={2000}
						showCursor={false}
					/>
					<div className="relative flex flex-col w-full items-center justify-between ~gap-2/4 lg:flex-row mt-6">
						<div className="max-w-[45ch] font-semibold ~text-lg/xl">
							<p>
								I build robust, scalable web applications and beautiful user
								interfaces. Let&apos;s create something amazing together!
							</p>
						</div>
						<a
							href="#projects"
							className="z-20 mt-2 block button-cutout group mx-4 inline-flex items-center bg-gradient-to-b from-25% to-75% bg-[length:100%_400%] font-bold transition-[filter,background-position] duration-300 hover:bg-bottom from-brand-purple to-brand-lime text-white hover:text-black ~text-lg/2xl ~gap-3/4 ~px-1/2 ~py-3/4"
						>
							<span className="flex size-6 items-center justify-center transition-transform group-hover:-rotate-[25deg] size-6">
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
							<div className="w-px self-stretch bg-black/25" />
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
							src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
							alt="Showcase"
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


const ProductGrid = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const cardsContainerRef = useRef<HTMLDivElement>(null);

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
			className="relative text-zinc-800 max-sm:mb-32 max-md:mb-32 py-16 px-4 overflow-hidden transition-all duration-500"
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
			<div className="absolute inset-0 bg-black/20 rounded-2xl" />

			{/* Content */}
			<div className="relative z-10 flex flex-col items-center justify-center">
				<TextType
					as="h2"
					text={["PROJECTS"]}
					className="mb-3 text-center font-sans uppercase text-white drop-shadow-lg text-4xl md:text-5xl lg:text-6xl tracking-tight"
					typingSpeed={60}
					pauseDuration={2000}
					showCursor={false}
				/>
				<TextType
					as="div"
					text={["Explore some of my recent work and creative projects."]}
					className="text-center mb-8 text-2xl md:text-3xl font-semibold text-white/90 drop-shadow"
					typingSpeed={40}
					pauseDuration={2000}
					showCursor={false}
				/>
				
				{/* Horizontal scroll container */}
				<div className="w-full overflow-hidden py-8">
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
import ContactForm from "@/app/components/ContactForm";
import Footer from "@/app/components/Footer";

const Homepage = () => {
	return (
		<div className="bg-texture bg-brand-pink">
			<Hero />
			<ProductGrid />
			<ParallaxSection>
				{/* About Section - Expanded */}
				<TextAndImage
					variation="right"
					theme="orange"
					heading="About Me"
					text={
						"I'm Hassan Mansuri, a passionate developer and designer based in India. I specialize in building interactive, visually stunning web applications that deliver real value. With a background in both design and engineering, I love turning ideas into delightful digital experiences.\n\nContact: aryan.sharma@email.com | +91-9876543210\nLocation: New Delhi, India\nExperience: 4+ years in web development\nEducation: B.Tech in Computer Science\nInterests: UI/UX, Animation, 3D, Open Source, Music, Travel."
					}
					buttonText="Download Resume"
					buttonLink="/resume.pdf"
					imageForeground="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
					imageBackground="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
				/>

				{/* Skills Section - Structured & Animated */}
				<section className="bg-brand-blue bg-texture py-16 px-4">
					<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:gap-24">
						<div className="flex flex-col gap-8 animate-fade-in-up">
							<TextType
								as="h2"
								text={["Skills"]}
								className="text-4xl font-bold text-white mb-2"
								typingSpeed={60}
								pauseDuration={2000}
								showCursor={false}
							/>
							<div className="text-lg text-white/90 max-w-md mb-4">
								A quick overview of my technical skills and tools I use daily.
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
								{[
									{
										group: "Frontend",
										skills: [
											"React",
											"Next.js",
											"TypeScript",
											"JavaScript",
											"Tailwind CSS",
											"Framer Motion",
											"CSS3",
											"HTML5",
										],
									},
									{
										group: "Backend",
										skills: [
											"Node.js",
											"Express",
											"MongoDB",
											"Firebase",
											"REST APIs",
										],
									},
									{
										group: "Design",
										skills: ["Figma", "Adobe XD", "UI/UX", "Animation"],
									},
									{
										group: "Tools",
										skills: ["Git", "VS Code", "Jira", "Vercel", "Netlify"],
									},
								].map(({ group, skills }) => (
									<div
										key={group}
										className="rounded-xl bg-white/10 p-4 shadow-lg border border-white/10 animate-fade-in-up"
									>
										<div className="font-bold text-brand-lime mb-2">
											{group}
										</div>
										<ul className="space-y-1">
											{skills.map((skill) => (
												<li key={skill} className="flex items-center gap-2">
													<span className="inline-block w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
													<span className="text-white/90 font-medium">
														{skill}
													</span>
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
						<div className="flex justify-center items-center animate-fade-in-up">
							<Image
								src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
								alt="Skills"
								width={300}
								height={400}
								className="rounded-2xl shadow-2xl w-full max-w-xs"
								priority
							/>
						</div>
					</div>
				</section>
				{/* New Contact Section */}
				<section className="bg-brand-lime bg-texture py-16 px-4 min-h-[90vh]">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:gap-24 max-w-6xl mx-auto">
						<div className="flex flex-col items-center md:items-start text-center md:text-left gap-8 animate-fade-in-up">
							<TextType
								as="h2"
								text={["Contact"]}
								className="text-4xl font-bold text-white"
								typingSpeed={60}
								pauseDuration={2000}
								showCursor={false}
							/>
							<div className="text-lg text-white max-w-md">
								Interested in working together, collaborating, or just want to
								say hi? I&apos;m always open to new opportunities and creative
								projects. Let&apos;s connect!
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
