import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
	const body = await req.json();
	await dbConnect();
	const { name, email, password } = body;
	if (!name || !email || !password)
		return new Response(JSON.stringify({ error: "Missing fields" }), {
			status: 400,
		});
	const existing = await User.findOne({ email });
	if (existing)
		return new Response(JSON.stringify({ error: "User exists" }), {
			status: 409,
		});
	const hash = await bcrypt.hash(password, 10);
	const verificationToken = crypto.randomBytes(32).toString("hex");
	let user;
	try {
		user = await User.create({
			name,
			email,
			password: hash,
			verificationToken,
		});
		console.log("User created:", user);
	} catch (err) {
		console.error("User creation error:", err);
		return new Response(JSON.stringify({ error: "User creation failed." }), {
			status: 500,
		});
	}

	// Send verification email
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	const verifyUrl = `${baseUrl}/api/auth/verify?email=${encodeURIComponent(
		email
	)}&token=${verificationToken}`;
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	try {
		await transporter.sendMail({
			from: `Portfolio Maker <${process.env.EMAIL_USER}>`,
			to: email,
			subject: "Verify your email",
			html: `<p>Hi ${name},</p><p>Please verify your account by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
		});
	} catch (err) {
		console.error("Email send error:", err);
		await User.deleteOne({ _id: user._id }); // Clean up user if email fails
		return new Response(
			JSON.stringify({ error: "Failed to send verification email." }),
			{ status: 500 }
		);
	}

	return new Response(
		JSON.stringify({
			message: "Verification email sent. Please check your inbox.",
		}),
		{ status: 201 }
	);
}
