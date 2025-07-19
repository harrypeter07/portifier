"use client";
import { useState } from "react";

// Mock selected layout (in real app, get from store or previous step)
const SELECTED_LAYOUT = {
  hero: "HeroA",
  showcase: "ShowcaseA",
  contact: "ContactFormA"
};

export default function CustomizePage() {
  const [content, setContent] = useState({
    hero: { title: "", subtitle: "" },
    showcase: { projects: "" },
    contact: { email: "" }
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  function handleChange(section, field, value) {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSuccess("");
    // TODO: Save to DB (call API)
    setTimeout(() => {
      setSaving(false);
      setSuccess("Saved! (Mock)");
    }, 1000);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-2xl font-bold mb-4">Customize Your Portfolio</h1>
      <form className="flex flex-col gap-6 w-full max-w-xl" onSubmit={e => { e.preventDefault(); handleSave(); }}>
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <div className="font-semibold mb-2">Hero Section ({SELECTED_LAYOUT.hero})</div>
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Title"
            value={content.hero.title}
            onChange={e => handleChange("hero", "title", e.target.value)}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Subtitle"
            value={content.hero.subtitle}
            onChange={e => handleChange("hero", "subtitle", e.target.value)}
          />
        </div>
        {/* Showcase Section */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <div className="font-semibold mb-2">Showcase ({SELECTED_LAYOUT.showcase})</div>
          <textarea
            className="border p-2 rounded w-full"
            placeholder="Projects (comma separated)"
            value={content.showcase.projects}
            onChange={e => handleChange("showcase", "projects", e.target.value)}
          />
        </div>
        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <div className="font-semibold mb-2">Contact ({SELECTED_LAYOUT.contact})</div>
          <input
            className="border p-2 rounded w-full"
            placeholder="Contact Email"
            value={content.contact.email}
            onChange={e => handleChange("contact", "email", e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {success && <div className="text-green-600">{success}</div>}
      </form>
    </div>
  );
} 