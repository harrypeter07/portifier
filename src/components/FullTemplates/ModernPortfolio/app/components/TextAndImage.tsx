import React from "react";
import clsx from "clsx";
import { Heading } from "./Heading";
import { ButtonLink } from "./ButtonLink";
import { ParallaxImage } from "./ParallaxImage";

interface TextAndImageProps {
	theme?: "lime" | "blue" | "orange" | "navy";
	variation?: "left" | "right";
	heading?: string;
	text?: string;
	buttonText?: string;
	buttonLink?: string;
	imageForeground?: string;
	imageBackground?: string;
}

const TextAndImage = ({
	theme = "lime",
	variation = "left",
	heading = "TEXT",
	text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, enim?",
	buttonText = "Buy Now !",
	buttonLink = "/",
	imageForeground = "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
	imageBackground = "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
}: TextAndImageProps) => {
	const sectionClasses = clsx("bg-texture text-white p-8", {
		"bg-brand-blue": theme === "blue",
		"bg-brand-orange": theme === "orange",
		"bg-brand-lime": theme === "lime",
		"bg-brand-navy": theme === "navy",
	});

	return (
		<section className={`${sectionClasses} scroll-smooth`}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:gap-24 scroll-smooth">
				<div
					className={clsx(
						"flex flex-col items-center gap-8 text-center md:items-start md:text-left",
						{ "md:order-2": variation === "right" }
					)}
				>
					<Heading as="h2" size="lg">
						{heading}
					</Heading>
					<div className="body max-w-md text-lg leading-relaxed">{text}</div>
					<ButtonLink
						color={theme === "lime" ? "orange" : "lime"}
						href={buttonLink}
					>
						{buttonText}
					</ButtonLink>
				</div>
				<ParallaxImage
					foregroundImage={imageForeground}
					backgroundImage={imageBackground}
				/>
			</div>
		</section>
	);
};

export default TextAndImage;
