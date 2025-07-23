"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
	const [user, setUser] = useState(null);
	const router = useRouter();

	useEffect(() => {
		async function fetchUser() {
			const res = await fetch("/api/auth/me");
			if (res.ok) {
				const data = await res.json();
				setUser(data.user);
			} else {
				router.push("/auth/signin");
			}
		}
		fetchUser();
	}, [router]);

	if (!user) return <div>Loading...</div>;
	return (
		<main className="min-h-screen flex flex-col items-center justify-center">
			<h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
			<p>This is your dashboard.</p>
		</main>
	);
}
