import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function HeroB({ data = EMPTY_PORTFOLIO }) {
	const personal = data?.personal || {}
	const fullName =
		`${personal.firstName || ''} ${personal.lastName || ''}`.trim() ||
		"Your Name";
	const title = personal.title || "Professional Title";
	const tagline = personal.tagline;
	const subtitle = personal.subtitle || "";

	return (
		<section className="py-16 text-center bg-gray-100 dark:bg-gray-800">
			<div className="max-w-4xl mx-auto px-4">
				<h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
					{fullName}
				</h1>
				{subtitle && (
					<h2 className="text-xl text-blue-500 dark:text-blue-200 mb-6">{subtitle}</h2>
				)}
				{title && (
					<h3 className="text-lg text-gray-700 dark:text-gray-300 mb-6">{title}</h3>
				)}
				{tagline && (
					<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
						{tagline}
					</p>
				)}
			</div>
		</section>
	);
}
