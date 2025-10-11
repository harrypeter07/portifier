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

function shortTwoSentences(text = "") {
  try {
    const parts = text.split(".").filter(Boolean);
    return parts.slice(0, 2).join(". ") + (parts.length > 2 ? "..." : ".");
  } catch { return text; }
}

const ProjectCard = ({ title, image, description, link }) => {
	return (
		<div className="max-h-[20vh] lative px-6 py-6 mx-auto w-full max-w-md rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 h-group bg-white/90 hover:shadow-2xl hover:bg-white/95">
			<div className="flex flex-col gap-3 items-center">
				<CardContainer
					containerClassName="w-full flex justify-center"
					className=""
				>
					<CardBody className="flex justify-center w-full">
						<CardItem translateZ={60}>
							<img
								src={image}
								alt={title}
								width={280}
								height={160}
								className="object-cover w-full h-40 rounded-xl shadow transition-shadow duration-300 group-hover:shadow-lg"
							/>
						</CardItem>
					</CardBody>
				</CardContainer>
				<Heading
					as="h3"
					size="xs"
					className="mt-2 mb-1 font-bold text-center text-brand-purple"
				>
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="underline transition-colors duration-200 cursor-pointer underline-offset-4 hover:text-brand-purple"
					>
						{title}
					</a>
				</Heading>
        <p className="px-1 mb-3 text-xs font-medium leading-relaxed text-center text-zinc-700 line-clamp-3" title={description}>
          {shortTwoSentences(description)}
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
