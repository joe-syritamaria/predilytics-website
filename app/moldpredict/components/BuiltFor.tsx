// components/BuiltFor.tsx
"use client";

const roles = [
  { title: "Injection Molding Manufacturers", icon: "/icons/factory.svg" },
  { title: "Quality Engineers", icon: "/icons/quality.svg" },
  { title: "Plant Managers", icon: "/icons/manager.svg" },
  { title: "Process Engineers", icon: "/icons/engineer.svg" },
];

export default function BuiltFor() {
  return (
    <section id="built-for" className="py-20 bg-neutral-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-10 text-gray-900 dark:text-white">
          Built For
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {roles.map((role) => (
            <div
              key={role.title}
              className="p-6 border rounded-xl hover:shadow-lg transition flex flex-col items-center gap-4"
            >
              <img src={role.icon} alt={role.title} className="w-12 h-12" />
              <p className="font-medium text-lg text-gray-900 dark:text-white">{role.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}