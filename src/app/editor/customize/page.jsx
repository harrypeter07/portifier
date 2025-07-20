"use client";
import { useLayoutStore } from "../../../../store/layoutStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Mock parsed resume data (in real app, get from upload step or API)
const MOCK_RESUME = {
	hero: { title: "Hi, I'm Hassan", subtitle: "Web Developer" },
	about: { summary: "Experienced developer..." },
	showcase: { projects: "Acme Corp, Beta Inc" },
	contact: { email: "hassan@gmail.com" },
};

const FIELD_MAP = {
	hero: [
		{ name: "title", label: "Title" },
		{ name: "subtitle", label: "Subtitle" },
	],
	about: [{ name: "summary", label: "Bio" }],
	showcase: [{ name: "projects", label: "Projects (comma separated)" }],
	contact: [{ name: "email", label: "Contact Email" }],
};

export default function CustomizePage() {
	const { layout, content, setContent } = useLayoutStore();
	const [localContent, setLocalContent] = useState({});
	const [saving, setSaving] = useState(false);
	const [success, setSuccess] = useState("");
	const router = useRouter();

	// Prefill from resume or Zustand content
	useEffect(() => {
		const initial = {};
		Object.keys(layout).forEach((section) => {
			initial[section] = {
				...MOCK_RESUME[section],
				...content[section],
			};
		});
		setLocalContent(initial);
	}, [layout, content]);

	function handleChange(section, field, value) {
		setLocalContent((prev) => ({
			...prev,
			[section]: { ...prev[section], [field]: value },
		}));
	}

	async function handleSave() {
		// Save to Zustand
		Object.keys(localContent).forEach((section) => {
			setContent(section, localContent[section]);
		});
		setSaving(true);
		setSuccess("");
		try {
			const res = await fetch("/api/portfolio/save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ layout, content: localContent }),
			});
			const data = await res.json();
			if (res.ok && data.success) {
				setSuccess(
					"Portfolio saved! View your portfolio on your profile page."
				);
				// Optionally: router.push(`/dashboard`);
			} else {
				setSuccess("");
				alert(data.error || "Failed to save portfolio");
			}
		} catch (err) {
			setSuccess("");
			alert("Failed to save portfolio");
		}
		setSaving(false);
	}

	function handlePreview() {
		// Save to Zustand first
		Object.keys(localContent).forEach((section) => {
			setContent(section, localContent[section]);
		});
		router.push("/preview/live");
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<h1 className="text-2xl font-bold mb-4">Customize Your Portfolio</h1>
			<form
				className="flex flex-col gap-6 w-full max-w-xl"
				onSubmit={(e) => {
					e.preventDefault();
					handleSave();
				}}
			>
				{Object.keys(layout).map((section) => (
					<div
						key={section}
						className="bg-white dark:bg-gray-900 p-4 rounded shadow"
					>
						<div className="font-semibold mb-2 capitalize">
							{section} ({layout[section]})
						</div>
						{FIELD_MAP[section]?.map((field) => (
							<input
								key={field.name}
								className="border p-2 rounded w-full mb-2"
								placeholder={field.label}
								value={localContent[section]?.[field.name] || ""}
								onChange={(e) =>
									handleChange(section, field.name, e.target.value)
								}
							/>
						))}
					</div>
				))}
				<div className="flex gap-4">
					<button
						className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-60"
						type="button"
						onClick={handlePreview}
					>
						Preview Portfolio
					</button>
					<button
						className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
						type="submit"
						disabled={saving}
					>
						{saving ? "Saving..." : "Save & Finish"}
					</button>
				</div>
				{success && <div className="text-green-600">{success}</div>}
			</form>
		</div>
	);
}
