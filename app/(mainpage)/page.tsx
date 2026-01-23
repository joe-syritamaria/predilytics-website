"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { IntroSequence } from "./components/IntroSequence";
import { PredilyticsSidebar } from "./components/Sidebar";
import { HomeSection } from "./components/HomeSection";
import { ProductsSection } from "./components/ProductsSection";
import { ContactSection } from "./components/ContactSection";

export default function PredilyticsPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {/* Intro animation */}
      <AnimatePresence>
        {showIntro && (
          <IntroSequence
            onComplete={() => {
              setIntroComplete(true);
              setTimeout(() => setShowIntro(false), 400);
            }}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex min-h-screen bg-blue-50">
        <PredilyticsSidebar
          active={activeSection}
          setActive={setActiveSection}
          showLogo={introComplete}
        />

        <main className="flex-1 p-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-6xl"
            >
              {activeSection === "home" && <HomeSection />}
              {activeSection === "products" && <ProductsSection />}
              {activeSection === "contact" && <ContactSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
