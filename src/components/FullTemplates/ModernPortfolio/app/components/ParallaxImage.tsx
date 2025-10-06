"use client";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect } from "react";
import { useRef } from "react";

type Props = {
	foregroundImage?: string;
	backgroundImage?: string;
	className?: string;
};

export function ParallaxImage({
	foregroundImage = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
	backgroundImage = "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
	className,
}: Props) {
	const backgroundImageRef = useRef<HTMLDivElement>(null);
	const foregroundImageRef = useRef<HTMLDivElement>(null);

	const targetPosition = useRef({ x: 0, y: 0 });
	const currentPosition = useRef({ x: 0, y: 0 });
	useEffect(() => {
		const frameId = requestAnimationFrame(animationFrame);
		window.addEventListener("mousemove", onMouseMove);

		function onMouseMove(event: MouseEvent) {
			const { innerWidth, innerHeight } = window;
			const xPercent = (event.clientX / innerWidth - 0.5) * 2; //rnage -1 to 1
			const yPercent = (event.clientY / innerHeight - 0.5) * 2; //rnage -1 to 1

			// console.log(xPercent, yPercent)
			targetPosition.current = { x: xPercent * -20, y: yPercent * -20 };
		}

		function animationFrame() {
			const { x: targetX, y: targetY } = targetPosition.current;
			const { x: currentX, y: currentY } = currentPosition.current;

			const newX = currentX + (targetX - currentX) * 0.1;
			const newY = currentY + (targetY - currentY) * 0.1;
			currentPosition.current = { x: newX, y: newY };

			if (backgroundImageRef.current) {
				backgroundImageRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
			}
			if (foregroundImageRef.current) {
				foregroundImageRef.current.style.transform = `translate(${
					newX * 3
				}px, ${newY * 3}px)`;
			}
			requestAnimationFrame(animationFrame);
		}

		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			cancelAnimationFrame(frameId);
		};
	}, []);

	return (
		<div className={clsx("grid grid-cols-1 place-items-center", className)}>
			<div
				ref={backgroundImageRef}
				className="backgroundImage  col-start-1 row-start-1 transition-transform"
			>
				<Image src={backgroundImage} height={500} width={500} alt="bg-image" />
			</div>
			<div
				ref={foregroundImageRef}
				className="foreGroundImage col-start-1 row-start-1 transition-transform h-full w-full place-items-center"
			>
				<Image src={foregroundImage} height={450} width={450} alt="bg-image" />
			</div>
		</div>
	);
}
