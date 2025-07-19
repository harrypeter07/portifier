"use client";
import { useLayoutStore } from "@/store/layoutStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Mock parsed resume data (in real app, get from upload step or API)
const MOCK_RESUME = {
	hero: { title: "Hi, I'm Hassan", subtitle: "Web Developer" },
	about: { bio: "Experienced developer..." },
	showcase: { projects: "Acme Corp, Beta Inc" },
	contact: { email: "hassan@gmail.com" },
};

const FIELD_MAP = {
	hero: [
		{ name: "title", label: "Title" },
		{ name: "subtitle", label: "Subtitle" },
	],
	about: [{ name: "bio", label: "Bio" }],
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
		setTimeout(() => {
			setSaving(false);
			setSuccess("Saved! (Mock)");
			// router.push("/editor/preview"); // Optionally go to preview/finish
		}, 1000);
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
				<button
					className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
					type="submit"
					disabled={saving}
				>
					{saving ? "Saving..." : "Save & Finish"}
				</button>
				{success && <div className="text-green-600">{success}</div>}
			</form>
		</div>
	);
}
