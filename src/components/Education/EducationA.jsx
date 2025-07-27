export default function EducationA({ degrees = [] }) {
	if (!degrees || degrees.length === 0) {
		return (
			<section className="py-12 px-6">
				<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Education</h2>
				<div className="text-center py-8">
					<p className="text-gray-500">No education information available.</p>
				</div>
			</section>
		);
	}

	return (
		<section className="py-6 sm:py-10 md:py-12 px-2 sm:px-6">
			<h2 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-6 text-gray-900 dark:text-white">Education</h2>
			<div className="space-y-3 sm:space-y-6">
				{degrees.map((degree, index) => (
					<div key={index} className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-lg shadow border dark:border-gray-700">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between">
							<div className="flex-1">
								<h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
									{degree.degree || 'Degree'} 
									{degree.field && <span className="text-blue-600 dark:text-blue-400"> in {degree.field}</span>}
								</h3>
								<p className="text-sm sm:text-lg text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
									{degree.institution || 'Institution Name'}
								</p>
								<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
									{degree.year && (
										<span className="flex items-center">
											<span className="mr-1">📅</span>
											{degree.year}
										</span>
									)}
									{degree.location && (
										<span className="flex items-center">
											<span className="mr-1">📍</span>
											{degree.location}
										</span>
									)}
									{degree.gpa && (
										<span className="flex items-center">
											<span className="mr-1">🏅</span>
											GPA: {degree.gpa}
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
