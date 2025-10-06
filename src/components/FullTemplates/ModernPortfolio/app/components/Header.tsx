import Link from "next/link";
import React from "react";
import { ButtonLink } from "./ButtonLink";
import { navigationData } from "../../data/navagationData";

export function Header() {
	return (
        <header className="header absolute left-0 right-0 top-0 z-50 ~h-32/48 ~px-4/6 ~py-4/6 md:h-32">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto,auto] items-center gap-6 md:grid-cols-[1fr,auto,1fr] px-4">
				{/* Logo removed as per user request */}
				<nav
					aria-label="Main"
                    className="col-span-full row-start-2 md:col-span-1 md:col-start-2 md:row-start-1"
				>
                    <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
						{navigationData.navigation.map((item) => (
							<li key={item.text}>
                                <Link href={item.link} className="text-sm md:text-base font-semibold tracking-wide">
									{item.text}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div className="justify-self-end">
                    <ButtonLink href="/" icon="cart" color="purple" aria-label="Cart (1)" className="font-semibold">
                        <span className="md:hidden text-sm">1</span>
                        <span className="hidden md:inline text-sm">Cart (1)</span>
					</ButtonLink>
				</div>
			</div>
		</header>
	);
}
