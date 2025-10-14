import clsx from "clsx";
import React from "react";
import Link from "next/link";
import Bounded from "./Bounded";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { getSettingsData } from "../lib/data";

export default async function Footer() {
  const settings = await getSettingsData();
  return (
    <Bounded as="footer" className="text-slate-600">
      <div className="container flex flex-col gap-6 justify-between items-center py-8 mx-auto mt-20 sm:flex-row">
        <div className="flex flex-col gap-y-2 gap-x-4 justify-center items-center name sm:flex-row sm:justify-self-start">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tighter transition-colors duration-150 text-slate-100 hover:text-yellow-400"
          >
            {settings.name}
          </Link>
          <span
            className="hidden text-5xl font-extralight leading-[0] text-slate-400 sm:inline"
            aria-hidden={true}
          >
            /
          </span>
          <p className="text-sm text-slate-300">
            © {new Date().getFullYear()} {settings.name}
          </p>
        </div>
        <nav className="navigation" aria-label="Footer Navigation">
          <ul className="flex gap-1 items-center">
            {settings.nav_item.map(({ link, label }, index) => (
              <React.Fragment key={label}>
                <li>
                  <Link
                    className={clsx(
                      "block overflow-hidden relative px-3 py-1 text-base font-bold rounded transition-colors duration-150 group text-slate-100 hover:hover:text-yellow-400",
                    )}
                    href={link.url}
                  >
                    {label}
                  </Link>
                </li>
                {index < settings.nav_item.length - 1 && (
                  <span
                    className="text-4xl font-thin leading-[0] text-slate-400"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>
        <div className="inline-flex justify-center socials sm:justify-end">
          <Link
            href={settings.github_link.url}
            className="p-2 text-2xl transition-all duration-150 text-slate-300 hover:scale-125 hover:text-yellow-400"
            aria-label={settings.name + " on GitHub"}
          >
            <FaGithub />
          </Link>
          <Link
            href={settings.twitter_link.url}
            className="p-2 text-2xl transition-all duration-150 text-slate-300 hover:scale-125 hover:text-yellow-400"
            aria-label={settings.name + " on Twitter"}
          >
            <FaTwitter />
          </Link>
          <Link
            href={settings.linkdin_link.url}
            className="p-2 text-2xl transition-all duration-150 text-slate-300 hover:scale-125 hover:text-yellow-400"
            aria-label={settings.name + " on LinkedIn"}
          >
            <FaLinkedin/>
          </Link>
          <Link
            href={settings.intagram_link.url}
            className="p-2 text-2xl transition-all duration-150 text-slate-300 hover:scale-125 hover:text-yellow-400"
            aria-label={settings.name + " on Instagram"}
          >
            <FaInstagram />
          </Link>
        </div>
      </div>
    </Bounded>
  );
}
