"use client";

import { useState } from "react";
import { useActiveSection } from "../../hooks/useActiveSection";
import DarkModeToggle from "@/app/(mainpage)/components/DarkModeToggle";

const navItems = [
  { label: "Download", sectionId: "hero" },
  { label: "Product", sectionId: "problem" },
  { label: "Pricing", sectionId: "pricing" },
  { label: "Help", sectionId: "help" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection(navItems.map((item) => item.sectionId));

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false); // close mobile menu
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-[rgb(var(--card))] border-b px-4 py-3 md:hidden">
        <span className="font-semibold text-blue-700 dark:text-white">Predilytics</span>
        <button onClick={() => setOpen(!open)} className="text-blue-600 font-medium">
          Menu
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[rgb(var(--card))] border-r p-6 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-xl font-bold text-blue-700 dark:text-white text-right pr-4">
            MoldPredict™
          </h1>
        </div>

        {/* Nav */}
        <nav className="space-y-6 text-right pr-4">
          {navItems.map((item) => {
            const isActive = activeSection === item.sectionId;

            return (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.sectionId)}
                className={`relative block w-full text-right transition
                  ${isActive ? "text-blue-700 font-semibold" : "text-gray-500 hover:text-blue-600"}
                `}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-md"></span>
                )}
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-6 flex justify-end pr-4">
          <DarkModeToggle />
        </div>
      </aside>
    </>
  );
}


