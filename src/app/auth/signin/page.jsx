"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signin() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [verifiedMsg, setVerifiedMsg] = useState("");
	const router = useRouter();

	// Check if user is already logged in
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
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl font-bold">
						Welcome Back
					</CardTitle>
					<CardDescription>
						Sign in to access your portfolio
					</CardDescription>
				</CardHeader>

				<CardContent>
					{verifiedMsg && (
						<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
							<p className="text-green-700 text-sm">{verifiedMsg}</p>
						</div>
					)}

					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-700 text-sm">{error}</p>
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
								Email Address
							</label>
							<Input
								id="email"
								required
								type="email"
								placeholder="Enter your email"
								value={form.email}
								onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
								disabled={loading}
							/>
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
								Password
							</label>
							<div className="relative">
								<Input
									id="password"
									required
									type={showPassword ? "text" : "password"}
									placeholder="Enter your password"
									value={form.password}
									onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
									disabled={loading}
									className="pr-10"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									<svg className="w-5 h-5 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										{showPassword ? (
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
										) : (
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										)}
									</svg>
								</button>
							</div>
						</div>



						{/* Submit Button */}
						<Button
							type="submit"
							disabled={loading}
							className="w-full"
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-3"></div>
									Signing In...
								</div>
							) : (
								"Sign In"
							)}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-muted-foreground">
							Don't have an account?{" "}
							<Link
								href="/auth/signup"
								className="text-primary hover:text-primary/80 font-medium"
							>
								Sign up
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
