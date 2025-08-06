import { EMPTY_PORTFOLIO } from "@/data/schemas/portfolioSchema";

export default function HeroC({ data = EMPTY_PORTFOLIO, ...personalData }) {
	// Handle both data structures: new schema format and direct personal data
	const personal = data?.personal || personalData || {};
	
	// Handle legacy structure where data might be direct personal data
	const actualPersonal = personal.firstName ? personal : data;

	const fullName =
		actualPersonal.firstName || actualPersonal.lastName
			? `${actualPersonal.firstName || ""} ${actualPersonal.lastName || ""}`.trim()
			: actualPersonal.title || "Your Name";
	const subtitle = actualPersonal.subtitle || "";
	const tagline = actualPersonal.tagline;
	const email = actualPersonal.email || "";

	return (
		<section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
			</div>
			
			<div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
				{/* Avatar Placeholder */}
				<div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-2xl font-bold text-white shadow-2xl">
					{fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
				</div>
				
				{/* Name */}
				<h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
					{fullName}
				</h1>
				
				{/* Subtitle */}
				{subtitle && (
					<h2 className="text-xl md:text-2xl text-purple-200 mb-6 font-light">
						{subtitle}
					</h2>
				)}
				
				{/* Tagline */}
				{tagline && (
					<p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
						{tagline}
					</p>
				)}
				
				{/* Contact Info */}
				{email && (
					<div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
						<span className="flex items-center">
							<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
								<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
							</svg>
							{email}
						</span>
					</div>
				)}
				
				{/* Scroll Indicator */}
				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
					<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
				</div>
			</div>
		</section>
	);
} 