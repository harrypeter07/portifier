'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/signup", label: "Sign Up" },
	{ href: "/signin", label: "Sign In" },
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/editor", label: "Editor" },
];

export default function Navbar() {
	const pathname = usePathname();
	return (
		<nav className="flex gap-6 py-4 px-8 border-b bg-white/80 backdrop-blur sticky top-0 z-10">
			{navLinks.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className={`font-semibold transition-colors hover:text-blue-600 ${
						pathname === link.href ? "text-blue-600 underline" : ""
					}`}
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}
