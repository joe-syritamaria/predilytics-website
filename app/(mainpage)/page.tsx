"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { IntroSequence } from "./components/IntroSequence";
import { HomeSection } from "./components/HomeSection";
import { ProductsSection } from "./components/ProductsSection";
import { ContactSection } from "./components/ContactSection";

export default function PredilyticsPage() {
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
      <div className="bg-blue-50">
        <main className="mx-auto max-w-6xl px-6 py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={introComplete ? "ready" : "loading"}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-24"
            >
              <section id="home">
                <HomeSection />
              </section>

              <section id="products">
                <ProductsSection />
              </section>

              <section id="contact">
                <ContactSection />
              </section>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
