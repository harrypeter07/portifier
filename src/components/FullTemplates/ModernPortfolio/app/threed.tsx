"use client";
import React from "react";
import Spline from "@splinetool/react-spline/next";

const ThreeDSection = () => {
	return (
		<section className="flex items-center justify-center min-h-screen bg-white">
			<div className="w-full max-w-3xl h-[500px] flex items-center justify-center rounded-xl shadow-lg">
				<Spline
					scene="https://prod.spline.design/1sMgnGO94Nhv2WXz/scene.splinecode"
					style={{
						width: "100%",
						height: "100%",
						minWidth: 250,
						minHeight: 250,
						background: "transparent",
						zIndex: 10,
					}}
				/>
			</div>
		</section>
	);
};

export default ThreeDSection;
