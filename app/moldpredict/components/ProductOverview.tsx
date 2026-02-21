import Image from "next/image";

export default function ProductOverview() {
  return (
    <section className="py-24 bg-[rgb(var(--background))]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-700 dark:text-white">
          About MoldPredict™
        </h2>

        <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg">
          MoldPredict™ analyzes mold process parameters, and
          historical production outcomes to generate actionable predictions.
          It is designed for engineers and clients — not data scientists —
          so teams can plan decisions before a repair happens.
        </p>

        {/* Image Placeholder */}
        <div className="mt-12 relative w-full max-w-4xl mx-auto aspect-video bg-[rgb(var(--card))] border rounded-2xl overflow-hidden flex items-center justify-center">
          <Image
            src="/images/AboutMoldPredict.png"
            alt="About MoldPredict"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </section>
  );
}


