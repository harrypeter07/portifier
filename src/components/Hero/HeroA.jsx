export default function HeroA({ title = "Your Name", subtitle = "Professional Title" }) {
	return (
		<section className="py-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
			<div className="max-w-4xl mx-auto px-4">
				<h1 className="text-5xl font-bold mb-4">{title}</h1>
				{subtitle && (
					<h2 className="text-xl text-blue-100 mb-8">{subtitle}</h2>
				)}
			</div>
		</section>
	);
}
