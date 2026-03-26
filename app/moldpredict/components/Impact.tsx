// components/Impact.tsx
"use client";

export default function Impact() {
  const stats = [
    { value: "30–50%", label: "Scrap Reduction" },
    { value: "10–20%", label: "Cycle Optimization" },
    { value: "40%", label: "Faster Root Cause Analysis" },
  ];

  return (
    <section id="impact" className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10">Impact You Can Measure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-5xl font-extrabold text-blue-600">{stat.value}</p>
              <p className="mt-2 text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}