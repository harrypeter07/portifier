"use client";
import React from "react";
import { Heading } from "./Heading";
import { ButtonLink } from "./ButtonLink";

import Image from "next/image";

const Hero = () => {
	return (
		<section className="hero relative h-dvh overflow-hidden text-zinc-800 m-0">
			{/* Removed WideLogo and TallLogo background */}
			<div className="grid absolute inset-0 mx-auto mt-24 max-w-6xl grid-rows-[1fr,auto] place-items-end px-6 ~py-10/16 w-full h-full">
				<div className="flex flex-col-reverse lg:flex-row w-full h-full items-center justify-between gap-8">
					<div className="flex-1 flex flex-col justify-center">
						<Heading size="lg" className="relative max-w-2xl place-self-start">
							Hi, I&apos;m{" "}
							<span className="text-brand-purple">Aryan Sharma</span>
							<br />
							<span className="mt-6 block text-2xl font-bold">
								Creative Developer & Designer
							</span>
						</Heading>
						<div className="relative flex flex-col w-full items-center justify-between ~gap-2/4 lg:flex-row mt-6">
							<div className="max-w-[45ch] font-semibold ~text-lg/xl">
								<p>
									I craft interactive, visually engaging web experiences that
									blend code and creativity. Welcome to my portfolio!
								</p>
							</div>
							<ButtonLink
								href="#projects"
								icon="plus"
								size="lg"
								className="z-20 mt-2 block"
							>
								View Projects
							</ButtonLink>
						</div>
					</div>

					{/* Interactive Image Container (replaces 3D) */}
					<div className="flex-1 w-full max-w-xl h-[300px] min-h-[200px] max-h-[350px] flex items-center justify-center relative z-30">
						<div
							className="group w-full h-full flex items-center justify-center cursor-pointer transition-transform duration-300"
							style={{ perspective: "1200px" }}
						>
							<Image
								src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
								alt="Showcase"
								width={600}
								height={350}
								className="rounded-2xl shadow-2xl object-cover w-full h-full max-h-[350px] max-w-xl transition-transform duration-500 group-hover:scale-105"
								style={{ willChange: "transform" }}
								priority
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
