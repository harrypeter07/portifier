"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PortfolioRedirectPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function redirectToUserPortfolio() {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				
				if (res.ok && data.user?.username) {
					console.log("🔄 [PORTFOLIO] Redirecting to user portfolio:", data.user.username);
					router.push(`/portfolio/${data.user.username}`);
				} else {
					console.error("❌ [PORTFOLIO] No username found, redirecting to dashboard");
					router.push("/dashboard");
				}
			} catch (error) {
				console.error("❌ [PORTFOLIO] Failed to get user data, redirecting to dashboard:", error);
				router.push("/dashboard");
			}
		}

		redirectToUserPortfolio();
	}, [router]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
				<p className="text-gray-600 dark:text-gray-300">Redirecting to your portfolio...</p>
			</div>
		</div>
	);
}
