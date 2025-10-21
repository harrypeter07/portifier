"use client";

import { useEffect, useRef, useState } from "react";

// Module-scoped holder for mapped data used by sections
let portfolioData;

export default function NeoBrutalFull({ data }) {
    const mapped = mapSchemaToNeoData(data);
    return (
		<div id="neo-brutal-root">
			<style jsx global>{`
				* { margin: 0; padding: 0; box-sizing: border-box; }
				body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-weight: 700; line-height: 1.4; background-color: #FAFAFA; color: #000000; overflow-x: hidden; }
				html { scroll-behavior: smooth; }
				.neo-shadow { box-shadow: 8px 8px 0 0 #000000; }
				.neo-border { border: 4px solid #000000; }
				.star { position: relative; display: inline-block; cursor: pointer; transition: all 0.3s ease; outline: none; border-radius: 2px; }
				.star:focus { outline: 3px solid #FFFFFF; outline-offset: 2px; }
				.star:hover { transform: rotate(180deg) scale(1.1); }
				.star-4 { width: 30px; height: 30px; background: #4169E1; border: 3px solid #000000; clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
				.star-6 { width: 35px; height: 35px; background: #4169E1; border: 3px solid #000000; clip-path: polygon(50% 0%, 65% 25%, 100% 25%, 75% 50%, 100% 75%, 65% 75%, 50% 100%, 35% 75%, 0% 75%, 25% 50%, 0% 25%, 35% 25%); }
				.star-8 { width: 40px; height: 40px; background: #FAFAFA; border: 3px solid #000000; clip-path: polygon(50% 0%, 64% 19%, 90% 19%, 71% 36%, 82% 64%, 50% 50%, 18% 64%, 29% 36%, 10% 19%, 36% 19%); }
				.star-brutal-4 { width: 30px; height: 30px; background: #4169E1; border: 4px solid #000000; position: relative; transform: rotate(45deg); }
				.star-brutal-4:before, .star-brutal-4:after { content: ''; position: absolute; width: 100%; height: 100%; background: inherit; border: inherit; transform: rotate(45deg); top: -4px; left: -4px; }
				.star-small { width: 20px; height: 20px; }
				.star-medium { width: 30px; height: 30px; }
				.star-large { width: 50px; height: 50px; }
				.star-bg { position: absolute; opacity: 0.3; animation: float 6s ease-in-out infinite; }
				@keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }
				@keyframes starClick { 0% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.3) rotate(180deg); } 100% { transform: scale(1) rotate(360deg); } }
				.star-clicked { animation: starClick 0.6s ease; }
				.star-blue { background: #4169E1; }
				.star-white { background: #FAFAFA; }
				.stars-container { position: absolute; width: 100%; height: 100%; pointer-events: none; overflow: hidden; }
				.stars-container .star { pointer-events: all; }
				@media (max-width: 768px) {
					.star-bg { opacity: 0.2; }
					.star-large { width: 35px; height: 35px; }
					.star-medium { width: 25px; height: 25px; }
					.star-small { width: 15px; height: 15px; }
				}
				.star:hover { animation: starPulse 0.8s ease-in-out infinite alternate; }
				@keyframes starPulse { 0% { transform: scale(1) rotate(0deg); filter: brightness(1); } 100% { transform: scale(1.1) rotate(15deg); filter: brightness(1.2); } }
				@keyframes starTrail { 0% { box-shadow: 0 0 0 0 currentColor; } 50% { box-shadow: 0 0 20px 10px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
				.star-clicked { animation: starClick 0.6s ease, starTrail 0.6s ease; }
				@media (max-width: 768px) {
					.mobile-stack { flex-direction: column !important; }
					.mobile-full { width: 100% !important; margin-bottom: 20px !important; }
					.mobile-text-center { text-align: center !important; }
				}
			`}</style>
            <App initialData={mapped} />
		</div>
	);
}

// ------- React implementation copied from provided HTML (unchanged styles) -------

function mapSchemaToNeoData(schema) {
    const personal = schema?.personal || {};
    const skills = (schema?.skills?.technical || [])
        .flatMap((cat) => (cat?.skills || []))
        .slice(0, 8)
        .map((s) => ({ name: s?.name || "", level: Math.min(100, s?.years ? 60 + Math.min(40, s.years * 8) : 85) }));
    const projects = (schema?.projects?.items || []).slice(0, 6).map((p) => ({
        title: p?.title || "",
        description: p?.description || "",
        technologies: p?.technologies || [],
        image: (p?.images && p.images[0]) || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop",
    }));
    const social = personal?.social || {};
    const social_links = Object.entries(social)
        .filter(([, url]) => !!url)
        .map(([platform, url]) => ({ platform, url }));
    return {
        personal_info: {
            name: [personal.firstName, personal.lastName].filter(Boolean).join(" ") || personal.title || "",
            title: personal.title || personal.subtitle || "",
            tagline: personal.tagline || personal.subtitle || "",
            email: personal.email || "",
            phone: personal.phone || "",
            avatar: personal.avatar || "",
            location: [personal?.location?.city, personal?.location?.state, personal?.location?.country].filter(Boolean).join(", "),
        },
        skills: skills.length ? skills : [
            { name: "React", level: 90 },
            { name: "JavaScript", level: 85 },
            { name: "Web Development", level: 88 },
        ],
        projects: projects.length ? projects : [
            { title: "Project", description: "", technologies: [], image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop" },
        ],
        social_links: social_links.length ? social_links : [],
    };
}

function StarDecorations({ sectionName }) {
	const starDecorations = {
		hero: [],
		about: [
			{ type: "4", size: "small", color: "#4169E1", position: { top: "10%", right: "10%" } },
			{ type: "6", size: "medium", color: "#FAFAFA", position: { bottom: "20%", left: "15%" } },
		],
		skills: [
			{ type: "8", size: "large", color: "#FAFAFA", position: { top: "15%", left: "5%" } },
			{ type: "4", size: "medium", color: "#4169E1", position: { bottom: "25%", right: "10%" } },
		],
		portfolio: [
			{ type: "6", size: "medium", color: "#4169E1", position: { top: "10%", left: "8%" } },
			{ type: "4", size: "small", color: "#FAFAFA", position: { bottom: "15%", right: "12%" } },
		],
		contact: [
			{ type: "8", size: "large", color: "#FAFAFA", position: { top: "20%", right: "8%" } },
			{ type: "6", size: "medium", color: "#4169E1", position: { bottom: "30%", left: "10%" } },
		],
	};

	if (!starDecorations[sectionName]) return null;

	return (
		<div className="stars-container">
			{starDecorations[sectionName].map((star, index) => (
				<div
					key={index}
					className={`star star-${star.type} star-${star.size} star-bg`}
					style={{ background: star.color, position: "absolute", ...star.position }}
				/>
			))}
		</div>
	);
}

function Navigation({ activeSection, setActiveSection }) {
	const [isOpen, setIsOpen] = useState(false);

	const navStyle = {
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: "#4169E1",
		border: "4px solid #000000",
		boxShadow: "0 8px 0 0 #000000",
		zIndex: 1000,
		padding: "20px",
	};

	const navContainerStyle = {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		maxWidth: "1200px",
		margin: "0 auto",
	};

	const logoStyle = { fontSize: "24px", fontWeight: "900", color: "#FAFAFA" };

	const menuButtonStyle = {
		display: "none",
		backgroundColor: "#4169E1",
		color: "#FAFAFA",
		border: "4px solid #000000",
		padding: "10px 15px",
		fontSize: "20px",
		fontWeight: "900",
		cursor: "pointer",
		boxShadow: "4px 4px 0 0 #000000",
	};

	const navLinksStyle = { display: "flex", listStyle: "none", gap: "30px" };

	const linkStyle = {
		color: "#FFFFFF",
		textDecoration: "none",
		fontSize: "18px",
		fontWeight: "800",
		padding: "10px 20px",
		border: "3px solid #000000",
		backgroundColor: "#800020",
		transition: "all 0.2s ease",
		cursor: "pointer",
	};

	const linkHoverStyle = {
		...linkStyle,
		backgroundColor: "#FAFAFA",
		color: "#000000",
		transform: "translate(-2px, -2px)",
		boxShadow: "6px 6px 0 0 #000000",
	};

	const mobileMenuStyle = {
		display: isOpen ? "flex" : "none",
		position: "absolute",
		top: "100%",
		left: 0,
		right: 0,
		backgroundColor: "#4169E1",
		border: "4px solid #000000",
		borderTop: "none",
		flexDirection: "column",
		padding: "20px",
	};

	const sections = ["hero", "about", "skills", "portfolio", "contact"];

	const handleNavClick = (section) => {
		setActiveSection(section);
		setIsOpen(false);
		const el = document.getElementById(section);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		const updateMenuButton = () => {
			const menuButton = document.querySelector(".menu-button");
			if (menuButton) {
				menuButton.style.display = window.innerWidth <= 768 ? "block" : "none";
			}
			const navLinks = document.querySelector(".nav-links");
			if (navLinks) {
				navLinks.style.display = window.innerWidth <= 768 ? "none" : "flex";
			}
		};
		updateMenuButton();
		window.addEventListener("resize", updateMenuButton);
		return () => window.removeEventListener("resize", updateMenuButton);
	}, []);

	return (
		<nav style={navStyle}>
			<div style={navContainerStyle}>
				<div style={logoStyle}>ALEX RIVERA</div>
				<button className="menu-button" style={menuButtonStyle} onClick={() => setIsOpen(!isOpen)}>
					☰
				</button>
				<ul className="nav-links" style={navLinksStyle}>
					{sections.map((section) => (
						<li key={section}>
							<a
								style={activeSection === section ? linkHoverStyle : linkStyle}
								onClick={() => handleNavClick(section)}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "#FAFAFA";
									e.currentTarget.style.color = "#000000";
									e.currentTarget.style.transform = "translate(-2px, -2px)";
									e.currentTarget.style.boxShadow = "6px 6px 0 0 #000000";
								}}
								onMouseLeave={(e) => {
									if (activeSection !== section) {
										e.currentTarget.style.backgroundColor = "#4169E1";
										e.currentTarget.style.color = "#FAFAFA";
										e.currentTarget.style.transform = "none";
										e.currentTarget.style.boxShadow = "none";
									}
								}}
							>
								{section.toUpperCase()}
							</a>
						</li>
					))}
				</ul>
				<div style={mobileMenuStyle}>
					{sections.map((section) => (
						<a key={section} style={{ ...linkStyle, marginBottom: "10px", textAlign: "center" }} onClick={() => handleNavClick(section)}>
							{section.toUpperCase()}
						</a>
					))}
				</div>
			</div>
		</nav>
	);
}

function HeroSection() {
	const heroStyle = {
		minHeight: "100vh",
		backgroundColor: "#FAFAFA",
		display: "flex",
		alignItems: "center",
		padding: "120px 20px 60px",
		position: "relative",
		overflow: "hidden",
	};
	const containerStyle = {
		maxWidth: "1200px",
		margin: "0 auto",
		display: "flex",
		alignItems: "center",
		gap: "60px",
		zIndex: 2,
		position: "relative",
	};
	const textStyle = { flex: 1, color: "#000000" };
	const nameStyle = { fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: "900", lineHeight: "1", marginBottom: "20px", textShadow: "4px 4px 0 #4169E1" };
	const titleStyle = { fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: "800", marginBottom: "30px", color: "#000000", textShadow: "2px 2px 0 #4169E1" };
	const taglineStyle = { fontSize: "1.25rem", fontWeight: "600", marginBottom: "40px", lineHeight: "1.4", color: "#000000" };
	const buttonStyle = { backgroundColor: "#4169E1", color: "#FAFAFA", border: "4px solid #000000", padding: "20px 40px", fontSize: "18px", fontWeight: "900", cursor: "pointer", boxShadow: "8px 8px 0 0 #000000", transition: "all 0.2s ease", textDecoration: "none", display: "inline-flex", alignItems: "center" };
	const imageContainerStyle = { flex: "0 0 300px", position: "relative" };
	const imageStyle = { width: "100%", height: "300px", objectFit: "cover", border: "6px solid #000000", boxShadow: "12px 12px 0 0 #4169E1" };
	const backgroundShapeStyle = { position: "absolute", width: "200px", height: "200px", backgroundColor: "#4169E1", border: "4px solid #000000", top: "20%", right: "10%", transform: "rotate(45deg)", zIndex: 1 };

	return (
		<section id="hero" style={heroStyle}>
			<div style={backgroundShapeStyle}></div>
			<div style={containerStyle} className="mobile-stack">
				<div style={textStyle} className="mobile-text-center">
					<h1 style={nameStyle}>{portfolioData.personal_info.name}</h1>
					<h2 style={titleStyle}>{portfolioData.personal_info.title}</h2>
					<p style={taglineStyle}>{portfolioData.personal_info.tagline}</p>
					<a
						href="#contact"
						style={buttonStyle}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "translate(-4px, -4px)";
							e.currentTarget.style.boxShadow = "12px 12px 0 0 #000000";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "none";
							e.currentTarget.style.boxShadow = "8px 8px 0 0 #000000";
						}}
						onClick={(e) => {
							e.preventDefault();
							const el = document.getElementById("contact");
							if (el) el.scrollIntoView({ behavior: "smooth" });
						}}
					>
						LET'S WORK TOGETHER!
					</a>
				</div>
				<div style={imageContainerStyle} className="mobile-full">
					<img 
						src={portfolioData.personal_info.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"} 
						alt={portfolioData.personal_info.name} 
						style={imageStyle} 
					/>
				</div>
			</div>
		</section>
	);
}

function AboutSection() {
	const sectionStyle = { backgroundColor: "#4169E1", padding: "100px 20px", position: "relative" };
	const containerStyle = { maxWidth: "1200px", margin: "0 auto", textAlign: "center" };
	const titleStyle = { fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: "900", color: "#FAFAFA", marginBottom: "60px", textShadow: "3px 3px 0 #000000", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" };
	const contentStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "start" };
	const cardStyle = { backgroundColor: "#FAFAFA", border: "4px solid #000000", boxShadow: "8px 8px 0 0 #000000", padding: "40px", textAlign: "left" };
	const cardTitleStyle = { fontSize: "24px", fontWeight: "900", color: "#4169E1", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" };
	const textStyle = { fontSize: "16px", lineHeight: "1.6", color: "#000000", fontWeight: "600" };
	const locationStyle = { backgroundColor: "#4169E1", color: "#FAFAFA", border: "3px solid #000000", padding: "15px 25px", display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "30px", fontWeight: "800", fontSize: "18px" };

	return (
		<section id="about" style={sectionStyle}>
			<StarDecorations sectionName="about" />
			<div style={containerStyle}>
				<h2 style={titleStyle}>
					<span className="star star-4" style={{ background: "#FAFAFA" }}></span>
					ABOUT ME
					<span className="star star-4" style={{ background: "#FAFAFA" }}></span>
				</h2>
				<div style={contentStyle}>
					<div style={cardStyle}>
						<h3 style={cardTitleStyle}>
							<span className="star star-6" style={{ background: "#4169E1" }}></span>
							WHO I AM
						</h3>
						<p style={textStyle}>
							I'm a creative developer who bridges the gap between design and technology. With a passion for bold, unconventional digital experiences, I create applications that don't just function—they make a statement.
						</p>
						<p style={textStyle}>
							My approach combines technical expertise with creative vision, resulting in projects that are both visually striking and functionally robust.
						</p>
						<div style={locationStyle}>
							<span className="star star-4 star-small" style={{ background: "#FAFAFA" }}></span>
							📍 {portfolioData.personal_info.location}
						</div>
					</div>
					<div style={cardStyle}>
						<h3 style={cardTitleStyle}>
							<span className="star star-6" style={{ background: "#4169E1" }}></span>
							WHAT I DO
						</h3>
						<p style={textStyle}>
							I specialize in front-end development with React, creating user interfaces that challenge conventions while maintaining excellent usability. I also work with Python for backend development and data visualization.
						</p>
						<p style={textStyle}>
							From concept to deployment, I handle the full development lifecycle, ensuring every project delivers both aesthetic impact and technical excellence.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

function SkillsSection() {
	const [animateSkills, setAnimateSkills] = useState(false);
	const skillsRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) setAnimateSkills(true);
			},
			{ threshold: 0.5 }
		);
		if (skillsRef.current) observer.observe(skillsRef.current);
		return () => observer.disconnect();
	}, []);

	const sectionStyle = { backgroundColor: "#FAFAFA", padding: "100px 20px", color: "#000000" };
	const containerStyle = { maxWidth: "1200px", margin: "0 auto" };
	const titleStyle = { fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: "900", textAlign: "center", marginBottom: "60px", textShadow: "3px 3px 0 #4169E1", color: "#000000" };
	const skillsGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" };
	const skillItemStyle = { backgroundColor: "#FAFAFA", border: "4px solid #000000", boxShadow: "8px 8px 0 0 #000000", padding: "30px" };
	const skillNameStyle = { fontSize: "20px", fontWeight: "900", color: "#000000", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" };
	const progressBarStyle = { width: "100%", height: "20px", backgroundColor: "#FAFAFA", border: "3px solid #000000", position: "relative", overflow: "hidden" };
	const progressFillStyle = (level) => ({ height: "100%", backgroundColor: "#4169E1", width: animateSkills ? `${level}%` : "0%", transition: "width 2s ease-out", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "10px", fontWeight: "900", fontSize: "14px", color: "#FAFAFA" });

	return (
		<section id="skills" style={sectionStyle} ref={skillsRef}>
			<StarDecorations sectionName="skills" />
			<div style={containerStyle}>
				<h2 style={titleStyle}>
					<span className="star star-8" style={{ background: "#4169E1" }}></span>
					SKILLS &amp; EXPERTISE
					<span className="star star-8" style={{ background: "#4169E1" }}></span>
				</h2>
				<div style={skillsGridStyle}>
					{portfolioData.skills.map((skill, index) => (
						<div key={index} style={skillItemStyle}>
							<div style={skillNameStyle}>
								<span className="star star-4 star-small" style={{ background: "#4169E1" }}></span>
								{skill.name}
							</div>
							<div style={progressBarStyle}>
								<div style={progressFillStyle(skill.level)}>{skill.level}%</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function PortfolioSection() {
	const [hoveredProject, setHoveredProject] = useState(null);
	const sectionStyle = { backgroundColor: "#4169E1", padding: "100px 20px" };
	const containerStyle = { maxWidth: "1200px", margin: "0 auto" };
	const titleStyle = { fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: "900", textAlign: "center", marginBottom: "60px", color: "#FAFAFA", textShadow: "3px 3px 0 #000000" };
	const projectsGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "40px" };
	const projectCardStyle = (index) => ({ backgroundColor: "#4169E1", border: "4px solid #000000", boxShadow: hoveredProject === index ? "12px 12px 0 0 #000000" : "8px 8px 0 0 #000000", transform: hoveredProject === index ? "translate(-4px, -4px)" : "none", transition: "all 0.3s ease", overflow: "hidden", cursor: "pointer", position: "relative" });
	const imageStyle = { width: "100%", height: "200px", objectFit: "cover", border: "none" };
	const contentStyle = { padding: "30px" };
	const projectTitleStyle = { fontSize: "24px", fontWeight: "900", marginBottom: "15px", color: "#FAFAFA", display: "flex", alignItems: "center", gap: "10px" };
	const descriptionStyle = { fontSize: "16px", fontWeight: "600", marginBottom: "20px", lineHeight: "1.5", color: "#FAFAFA" };
	const techStackStyle = { display: "flex", flexWrap: "wrap", gap: "10px" };
	const techTagStyle = { backgroundColor: "#FAFAFA", color: "#000000", padding: "8px 15px", border: "2px solid #000000", fontSize: "12px", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "5px" };

	return (
		<section id="portfolio" style={sectionStyle}>
			<StarDecorations sectionName="portfolio" />
			<div style={containerStyle}>
				<h2 style={titleStyle}>
					<span className="star star-6" style={{ background: "#FAFAFA" }}></span>
					FEATURED PROJECTS
					<span className="star star-6" style={{ background: "#FAFAFA" }}></span>
				</h2>
				<div style={projectsGridStyle}>
					{portfolioData.projects.map((project, index) => (
						<div
							key={index}
							style={projectCardStyle(index)}
							onMouseEnter={() => setHoveredProject(index)}
							onMouseLeave={() => setHoveredProject(null)}
						>
							<img src={project.image} alt={project.title} style={imageStyle} />
							<div className="star star-4" style={{ position: "absolute", top: "10px", right: "10px", background: "#FAFAFA" }}></div>
							<div style={contentStyle}>
								<h3 style={projectTitleStyle}>
									<span className="star star-6 star-small" style={{ background: "#FAFAFA" }}></span>
									{project.title}
								</h3>
								<p style={descriptionStyle}>{project.description}</p>
								<div style={techStackStyle}>
									{project.technologies.map((tech, techIndex) => (
										<span key={techIndex} style={techTagStyle}>
											<span className="star star-4" style={{ width: "8px", height: "8px", background: "#4169E1" }}></span>
											{tech}
										</span>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function ContactSection() {
	const [formData, setFormData] = useState({ name: "", email: "", message: "" });
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSubmitted(true);
		setTimeout(() => setIsSubmitted(false), 3000);
		setFormData({ name: "", email: "", message: "" });
	};

	const sectionStyle = { backgroundColor: "#FAFAFA", color: "#000000", padding: "100px 20px" };
	const containerStyle = { maxWidth: "1200px", margin: "0 auto" };
	const titleStyle = { fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: "900", textAlign: "center", marginBottom: "60px", color: "#000000", textShadow: "3px 3px 0 #4169E1", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" };
	const contentStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px" };
	const contactInfoStyle = { backgroundColor: "#4169E1", border: "4px solid #000000", boxShadow: "8px 8px 0 0 #000000", padding: "40px", position: "relative" };
	const formStyle = { backgroundColor: "#FAFAFA", border: "4px solid #000000", boxShadow: "8px 8px 0 0 #000000", padding: "40px", position: "relative" };
	const inputStyle = { width: "100%", padding: "15px", border: "3px solid #000000", fontSize: "16px", fontWeight: "600", marginBottom: "20px", backgroundColor: "#FAFAFA", color: "#000000" };
	const textareaStyle = { ...inputStyle, minHeight: "120px", resize: "vertical" };
	const submitButtonStyle = { backgroundColor: "#4169E1", color: "#FAFAFA", border: "3px solid #000000", padding: "15px 30px", fontSize: "18px", fontWeight: "900", cursor: "pointer", boxShadow: "6px 6px 0 0 #000000", transition: "all 0.2s ease", display: "inline-flex", alignItems: "center", gap: "10px" };
	const successMessageStyle = { backgroundColor: "#4169E1", color: "#FAFAFA", padding: "20px", border: "3px solid #000000", marginTop: "20px", textAlign: "center", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" };
	const contactItemStyle = { marginBottom: "30px" };
	const labelStyle = { fontSize: "18px", fontWeight: "900", color: "#FAFAFA", marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" };
	const valueStyle = { fontSize: "16px", fontWeight: "600", color: "#FAFAFA" };

	return (
		<section id="contact" style={sectionStyle}>
			<StarDecorations sectionName="contact" />
			<div style={containerStyle}>
				<h2 style={titleStyle}>
					<span className="star star-8" style={{ background: "#4169E1" }}></span>
					GET IN TOUCH
					<span className="star star-8" style={{ background: "#4169E1" }}></span>
				</h2>
				<div style={contentStyle}>
					<div style={contactInfoStyle}>
						<div className="star star-6" style={{ position: "absolute", top: "10px", right: "10px", background: "#FAFAFA" }}></div>
						<div style={contactItemStyle}>
							<div style={labelStyle}>
								<span className="star star-4 star-small" style={{ background: "#FAFAFA" }}></span>
								EMAIL
							</div>
							<div style={valueStyle}>{portfolioData.personal_info.email}</div>
						</div>
						<div style={contactItemStyle}>
							<div style={labelStyle}>
								<span className="star star-4 star-small" style={{ background: "#FFFFFF" }}></span>
								PHONE
							</div>
							<div style={valueStyle}>{portfolioData.personal_info.phone}</div>
						</div>
						<div style={contactItemStyle}>
							<div style={labelStyle}>
								<span className="star star-4 star-small" style={{ background: "#FFFFFF" }}></span>
								LOCATION
							</div>
							<div style={valueStyle}>{portfolioData.personal_info.location}</div>
						</div>
					</div>

					<form style={formStyle} onSubmit={handleSubmit}>
						<div className="star star-4" style={{ position: "absolute", top: "10px", left: "10px", background: "#4169E1" }}></div>
						<input type="text" name="name" placeholder="YOUR NAME" value={formData.name} onChange={handleInputChange} style={inputStyle} required />
						<input type="email" name="email" placeholder="YOUR EMAIL" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
						<textarea name="message" placeholder="YOUR MESSAGE" value={formData.message} onChange={handleInputChange} style={textareaStyle} required />
						<button
							type="submit"
							style={submitButtonStyle}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = "translate(-3px, -3px)";
								e.currentTarget.style.boxShadow = "9px 9px 0 0 #000000";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = "none";
								e.currentTarget.style.boxShadow = "6px 6px 0 0 #000000";
							}}
						>
							<span className="star star-4 star-small" style={{ background: "#FAFAFA" }}></span>
							SEND MESSAGE
							<span className="star star-4 star-small" style={{ background: "#FAFAFA" }}></span>
						</button>
						{isSubmitted && (
							<div style={successMessageStyle}>
								<span className="star star-6 star-small" style={{ background: "#FAFAFA" }}></span>
								MESSAGE SENT! I'LL GET BACK TO YOU SOON!
								<span className="star star-6 star-small" style={{ background: "#FAFAFA" }}></span>
							</div>
						)}
					</form>
				</div>
			</div>
		</section>
	);
}

function FooterSection() {
	const footerStyle = { backgroundColor: "#4169E1", border: "4px solid #000000", padding: "60px 20px 40px", textAlign: "center", position: "relative" };
	const containerStyle = { maxWidth: "1200px", margin: "0 auto" };
	const socialLinksStyle = { display: "flex", justifyContent: "center", gap: "30px", marginBottom: "40px", flexWrap: "wrap" };
	const socialLinkStyle = { backgroundColor: "#4169E1", color: "#FAFAFA", padding: "15px 25px", border: "3px solid #000000", textDecoration: "none", fontWeight: "800", fontSize: "16px", boxShadow: "6px 6px 0 0 #000000", transition: "all 0.2s ease", display: "inline-flex", alignItems: "center", gap: "8px" };
	const copyrightStyle = { fontSize: "16px", fontWeight: "700", color: "#FAFAFA" };

	return (
		<footer style={footerStyle}>
			<div className="star star-6" style={{ position: "absolute", top: "15px", left: "20px", background: "#FAFAFA" }}></div>
			<div className="star star-8" style={{ position: "absolute", top: "15px", right: "20px", background: "#FAFAFA" }}></div>
			<div className="star star-4" style={{ position: "absolute", bottom: "15px", left: "50%", transform: "translateX(-50%)", background: "#FAFAFA" }}></div>
			<div style={containerStyle}>
				<div style={socialLinksStyle}>
					{portfolioData.social_links.map((link, index) => (
						<a
							key={index}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							style={socialLinkStyle}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#FAFAFA";
								e.currentTarget.style.color = "#000000";
								e.currentTarget.style.transform = "translate(-3px, -3px)";
								e.currentTarget.style.boxShadow = "9px 9px 0 0 #000000";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#4169E1";
								e.currentTarget.style.color = "#FAFAFA";
								e.currentTarget.style.transform = "none";
								e.currentTarget.style.boxShadow = "6px 6px 0 0 #000000";
							}}
						>
							<span className="star star-4" style={{ width: "12px", height: "12px", background: "#FAFAFA" }}></span>
							{link.platform.toUpperCase()}
						</a>
					))}
				</div>
				<div style={copyrightStyle}>© 2025 {portfolioData.personal_info.name}. ALL RIGHTS RESERVED.</div>
			</div>
		</footer>
	);
}

function addStarClickEffects() {
	const createStarBurst = (x, y) => {
		const colors = ["#4169E1", "#FAFAFA"];
		for (let i = 0; i < 6; i++) {
			const particle = document.createElement("div");
			particle.className = "star star-4 star-small";
			particle.style.position = "fixed";
			particle.style.left = x + "px";
			particle.style.top = y + "px";
			particle.style.background = colors[Math.floor(Math.random() * colors.length)];
			particle.style.pointerEvents = "none";
			particle.style.zIndex = "9999";

			const angle = ((i * 60) * Math.PI) / 180;
			const distance = 50 + Math.random() * 30;
			const duration = 800 + Math.random() * 400;

			particle.animate(
				[
					{ transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
					{ transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.3) rotate(360deg)`, opacity: 0 },
				],
				{ duration, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }
			).onfinish = () => particle.remove();

			document.body.appendChild(particle);
		}
	};

	const handler = (e) => {
		const target = e.target;
		if (!(target instanceof HTMLElement)) return;
		if (target.classList.contains("star")) {
			target.classList.remove("star-clicked");
			// force reflow
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			target.offsetHeight;
			target.classList.add("star-clicked");
			const rect = target.getBoundingClientRect();
			createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
		}
	};

	document.addEventListener("click", handler);
	return () => document.removeEventListener("click", handler);
}

function addScrollStarEffects() {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const stars = entry.target.querySelectorAll(".star-bg");
					stars.forEach((star, index) => {
						setTimeout(() => {
							star.style.animation = "float 6s ease-in-out infinite";
							star.style.animationDelay = `${index * 0.2}s`;
						}, index * 100);
					});
				}
			});
		},
		{ threshold: 0.3 }
	);

	document.querySelectorAll("section").forEach((section) => observer.observe(section));
	return () => observer.disconnect();
}

function App({ initialData }) {
    const [activeSection, setActiveSection] = useState("hero");

	useEffect(() => {
		const handleScroll = () => {
			const sections = ["hero", "about", "skills", "portfolio", "contact"];
			const scrollPosition = window.scrollY + 200;
			sections.forEach((section) => {
				const element = document.getElementById(section);
				if (element) {
					const offsetTop = element.offsetTop;
					const offsetHeight = element.offsetHeight;
					if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
						setActiveSection(section);
					}
				}
			});
		};
		window.addEventListener("scroll", handleScroll);
		const removeStarClick = addStarClickEffects();
		const removeScrollEffects = addScrollStarEffects();
		const handleKeyPress = (e) => {
			if (e.key === " " || e.key === "Enter") {
				const focused = document.activeElement;
				if (focused && focused.classList && focused.classList.contains("star")) {
					focused.click();
				}
			}
		};
		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("keydown", handleKeyPress);
			removeStarClick();
			removeScrollEffects();
		};
	}, []);

    // Expose mapped data to section components via module variable
    // Ensure symbol exists in module scope
    // eslint-disable-next-line no-undef
    portfolioData = initialData;
    return (
		<div>
			<Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
			<HeroSection />
			<AboutSection />
			<SkillsSection />
			<PortfolioSection />
			<ContactSection />
			<FooterSection />
		</div>
	);
}


