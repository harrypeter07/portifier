"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

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
		<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl font-bold">
						Create Account
					</CardTitle>
					<CardDescription>
						Join us to build your amazing portfolio
					</CardDescription>
				</CardHeader>

				<CardContent>
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

					<Form onSubmit={handleSubmit} className="space-y-6">
						<FormField>
							<FormLabel htmlFor="name">Full Name</FormLabel>
							<FormControl>
								<Input
									id="name"
									type="text"
									required
									placeholder="Enter your full name"
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									disabled={loading}
								/>
							</FormControl>
						</FormField>

						<FormField>
							<FormLabel htmlFor="username">Username</FormLabel>
							<FormControl>
								<Input
									id="username"
									type="text"
									required
									placeholder="Choose a username"
									value={form.username}
									onChange={(e) => setForm({ ...form, username: e.target.value })}
									disabled={loading}
								/>
							</FormControl>
							<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
								This will be your portfolio URL (e.g., yoursite.com/username)
							</p>
						</FormField>

						<FormField>
							<FormLabel htmlFor="email">Email Address</FormLabel>
							<FormControl>
								<Input
									id="email"
									type="email"
									required
									placeholder="Enter your email"
									value={form.email}
									onChange={(e) => setForm({ ...form, email: e.target.value })}
									disabled={loading}
								/>
							</FormControl>
						</FormField>

						<FormField>
							<FormLabel htmlFor="password">Password</FormLabel>
							<FormControl>
								<Input
									id="password"
									type="password"
									required
									placeholder="Create a password"
									value={form.password}
									onChange={(e) => setForm({ ...form, password: e.target.value })}
									disabled={loading}
								/>
							</FormControl>
						</FormField>

						<Button
							type="submit"
							disabled={loading}
							className="w-full"
						>
							{loading ? "Creating Account..." : "Create Account"}
						</Button>
					</Form>

					<div className="mt-6 text-center">
						<p className="text-gray-600 dark:text-gray-400">
							Already have an account?{" "}
							<Link
								href="/auth/signin"
								className="text-black dark:text-white hover:text-black dark:text-white/80 font-medium"
							>
								Sign in
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
