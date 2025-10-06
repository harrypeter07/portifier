import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ButtonLink } from "./ButtonLink";
import { navigationData } from "../../data/navagationData";

export function Header() {
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
    const base = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const resolveHref = (href: string) => {
        if (href.startsWith("/#")) return `${base}${href.slice(1)}`; // "/#section" -> "/current#section"
        if (href.startsWith("#")) return `${base}${href}`;           // "#section" -> "/current#section"
        if (href === "/") return base || "/";                      // home -> current page
        return href;                                                  // external/absolute
    };
    return (
        <header className="header absolute left-0 right-0 top-0 z-50 ~h-32/48 ~px-4/6 ~py-4/6 md:h-32">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto,auto] items-center gap-6 md:grid-cols-[1fr,auto,1fr] px-4">
				{/* Logo removed as per user request */}
				<nav
					aria-label="Main"
                    className="col-span-full row-start-2 md:col-span-1 md:col-start-2 md:row-start-1"
				>
                    <ul className="flex flex-wrap gap-4 justify-center items-center sm:gap-6 md:gap-8">
                        {navigationData.navigation.map((item) => (
							<li key={item.text}>
                                <Link href={resolveHref(item.link)} className="text-sm font-semibold tracking-wide md:text-base">
									{item.text}
								</Link>
							</li>
						))}
					</ul>
				</nav>

                <div className="justify-self-end">
                    <ButtonLink href="/" icon="cart" color="purple" aria-label="Portfolio" className="font-semibold">
                        <span className="text-sm md:hidden">Go</span>
                        <span className="hidden text-sm md:inline">Portfolio</span>
					</ButtonLink>
				</div>
			</div>
		</header>
	);
}
