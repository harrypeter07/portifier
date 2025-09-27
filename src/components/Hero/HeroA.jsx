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
		<section className="py-6 sm:py-10 md:py-16 text-center bg-gradient-to-r from-black to-black text-white">
			<div className="max-w-full px-2 sm:px-4 mx-auto">
				<h1 className="font-bold mb-2 sm:mb-4" style={{ fontSize: 'clamp(1.5rem, 6vw, 3rem)' }}>{fullName}</h1>
				{subtitle && <h2 className="text-base sm:text-xl text-white/80 mb-2 sm:mb-6">{subtitle}</h2>}
				{tagline && (
					<p className="text-sm sm:text-lg text-white/70 max-w-full sm:max-w-2xl mx-auto">{tagline}</p>
				)}
			</div>
		</section>
	);
}
