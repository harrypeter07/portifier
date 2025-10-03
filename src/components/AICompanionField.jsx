"use client";
import { useState } from "react";

export default function AICompanionField({
	type = "input", // "input" or "textarea"
	label,
	value,
	onChange,
	placeholder,
	rows = 3,
	className = "",
	aiEnabled = false,
	aiSection,
	aiField,
	aiLabel,
	resumeData = {},
	resumeType = "developer"
}) {
	const [aiSuggestions, setAiSuggestions] = useState([]);
	const [aiLoading, setAiLoading] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);

	// AI Help Button Component
	function AIHelpButton() {
		if (!aiEnabled) return null;

		return (
			<button
				type="button"
				onClick={handleAIClick}
				title={`Get AI suggestion for ${aiLabel || aiField}`}
				className="inline-flex items-center px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
			>
				<span className="mr-1">🤖</span>
				AI Help
			</button>
		);
	}

	// AI Suggestions Component
	function AISuggestions() {
		if (!aiEnabled || !showSuggestions) return null;

		return (
			<div className="mt-2 p-3 glass rounded-lg border border-gray-200">
				{aiLoading ? (
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
						<span>Generating AI suggestions...</span>
					</div>
				) : aiSuggestions.length > 0 ? (
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
								🤖 AI Suggestions for {aiLabel || aiField}
							</p>
							<button
								onClick={() => setShowSuggestions(false)}
								className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
							>
								✕
							</button>
						</div>
						<div className="grid grid-cols-1 gap-2">
							{aiSuggestions.map((suggestion, index) => (
								<button
									key={index}
									onClick={() => handleSuggestionSelect(suggestion)}
									className="w-full p-2 text-left text-sm border border-gray-200 dark:border-gray-600 rounded hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
								>
									<span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
										{index + 1}.
									</span>
									{suggestion}
								</button>
							))}
						</div>
					</div>
				) : (
					<div className="text-center py-2">
						<p className="text-sm text-gray-500 dark:text-gray-400">
							No suggestions available. Please try again.
						</p>
					</div>
				)}
			</div>
		);
	}

	// Handle AI button click
	async function handleAIClick() {
		setAiLoading(true);
		setShowSuggestions(true);

		try {
			const response = await fetch("/api/ai-suggestions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					inputField: aiField,
					fieldName: aiField,
					resumeType: resumeType,
					resumeData: resumeData,
					currentValue: value
				}),
			});

			const data = await response.json();
			
			if (data.success) {
				setAiSuggestions(data.suggestions);
			} else {
				console.error("AI suggestion failed:", data.error);
				setAiSuggestions([]);
			}
		} catch (error) {
			console.error("Error getting AI suggestions:", error);
			setAiSuggestions([]);
		} finally {
			setAiLoading(false);
		}
	}

	// Handle suggestion selection
	function handleSuggestionSelect(suggestion) {
		// Handle different field types
		if (aiField === "interests" || aiField === "personalValues" || aiField === "funFacts" || aiField === "technical" || aiField === "soft" || aiField === "languages") {
			// For array fields, split by commas and clean up
			if (suggestion && typeof suggestion === 'string') {
				const items = suggestion.split(",").map(s => s.trim()).filter(s => s);
				onChange(items);
			} else {
				// Fallback for empty or invalid suggestions
				onChange([]);
			}
		} else {
			// For regular text fields
			onChange(suggestion || "");
		}
		setShowSuggestions(false);
	}

	// Render the field
	return (
		<div>
			<div className="flex items-start gap-2">
				{type === "textarea" ? (
					<textarea
						placeholder={placeholder}
						value={value || ""}
						onChange={(e) => onChange(e.target.value)}
						rows={rows}
						className={`flex-1 p-3 border rounded-lg glass ${className}`}
					/>
				) : (
					<input
						type={type === "input" ? "text" : type}
						placeholder={placeholder}
						value={value || ""}
						onChange={(e) => onChange(e.target.value)}
						className={`flex-1 p-3 border rounded-lg glass ${className}`}
					/>
				)}
				<AIHelpButton />
			</div>
			<AISuggestions />
		</div>
	);
} 