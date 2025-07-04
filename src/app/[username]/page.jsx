import { componentMap } from "../../data/componentMap";

async function getPortfolioConfigFromDB(username) {
	const res = await fetch(
		`${
			process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
		}/api/portfolio/get?username=${username}`,
		{ cache: "no-store" }
	);
	if (!res.ok) return null;
	const data = await res.json();
	return data.portfolio;
}

export default async function CustomPortfolioPage({ params }) {
	const config = await getPortfolioConfigFromDB(params.username);

	if (!config) {
		return <div>Portfolio not found.</div>;
	}

	return (
		<>
			<style>{`:root { --primary: ${config.theme.primary}; }`}</style>
			<main>
				{config.layout.map((block, i) => {
					const Component = componentMap[block.component];
					return Component ? <Component key={i} {...block.props} /> : null;
				})}
			</main>
		</>
	);
}
