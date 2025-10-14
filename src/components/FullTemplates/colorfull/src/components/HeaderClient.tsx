"use client";
import React from "react";
import NavBar from "./Navbar";
import { getRuntimeData } from "../lib/runtimeStore";

export default function HeaderClient() {
  const rt = getRuntimeData();
  const settings = rt.settings || {
    name: "Portfolio",
    nav_item: [],
    cta_link: { link_type: "Web", url: "#contact" },
    cta_label: "Contact",
  };
  return (
    <header className="top-0 z-50 mx-auto max-w-7xl md:sticky md:top-4">
      <NavBar settings={settings as any} />
    </header>
  );
}


