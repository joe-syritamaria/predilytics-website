"use client";

import { motion } from "framer-motion";

export function HomeSection() {
  return (
    <motion.div
      className="grid md:grid-cols-2 gap-14 items-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <span className="inline-block mb-4 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
          Predictive analytics platform
        </span>

        <h1 className="text-4xl font-semibold text-gray-900 mb-6 leading-tight">
          Smarter decisions
          <br />
          powered by predictive insight
        </h1>

        <p className="text-lg text-gray-600 mb-4">
          Predilytics builds intelligent analytics tools that help manufacturers
          anticipate repairs, manage risk, and optimize performance.
        </p>

        <p className="text-gray-500">
          Our products transform operational data into forward-looking insight,
          enabling teams to act with confidence instead of waiting to react.
        </p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        className="w-full h-72 rounded-2xl bg-linear-to-br from-blue-50 to-white border border-blue-100 shadow-sm flex items-center justify-center text-gray-400 text-sm"
      >
        Abstract analytics visualization/image
      </motion.div>
    </motion.div>
  );
}
