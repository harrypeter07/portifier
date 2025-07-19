"use client";
import { useState } from "react";

export default function ResumeUploadPage() {
	const [file, setFile] = useState(null);
	const [parsed, setParsed] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

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
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
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
				<pre className="bg-gray-100 p-4 rounded w-full max-w-xl text-left overflow-x-auto">
					{JSON.stringify(parsed, null, 2)}
				</pre>
			)}
		</div>
	);
}
