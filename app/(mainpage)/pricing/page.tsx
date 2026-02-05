// app/pricing/page.tsx
import PricingClient from "./pricing-client";

export default function PricingPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-slate-900">
          Pricing
        </h1>
        <p className="mt-4 text-base text-slate-600">
          Start free. Upgrade when you’re ready to deploy MoldPredict in production.
        </p>
      </div>

      <PricingClient />
    </section>
  );
}
