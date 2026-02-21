"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function ProductsSection() {
  return (
    <section>
      <h2 className="text-3xl font-semibold text-[rgb(var(--foreground))] mb-10">
        Products
      </h2>

      <motion.a
        href="https://predilyticsinc.com/moldpredict"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm hover:shadow-lg transition-shadow">
          {/* subtle gradient accent */}
          <div className="absolute inset-0 bg-linear-to-r from-[rgb(var(--input))] via-[rgb(var(--card))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative flex items-center gap-8 p-8 md:p-10">
            {/* Logo */}
            <div className="shrink-0 h-28 w-28 rounded-2xl bg-gray-900 flex items-center justify-center
                            transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logos/MoldPredict Logo.jpeg"
                alt="MoldPredict logo"
                width={96}
                height={96}
                className="object-contain rounded-lg"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-semibold text-[rgb(var(--foreground))]">
                  MoldPredict
                </h3>
                <span className="text-xs font-medium text-gray-500">
                  ™
                </span>
              </div>

              <p className="text-gray-600 max-w-2xl">
                Predict mold overhauls, maintenance timing, and expected costs
                using real production data and cycle behavior.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-blue-700 font-medium">
                <span>Explore product</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.a>
    </section>
  );
}

