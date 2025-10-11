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

	// Typewriter heading
	const fullHeading = "Manage your resumes and portfolios";
	const [typed, setTyped] = useState("");
	useEffect(() => {
		let i = 0;
		const id = setInterval(() => {
			setTyped(fullHeading.slice(0, i + 1));
			i++;
			if (i >= fullHeading.length) clearInterval(id);
		}, 35);
		return () => clearInterval(id);
	}, []);

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
		<div className="flex justify-center items-center p-4 pt-32 min-h-screen grainy-bg">
			<div className="absolute top-24 left-1/2 px-4 text-center -translate-x-1/2">
				<h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
					{typed}
					<span className="inline-block w-[1ch] ml-1 align-baseline animate-pulse">|</span>
				</h1>
			</div>
			<Card className="w-full max-w-md border border-white/20 shadow-xl backdrop-blur-xl bg-white/10">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl font-bold text-white">
						Create Account
					</CardTitle>
					<CardDescription className="text-gray-300">
						Join us to build your amazing portfolio
					</CardDescription>
				</CardHeader>

				<CardContent>
					{success && (
						<div className="p-4 mb-6 bg-green-50 rounded-lg border border-green-200">
							<p className="text-sm text-green-700">{success}</p>
						</div>
					)}

					{error && (
						<div className="p-4 mb-6 bg-red-50 rounded-lg border border-red-200">
							<p className="text-sm text-red-700">{error}</p>
						</div>
					)}

					<Form onSubmit={handleSubmit} className="space-y-6">
					<FormField>
						<FormLabel htmlFor="name" className="text-gray-800">Full Name</FormLabel>
							<FormControl>
							<Input
									id="name"
									type="text"
									required
									placeholder="Enter your full name"
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									disabled={loading}
								className="text-black bg-white border-gray-300 placeholder:text-gray-500"
								/>
							</FormControl>
						</FormField>

					<FormField>
						<FormLabel htmlFor="username" className="text-gray-800">Username</FormLabel>
							<FormControl>
							<Input
									id="username"
									type="text"
									required
									placeholder="Choose a username"
									value={form.username}
									onChange={(e) => setForm({ ...form, username: e.target.value })}
									disabled={loading}
								className="text-black bg-white border-gray-300 placeholder:text-gray-500"
								/>
							</FormControl>
						<p className="mt-1 text-xs text-gray-600">
								This will be your portfolio URL (e.g., yoursite.com/username)
							</p>
						</FormField>

					<FormField>
						<FormLabel htmlFor="email" className="text-gray-800">Email Address</FormLabel>
							<FormControl>
							<Input
									id="email"
									type="email"
									required
									placeholder="Enter your email"
									value={form.email}
									onChange={(e) => setForm({ ...form, email: e.target.value })}
									disabled={loading}
								className="text-black bg-white border-gray-300 placeholder:text-gray-500"
								/>
							</FormControl>
						</FormField>

					<FormField>
						<FormLabel htmlFor="password" className="text-gray-800">Password</FormLabel>
							<FormControl>
							<Input
									id="password"
									type="password"
									required
									placeholder="Create a password"
									value={form.password}
									onChange={(e) => setForm({ ...form, password: e.target.value })}
									disabled={loading}
								className="text-black bg-white border-gray-300 placeholder:text-gray-500"
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
						<p className="text-gray-700">
							Already have an account?{" "}
							<Link
								href="/auth/signin"
								className="font-medium text-black hover:text-black/80"
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
