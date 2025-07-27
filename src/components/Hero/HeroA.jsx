import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function HeroA({ data = EMPTY_PORTFOLIO, ...personalData }) {
	// Handle both data structures: new schema format and direct personal data
	const personal = data?.personal || personalData || {};
	console.log("🎯 [HERO-A] Component received data:", { 
		hasData: !!data, 
		hasPersonal: !!personal, 
		personalKeys: Object.keys(personal),
		personalDataKeys: Object.keys(personalData || {})
	});

	// Handle legacy structure where data might be direct personal data
	const actualPersonal = personal.firstName ? personal : data;
	console.log("🎯 [HERO-A] Final personal data used:", {
		firstName: actualPersonal.firstName,
		lastName: actualPersonal.lastName,
		title: actualPersonal.title,
		subtitle: actualPersonal.subtitle,
		tagline: actualPersonal.tagline
	});

	const fullName =
		actualPersonal.firstName || actualPersonal.lastName
			? `${actualPersonal.firstName || ""} ${actualPersonal.lastName || ""}`.trim()
			: actualPersonal.title || "Your Name";
	const subtitle = actualPersonal.subtitle || "";
	const tagline = actualPersonal.tagline;

	console.log("🎯 [HERO-A] Rendered values:", {
		fullName,
		subtitle,
		tagline,
		hasName: !!fullName && fullName !== "Your Name",
		hasSubtitle: !!subtitle,
		hasTagline: !!tagline
	});

	return (
		<section className="py-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
			<div className="max-w-4xl mx-auto px-4">
				<h1 className="text-5xl font-bold mb-4">{fullName}</h1>
				{subtitle && <h2 className="text-xl text-blue-100 mb-6">{subtitle}</h2>}
				{tagline && (
					<p className="text-lg text-blue-50 max-w-2xl mx-auto">{tagline}</p>
				)}
			</div>
		</section>
	);
}
