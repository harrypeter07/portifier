export default function ShowcaseA({ projects = "", items = [] }) {
	// Handle multiple project data formats
	let projectsArray = [];
	
	// New schema format with items array
	if (Array.isArray(items) && items.length > 0) {
		projectsArray = items;
	}
	// Legacy string format
	else if (typeof projects === 'string' && projects) {
		projectsArray = projects.split(',').map(p => ({ 
			name: p.trim(), 
			description: '', 
			url: '#',
			github: ''
		}));
	}
	// Legacy array format
	else if (Array.isArray(projects)) {
		projectsArray = projects;
	}

	return (
		<section className="py-12 px-6">
			<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Projects</h2>
			{projectsArray.length > 0 ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{projectsArray.map((p, i) => (
						<div key={i} className="p-4 border rounded shadow dark:border-gray-600 bg-white dark:bg-gray-800">
							<h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{p.name}</h3>
							{p.description && <p className="text-gray-700 dark:text-gray-300 mb-3">{p.description}</p>}
							{/* Project Technologies/Tools */}
							{(p.technologies || p.tools) && (
								<div className="mb-3">
									<div className="flex flex-wrap gap-1">
										{(p.technologies || p.tools).map((tech, idx) => (
											<span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
												{tech}
											</span>
										))}
									</div>
								</div>
							)}
							
							{/* Project Links */}
							<div className="flex gap-2">
								{(p.url || p.link) && (p.url || p.link) !== '#' && (
									<a
										href={p.url || p.link}
										className="text-blue-500 hover:text-blue-700 underline text-sm"
										target="_blank"
										rel="noopener noreferrer"
									>
										🔗 Live Demo
									</a>
								)}
								{p.github && (
									<a
										href={p.github}
										className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline text-sm"
										target="_blank"
										rel="noopener noreferrer"
									>
										💻 GitHub
									</a>
								)}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-8">
					<p className="text-gray-500">No projects information available.</p>
				</div>
			)}
		</section>
	);
}
