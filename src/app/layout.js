import { Geist, Geist_Mono, Epilogue, Bungee } from "next/font/google";
import "./globals.css";
import "@/lib/devtools-fix"; // Fix React DevTools semver errors
import UnifiedNavbar from "@/components/common/UnifiedNavbar";
import FloatingSocialLinks from "@/components/FloatingSocialLinks";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next"
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const epilogue = Epilogue({
	variable: "--font-epilogue",
	subsets: ["latin"],
	display: "swap",
});

const bungee = Bungee({
	weight: "400",
	variable: "--font-bungee",
	subsets: ["latin"],
	display: "swap",
});

export const metadata = {
	title: "Portume | Portfolio Builder",
	description: "Create, customize, and publish beautiful developer portfolios.",
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
	applicationName: "Portume",
	authors: [{ name: "Harshal Pande" }, { name: "Hassan Mansuri" }],
	keywords: ["portfolio", "next.js", "templates", "resume", "developer"],
	icons: { icon: "/favicon.svg" },
	openGraph: {
		title: "Portume | Portfolio Builder",
		description: "Create, customize, and publish beautiful developer portfolios.",
		url: "/",
		siteName: "Portume",
		images: [
			{ url: "/og.png", width: 1200, height: 630, alt: "Portume" },
		],
		type: "website",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="dark" suppressHydrationWarning>
			<Analytics />
					
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${epilogue.variable} ${bungee.variable} font-bungee antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen`}
			>
				<ErrorBoundary>
					<UnifiedNavbar />
					<main className="min-h-screen app-main grainy-bg">{children}</main>
					<FloatingSocialLinks />
				</ErrorBoundary>
			</body>
		</html>
	);
}
