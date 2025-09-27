import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function AboutA({
	summary = "Professional summary not available.",
	data = EMPTY_PORTFOLIO,
}) {
	// Use new schema data if available, fallback to legacy prop
	const aboutData = data.about || {};
	const displaySummary =
		aboutData.summary || summary || "Professional summary not available.";
	const bio = aboutData.bio;
	const interests = aboutData.interests || [];
	const personalValues = aboutData.personalValues || [];
	const funFacts = aboutData.funFacts || [];

	return (
		<section className="py-12 px-6">
			<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
				About Me
			</h2>
			<div className="max-w-4xl space-y-6">
				{/* Main summary/bio */}
				<div className="prose prose-lg max-w-none">
					<p className="text-gray-900 dark:text-gray-100 leading-relaxed text-lg mb-4">
						{displaySummary}
					</p>
					{bio && bio !== displaySummary && (
						<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
							{bio}
						</p>
					)}
				</div>

				{/* Additional sections for rich about data */}
				{(interests.length > 0 ||
					personalValues.length > 0 ||
					funFacts.length > 0) && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
						{interests.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
									Interests
								</h3>
								<ul className="space-y-2">
									{interests.map((interest, index) => (
										<li
											key={index}
											className="text-gray-600 dark:text-gray-400 flex items-center"
										>
											<span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
											{interest}
										</li>
									))}
								</ul>
							</div>
						)}

						{personalValues.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
									Values
								</h3>
								<ul className="space-y-2">
									{personalValues.map((value, index) => (
										<li
											key={index}
											className="text-gray-600 dark:text-gray-400 flex items-center"
										>
											<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
											{value}
										</li>
									))}
								</ul>
							</div>
						)}

						{funFacts.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
									Fun Facts
								</h3>
								<ul className="space-y-2">
									{funFacts.map((fact, index) => (
										<li
											key={index}
											className="text-gray-600 dark:text-gray-400 flex items-center"
										>
											<span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
											{fact}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
