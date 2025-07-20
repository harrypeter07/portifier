"use client";
import { useLayoutStore } from "../../../store/layoutStore";
import { componentMap } from "@/data/componentMap";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
	{ key: "hero", label: "Hero", options: ["HeroA", "HeroB"] },
	{ key: "about", label: "About", options: ["AboutA"] }, // Add more About components as needed
	{ key: "showcase", label: "Projects", options: ["ShowcaseA"] },
	{ key: "contact", label: "Contact", options: ["ContactFormA"] },
];

export default function ComponentPickerPage() {
	const { layout, setLayout, content } = useLayoutStore();
	const [selectedSection, setSelectedSection] = useState(SECTIONS[0].key);
	const [error, setError] = useState("");
	const router = useRouter();

	function handleAdd(section, comp) {
		setLayout(section, comp);
	}

	function handleConfirm() {
		for (const s of SECTIONS) {
			if (s.options.length && !layout[s.key]) {
				setError(`Please add a component for ${s.label}`);
				return;
			}
		}
		setError("");
		router.push("/editor/customize");
	}

	return (
		<div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			{/* Sidebar */}
			<aside className="w-64 p-6 bg-white dark:bg-gray-900 shadow flex flex-col gap-6">
				<h2 className="text-xl font-bold mb-2">Sections</h2>
				{SECTIONS.map((section) => (
					<button
						key={section.key}
						className={`text-left px-3 py-2 rounded font-semibold mb-1 ${
							selectedSection === section.key
								? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
								: "hover:bg-gray-100 dark:hover:bg-gray-800"
						}`}
						onClick={() => setSelectedSection(section.key)}
					>
						{section.label}
					</button>
				))}
				{error && <div className="text-red-600 text-sm mt-2">{error}</div>}
				<button
					className="mt-8 bg-blue-600 text-white px-4 py-2 rounded font-semibold"
					onClick={handleConfirm}
				>
					Confirm Layout
				</button>
			</aside>
			{/* Center: Component Cards */}
			<main className="flex-1 flex flex-col items-center justify-center p-12 gap-8">
				<h1 className="text-2xl font-bold mb-6">
					Pick a {SECTIONS.find((s) => s.key === selectedSection)?.label}{" "}
					Component
				</h1>
				<div className="grid grid-cols-2 gap-8">
					{SECTIONS.find((s) => s.key === selectedSection)?.options.map(
						(comp) => {
							const Comp = componentMap[comp];
							return (
								<motion.div
									key={comp}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.97 }}
									className={`border rounded-lg shadow p-4 bg-white dark:bg-gray-900 flex flex-col items-center ${
										layout[selectedSection] === comp
											? "ring-2 ring-blue-500"
											: ""
									}`}
								>
									<div className="mb-2 font-semibold">{comp}</div>
									<div className="w-full mb-4">
										<Comp {...(content[selectedSection] || {})} />
									</div>
									<button
										className={`px-4 py-1 rounded ${
											layout[selectedSection] === comp
												? "bg-blue-600 text-white"
												: "bg-gray-200 dark:bg-gray-800"
										}`}
										onClick={() => handleAdd(selectedSection, comp)}
									>
										{layout[selectedSection] === comp ? "Selected" : "Add"}
									</button>
								</motion.div>
							);
						}
					)}
				</div>
			</main>
			{/* Right Panel: Live Preview */}
			<aside className="w-96 p-6 bg-white dark:bg-gray-900 shadow flex flex-col gap-4">
				<h2 className="text-xl font-bold mb-4">Live Preview</h2>
				<AnimatePresence mode="wait">
					{SECTIONS.filter((s) => layout[s.key]).map((section) => {
						const Comp = componentMap[layout[section.key]];
						if (!Comp) return null;
						return (
							<motion.div
								key={section.key}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
								className="border rounded shadow p-4 bg-white dark:bg-gray-900 mb-4"
							>
								<Comp {...(content[section.key] || {})} />
							</motion.div>
						);
					})}
				</AnimatePresence>
			</aside>
		</div>
	);
}
