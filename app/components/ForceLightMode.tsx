"use client";

import { useEffect } from "react";

export default function ForceLightMode() {
  useEffect(() => {
    const root = document.documentElement;
    const prev = {
      dark: root.classList.contains("dark"),
      light: root.classList.contains("light"),
    };

    root.classList.remove("dark", "light");
    root.classList.add("light");

    return () => {
      try {
        const stored = localStorage.getItem("theme");
        const theme = stored === "light" ? "light" : "dark";
        root.classList.remove("dark", "light");
        root.classList.add(theme);
      } catch {
        root.classList.remove("dark", "light");
        if (prev.dark) {
          root.classList.add("dark");
        } else if (prev.light) {
          root.classList.add("light");
        } else {
          root.classList.add("dark");
        }
      }
    };
  }, []);

  return null;
}

