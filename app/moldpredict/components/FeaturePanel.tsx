// components/FeaturePanel.tsx
"use client";

export default function FeaturePanel({
  title,
  description,
  video,
  reverse = false,
}: {
  title: string;
  description: string;
  video: string;
  reverse?: boolean;
}) {
  return (
    <section className="py-28 bg-neutral-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white dark:bg-gray-900 border border-neutral-200 dark:border-gray-800 rounded-2xl p-12 shadow-sm hover:shadow-md transition">
          <div
            className={`grid md:grid-cols-2 gap-12 items-center ${
              reverse ? "md:flex-row-reverse" : ""
            }`}
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-400">{description}</p>
            </div>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full rounded-xl border border-neutral-200 dark:border-gray-700 shadow-sm"
            >
              <source src={video} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}