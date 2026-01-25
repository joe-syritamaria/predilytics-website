"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
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
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur">
      <div ref={headerRef} className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold text-blue-700">
          Predilytics
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <div className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu === "products"}
              aria-controls="products-menu"
              onClick={() => toggleMenu("products")}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
            >
              Products
              <span className="text-xs">v</span>
            </button>
            {openMenu === "products" && (
              <div
                id="products-menu"
                role="menu"
                className="absolute left-0 mt-2 w-56 rounded-xl border border-blue-100 bg-white p-2 shadow-lg"
              >
                <Link
                  href="/moldpredict"
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-blue-50"
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
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
            >
              Resources
              <span className="text-xs">v</span>
            </button>
            {openMenu === "resources" && (
              <div
                id="resources-menu"
                role="menu"
                className="absolute left-0 mt-2 w-60 rounded-xl border border-blue-100 bg-white p-2 shadow-lg"
              >
                <Link
                  href="/moldpredict/ticket"
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-blue-50"
                  onClick={closeMenus}
                >
                  Support
                </Link>
                <Link
                  href="/tutorials"
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-blue-50"
                  onClick={closeMenus}
                >
                  Tutorials
                </Link>
                <Link
                  href="/whitepapers"
                  role="menuitem"
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-blue-50"
                  onClick={closeMenus}
                >
                  White Papers
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/pricing"
            className="rounded-full px-3 py-2 transition hover:bg-blue-50 hover:text-blue-700"
          >
            Pricing
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-full border border-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 md:hidden"
        >
          Menu
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-blue-100 bg-white px-6 py-4 md:hidden">
          <div className="space-y-3 text-sm font-medium text-slate-700">
            <button
              type="button"
              aria-expanded={mobileSection === "products"}
              onClick={() => toggleMobileSection("products")}
              className="flex w-full items-center justify-between rounded-lg border border-blue-100 px-3 py-2 text-left"
            >
              Products
              <span className="text-xs">v</span>
            </button>
            {mobileSection === "products" && (
              <div className="ml-3 space-y-2">
                <Link
                  href="/moldpredict"
                  className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-blue-50"
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
              className="flex w-full items-center justify-between rounded-lg border border-blue-100 px-3 py-2 text-left"
            >
              Resources
              <span className="text-xs">v</span>
            </button>
            {mobileSection === "resources" && (
              <div className="ml-3 space-y-2">
                <Link
                  href="/moldpredict/ticket"
                  className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-blue-50"
                  onClick={closeMenus}
                >
                  Support
                </Link>
                <Link
                  href="/tutorials"
                  className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-blue-50"
                  onClick={closeMenus}
                >
                  Tutorials
                </Link>
                <Link
                  href="/whitepapers"
                  className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-blue-50"
                  onClick={closeMenus}
                >
                  White Papers
                </Link>
              </div>
            )}

            <Link
              href="/pricing"
              className="block rounded-lg border border-blue-100 px-3 py-2 text-slate-700 hover:bg-blue-50"
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
