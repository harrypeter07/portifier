export default function AchievementsA({ awards = [], certifications = [], publications = [] }) {
	const hasAchievements = (awards && awards.length > 0) || 
						   (certifications && certifications.length > 0) || 
						   (publications && publications.length > 0);

	if (!hasAchievements) {
		return (
			<section className="py-12 px-6">
				<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Achievements</h2>
				<div className="text-center py-8">
					<p className="text-gray-500">No achievements information available.</p>
				</div>
			</section>
		);
	}

	const AchievementCategory = ({ title, items, icon, colorClass }) => {
		if (!items || items.length === 0) return null;
		
		return (
			<div className="mb-8">
				<h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
					<span className="mr-2">{icon}</span>
					{title}
				</h3>
				<div className="space-y-3">
					{items.map((item, index) => (
						<div key={index} className={`p-4 rounded-lg ${colorClass}`}>
							<p className="font-medium">{item}</p>
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<section className="py-12 px-6">
			<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Achievements</h2>
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
				<AchievementCategory
					title="Awards & Recognition"
					items={awards}
					icon="🏆"
					colorClass="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
				/>
				
				<AchievementCategory
					title="Certifications"
					items={certifications}
					icon="📜"
					colorClass="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
				/>
				
				<AchievementCategory
					title="Publications"
					items={publications}
					icon="📚"
					colorClass="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
				/>
			</div>
		</section>
	);
}
