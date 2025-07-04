import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	username: { type: String, required: true, unique: true },
	templateName: { type: String, required: true },
	theme: { type: Object, required: true },
	layout: { type: Array, required: true },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Portfolio ||
	mongoose.model("Portfolio", PortfolioSchema);
