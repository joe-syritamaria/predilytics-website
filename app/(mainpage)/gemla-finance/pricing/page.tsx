import GemlaFinancePricing from "@/app/components/GemlaFinancePricing";

export const metadata = {
  title: "GEMLA Finance Pricing | Predilytics",
  description:
    "Compare the free GEMLA Finance forecasts with premium annual access at $239 per year.",
};

export default function GemlaFinancePricingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 text-[rgb(var(--foreground))] sm:px-6 sm:py-16">
      <h1 className="sr-only">GEMLA Finance Pricing</h1>
      <GemlaFinancePricing />
    </main>
  );
}
