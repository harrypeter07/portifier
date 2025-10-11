import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";

import { Footer } from "../components/main/footer";
import { Navbar } from "../components/main/navbar";
import { StarsCanvas } from "../components/main/star-background";

import "./globals.css";
import React from "react";

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = {
  title: "Spacefolio Portfolio",
  description: "A modern portfolio template",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className="bg-[#030014] overflow-y-scroll overflow-x-hidden"
      >
        <StarsCanvas />
        <Navbar data={{}} />
        {children}
        <Footer data={{}} />
      </body>
    </html>
  );
}
