const isDemoMode =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const pricingTiers = [
  {
    title: "Free",
    description: "Basic predictions and limited projects.",
    cta: "Get Started",
    href: isDemoMode ? "/demo" : "/login",
  },
  {
    title: "Enterprise",
    description: "Further trained models, and dedicated support.",
    cta: "View Pricing",
    href: "/pricing",
  },
];

export default function Pricing() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-700">Pricing</h2>

        <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg">
          Choose a plan that fits your team’s needs. Upgrade as your
          prediction requirements grow.
        </p>

        <div className="mt-14 grid md:grid-cols-2 gap-8">
          {pricingTiers.map((tier) => (
            <div
              key={tier.title}
              className="bg-blue-50 border rounded-2xl p-8 flex flex-col"
            >
              <h3 className="text-2xl font-semibold text-blue-700">
                {tier.title}
              </h3>

              <p className="mt-4 text-gray-600 grow">
                {tier.description}
              </p>

              {tier.href ? (
                <a
                  href={tier.href}
                  className="mt-8 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-center"
                >
                  {tier.cta}
                </a>
              ) : (
                <button
                  disabled
                  className="mt-8 w-full py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed"
                >
                  {tier.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
