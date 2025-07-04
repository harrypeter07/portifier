export default function ContactFormA() {
	return (
		<section className="py-12">
			<h2 className="text-2xl font-semibold mb-6">Contact Me</h2>
			<form className="max-w-md mx-auto flex flex-col gap-4">
				<input
					className="border p-2 rounded"
					type="text"
					placeholder="Your Name"
					required
				/>
				<input
					className="border p-2 rounded"
					type="email"
					placeholder="Your Email"
					required
				/>
				<textarea
					className="border p-2 rounded"
					placeholder="Your Message"
					required
				/>
				<button className="bg-blue-600 text-white py-2 rounded" type="submit">
					Send
				</button>
			</form>
		</section>
	);
}
