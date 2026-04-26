"use client";

import Link from "next/link";

interface HeroProps {
  onSeeHow: () => void;
}

export default function Hero({ onSeeHow }: HeroProps) {
  const isDemoMode =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const tryItOutHref = isDemoMode ? "/demo" : "/login";

  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      
      {/* TOP GRID */}
      <div className="grid md:grid-cols-2 gap-14 items-start">
        
        {/* LEFT SIDE */}
        <div>
          <span className="inline-block mb-4 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
            Predictive maintenance analytics
          </span>

          <h1 className="text-4xl font-semibold text-[rgb(var(--foreground))] mb-6 leading-tight">
          Manage Mold Repair
            <br />
            before they even happen!
          </h1>

          <p className="text-lg text-gray-600 mb-4">
          MoldPredict™ helps manufacturing teams forecast mold risk, schedule
            maintenance, and avoid unplanned downtime with data-driven insights.
          </p>

          <p className="text-gray-500">
            See risk, cost, and timing in one place so your team can act with
            confidence and stay ahead of production disruptions.
          </p>
        </div>

        {/* RIGHT SIDE (ALIGNED TO TOP) */}
        <div className="w-full h-72 rounded-2xl border border-[rgb(var(--border))] bg-gradient-to-br from-[rgb(var(--input))] to-[rgb(var(--card))] shadow-sm overflow-hidden">
          <img
            src="/images/HeroImage.png"
            alt="Hero illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* BUTTON ROW (CENTERED, SINGLE LINE) */}
      <div className="mt-12 flex justify-center items-center gap-6 flex-nowrap overflow-x-auto">
        <Link
          href={tryItOutHref}
          className="px-8 py-4 bg-blue-600 text-white rounded-xl text-base font-medium hover:bg-blue-700 transition whitespace-nowrap"
        >
          Try It Out
        </Link>

        <Link
          href="/moldpredict/downloads"
          className="px-8 py-4 bg-[rgb(var(--card))] border border-blue-600 text-blue-600 rounded-xl text-base font-medium hover:bg-[rgb(var(--input))] transition whitespace-nowrap"
        >
          Download
        </Link>

        <Link
          href="/moldpredict/registry"
          target="_blank"
          rel="noreferrer"
          className="px-8 py-4 bg-[rgb(var(--card))] border border-blue-600 text-blue-600 rounded-xl text-base font-medium hover:bg-[rgb(var(--input))] transition whitespace-nowrap"
        >
          Global Mold Registry
        </Link>

        <button
          onClick={onSeeHow}
          className="px-8 py-4 border border-blue-600 text-blue-600 rounded-xl text-base font-medium hover:bg-blue-100 transition whitespace-nowrap"
        >
          See How It Works
        </button>
      </div>

    </section>
  );
}