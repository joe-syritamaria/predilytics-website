"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DarkModeToggle from "@/app/(mainpage)/components/DarkModeToggle";

type MenuKey = "products" | "resources" | null;

export default function MarketingHeader() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuKey>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleMenu = (menu: Exclude<MenuKey, null>) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const closeMenus = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const toggleMobileSection = (section: Exclude<MenuKey, null>) => {
    setMobileSection((current) => (current === section ? null : section));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 backdrop-blur">
      <div ref={headerRef} className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-blue-700 outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          Predilytics
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[rgb(var(--foreground))]/85 md:flex">
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu === "products"}
              aria-controls="products-menu"
              onClick={() => toggleMenu("products")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleMenu("products");
                }
              }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[rgb(var(--background))] hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              Products
              <span className="text-xs">v</span>
            </button>
            {openMenu === "products" && (
              <div
                id="products-menu"
                role="menu"
                className="absolute left-0 mt-2 w-56 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-2 shadow-lg"
              >
                <Link
                  href="/moldpredict"
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-[rgb(var(--foreground))] transition hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={closeMenus}
                >
                  MoldPredict
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu === "resources"}
              aria-controls="resources-menu"
              onClick={() => toggleMenu("resources")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleMenu("resources");
                }
              }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[rgb(var(--background))] hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              Resources
              <span className="text-xs">v</span>
            </button>
            {openMenu === "resources" && (
              <div
                id="resources-menu"
                role="menu"
                className="absolute left-0 mt-2 w-60 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-2 shadow-lg"
              >
                <Link
                  href="/moldpredict/ticket"
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-[rgb(var(--foreground))] transition hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={closeMenus}
                >
                  Support
                </Link>
                <Link
                  href="/tutorials"
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-[rgb(var(--foreground))] transition hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={closeMenus}
                >
                  Tutorials
                </Link>
                <Link
                  href="/whitepapers"
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-[rgb(var(--foreground))] transition hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={closeMenus}
                >
                  White Papers
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/pricing"
            className="rounded-full px-3 py-2 transition hover:bg-[rgb(var(--background))] hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="marketing-mobile-nav"
            onClick={() => setMobileOpen((current) => !current)}
            className="rounded-full border border-[rgb(var(--border))] px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300 md:hidden"
          >
            Menu
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="marketing-mobile-nav" className="border-t border-[rgb(var(--border))] bg-[rgb(var(--card))] px-6 py-4 md:hidden">
          <div className="space-y-3 text-sm font-medium text-[rgb(var(--foreground))]/90">
            <button
              type="button"
              aria-expanded={mobileSection === "products"}
              onClick={() => toggleMobileSection("products")}
              className="flex w-full items-center justify-between rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-left focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              Products
              <span className="text-xs">v</span>
            </button>
            {mobileSection === "products" && (
              <div className="ml-3 space-y-2">
                <Link
                  href="/moldpredict"
                  className="block rounded-lg px-3 py-2 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={closeMenus}
                >
                  MoldPredict
                </Link>
              </div>
            )}

            <button
              type="button"
              aria-expanded={mobileSection === "resources"}
              onClick={() => toggleMobileSection("resources")}
              className="flex w-full items-center justify-between rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-left focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              Resources
              <span className="text-xs">v</span>
            </button>
            {mobileSection === "resources" && (
              <div className="ml-3 space-y-2">
                <Link
                  href="/moldpredict/ticket"
                  className="block rounded-lg px-3 py-2 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={closeMenus}
                >
                  Support
                </Link>
                <Link
                  href="/tutorials"
                  className="block rounded-lg px-3 py-2 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={closeMenus}
                >
                  Tutorials
                </Link>
                <Link
                  href="/whitepapers"
                  className="block rounded-lg px-3 py-2 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
                  onClick={closeMenus}
                >
                  White Papers
                </Link>
              </div>
            )}

            <Link
              href="/pricing"
              className="block rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--input))] focus-visible:ring-2 focus-visible:ring-blue-300"
              onClick={closeMenus}
            >
              Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

