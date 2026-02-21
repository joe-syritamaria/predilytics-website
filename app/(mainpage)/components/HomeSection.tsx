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
          Predictive maintenance analytics
        </span>

        <h1 className="text-4xl font-semibold text-[rgb(var(--foreground))] mb-6 leading-tight">
          Predict mold maintenance
          <br />
          before downtime hits
        </h1>

        <p className="text-lg text-gray-600 mb-4">
          Predilytics helps manufacturing teams forecast mold risk, schedule
          maintenance, and avoid unplanned downtime with data-driven insights.
        </p>

        <p className="text-gray-500">
          See risk, cost, and timing in one place so your team can act with
          confidence and stay ahead of production disruptions.
        </p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0 },
        }}
        className="w-full h-72 rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--input))] to-[rgb(var(--card))] shadow-sm flex items-center justify-center text-gray-400 text-sm"
      >
                <img
          src="/images/HeroImage.png"
          alt="Hero illustration"
          className="w-full h-full object-cover rounded-2xl"
        />

      </motion.div>
    </motion.div>
  );
}

