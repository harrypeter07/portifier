import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function HeroA({ data = EMPTY_PORTFOLIO }) {
	const fullName =
		`${data.personal.firstName} ${data.personal.lastName}`.trim() ||
		"Your Name";
	const title = data.personal.title || "Professional Title";
	const tagline = data.personal.tagline;

	return (
		<section className="py-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
			<div className="max-w-4xl mx-auto px-4">
				<h1 className="text-5xl font-bold mb-4">{fullName}</h1>
				{title && <h2 className="text-xl text-blue-100 mb-6">{title}</h2>}
				{tagline && (
					<p className="text-lg text-blue-50 max-w-2xl mx-auto">{tagline}</p>
				)}
			</div>
		</section>
	);
}
