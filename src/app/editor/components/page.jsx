"use client";
import { useState } from "react";

const AVAILABLE_COMPONENTS = [
	{ key: "hero", label: "Hero Section", options: ["HeroA", "HeroB"] },
	{ key: "showcase", label: "Showcase", options: ["ShowcaseA"] },
	{ key: "contact", label: "Contact", options: ["ContactFormA"] },
];

export default function ComponentPickerPage() {
	const [layout, setLayout] = useState({});
	const [order, setOrder] = useState(["hero", "showcase", "contact"]);
	const [error, setError] = useState("");

	function handleSelect(section, value) {
		setLayout((prev) => ({ ...prev, [section]: value }));
	}

	function handleOrderChange(e, idx) {
		const newOrder = [...order];
		newOrder[idx] = e.target.value;
		setOrder(newOrder);
	}

	function handleNext() {
		if (!layout.hero || !layout.showcase || !layout.contact) {
			setError("Please select a component for each section.");
			return;
		}
		setError("");
		// TODO: Save to store and navigate to next step
		alert("Selected layout: " + JSON.stringify({ layout, order }, null, 2));
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<h1 className="text-2xl font-bold mb-4">
				Pick Your Portfolio Components
			</h1>
			<div className="flex flex-col gap-6 w-full max-w-xl">
				{AVAILABLE_COMPONENTS.map((section) => (
					<div
						key={section.key}
						className="bg-white dark:bg-gray-900 p-4 rounded shadow"
					>
						<div className="font-semibold mb-2">{section.label}</div>
						<div className="flex gap-4">
							{section.options.map((opt) => (
								<label key={opt} className="flex items-center gap-2">
									<input
										type="radio"
										name={section.key}
										value={opt}
										checked={layout[section.key] === opt}
										onChange={() => handleSelect(section.key, opt)}
									/>
									{opt}
								</label>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="w-full max-w-xl bg-white dark:bg-gray-900 p-4 rounded shadow mt-4">
				<div className="font-semibold mb-2">Section Order</div>
				<div className="flex gap-4">
					{order.map((section, idx) => (
						<select
							key={idx}
							value={section}
							onChange={(e) => handleOrderChange(e, idx)}
							className="border rounded p-2"
						>
							{AVAILABLE_COMPONENTS.map((s) => (
								<option key={s.key} value={s.key}>
									{s.label}
								</option>
							))}
						</select>
					))}
				</div>
			</div>
			{error && <div className="text-red-600">{error}</div>}
			<button
				className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
				onClick={handleNext}
			>
				Next
			</button>
		</div>
	);
}
