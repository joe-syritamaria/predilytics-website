"use client";

export default function AboutPage() {
  const founders = [
    {
      name: "Biju Jose",
      role: "Co-Founder",
      linkedIn: "https://www.linkedin.com/in/bijujose1",
      photo: "/founders/biju.png",
    },
    {
      name: "Sincy Joe",
      role: "Co-Founder",
      linkedIn: "#",
      photo: "/founders/sincy.png",
    },
    {
      name: "Syrita Joe",
      role: "Co-Founder",
      linkedIn: "#",
      photo: "/founders/founder3.jpg",
    },
    {
      name: "Celes John",
      role: "Co-Founder",
      linkedIn: "#",
      photo: "/founders/founder4.jpg",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">About Predilytics</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
          Predilytics is building predictive intelligence for modern
          manufacturing—helping teams move from reactive decisions to proactive outcomes.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">
            To become the intelligence layer manufacturers rely on to anticipate risk,
            optimize operations, and build resilient systems.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            We transform complex operational data into clear, actionable predictions—
            reducing downtime and enabling confident decisions.
          </p>
        </div>
      </div>

      {/* Outcomes */}
      <div>
        <h2 className="text-3xl font-semibold text-slate-900 text-center mb-8">
          Outcomes We Deliver
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            "Early detection of operational risk and failure patterns",
            "Reduced downtime through predictive insights",
            "Improved maintenance and planning efficiency",
            "Explainable predictions for engineering and operations teams",
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-blue-50 rounded-xl p-6 text-slate-700 font-medium hover:bg-blue-100 transition"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
{/* Founders */}
<div>
  <h2 className="text-3xl font-semibold text-slate-900 text-center mb-10">
    Meet the Founders
  </h2>

  <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
    {founders.map((founder, idx) => (
      <div
        key={idx}
        className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 text-center"
      >
        <img
          src={founder.photo}
          alt={founder.name}
          className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
        />

        <h3 className="text-lg font-semibold text-slate-900">
          {founder.name}
        </h3>

        <p className="text-sm text-slate-600 mb-3">
          {founder.role}
        </p>

        {founder.linkedIn !== "#" && (
          <a
            href={founder.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline"
          >
            LinkedIn
          </a>
        )}
      </div>
    ))}
  </div>
</div>
    </section>
  );
}
