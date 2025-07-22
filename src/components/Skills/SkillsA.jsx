export default function SkillsA({ technical = [], soft = [], languages = [] }) {
	const hasSkills = (technical && technical.length > 0) || 
					 (soft && soft.length > 0) || 
					 (languages && languages.length > 0);

	if (!hasSkills) {
		return (
			<section className="py-12 px-6">
				<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Skills</h2>
				<div className="text-center py-8">
					<p className="text-gray-500">No skills information available.</p>
				</div>
			</section>
		);
	}

	const SkillCategory = ({ title, skills, colorClass, icon }) => {
		if (!skills || skills.length === 0) return null;
		
		return (
			<div className="mb-8">
				<h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
					<span className="mr-2">{icon}</span>
					{title}
				</h3>
				<div className="flex flex-wrap gap-2">
					{skills.map((skill, index) => (
						<span
							key={index}
							className={`px-4 py-2 rounded-full text-sm font-medium ${colorClass}`}
						>
							{skill}
						</span>
					))}
				</div>
			</div>
		);
	};

	return (
		<section className="py-12 px-6">
			<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Skills</h2>
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
				<SkillCategory
					title="Technical Skills"
					skills={technical}
					icon="⚙️"
					colorClass="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
				/>
				
				<SkillCategory
					title="Soft Skills"
					skills={soft}
					icon="🤝"
					colorClass="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
				/>
				
				<SkillCategory
					title="Languages"
					skills={languages}
					icon="🌐"
					colorClass="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
				/>
			</div>
		</section>
	);
}
