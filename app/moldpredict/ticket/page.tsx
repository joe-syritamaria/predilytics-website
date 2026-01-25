 "use client";

import { useState } from "react";

export default function SubmitTicketPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    let response: Response;
    try {
      response = await fetch("/api/support-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setErrorMessage("Failed to submit ticket.");
      setStatus("error");
      return;
    }

    const data = await response.json().catch(() => null);
    if (!response.ok || data?.ok !== true) {
      setErrorMessage(data?.error ?? "Failed to submit ticket.");
      setStatus("error");
      return;
    }

    setStatus("success");
    form.reset();
  };

  return (
    <section className="px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-3xl border border-blue-100 bg-white p-10 shadow-sm">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Support
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Submit a Ticket
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Tell us what you need help with and our team will follow up.
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Submitting..." : "Submit Ticket"}
            </button>

            {status === "success" && (
              <p className="text-sm text-emerald-600">
                Thanks! Your ticket has been submitted.
              </p>
            )}

            {status === "error" && (
              <p className="text-sm text-red-600">
                {errorMessage || "Failed to submit ticket."}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
