"use client";
import { useLayoutStore } from "@/store/layoutStore";
import { componentMap } from "@/data/componentMap";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SECTIONS = [
	{ key: "hero", label: "Hero", options: ["HeroA", "HeroB"] },
	{ key: "about", label: "About", options: [] }, // Placeholder for About components
	{ key: "showcase", label: "Projects", options: ["ShowcaseA"] },
	{ key: "contact", label: "Contact", options: ["ContactFormA"] },
];

export default function ComponentPickerPage() {
	const { layout, setLayout } = useLayoutStore();
	const [error, setError] = useState("");
	const router = useRouter();

	function handleAdd(section, comp) {
		setLayout(section, comp);
	}

	function handleConfirm() {
		// Require at least one component for each section with options
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
					<div key={section.key} className="mb-4">
						<div className="font-semibold mb-1">{section.label}</div>
						<div className="flex flex-col gap-2">
							{section.options.length === 0 && (
								<span className="text-gray-400 text-sm">Coming soon</span>
							)}
							{section.options.map((comp) => (
								<button
									key={comp}
									className={`px-3 py-1 rounded border ${
										layout[section.key] === comp
											? "bg-blue-600 text-white"
											: "bg-gray-100 dark:bg-gray-800"
									}`}
									onClick={() => handleAdd(section.key, comp)}
								>
									{comp} {layout[section.key] === comp && "✓"}
								</button>
							))}
						</div>
					</div>
				))}
				{error && <div className="text-red-600 text-sm mt-2">{error}</div>}
				<button
					className="mt-8 bg-blue-600 text-white px-4 py-2 rounded font-semibold"
					onClick={handleConfirm}
				>
					Confirm Layout
				</button>
			</aside>
			{/* Live Preview */}
			<main className="flex-1 flex flex-col items-center justify-center p-12 gap-8">
				<h1 className="text-2xl font-bold mb-6">Live Preview</h1>
				<div className="w-full max-w-2xl flex flex-col gap-8">
					{SECTIONS.filter((s) => layout[s.key]).map((section) => {
						const Comp = componentMap[layout[section.key]];
						if (!Comp) return null;
						return (
							<div
								key={section.key}
								className="border rounded shadow p-4 bg-white dark:bg-gray-900"
							>
								<Comp />
							</div>
						);
					})}
				</div>
			</main>
		</div>
	);
}
