// components/ProductHowItWorks.tsx
"use client";

const steps = [
  { title: "Data Capture", desc: "Collect real-time data from your machines and molds.", icon: "/icons/data.svg" },
  { title: "AI Analysis", desc: "Process signals with advanced AI models to detect anomalies.", icon: "/icons/ai.svg" },
  { title: "Alerts & Insights", desc: "Receive instant alerts and actionable insights.", icon: "/icons/alert.svg" },
  { title: "Optimize Production", desc: "Improve yield, reduce scrap, and save costs.", icon: "/icons/optimize.svg" },
];

export default function ProductHowItWorks() {
  return (
    <section id="product-how-it-works" className="py-20 bg-neutral-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
          How MoldPredict Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-left">
          {steps.map((step) => (
            <div key={step.title} className="p-6 border rounded-xl hover:shadow-lg transition flex flex-col items-center gap-4">
              <img src={step.icon} alt={step.title} className="w-12 h-12" />
              <p className="font-semibold text-lg text-gray-900 dark:text-white">{step.title}</p>
              <p className="text-gray-600 dark:text-gray-400 text-center">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}