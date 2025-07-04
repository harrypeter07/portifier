"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Editor() {
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		async function fetchUser() {
			const res = await fetch("/api/auth/me");
			if (res.ok) {
				const data = await res.json();
				setUser(data.user);
			} else {
				router.push("/signin");
			}
		}
		fetchUser();
	}, [router]);

	if (!user) return <div>Loading...</div>;
	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<h1 className="text-2xl font-bold mb-4">Portfolio Editor</h1>
			<p>UI for selecting theme, layout, and saving config goes here.</p>
		</main>
	);
}
