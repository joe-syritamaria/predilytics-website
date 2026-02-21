"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const contactCards = [
    { title: "General Inquiries", subtitle: "sales@predilyticsinc.com", id: "general" },
    { title: "Careers", subtitle: "View open positions", id: "careers" },
    { title: "Customer Support", subtitle: "support@predilyticsinc.com", id: "support" },
    { title: "Become a Partner", subtitle: "Partner opportunities", id: "partner" },
  ];

  return (
    <section id="contact" className="bg-[rgb(var(--background))] py-16">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 className="text-4xl font-semibold text-[rgb(var(--foreground))]">
          Contact Us
        </h2>
        <p className="mt-3 text-base text-slate-600">
          Tell us what you are working on and we will follow up within one business day.
        </p>

        <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-sm"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="company" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company (if applicable)
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="mt-6">
              <label htmlFor="reason" className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Reason / Priority
              </label>
              <select
                id="reason"
                name="reason"
                className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select a reason</option>
                <option value="sales">Sales inquiry</option>
                <option value="support">Customer support</option>
                <option value="partnerships">Partnerships</option>
                <option value="careers">Careers</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Send inquiry
              <ArrowRight className="h-4 w-4" />
            </button>

            {submitted && (
              <p className="mt-4 text-sm text-emerald-600">
                Thanks! Your inquiry has been sent.
              </p>
            )}
          </form>

          <div className="space-y-8">
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                Contact
              </h3>

              <div className="mt-6 space-y-4 text-slate-700">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </p>
                  <a
                    href="mailto:support@predilyticsinc.com"
                    className="mt-2 inline-flex text-base font-semibold text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300"
                  >
                    support@predilyticsinc.com
                  </a>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </p>
                  <p className="mt-2 text-base font-semibold text-[rgb(var(--foreground))]">
                    +1 (415) 907-0704
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Address
                  </p>
                  <p className="mt-2 text-base font-semibold text-[rgb(var(--foreground))]">
                    2108 N St # 14479
                    <br />
                    Sacramento, CA 95816
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {contactCards.map((card) => (
                <a
                  key={card.id}
                  id={card.id}
                  href="#"
                  className="group relative rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <p className="text-sm font-semibold text-[rgb(var(--foreground))]">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {card.subtitle}
                  </p>
                  <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-slate-400 transition group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



