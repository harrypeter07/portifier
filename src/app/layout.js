import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UnifiedNavbar from "@/components/common/UnifiedNavbar";
import ErrorBoundary from "@/components/ErrorBoundary";
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
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
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-black dark:text-white min-h-screen grainy-bg`}
			>
				<ErrorBoundary>
					<UnifiedNavbar />
					
 

				<main className="min-h-screen grainy-bg">{children}</main>
				</ErrorBoundary>
			</body>
		</html>
	);
}
