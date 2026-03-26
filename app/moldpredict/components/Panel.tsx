// components/Panel.tsx
"use client";

export default function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-28 bg-neutral-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white dark:bg-gray-900 border border-neutral-200 dark:border-gray-800 rounded-2xl p-12 shadow-sm hover:shadow-md transition">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl">
              {description}
            </p>
          )}
          <div className="mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}