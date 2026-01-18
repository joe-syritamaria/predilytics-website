"use client";

import { useState } from "react"; 
import Hero from "./components/Hero";
import ProblemSolution from "./components/ProblemSolution";
import ProductOverview from "./components/ProductOverview";
import Pricing from "./components/Pricing";
import HelpContact from "./components/HelpContact";
import HowItWorks from "./components/HowItWorks";

export default function Home() {
  // State to show/hide the HowItWorks modal
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  console.log("showHowItWorks:", showHowItWorks); 

  return (
    <main className="bg-blue-50 text-gray-900 relative">
      {/* HERO */}
      <section id="hero">
        <Hero
         onSeeHow={() => {
          console.log("🔥 HERO BUTTON CLICKED");
          setShowHowItWorks(true);
      }}
    />
      </section>

      {/* PROBLEM / SOLUTION */}
      <section id="problem">
        <ProblemSolution />
      </section>

      {/* PRODUCT */}
      <section id="product">
        <ProductOverview />
      </section>

      {/* PRICING */}
      <section id="pricing">
        <Pricing />
      </section>

      {/* HELP / CONTACT */}
      <section id="help">
        <HelpContact />
      </section>

      {/* How It Works modal */}
      {showHowItWorks && <HowItWorks onClose={() => setShowHowItWorks(false)} />}
    </main>
  );
}
