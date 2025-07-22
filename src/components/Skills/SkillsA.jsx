import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function SkillsA({
	technical = [],
	soft = [],
	languages = [],
	data = EMPTY_PORTFOLIO,
}) {
	// Use new schema data if available, fallback to legacy props
	const skillsData = data.skills || {};
	const technicalSkills = skillsData.technical || [];
	const softSkills = skillsData.soft || [];
	const languageSkills = skillsData.languages || [];

	// Fallback to legacy props if new schema data is not available
	const displayTechnical =
		technicalSkills.length > 0 ? technicalSkills : technical || [];
	const displaySoft = softSkills.length > 0 ? softSkills : soft || [];
	const displayLanguages =
		languageSkills.length > 0 ? languageSkills : languages || [];

	const hasSkills =
		displayTechnical.length > 0 ||
		displaySoft.length > 0 ||
		displayLanguages.length > 0;

	if (!hasSkills) {
		return (
			<section className="py-12 px-6">
				<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
					Skills
				</h2>
				<div className="text-center py-8">
					<p className="text-gray-500">No skills information available.</p>
				</div>
			</section>
		);
	}

	// Component for displaying technical skill categories with detailed information
	const TechnicalSkillCategory = ({ categoryData }) => {
		if (!categoryData?.skills || categoryData.skills.length === 0) return null;

		return (
			<div className="mb-8">
				<h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
					<span className="mr-2">⚙️</span>
					{categoryData.category}
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{categoryData.skills.map((skill, index) => (
						<div
							key={index}
							className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
						>
							<div className="flex justify-between items-center mb-1">
								<span className="font-medium text-blue-800 dark:text-blue-200">
									{skill.name}
								</span>
								{skill.certified && (
									<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
										✓
									</span>
								)}
							</div>
							{skill.level && (
								<div className="flex items-center gap-2">
									<div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
										<div
											className={`h-2 rounded-full ${
												skill.level === "expert"
													? "bg-green-500 w-full"
													: skill.level === "advanced"
													? "bg-blue-500 w-4/5"
													: skill.level === "intermediate"
													? "bg-yellow-500 w-3/5"
													: "bg-red-500 w-2/5"
											}`}
										></div>
									</div>
									<span className="text-xs text-gray-500 capitalize">
										{skill.level}
									</span>
								</div>
							)}
							{skill.years > 0 && (
								<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
									{skill.years} year{skill.years > 1 ? "s" : ""} experience
								</p>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	// Component for displaying simple skill categories (legacy support)
	const SimpleSkillCategory = ({ title, skills, colorClass, icon }) => {
		if (!skills || skills.length === 0) return null;

		return (
			<div className="mb-8">
				<h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
					<span className="mr-2">{icon}</span>
					{title}
				</h3>
				<div className="flex flex-wrap gap-2">
					{skills.map((skill, index) => {
						// Handle both string and object formats
						const skillName = typeof skill === "string" ? skill : skill.name;
						return (
							<span
								key={index}
								className={`px-4 py-2 rounded-full text-sm font-medium ${colorClass}`}
							>
								{skillName}
							</span>
						);
					})}
				</div>
			</div>
		);
	};

	// Component for displaying soft skills with descriptions
	const SoftSkillCategory = ({ skills }) => {
		if (!skills || skills.length === 0) return null;

		return (
			<div className="mb-8">
				<h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
					<span className="mr-2">🤝</span>
					Soft Skills
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{skills.map((skill, index) => {
						const skillData =
							typeof skill === "string" ? { name: skill } : skill;
						return (
							<div
								key={index}
								className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
							>
								<h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
									{skillData.name}
								</h4>
								{skillData.description && (
									<p className="text-sm text-green-700 dark:text-green-300 mb-2">
										{skillData.description}
									</p>
								)}
								{skillData.examples && skillData.examples.length > 0 && (
									<ul className="text-xs text-green-600 dark:text-green-400 list-disc list-inside">
										{skillData.examples.map((example, idx) => (
											<li key={idx}>{example}</li>
										))}
									</ul>
								)}
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	// Component for displaying language skills with proficiency
	const LanguageSkillCategory = ({ skills }) => {
		if (!skills || skills.length === 0) return null;

		return (
			<div className="mb-8">
				<h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
					<span className="mr-2">🌐</span>
					Languages
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{skills.map((language, index) => {
						const langData =
							typeof language === "string"
								? { name: language, proficiency: "conversational" }
								: language;
						return (
							<div
								key={index}
								className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center"
							>
								<h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
									{langData.name}
								</h4>
								{langData.proficiency && (
									<p className="text-sm text-purple-600 dark:text-purple-300 capitalize">
										{langData.proficiency}
									</p>
								)}
								{langData.certification && (
									<p className="text-xs text-purple-500 dark:text-purple-400 mt-1">
										{langData.certification}
									</p>
								)}
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<section className="py-12 px-6">
			<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
				Skills
			</h2>
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 space-y-6">
				{/* Technical Skills - New schema format */}
				{displayTechnical.length > 0 && Array.isArray(displayTechnical[0]) && (
					// Legacy array format
					<SimpleSkillCategory
						title="Technical Skills"
						skills={displayTechnical}
						icon="⚙️"
						colorClass="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
					/>
				)}

				{/* Technical Skills - New schema format with categories */}
				{displayTechnical.length > 0 && displayTechnical[0]?.category && (
					<div>
						{displayTechnical.map((categoryData, index) => (
							<TechnicalSkillCategory key={index} categoryData={categoryData} />
						))}
					</div>
				)}

				{/* Handle simple technical skills array */}
				{displayTechnical.length > 0 &&
					typeof displayTechnical[0] === "string" && (
						<SimpleSkillCategory
							title="Technical Skills"
							skills={displayTechnical}
							icon="⚙️"
							colorClass="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
						/>
					)}

				{/* Soft Skills */}
				{displaySoft.length > 0 && displaySoft[0]?.name && (
					<SoftSkillCategory skills={displaySoft} />
				)}

				{/* Handle simple soft skills array */}
				{displaySoft.length > 0 && typeof displaySoft[0] === "string" && (
					<SimpleSkillCategory
						title="Soft Skills"
						skills={displaySoft}
						icon="🤝"
						colorClass="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
					/>
				)}

				{/* Languages */}
				{displayLanguages.length > 0 && displayLanguages[0]?.name && (
					<LanguageSkillCategory skills={displayLanguages} />
				)}

				{/* Handle simple languages array */}
				{displayLanguages.length > 0 &&
					typeof displayLanguages[0] === "string" && (
						<SimpleSkillCategory
							title="Languages"
							skills={displayLanguages}
							icon="🌐"
							colorClass="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
						/>
					)}
			</div>
		</section>
	);
}
