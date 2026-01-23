"use client";

import { motion } from "framer-motion";

type SidebarProps = {
  active: string;
  setActive: (value: string) => void;
  showLogo?: boolean;
};

export function PredilyticsSidebar({ active, setActive, showLogo = false }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen px-6 py-8">
      <motion.div
        className="text-2xl font-semibold text-blue-700 mb-12"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: showLogo ? 0 : -50, opacity: showLogo ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        Predilytics
      </motion.div>

      <nav className="space-y-2">
        {["home", "products", "contact"].map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
              active === item
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-blue-50/70 hover:text-blue-700"
            }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>
    </aside>
  );
}
