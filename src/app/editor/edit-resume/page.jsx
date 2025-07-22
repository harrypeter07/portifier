"use client";
import { useState, useEffect } from "react";
import { useLayoutStore } from "@/store/layoutStore";
import { useRouter } from "next/navigation";
import { componentMap } from "@/data/componentMap";

export default function EditResumePage() {
	const {
		content,
		setContent,
		layout,
		parsedData,
		restoreFromParsed,
		setAllContent,
	} = useLayoutStore();
	const [formData, setFormData] = useState({
		hero: { title: "", subtitle: "" },
		about: { summary: "" },
		contact: { email: "", phone: "", location: "", linkedin: "" },
		experience: { jobs: [] },
		education: { degrees: [] },
		skills: { technical: [], soft: [] },
		showcase: { projects: "" },
		achievements: { awards: [] },
		languages: [],
		hobbies: [],
	});
	const router = useRouter();

	useEffect(() => {
		// If no content but we have parsed data, restore it first
		if (Object.keys(content).length === 0 && parsedData) {
			restoreFromParsed();
			return;
		}
		console.log('Initial content:', content);
		// Initialize with existing content or defaults
		setFormData({
			hero: content.hero || { title: "", subtitle: "" },
			about: content.about || { summary: "" },
			contact: content.contact || {
				email: "",
				phone: "",
				location: "",
				linkedin: "",
			},
			experience: content.experience || { jobs: [] },
			education: content.education || { degrees: [] },
			skills: content.skills || { technical: [], soft: [] },
			showcase: content.showcase || { projects: "" },
			achievements: content.achievements || { awards: [] },
			languages: content.languages || [],
			hobbies: content.hobbies || [],
		});
		console.log('Form data initialized:', formData);
	}, [content, parsedData, restoreFromParsed]);

	const handleInputChange = (section, field, value) => {
		setFormData((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: value,
			},
		}));
	};

	const handleArrayChange = (section, field, index, value) => {
		setFormData((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: prev[section][field].map((item, i) =>
					i === index ? value : item
				),
			},
		}));
	};

	const addArrayItem = (section, field, defaultValue = "") => {
		setFormData((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: [...prev[section][field], defaultValue],
			},
		}));
	};

	const removeArrayItem = (section, field, index) => {
		setFormData((prev) => ({
			...prev,
			[section]: {
				...prev[section],
				[field]: prev[section][field].filter((_, i) => i !== index),
			},
		}));
	};

	const addJob = () => {
		addArrayItem("experience", "jobs", {
			title: "",
			company: "",
			duration: "",
			description: "",
		});
	};

	const addDegree = () => {
		addArrayItem("education", "degrees", {
			degree: "",
			institution: "",
			year: "",
		});
	};

	const handleSave = () => {
		// Save all form data to Zustand store
		Object.entries(formData).forEach(([section, data]) => {
			setContent(section, data);
		});

		// Navigate to customize page or preview
		router.push("/editor/customize");
	};

	const handlePreview = () => {
		// Save data first
		Object.entries(formData).forEach(([section, data]) => {
			setContent(section, data);
		});

		// Navigate to preview
		router.push("/preview/live");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<div className="flex">
				{/* Left Panel - Form */}
				<div className="w-1/2 p-6 overflow-y-auto h-screen">
					<h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
						Edit Resume Details
					</h1>

					{/* Personal Information */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Personal Information</h2>
						<div className="grid grid-cols-1 gap-4">
							<input
								type="text"
								placeholder="Full Name"
								value={formData.hero?.title || ""}
								onChange={(e) =>
									handleInputChange("hero", "title", e.target.value)
								}
								className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<input
								type="text"
								placeholder="Professional Title (e.g., Software Developer)"
								value={formData.hero?.subtitle || ""}
								onChange={(e) =>
									handleInputChange("hero", "subtitle", e.target.value)
								}
								className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
						</div>
					</div>

					{/* Contact Information */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Contact Information</h2>
						<div className="grid grid-cols-1 gap-4">
							<input
								type="email"
								placeholder="Email Address"
								value={formData.contact?.email || ""}
								onChange={(e) => {
									handleInputChange("contact", "email", e.target.value)
								}}
								className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<input
								type="tel"
								placeholder="Phone Number"
								value={formData.contact?.phone || ""}
								onChange={(e) =>
									handleInputChange("contact", "phone", e.target.value)
								}
								className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<input
								type="text"
								placeholder="Location (City, Country)"
								value={formData.contact?.location || ""}
								onChange={(e) =>
									handleInputChange("contact", "location", e.target.value)
								}
								className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
							<input
								type="url"
								placeholder="LinkedIn Profile"
								value={formData.contact?.linkedin || ""}
								onChange={(e) =>
									handleInputChange("contact", "linkedin", e.target.value)
								}
								className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
						</div>
					</div>

					{/* Professional Summary */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
						<textarea
							placeholder="Write a brief professional summary about yourself..."
							value={formData.about?.summary || ""}
							onChange={(e) =>
								handleInputChange("about", "summary", e.target.value)
							}
							rows={4}
							className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
						/>
					</div>

					{/* Experience */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Work Experience</h2>
						{(formData.experience?.jobs || []).map((job, index) =>
							<div
								key={index}
								className="mb-6 p-4 border rounded-lg dark:border-gray-600"
							>
								<div className="grid grid-cols-1 gap-3 mb-3">
									<input
										type="text"
										placeholder="Job Title"
										value={job?.title || ""}
										onChange={(e) =>
											handleArrayChange("experience", "jobs", index, {
												...job,
												title: e.target.value,
											})
										}
										className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
									/>
									<input
										type="text"
										placeholder="Company Name"
										value={job?.company || ""}
										onChange={(e) =>
											handleArrayChange("experience", "jobs", index, {
												...job,
												company: e.target.value,
											})
										}
										className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
									/>
									<input
										type="text"
										placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
										value={job?.duration || ""}
										onChange={(e) =>
											handleArrayChange("experience", "jobs", index, {
												...job,
												duration: e.target.value,
											})
										}
										className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
									/>
									<textarea
										placeholder="Job Description"
										value={job?.description || ""}
										onChange={(e) =>
											handleArrayChange("experience", "jobs", index, {
												...job,
												description: e.target.value,
											})
										}
										rows={3}
										className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
									/>
								</div>
								<button
									type="button"
									onClick={() => removeArrayItem("experience", "jobs", index)}
									className="text-red-600 hover:text-red-800"
								>
									Remove Job
								</button>
							</div>
							))}
						<button
							type="button"
							onClick={addJob}
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Add Job
						</button>
					</div>

					{/* Education */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Education</h2>
						{(formData.education?.degrees || []).map((degree, index) =>
							<div
								key={index}
								className="mb-4 p-4 border rounded-lg dark:border-gray-600"
							>
								<div className="grid grid-cols-1 gap-3 mb-3">
									<input
										type="text"
										placeholder="Degree (e.g., Bachelor of Computer Science)"
										value={degree?.degree || ""}
										onChange={(e) =>
											handleArrayChange("education", "degrees", index, {
												...degree,
												degree: e.target.value,
											})
										}
										className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
									/>
									<input
										type="text"
										placeholder="Institution Name"
										value={degree?.institution || ""}
										onChange={(e) =>
											handleArrayChange("education", "degrees", index, {
												...degree,
												institution: e.target.value,
											})
										}
										className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
									/>
									<input
										type="text"
										placeholder="Year (e.g., 2020-2024)"
										value={degree?.year || ""}
										onChange={(e) =>
											handleArrayChange("education", "degrees", index, {
												...degree,
												year: e.target.value,
											})
										}
										className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
									/>
								</div>
								<button
									type="button"
									onClick={() => removeArrayItem("education", "degrees", index)}
									className="text-red-600 hover:text-red-800"
								>
									Remove Education
								</button>
							</div>
						)}
						<button
							type="button"
							onClick={addDegree}
							className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
						>
							Add Education
						</button>
					</div>

					{/* Skills */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Skills</h2>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">
								Technical Skills (comma-separated)
							</label>
							<textarea
								placeholder="e.g., JavaScript, React, Python, SQL"
								value={(formData.skills?.technical || []).join(", ")}
								onChange={(e) =>
									handleInputChange(
										"skills",
										"technical",
										e.target.value
											.split(",")
											.map((s) => s.trim())
											.filter((s) => s)
									)
								}
								rows={3}
								className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">
								Soft Skills (comma-separated)
							</label>
							<textarea
								placeholder="e.g., Team Leadership, Communication, Problem Solving"
								value={(formData.skills?.soft || []).join(", ")}
								onChange={(e) =>
									handleInputChange(
										"skills",
										"soft",
										e.target.value
											.split(",")
											.map((s) => s.trim())
											.filter((s) => s)
									)
								}
								rows={3}
								className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
							/>
						</div>
					</div>

					{/* Projects */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Projects</h2>
						<textarea
							placeholder="Describe your key projects..."
							value={formData.showcase?.projects || ""}
							onChange={(e) =>
								handleInputChange("showcase", "projects", e.target.value)
							}
							rows={4}
							className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
						/>
					</div>

					{/* Languages */}
					<div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
						<h2 className="text-xl font-semibold mb-4">Languages</h2>
						<textarea
							placeholder="Languages you speak (comma-separated) e.g., English, Hindi, Spanish"
							value={(formData.languages || []).join(", ")}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									languages: e.target.value
										.split(",")
										.map((s) => s.trim())
										.filter((s) => s),
								}))
							}
							rows={2}
							className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-4 mb-8">
						<button
							onClick={handleSave}
							className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
						>
							Save Changes
						</button>
						<button
							onClick={handlePreview}
							className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
						>
							Preview Portfolio
						</button>
						<button
							onClick={() => router.push("/editor")}
							className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold"
						>
							Back to Upload
						</button>
					</div>
				</div>

				{/* Right Panel - Live Preview */}
				<div className="w-1/2 h-screen overflow-y-auto border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
					<div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 z-10">
						<h2 className="text-xl font-semibold">Live Preview</h2>
					</div>
					<div className="p-4">
						{layout && Object.entries(layout).length > 0 ? (
							Object.entries(layout).map(([section, componentName]) => {
								const Component = componentMap[componentName];
								if (!Component) return null;

								// Handle different data structures for different components
								let componentProps = formData[section] || {};

								// Ensure no null values for inputs
								Object.keys(componentProps).forEach(key => {
									if (componentProps[key] === null || componentProps[key] === undefined) {
										componentProps[key] = "";
									}
								});

								// For projects section, handle the new schema structure
								if (section === "projects" && formData[section]?.items) {
									componentProps = { items: formData[section].items };
								}

								// For skills section, flatten the structure
								if (section === "skills" && formData[section]) {
									componentProps = {
										technical: formData[section].technical || [],
										soft: formData[section].soft || [],
										languages: formData[section].languages || [],
									};
								}

								// For achievements section, flatten the structure
								if (section === "achievements" && formData[section]) {
									componentProps = {
										awards: formData[section].awards || [],
										certifications: formData[section].certifications || [],
										publications: formData[section].publications || [],
									};
								}

								// For experience section, flatten the structure
								if (section === "experience" && formData[section]?.jobs) {
									componentProps = { jobs: formData[section].jobs };
								}

								// For education section, flatten the structure
								if (section === "education" && formData[section]?.degrees) {
									componentProps = { degrees: formData[section].degrees };
								}

								return (
									<div key={section} className="mb-8 last:mb-0">
										<Component {...componentProps} />
									</div>
								);
							})
						) : (
							<div className="text-center py-12">
								<p className="text-gray-500">
									No layout selected. Please go back and choose a template
									first.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
