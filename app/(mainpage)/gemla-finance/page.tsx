import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEMLA Finance | Predilytics",
  description:
    "Explore free AI-powered market forecasts, stock price trajectories and historical forecast performance with GEMLA Finance.",

  openGraph: {
    title: "GEMLA Finance | AI-Powered Market Forecasts",
    description:
      "Explore free next-session market forecasts for AAPL, MSFT, NVDA, TSLA and SPY. Compare forecast trajectories against actual market closes and explore historical performance.",
    url: "https://predilyticsinc.com/gemla-finance",
    siteName: "Predilytics",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://predilyticsinc.com/images/gemla-finance-og-image.jpeg",
        width: 1199,
        height: 961,
        alt: "GEMLA Finance Market Forecast Dashboard",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GEMLA Finance | AI-Powered Market Forecasts",
    description:
      "Explore free market forecasts, price trajectories and historical forecast performance.",
    images: [
      "https://predilyticsinc.com/images/gemla-finance-og-image.jpeg",
    ],
  },
};

export default function GemlaFinancePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <section className="mb-8 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 sm:p-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700">
            Predilytics Product
          </span>
          <span className="rounded-full bg-green-100 px-4 py-1 text-xs font-semibold text-green-700">
            Free Access
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          GEMLA Finance
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-[rgb(var(--foreground))]/70">
          Explore free market trajectory predictions and next-session forecasts
          for AAPL, MSFT, NVDA, TSLA and SPY. View the historical relay
          track-record audit summary below the charts. Additional tickers and
          advanced chart features are available in our Premium plan (coming soon).
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#dashboard"
            className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            View Free Predictions
          </a>
          <Link
            href="/gemla-finance/pricing"
            className="rounded-xl border border-blue-500 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-500/10 dark:text-blue-300"
          >
            Get Access to More Tickers
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-[rgb(var(--border))] px-6 py-3 font-semibold text-[rgb(var(--foreground))] transition hover:bg-blue-500/10"
          >
            Back to Homepage
          </Link>
        </div>
      </section>

      <section
        id="dashboard"
        className="overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgb(var(--border))] px-6 py-4">
          <h2 className="text-lg font-semibold text-[rgb(var(--foreground))]">
            GEMLA Finance — Free Prediction Dashboard
          </h2>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            Public Access
          </span>
        </div>

        <iframe
          id="gemla-finance-dashboard"
          src="/gemla-finance/relay-paths.html"
          title="GEMLA Finance free forecasts and historical audit summary"
          className="block h-[2000px] w-full border-0"
          loading="lazy"
        />
      </section>

      <Script id="gemla-finance-iframe-resize" strategy="afterInteractive">{`
        (function () {
          const frame = document.getElementById('gemla-finance-dashboard');
          if (!frame) return;
          let observer;
          // The iframe is a separate document; Next.js theme classes do not cross it.
          function siteTheme() {
            const root = document.documentElement;
            if (root.classList.contains('dark') || root.dataset.theme === 'dark') return 'dark';
            if (root.classList.contains('light') || root.dataset.theme === 'light') return 'light';
            // Fallback for websites that change CSS variables rather than classes.
            const bg = getComputedStyle(document.body).backgroundColor || getComputedStyle(root).backgroundColor;
            const nums = (bg.match(/[0-9.]+/g) || []).map(Number);
            if (nums.length >= 3 && nums[0] + nums[1] + nums[2] > 0) {
              return (nums[0] * 0.2126 + nums[1] * 0.7152 + nums[2] * 0.0722) < 128 ? 'dark' : 'light';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
          function syncTheme() {
            if (frame.contentWindow) {
              frame.contentWindow.postMessage({ type: 'gemla-finance:set-theme', theme: siteTheme() }, window.location.origin);
            }
          }
          const rootThemeObserver = new MutationObserver(syncTheme);
          rootThemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
          const bodyThemeObserver = new MutationObserver(syncTheme);
          if (document.body) bodyThemeObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
          const media = window.matchMedia('(prefers-color-scheme: dark)');
          media.addEventListener('change', syncTheme);
          function adjustHeight() {
            try {
              const doc = frame.contentDocument;
              if (!doc || !doc.body) return;
              frame.style.height = Math.ceil(Math.max(
                doc.body.scrollHeight,
                doc.documentElement.scrollHeight
              ) + 10) + 'px';
            } catch (_) { /* Same-origin HTML is required for auto-sizing. */ }
          }
          frame.addEventListener('load', function () {
            if (observer) observer.disconnect();
            adjustHeight();
            syncTheme();
            try {
              observer = new ResizeObserver(adjustHeight);
              observer.observe(frame.contentDocument.body);
            } catch (_) { /* Fallback retains the initial height. */ }
          });
          if (frame.contentDocument && frame.contentDocument.readyState === 'complete') {
            adjustHeight();
            syncTheme();
          }
          window.addEventListener('resize', adjustHeight);
        })();
      `}</Script>
    </main>
  );
}
