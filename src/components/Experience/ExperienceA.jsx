export default function ExperienceA({ jobs = [] }) {
	if (!jobs || jobs.length === 0) {
		return (
			<section className="py-12 px-6">
				<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Work Experience</h2>
				<div className="text-center py-8">
					<p className="text-gray-500">No work experience information available.</p>
				</div>
			</section>
		);
	}

	return (
		<section className="py-6 sm:py-10 md:py-12 px-2 sm:px-6">
			<h2 className="text-lg sm:text-2xl font-semibold mb-3 sm:mb-6 text-gray-900 dark:text-white">Work Experience</h2>
			<div className="space-y-4 sm:space-y-8">
				{jobs.map((job, index) => (
					<div key={index} className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-lg shadow border dark:border-gray-700">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 sm:mb-3">
							<div>
								<h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
									{job.title || 'Job Title'}
								</h3>
								<p className="text-sm sm:text-lg text-blue-600 dark:text-blue-400 font-medium">
									{job.company || 'Company Name'}
								</p>
							</div>
							<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 md:mt-0">
								<p>{job.duration || 'Duration'}</p>
								{job.location && <p>{job.location}</p>}
							</div>
						</div>
						
						{job.description && (
							<div className="text-gray-700 dark:text-gray-300 mb-2 sm:mb-4">
								{job.description.split('\n').map((line, idx) => (
									line.trim() && (
										<p key={idx} className="mb-1 sm:mb-2">• {line.trim()}</p>
									)
								))}
							</div>
						)}
						
						{job.technologies && job.technologies.length > 0 && (
							<div className="flex flex-wrap gap-1 sm:gap-2">
								{job.technologies.map((tech, idx) => (
									<span 
										key={idx} 
										className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm rounded-full"
									>
										{tech}
									</span>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</section>
	);
}
