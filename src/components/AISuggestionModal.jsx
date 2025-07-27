"use client";

export default function AISuggestionInline({ 
	isOpen, 
	onClose, 
	suggestions = [], 
	onSelectSuggestion, 
	fieldName, 
	loading = false 
}) {
	if (!isOpen) return null;

	return (
		<div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
			{loading ? (
				<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
					<div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
					<span>Generating AI suggestions...</span>
				</div>
			) : suggestions.length > 0 ? (
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
							🤖 AI Suggestions for {fieldName}
						</p>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
						>
							✕
						</button>
					</div>
					<div className="grid grid-cols-1 gap-2">
						{suggestions.map((suggestion, index) => (
							<button
								key={index}
								onClick={() => {
									onSelectSuggestion(suggestion);
									onClose();
								}}
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