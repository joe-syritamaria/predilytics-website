"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HowItWorksProps {
  onClose: () => void;
}

interface Screen {
  title: string;
  desc: string;
  imgType: "video" | "image";
  imgSrc?: string;
}

const screens: Screen[] = [
  {
    title: "Input",
    desc: "Provide your mold data, plastic type, and process parameters to generate predictions.",
    imgType: "video",
  },
  {
    title: "Output",
    desc: "View the predicted days to overhaul, expected costs, risk metrics, and more.",
    imgType: "image",
    imgSrc: "/images/OutputExplanation.png",
  },
];

export default function HowItWorks({ onClose }: HowItWorksProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start overflow-y-auto py-20">
      <div className="bg-blue-50 rounded-3xl max-w-4xl w-full mx-4 p-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-center items-center mb-12 relative">
          <h1 className="text-4xl font-bold text-blue-700 text-center w-full">
            How MoldPredict™ Works
          </h1>

          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-blue-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Screens */}
        {screens.map((screen) => (
          <motion.div
            key={screen.title}
            className="flex flex-col items-center gap-6 mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Title & Text */}
            <div className="text-center max-w-2xl">
              <h2 className="text-3xl font-semibold text-blue-700 mb-4">
                {screen.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {screen.desc}
              </p>
            </div>

            {/* Media */}
            <div className="w-full max-w-3xl">
              {screen.imgType === "video" ? (
                <div className="aspect-video bg-black border rounded-3xl shadow-lg flex items-center justify-center text-gray-400 text-2xl">
                  Video placeholder
                </div>
              ) : (
                <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-lg">
                  <Image
                    src={screen.imgSrc!}
                    alt={`${screen.title} Illustration`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}
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
