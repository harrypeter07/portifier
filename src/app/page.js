import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-xl w-full px-6 py-16 bg-white/90 dark:bg-gray-900/80 rounded-xl shadow-lg flex flex-col items-center gap-8">
				<h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 dark:text-blue-400 text-center">
					Portfolio Maker
				</h1>
				<p className="text-lg text-gray-700 dark:text-gray-200 text-center">
					Build and customize your developer portfolio in minutes. Choose a
					template, edit your content, and publish instantly.
				</p>
				<div className="flex gap-4 w-full justify-center">
					<Link
						href="/auth/signup"
						className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow transition"
					>
						Sign Up
					</Link>
					<Link
						href="/auth/signin"
						className="bg-white border border-blue-600 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold text-lg shadow transition"
					>
						Sign In
					</Link>
				</div>
			</div>
		</div>
	);
}
