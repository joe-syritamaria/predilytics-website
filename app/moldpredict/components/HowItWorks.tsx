"use client";

import { motion } from "framer-motion";

interface HowItWorksProps {
  onClose: () => void;
}

const screens = [
  {
    title: "Dashboard",
    desc: "See your current mold predictions, status, and upcoming tasks in one place.",
    img: "/placeholder-dashboard.png",
  },
  {
    title: "Prediction Input",
    desc: "Enter mold data, plastic type, and process parameters to get predictions.",
    img: "/placeholder-input.png",
  },
  {
    title: "Results",
    desc: "Visualize predicted mold performance and expected costs.",
    img: "/placeholder-results.png",
  },
  {
    title: "Reports",
    desc: "Download reports or share with your team directly from the app.",
    img: "/placeholder-reports.png",
  },
];

export default function HowItWorks({ onClose }: HowItWorksProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start overflow-y-auto py-20">
      <div className="bg-blue-50 rounded-3xl max-w-6xl w-full mx-4 p-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-blue-700">
            How Predilytics Works
          </h1>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-blue-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Screens */}
        {screens.map((screen, i) => (
          <motion.div
            key={screen.title}
            className={`flex flex-col md:flex-row items-center gap-10 mb-16 ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Image */}
            <div className="md:w-1/2">
              <div className="aspect-video bg-white border rounded-2xl shadow-lg flex items-center justify-center text-gray-400">
                {screen.title} screen placeholder
              </div>
            </div>

            {/* Text */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-4">
                {screen.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {screen.desc}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
