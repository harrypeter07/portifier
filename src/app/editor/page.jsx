"use client";
import { useState } from "react";
import { useLayoutStore } from "@/store/layoutStore";
import { useRouter } from "next/navigation";

const PREBUILT_TEMPLATES = [
	{
		name: "Cleanfolio",
		layout: {
			hero: "HeroA",
			about: "AboutA",
			showcase: "ShowcaseA",
			contact: "ContactFormA",
		},
		content: {
			hero: { title: "Hi, I'm [Name]", subtitle: "Web Developer" },
			about: { summary: "A passionate developer..." },
			showcase: { projects: "" },
			contact: { email: "", linkedin: "" },
		},
	},
	// Add more templates as needed
];

export default function ResumeUploadPage() {
	const [file, setFile] = useState(null);
	const [parsed, setParsed] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { reset, setLayout, setContent } = useLayoutStore();
	const router = useRouter();

	async function handleFileChange(e) {
		setFile(e.target.files[0]);
		setParsed(null);
		setError("");
	}

	async function handleUpload() {
		if (!file) return;
		setLoading(true);
		setError("");
		setParsed(null);
		const formData = new FormData();
		formData.append("resume", file);
		try {
			const res = await fetch("/api/parse-resume", {
				method: "POST",
				body: formData,
			});
			if (!res.ok) throw new Error("Failed to parse resume");
			const data = await res.json();
			setParsed(data);
			// Store parsed info in Zustand for later steps
			reset();
			if (data.content) {
				Object.entries(data.content).forEach(([section, values]) => {
					setContent(section, values);
				});
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	function handleTemplateSelect(template) {
		reset();
		Object.entries(template.layout).forEach(([section, comp]) =>
			setLayout(section, comp)
		);
		Object.entries(template.content).forEach(([section, values]) =>
			setContent(section, values)
		);
		router.push("/editor/customize");
	}

	function handleCustomBuilder() {
		router.push("/editor/components");
	}

	function handlePreview() {
		router.push("/preview/live");
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<h1 className="text-2xl font-bold mb-4">Upload Your Resume (PDF)</h1>
			<input
				type="file"
				accept="application/pdf"
				onChange={handleFileChange}
				disabled={loading}
			/>
			<button
				className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
				onClick={handleUpload}
				disabled={!file || loading}
			>
				{loading ? "Parsing..." : "Upload & Parse"}
			</button>
			{error && <div className="text-red-600">{error}</div>}
			{parsed && (
				<div className="w-full max-w-xl bg-white dark:bg-gray-900 p-6 rounded shadow mt-4">
					<h2 className="text-lg font-semibold mb-2">Resume Parsed!</h2>
					<div className="flex flex-col gap-4">
						<button
							className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
							onClick={handlePreview}
						>
							Preview Portfolio
						</button>
						<button
							className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
							onClick={handleCustomBuilder}
						>
							Custom Builder
						</button>
						<div className="font-semibold text-gray-700 dark:text-gray-200">
							Or use a prebuilt template:
						</div>
						<div className="flex gap-4">
							{PREBUILT_TEMPLATES.map((tpl) => (
								<div
									key={tpl.name}
									className="border rounded p-4 flex flex-col items-center bg-gray-50 dark:bg-gray-800"
								>
									<div className="font-bold mb-2">{tpl.name}</div>
									<button
										className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
										onClick={() => handleTemplateSelect(tpl)}
									>
										Use Template
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
