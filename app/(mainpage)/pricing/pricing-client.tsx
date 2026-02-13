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
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
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
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Free</h2>
          <p className="mt-2 text-sm text-slate-600">
            Risk-based insights and reporting.
          </p>

          <div className="mt-6 text-4xl font-semibold text-slate-900">
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
            className="mt-8 block w-full rounded-xl border border-slate-300 py-3 text-center text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
          >
            Get Started Free
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="rounded-2xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white">Enterprise</h2>
          <p className="mt-2 text-sm text-slate-300">
            Secure, local-first predictive modeling for production environments.
          </p>

          <div className="mt-6 text-4xl font-semibold text-white">
            {symbol}
            {price} / year
          </div>

          <ul className="mt-8 space-y-3 text-sm text-slate-200">
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
            className="mt-8 block w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
          >
            Upgrade to Enterprise Now!
          </Link>
        </div>
      </div>
    </>
  );
}
