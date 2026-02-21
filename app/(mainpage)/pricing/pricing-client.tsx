"use client";

import { useState } from "react";
import Link from "next/link";

/* -------------------- Currency Setup -------------------- */

const CURRENCIES = {
  USD: { symbol: "$", rate: 1, label: "USD (United States)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (Finland)" },
  INR: { symbol: "₹", rate: 83, label: "INR (India)" },
  MXN: { symbol: "$", rate: 17, label: "MXN (Mexico)" },
} as const;

type Currency = keyof typeof CURRENCIES;

/* -------------------- Pricing -------------------- */

const BASE_PRICE_USD = 2399;

/* -------------------- Component -------------------- */

export default function PricingClient() {
  const [currency, setCurrency] = useState<Currency>("USD");

  const { symbol, rate } = CURRENCIES[currency];
  const price = Math.round(BASE_PRICE_USD * rate);

  return (
    <>
      {/* Currency Switcher */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as Currency)}
          className="rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-sm"
        >
          {Object.entries(CURRENCIES).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>

        {/* Disclaimer */}
        <p className="max-w-md text-center text-xs text-slate-500">
          Displayed prices are approximate conversions based on current
          exchange rates and may vary at checkout.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8">
          <h2 className="text-xl font-semibold text-[rgb(var(--foreground))]">Free</h2>
          <p className="mt-2 text-sm text-slate-600">
            Risk-based insights and reporting.
          </p>

          <div className="mt-6 text-4xl font-semibold text-[rgb(var(--foreground))]">
            $0
          </div>

          <ul className="mt-8 space-y-3 text-sm text-slate-700">
            <li>• Estimate maintenance costs and time-to-overhaul</li>
            <li>• View risk-based predictions for operating conditions</li>
            <li>• Generate clear, easy-to-read summary reports</li>
            <li>• Share reports instantly via email</li>
          </ul>

          <Link
            href="/demo"
            className="mt-8 block w-full rounded-xl border border-[rgb(var(--border))] py-3 text-center text-sm font-medium text-[rgb(var(--foreground))] hover:bg-[rgb(var(--input))] transition"
          >
            Get Started Free
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="scale-105 rounded-2xl border-2 border-blue-500 dark:border-white/90 bg-[rgb(var(--card))] p-8 shadow-[0_0_30px_rgba(59,130,246,0.28)] dark:shadow-[0_0_30px_rgba(255,255,255,0.16)]">
          <h2 className="text-xl font-semibold text-blue-700 dark:text-white">Enterprise</h2>
          <p className="mt-2 text-sm text-slate-600">
            Secure, local-first predictive modeling for production environments.
          </p>

          <div className="mt-6 text-4xl font-semibold text-[rgb(var(--foreground))]">
            {symbol}
            {price} / year
          </div>

          <ul className="mt-8 space-y-3 text-sm text-slate-700">
            <li>• Full predictive modeling on customer-owned local data</li>
            <li>• Manage multiple clients from a centralized workspace</li>
            <li>• Save predictions and view all mold forecasts</li>
            <li>• Monitor molds currently running today</li>
            <li>• Strong data security with row-level controls and strict API boundaries</li>
            <li>• Data export and enterprise-grade configuration</li>
          </ul>

          <Link
            href={`/sign-in?redirect_url=${encodeURIComponent(
              `/enterprise/checkout?currency=${currency}`
            )}`}
            className="mt-8 block w-full rounded-xl bg-[rgb(var(--card))] py-3 text-center text-sm font-semibold text-[rgb(var(--foreground))] hover:bg-[rgb(var(--input))] transition"
          >
            Upgrade to Enterprise Now!
          </Link>
        </div>
      </div>
    </>
  );
}



