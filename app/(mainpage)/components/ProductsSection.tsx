
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function ProductsSection() {
  return (
    <section>
      <h2 className="mb-10 text-3xl font-semibold text-[rgb(var(--foreground))]">
        Products
      </h2>

      <div className="space-y-6">

        {/* MoldPredict - existing product */}
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Link href="/moldpredict" className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm transition-shadow hover:shadow-lg">
              <div className="relative flex flex-col items-start gap-8 p-8 md:flex-row md:items-center md:p-10">

                {/* MoldPredict Logo */}
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gray-900 transition-transform group-hover:scale-105">
                  <Image
                    src="/logos/MoldPredict Logo.jpeg"
                    alt="MoldPredict Logo"
                    width={96}
                    height={96}
                    className="rounded-lg object-contain"
                  />
                </div>

                {/* MoldPredict Information */}
                <div className="flex-1">
                  <h3 className="mb-2 text-2xl font-semibold text-[rgb(var(--foreground))]">
                    MoldPredict
                    <span className="ml-1 text-xs text-gray-500">
                      ™
                    </span>
                  </h3>

                  <p className="max-w-2xl text-[rgb(var(--foreground))]/70">
                    Predict mold overhauls, maintenance timing,
                    and expected costs using real production data
                    and cycle behavior.
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 font-medium text-blue-500">
                    Explore product
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </Link>
        </motion.div>

        {/* GEMLA Finance - new product */}
        <motion.div
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Link href="/gemla-finance" className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] shadow-sm transition-shadow hover:shadow-lg">
              <div className="relative flex flex-col items-start gap-8 p-8 md:flex-row md:items-center md:p-10">

                {/* GEMLA Finance Logo */}
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-white transition-transform group-hover:scale-105">
                  <Image
                    src="/logos/GEMLA Finance.png"
                    alt="GEMLA Finance Logo"
                    width={96}
                    height={96}
                    className="rounded-lg object-contain"
                  />
                </div>

                {/* GEMLA Finance Information */}
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-semibold text-[rgb(var(--foreground))]">
                      GEMLA Finance
                    </h3>
                  </div>

                  <p className="max-w-2xl text-[rgb(var(--foreground))]/70">
                    Explore market predictions, evolving price
                    trajectories, and forecast bands powered by
                    GEMLA Finance. View publicly available ticker
                    predictions and projected market paths.
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 font-medium text-blue-500">
                    Explore product
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
