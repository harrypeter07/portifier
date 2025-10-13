import React from "react";
import { getSettingsData } from "@/lib/data";
import NavBar from "./Navbar";

export default async function Header() {
  const settings = await getSettingsData();
  return (
    <header className="top-0 z-50 mx-auto max-w-7xl md:sticky md:top-4">
      <NavBar settings={settings} />
    </header>
  );
}
