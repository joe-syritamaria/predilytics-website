import GemlaFinancePricing from "@/app/components/GemlaFinancePricing";
import PricingClient from "./pricing-client";

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-[rgb(var(--foreground))]">
          Pricing
        </h1>
        <p className="mt-4 text-base text-[rgb(var(--foreground))]/70">
          Explore plans for Predilytics products. Start free and choose the access
          that fits your needs.
        </p>
      </div>

      <section aria-labelledby="moldpredict-pricing" className="mt-16">
        <div className="text-center">
          <h2
            id="moldpredict-pricing"
            className="inline-flex rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-600 dark:text-blue-300"
          >
            MoldPredict
          </h2>
        </div>
        <PricingClient />
      </section>

      <div className="mt-20 border-t border-[rgb(var(--border))] pt-16">
        <GemlaFinancePricing />
      </div>
    </main>
  );
}
