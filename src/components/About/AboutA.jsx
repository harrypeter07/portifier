export default function AboutA({ summary = "Professional summary not available." }) {
	return (
		<section className="py-12 px-6">
			<h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">About Me</h2>
			<div className="max-w-4xl">
				<p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
					{summary}
				</p>
			</div>
		</section>
	);
}
