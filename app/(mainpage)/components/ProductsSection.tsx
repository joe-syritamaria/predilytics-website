"use client";

import { motion } from "framer-motion";

export function ProductsSection() {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-900 mb-10">
        Products
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-md"
        >
          <h3 className="text-xl font-semibold mb-3 text-gray-900">
            MoldPredict™
          </h3>

          <p className="text-gray-600 mb-6">
            Predict mold overhauls, maintenance timing, and expected costs using
            real production data and cycle behavior.
          </p>

          <div className="h-32 mb-6 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-gray-400 text-sm">
            Product visualization placeholder
          </div>

          <a
            href="/moldpredict"
            className="text-blue-700 font-medium hover:underline"
          >
            Learn more →
          </a>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 opacity-80"
        >
          <h3 className="text-xl font-semibold mb-3 text-gray-900">
            XYZ
          </h3>

          <p className="text-gray-600 mb-6">
            A future predictive analytics solution currently in development.
          </p>

          <div className="h-32 mb-6 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
            Coming soon
          </div>

          <span className="text-gray-400 font-medium">
            Learn more →
          </span>
        </motion.div>
      </div>
    </div>
  );
}
