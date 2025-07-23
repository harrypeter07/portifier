"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signin() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [verifiedMsg, setVerifiedMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const params = new URLSearchParams(window.location.search);
			if (params.get("verified")) {
				setVerifiedMsg("Your email has been verified! You can now sign in.");
			}
		}
	}, []);

	useEffect(() => {
		async function checkLoggedIn() {
			const res = await fetch("/api/auth/me");
			if (res.ok) {
				router.push("/dashboard");
			}
		}
		checkLoggedIn();
	}, [router]);

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		const res = await fetch("/api/auth/signin", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		setLoading(false);
		if (res.ok) {
			if (data.user) {
				router.push("/dashboard");
			} else {
				setError("Unexpected response from server. Please try again.");
			}
		} else {
			if (data && data.error) {
				setError(data.error);
			} else {
				setError("Signin failed");
			}
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<div className="w-full max-w-md p-8 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg flex flex-col gap-6">
				<h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 text-center">
					Sign In
				</h1>
				{verifiedMsg && (
					<div className="text-green-600 text-sm text-center" role="status">
						{verifiedMsg}
					</div>
				)}
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4"
					autoComplete="off"
				>
					<label htmlFor="email" className="sr-only">
						Email
					</label>
					<input
						id="email"
						required
						type="email"
						placeholder="Email"
						className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
						value={form.email}
						onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
						disabled={loading}
					/>
					<label htmlFor="password" className="sr-only">
						Password
					</label>
					<input
						id="password"
						required
						type="password"
						placeholder="Password"
						className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
						value={form.password}
						onChange={(e) =>
							setForm((f) => ({ ...f, password: e.target.value }))
						}
						disabled={loading}
					/>
					{error && (
						<div className="text-red-600 text-sm text-center" role="alert">
							{error}
						</div>
					)}
					<button
						className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg shadow transition disabled:opacity-60"
						type="submit"
						disabled={loading}
						aria-busy={loading}
					>
						{loading ? "Signing In..." : "Sign In"}
					</button>
				</form>
				<div className="text-center text-gray-600 dark:text-gray-300 text-sm">
					Don&apos;t have an account?{" "}
					<Link href="/auth/signup" className="text-blue-600 hover:underline">
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
}
