"use client";
import { useEffect, useState } from "react";
import { componentMap } from "@/data/componentMap";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function PortfolioPage() {
	const params = useParams();
	const username = params.username;
	const [portfolio, setPortfolio] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchPortfolio() {
			try {
				const res = await fetch(`/api/portfolio/get?username=${username}`);
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
	}, [username]);

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
				if (section === "hero") {
					return (
						<motion.div
							key={section}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className="mb-8"
						>
							<Component data={dataToUse.personal} />
						</motion.div>
					);
				}
				return (
					<motion.div
						key={section}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="mb-8"
					>
						<Component data={dataToUse[section]} />
					</motion.div>
				);
			})}
		</div>
	);
}
