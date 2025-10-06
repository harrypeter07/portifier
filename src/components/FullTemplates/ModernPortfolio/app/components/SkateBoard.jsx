"use client";
import React from "react";

import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "./CardEffect";
import { ButtonLink } from "./ButtonLink";
function Heading({
	as: Comp = "h1",
	className = "",
	children = "",
	size = "lg",
}) {
	return (
		<Comp
			className={[
				"font-sans uppercase",
				size === "xl" && "~text-4xl/8xl",
				size === "lg" && "~text-4xl/7xl",
				size === "md" && "~text-3xl/5xl",
				size === "sm" && "~text-2xl/4xl",
				size === "xs" && "~text-lg/xl",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			{children}
		</Comp>
	);
}

const ProjectCard = ({ title, image, description, link }) => {
	return (
		<div className="group relative mx-auto w-full max-w-md px-6 py-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-white/95">
			<div className="flex flex-col items-center gap-3">
				<CardContainer
					containerClassName="w-full flex justify-center"
					className=""
				>
					<CardBody className="w-full flex justify-center">
						<CardItem translateZ={60}>
							<img
								src={image}
								alt={title}
								width={280}
								height={160}
								className="rounded-xl object-cover shadow group-hover:shadow-lg transition-shadow duration-300 w-full h-40"
							/>
						</CardItem>
					</CardBody>
				</CardContainer>
				<Heading
					as="h3"
					size="xs"
					className="text-center text-brand-purple font-bold mt-2 mb-1"
				>
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="cursor-pointer underline underline-offset-4 hover:text-brand-purple transition-colors duration-200"
					>
						{title}
					</a>
				</Heading>
				<p className="text-center text-xs text-zinc-700 font-medium mb-3 px-1 leading-relaxed line-clamp-3">
					{description}
				</p>
				<a
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					className="block bg-brand-purple hover:bg-brand-purple/80 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 text-xs font-medium"
				>
					View Project
				</a>
			</div>
		</div>
	);
};

export default ProjectCard;
