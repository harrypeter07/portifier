"use client";
import React, { useEffect, useState } from "react";

const LoadingScreen = () => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let frame: number;
		if (progress < 100) {
			frame = window.setTimeout(() => setProgress(progress + 1), 12);
		}
		return () => window.clearTimeout(frame);
	}, [progress]);

	return (
		<div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-900 text-white transition-opacity duration-700">
			<div className="text-4xl font-bold mb-4 animate-pulse">
				Loading Portfolio...
			</div>
			<div className="relative w-64 h-6 bg-zinc-800 rounded-full overflow-hidden mb-2">
				<div
					className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-purple to-brand-lime rounded-full transition-all duration-200"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<div className="text-2xl font-mono tracking-widest animate-fade-in-up">
				{progress}%
			</div>
		</div>
	);
};

export default LoadingScreen;
