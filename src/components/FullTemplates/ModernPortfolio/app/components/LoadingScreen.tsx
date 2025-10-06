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
			<div className="mb-4 text-4xl font-bold animate-pulse">
				Loading Portfolio...
			</div>
			<div className="overflow-hidden relative mb-2 w-64 h-6 rounded-full bg-zinc-800">
				<div
					className="absolute top-0 left-0 h-full bg-gradient-to-r rounded-full transition-all duration-200 from-brand-purple to-brand-lime"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<div className="font-mono text-2xl tracking-widest animate-fade-in-up">
				{progress}%
			</div>
		</div>
	);
};

export default LoadingScreen;
