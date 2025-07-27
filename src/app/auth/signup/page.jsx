"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
	const [form, setForm] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// Check if user is already logged in
	useEffect(() => {
		async function checkAuth() {
			try {
				const res = await fetch("/api/auth/me");
				if (res.ok) {
					router.push("/dashboard");
				}
			} catch (error) {
				// User not logged in, continue
			}
		}
		checkAuth();
	}, [router]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (res.ok) {
				setSuccess("Account created successfully! Redirecting to dashboard...");
				// Wait a moment for the cookie to be set, then redirect
				setTimeout(() => {
					router.push("/dashboard");
				}, 1500);
			} else {
				setError(data.error || "Signup failed");
			}
		} catch (error) {
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Create Account
					</h1>
					<p className="text-gray-600">
						Join us to build your amazing portfolio
					</p>
				</div>

				{success && (
					<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
						<p className="text-green-700 text-sm">{success}</p>
					</div>
				)}

				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<p className="text-red-700 text-sm">{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
							Full Name
						</label>
						<input
							id="name"
							type="text"
							required
							placeholder="Enter your full name"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							disabled={loading}
						/>
					</div>

					<div>
						<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
							Username
						</label>
						<input
							id="username"
							type="text"
							required
							placeholder="Choose a username"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={form.username}
							onChange={(e) => setForm({ ...form, username: e.target.value })}
							disabled={loading}
						/>
						<p className="text-xs text-gray-500 mt-1">
							This will be your portfolio URL (e.g., yoursite.com/username)
						</p>
					</div>

					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
							Email Address
						</label>
						<input
							id="email"
							type="email"
							required
							placeholder="Enter your email"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
							disabled={loading}
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							placeholder="Create a password"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={form.password}
							onChange={(e) => setForm({ ...form, password: e.target.value })}
							disabled={loading}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Creating Account..." : "Create Account"}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-gray-600">
						Already have an account?{" "}
						<Link
							href="/auth/signin"
							className="text-blue-600 hover:text-blue-700 font-medium"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
