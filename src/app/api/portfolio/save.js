import dbConnect from "../../../src/lib/mongodb";
import Portfolio from "../../../src/models/Portfolio";
import auth from "../../../src/lib/auth";

export default async function handler(req, res) {
	if (req.method !== "POST") return res.status(405).end();
	await dbConnect();
	const user = await auth(req, res);
	if (!user) return; // auth handles response
	const { username, templateName, theme, layout } = req.body;
	if (!username || !templateName || !theme || !layout)
		return res.status(400).json({ error: "Missing fields" });
	const data = {
		userId: user._id,
		username,
		templateName,
		theme,
		layout,
		createdAt: new Date(),
	};
	const portfolio = await Portfolio.findOneAndUpdate(
		{ userId: user._id },
		data,
		{ upsert: true, new: true }
	);
	res.status(200).json({ portfolio });
}
