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
    desc: "Provide your mold data, plastic type, and process parameters to generate predictions. Watch this video to see it in action!",
    imgType: "video",
    imgSrc: "https://www.youtube.com/embed/0m502UbHSXM", // YouTube embed URL
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
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start overflow-y-auto py-20">
      <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-3xl max-w-4xl w-full mx-4 p-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-center items-center mb-12 relative">
          <h1 className="text-4xl font-bold text-blue-700 dark:text-white text-center w-full">
            How MoldPredict™ Works
          </h1>

          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-[rgb(var(--foreground))]/70 hover:text-blue-500 text-lg"
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
              <h2 className="text-3xl font-semibold text-blue-700 dark:text-white mb-4">
                {screen.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {screen.desc}
              </p>
            </div>

            {/* Media */}
            <div className="w-full max-w-3xl">
              {screen.imgType === "video" ? (
                <div className="aspect-video rounded-3xl overflow-hidden shadow-lg">
                  <iframe
                    src={screen.imgSrc}
                    title="Predilytics Demo Video"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
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

