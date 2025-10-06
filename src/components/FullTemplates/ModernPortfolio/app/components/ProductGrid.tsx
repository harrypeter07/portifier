"use client";
import React, { useRef, useEffect } from "react";
import ProjectCard from "./SkateBoard";
import projectData from "@/data/skateboardData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextType from "./TextType";

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

export default ProductGrid;
