'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Navbar = ({ data }: { data: any }) => {
  const personal = data?.personal || {};
  const contact = data?.contact || {};
  const social = data?.social || {};
  
  const fullName = personal.firstName && personal.lastName ? `${personal.firstName} ${personal.lastName}` : (personal.title || "Portfolio");
  
  // Create navigation links from data
  const navLinks = [
    { title: "About", link: "#about" },
    { title: "Skills", link: "#skills" },
    { title: "Projects", link: "#projects" },
    { title: "Contact", link: "#contact" }
  ];
  
  // Create social links from data
  const socials = [
    { name: "GitHub", link: social.github || "#", icon: "🐙" },
    { name: "LinkedIn", link: social.linkedin || "#", icon: "💼" },
    { name: "Twitter", link: social.twitter || "#", icon: "🐦" },
    { name: "Email", link: `mailto:${contact.email || "#"}`, icon: "📧" }
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001427] backdrop-blur-md z-50 px-10">
      {/* Navbar Container */}
      <div className="w-full h-full flex items-center justify-between m-auto px-[10px]">
        {/* Logo + Name */}
        <Link
          href="#about-me"
          className="flex items-center"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            draggable={false}
            className="cursor-pointer"
          />
          <div className="hidden md:flex md:selffont-bold ml-[10px] text-gray-300">{fullName}</div>
        </Link>

        {/* Web Navbar */}
        <div className="hidden md:flex w-[500px] h-full flex-row items-center justify-between md:mr-20">
          <div className="flex items-center justify-between w-full h-auto border-[rgba(112,66,248,0.38)] bg-[rgba(3,0,20,0.37)] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                className="cursor-pointer hover:text-[rgb(112,66,248)] transition"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Social Icons (Web) */}
        <div className="hidden flex-row gap-5 md:flex">
          {socials.map(({ link, name, icon }) => (
            <Link
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              key={name}
              className="text-2xl hover:text-[rgb(112,66,248)] transition"
            >
              {icon}
            </Link>
          ))}
        </div>

        {/* Hamburger Menu */}
        <button
          className="text-4xl text-white md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[65px] left-0 w-full bg-[#030014] p-5 flex flex-col items-center text-gray-300 md:hidden">
          {/* Links */}
          <div className="flex flex-col gap-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                className="cursor-pointer hover:text-[rgb(112,66,248)] transition text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 justify-center mt-6">
            {socials.map(({ link, name, icon }) => (
              <Link
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                key={name}
                className="text-3xl hover:text-[rgb(112,66,248)] transition"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};