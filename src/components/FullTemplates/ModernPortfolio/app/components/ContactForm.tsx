import React, { useState } from "react";

const ContactForm = () => {
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({ name: "", email: "", message: "" });

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setSubmitted(true);
		}, 1200);
	};

	return (
		<div className="w-full max-w-md mx-auto animate-fade-in-up">
			{submitted ? (
				<div className="p-6 text-center text-green-600 font-semibold text-lg animate-fade-in-up">
					Thank you for reaching out! I will get back to you soon.
				</div>
			) : (
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4 bg-white/90 p-6 rounded-xl shadow-lg animate-fade-in-up"
				>
					<input
						type="text"
						name="name"
						placeholder="Your Name"
						value={form.name}
						onChange={handleChange}
						required
						className="px-4 py-2 rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-purple transition"
					/>
					<input
						type="email"
						name="email"
						placeholder="Your Email"
						value={form.email}
						onChange={handleChange}
						required
						className="px-4 py-2 rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-purple transition"
					/>
					<textarea
						name="message"
						placeholder="Your Message"
						value={form.message}
						onChange={handleChange}
						required
						rows={4}
						className="px-4 py-2 rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-purple transition"
					/>
					<button
						type="submit"
						disabled={loading}
						className="bg-brand-purple text-white font-semibold py-2 rounded-lg mt-2 transition-colors duration-200 hover:bg-brand-purple/90 disabled:opacity-60"
					>
						{loading ? "Sending..." : "Send Message"}
					</button>
				</form>
			)}
		</div>
	);
};

export default ContactForm;
