import Link from "next/link";

export const metadata = {
  title: "GEMLA Finance Pricing | Predilytics",
  description:
    "Compare the free GEMLA Finance forecasts with premium annual access at $239 per year.",
};

export default function GemlaFinancePricingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 text-[rgb(var(--foreground))] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-600 dark:text-blue-300">
          GEMLA Finance
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
          Forecast more. Explore further.
        </h1>
        <p className="mt-4 text-base leading-7 opacity-75 sm:text-lg">
          Start with five free ticker forecasts. Upgrade to explore more stocks,
          extended forecast paths, FGF bands, and relay-layer visualizations.
        </p>
        <p className="mt-5 text-sm opacity-65">
          Premium is billed annually in USD. Subscriptions are coming soon.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        {/* Match the Free / Enterprise two-column structure used by MoldPredict. */}
        <section className="flex flex-col rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-7 shadow-sm sm:p-8">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-300">Free</span>
          <p className="mt-2 text-sm opacity-75">A simple view of the next market session.</p>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-sm opacity-70">/ forever</span>
          </div>
          <ul className="mt-8 flex-1 space-y-4 text-sm leading-6">
            <li>✓ Five free tickers: AAPL, MSFT, NVDA, TSLA, SPY</li>
            <li>✓ Next-session forecast display</li>
            <li>✓ Latest 6 historical as-of records</li>
            <li>✓ 1-session forecast horizon</li>
            <li>✓ Historical relay track-record audit summary</li>
            <li className="opacity-65">— Extended paths, FGF bands and relay layers locked</li>
          </ul>
          <Link
            href="/gemla-finance"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl border border-[rgb(var(--border))] px-5 py-3 text-sm font-semibold transition hover:bg-blue-500/10"
          >
            View Free Dashboard
          </Link>
        </section>

        <section className="relative flex flex-col rounded-2xl border-2 border-blue-500 bg-[rgb(var(--card))] p-7 shadow-[0_0_28px_rgba(59,130,246,0.13)] sm:p-8">
          <div className="absolute -top-4 right-6 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white">
            COMING SOON
          </div>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-300">Premium</span>
          <p className="mt-2 text-sm opacity-75">More tickers, deeper forecasting tools.</p>
          <div className="mt-6 flex flex-wrap items-baseline gap-2">
            <span className="text-4xl font-bold">$19.92</span>
            <span className="text-sm opacity-70">/ month equivalent</span>
          </div>
          <p className="mt-1 text-sm font-semibold">$239.00 billed annually</p>
          <ul className="mt-8 flex-1 space-y-4 text-sm leading-6">
            <li>✓ Everything in Free</li>
            <li>✓ Additional stocks and tickers</li>
            <li>✓ Choose Last 3, Last 6, or All 12 as-of records</li>
            <li>✓ Extended 1-, 5-, and 10-session forecast paths</li>
            <li>✓ FGF rehearsal bands A1 and A2</li>
            <li>✓ Relay path/range visualization layers</li>
            <li>✓ Continued next-session forecasts</li>
          </ul>
          <div
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white opacity-65"
            aria-label="GEMLA Finance Premium subscriptions coming soon"
          >
            Premium Access — Coming Soon
          </div>
          <p className="mt-3 text-center text-xs opacity-70">
            No checkout is active yet. Premium data requires a future subscription release.
          </p>
        </section>
      </div>

      <p className="mx-auto mt-9 max-w-3xl text-center text-xs leading-6 opacity-65">
        Market forecasts are experimental and uncertified. This information is not investment advice.
      </p>
    </main>
  );
}
