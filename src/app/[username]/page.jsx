"use client";
import { useEffect, useState } from "react";
import { componentMap } from "@/data/componentMap";
import { motion } from "framer-motion";

export default function PortfolioPage({ params }) {
	const [portfolio, setPortfolio] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchPortfolio() {
			try {
				const res = await fetch(
					`/api/portfolio/get?username=${params.username}`
				);
				if (res.ok) {
					const data = await res.json();
					setPortfolio(data.portfolio);
				} else {
					setError("Portfolio not found");
				}
			} catch (err) {
				setError("Failed to load portfolio");
			} finally {
				setLoading(false);
			}
		}

		fetchPortfolio();
	}, [params.username]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl">Loading portfolio...</div>
			</div>
		);
	}

	if (error || !portfolio) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-xl text-red-600">
					{error || "Portfolio not found"}
				</div>
			</div>
		);
	}

	const { layout, content, portfolioData } = portfolio;
	
	// Use portfolioData if available, fallback to content
	const dataToUse = portfolioData || {};

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			{/* Render each section based on layout */}
			{Object.entries(layout).map(([section, componentName], index) => {
				const Component = componentMap[componentName];
				if (!Component) return null;

				// Generate component props based on section and data structure
				let componentProps = content[section] || {};
				
				// If we have portfolioData, use it instead
				if (portfolioData) {
					switch (section) {
						case "hero":
							componentProps = dataToUse;
							break;
						case "about":
							componentProps = {
								summary: dataToUse.about?.summary || "",
								data: dataToUse,
							};
							break;
						case "projects":
							componentProps = {
								items: dataToUse.projects?.items || [],
								data: dataToUse,
							};
							break;
						case "skills":
							componentProps = {
								technical: dataToUse.skills?.technical || [],
								soft: dataToUse.skills?.soft || [],
								languages: dataToUse.skills?.languages || [],
								data: dataToUse,
							};
							break;
						case "experience":
							componentProps = {
								jobs: dataToUse.experience?.jobs || [],
								data: dataToUse,
							};
							break;
						case "education":
							componentProps = {
								degrees: dataToUse.education?.degrees || [],
								data: dataToUse,
							};
							break;
						case "achievements":
							componentProps = {
								awards: dataToUse.achievements?.awards || [],
								certifications: dataToUse.achievements?.certifications || [],
								publications: dataToUse.achievements?.publications || [],
								data: dataToUse,
							};
							break;
						case "contact":
							componentProps = {
								email: dataToUse.personal?.email || dataToUse.contact?.email || "",
								phone: dataToUse.personal?.phone || dataToUse.contact?.phone || "",
								linkedin: dataToUse.personal?.social?.linkedin || "",
								data: dataToUse,
							};
							break;
					}
				}

				return (
					<motion.div
						key={section}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<Component {...componentProps} />
					</motion.div>
				);
			})}
		</div>
	);
}
