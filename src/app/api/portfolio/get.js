import dbConnect from "../../../src/lib/mongodb";
import Portfolio from "../../../src/models/Portfolio";

export default async function handler(req, res) {
	if (req.method !== "GET") return res.status(405).end();
	await dbConnect();
	const { username } = req.query;
	if (!username) return res.status(400).json({ error: "Missing username" });
	const portfolio = await Portfolio.findOne({ username });
	if (!portfolio) return res.status(404).json({ error: "Not found" });
	res.status(200).json({ portfolio });
}
