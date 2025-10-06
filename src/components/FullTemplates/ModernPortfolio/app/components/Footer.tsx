import React from "react";

const Footer = () => (
	<footer className="w-full py-8 bg-zinc-900 text-zinc-200 text-center mt-16">
		<div className="container mx-auto flex flex-col items-center gap-2">
			<span className="font-semibold">
				&copy; {new Date().getFullYear()} Aryan Sharma. All rights reserved.
			</span>
			<span className="text-sm">
				Made with ❤️ using Next.js &amp; Tailwind CSS
			</span>
		</div>
	</footer>
);

export default Footer;
