import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
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
	// const verificationToken = crypto.randomBytes(32).toString("hex");
	let user;
	try {
		user = await User.create({
			name,
			email,
			password: hash,
			// verificationToken,
		});
		console.log("User created:", user);
	} catch (err) {
		console.error("User creation error:", err);
		return new Response(JSON.stringify({ error: "User creation failed." }), {
			status: 500,
		});
	}

	// Send verification email
	// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
	// const verifyUrl = `${baseUrl}/api/auth/verify?email=${encodeURIComponent(
	// 	email
	// )}&token=${verificationToken}`;
	// const transporter = nodemailer.createTransport({
	// 	service: "gmail",
	// 	auth: {
	// 		user: process.env.EMAIL_USER,
	// 		pass: process.env.EMAIL_PASS,
	// 	},
	// });
	// try {
	// 	await transporter.sendMail({
	// 		from: `Portfolio Maker <${process.env.EMAIL_USER}>`,
	// 		to: email,
	// 		subject: "Verify your email",
	// 		html: `
	// 		  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; padding: 40px 0;">
	// 		    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px 32px 24px 32px;">
	// 		      <h2 style="color: #2d3a4a; text-align: center; margin-bottom: 16px;">Welcome to <span style='color:#2563eb;'>Portfolio Maker</span>!</h2>
	// 		      <p style="font-size: 1.1rem; color: #444; text-align: center; margin-bottom: 24px;">Hi <b>${name}</b>,<br/>Thank you for signing up. Please verify your email address to activate your account.</p>
	// 		      <div style="text-align: center; margin-bottom: 32px;">
	// 		        <a href="${verifyUrl}" style="display: inline-block; background: #2563eb; color: #fff; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 1.1rem; box-shadow: 0 2px 6px rgba(37,99,235,0.12); transition: background 0.2s;">Verify Email</a>
	// 		      </div>
	// 		      <p style="font-size: 0.97rem; color: #888; text-align: center;">If you did not create an account, you can safely ignore this email.</p>
	// 		      <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #eee;"/>
	// 		      <div style="text-align: center; color: #b0b8c1; font-size: 0.93rem;">&copy; ${new Date().getFullYear()} Portfolio Maker</div>
	// 		    </div>
	// 		  </div>
	// 		`,
	// 	});
	// } catch (err) {
	// 	console.error("Email send error:", err);
	// 	await User.deleteOne({ _id: user._id }); // Clean up user if email fails
	// 	return new Response(
	// 		JSON.stringify({ error: "Failed to send verification email." }),
	// 		{ status: 500 }
	// 	);
	// }

	return new Response(
		JSON.stringify({
			message: "Signup successful. Email verification is currently disabled.",
		}),
		{ status: 201 }
	);
}
