export default function ShowcaseA({ projects = [] }) {
	return (
		<section className="py-12">
			<h2 className="text-2xl font-semibold mb-6">Projects</h2>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{projects.map((p, i) => (
					<div key={i} className="p-4 border rounded shadow">
						<h3 className="font-bold text-lg">{p.name}</h3>
						<p>{p.description}</p>
						<a
							href={p.link}
							className="text-blue-500 underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							View
						</a>
					</div>
				))}
			</div>
		</section>
	);
}
