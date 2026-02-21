"use client";

import { useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return !document.documentElement.classList.contains("light");
  });

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !dark;

    root.classList.remove("light", "dark");
    root.classList.add(nextDark ? "dark" : "light");
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-3 py-2 text-sm font-medium text-[rgb(var(--foreground))] transition hover:bg-[rgb(var(--input))]"
      aria-label="Toggle theme"
      type="button"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
