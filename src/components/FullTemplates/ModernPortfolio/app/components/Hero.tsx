"use client";
import React from "react";
import { Heading } from "./Heading";
import { ButtonLink } from "./ButtonLink";

import Image from "next/image";
import defaultImg from "../../public/default.png";
import texture from "../../public/bg-texture.webp";

const Hero = () => {
    return (
        <section
            className="overflow-hidden relative m-0 hero h-dvh text-zinc-800"
            style={{
                backgroundImage: `url(${texture})`,
                backgroundSize: "720px 460px",
                backgroundRepeat: "repeat",
                backgroundPosition: "center",
            }}
        >
			{/* Removed WideLogo and TallLogo background */}
            <div className="grid absolute inset-0 mx-auto mt-24 max-w-7xl grid-rows-[1fr,auto] place-items-end px-4 md:px-6 ~py-10/16 w-full h-full">
                <div className="flex flex-col-reverse gap-6 justify-between items-center w-full h-full lg:flex-row md:gap-8">
					<div className="flex flex-col flex-1 justify-center">
                        <Heading size="lg" className="relative place-self-start max-w-3xl leading-tight">
							Hi, I&apos;m{" "}
                            <span className="font-semibold text-brand-purple">Aryan Sharma</span>
							<br />
                            <span className="block mt-4 text-xl font-semibold md:text-2xl">
								Creative Developer & Designer
							</span>
						</Heading>
                        <div className="flex relative flex-col gap-3 justify-between items-center mt-6 w-full md:gap-4 lg:flex-row">
                            <div className="max-w-[55ch] font-medium text-base md:text-lg">
								<p>
									I craft interactive, visually engaging web experiences that
									blend code and creativity. Welcome to my portfolio!
								</p>
							</div>
							<ButtonLink
								href="#projects"
								icon="plus"
                                size="lg"
                                className="block z-20 mt-2 text-sm font-semibold md:text-base"
							>
								View Projects
							</ButtonLink>
						</div>
					</div>

					{/* Interactive Image Container (replaces 3D) */}
                    <div className="flex-1 w-full max-w-lg md:max-w-xl h-[260px] md:h-[300px] min-h-[200px] max-h-[350px] flex items-center justify-center relative z-30 overflow-hidden rounded-2xl">
						<div
							className="flex justify-center items-center w-full h-full transition-transform duration-300 cursor-pointer group"
							style={{ perspective: "1200px" }}
                        >
                            <Image
                                src={defaultImg}
                                alt="Showcase"
                                fill
                                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 560px"
                                className="object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105 bg-white/10"
                                style={{ willChange: "transform", objectPosition: "center center" }}
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
