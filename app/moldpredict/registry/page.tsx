"use client";

import { useState } from "react";
import Link from "next/link";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type RegistryResult = {
  publicId: string;
  publicUrl: string;
};

export default function GlobalMoldRegistryPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<RegistryResult | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    let response: Response;
    try {
      response = await fetch("/api/registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      setErrorMessage("Failed to submit registry entry.");
      setStatus("error");
      return;
    }

    const data = await response.json().catch(() => null);
    if (!response.ok || data?.ok !== true) {
      setErrorMessage(data?.error ?? "Failed to submit registry entry.");
      setStatus("error");
      return;
    }

    setResult({
      publicId: data.publicId,
      publicUrl: data.publicUrl,
    });
    setStatus("success");
    form.reset();
  };

  return (
    <section className="px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-10 shadow-sm">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Registry
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-[rgb(var(--foreground))]">
              Global Mold Registry
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Record mold events and keep your registry consistent across plants.
            </p>
          </div>

          {status === "success" && result ? (
            <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-emerald-800">
              <p className="text-base font-semibold">
                Registry entry recorded, you can safely close this tab now.
              </p>
              <div className="mt-4 text-sm text-emerald-900">
                <p>
                  Universal mold ID:{" "}
                  <span className="font-semibold">{result.publicId}</span>
                </p>
                <p className="mt-2">
                  Public link:{" "}
                  <a
                    href={result.publicUrl}
                    className="font-semibold text-emerald-900 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {result.publicUrl}
                  </a>
                </p>
              </div>
              <div className="mt-6 flex flex-col items-start gap-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    result.publicUrl
                  )}`}
                  alt={`QR code for ${result.publicId}`}
                  className="h-40 w-40 rounded-xl border border-emerald-200 bg-white p-2"
                />
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                    result.publicUrl
                  )}`}
                  download={`${result.publicId}.png`}
                  className="text-sm font-semibold text-emerald-900 underline"
                >
                  Download QR code
                </a>
              </div>
            </div>
          ) : (
            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="moldIdentification"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Mold identification
                </label>
                <input
                  id="moldIdentification"
                  name="moldIdentification"
                  type="text"
                  required
                  className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ownerCompany"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Owner / Company
                  </label>
                  <input
                    id="ownerCompany"
                    name="ownerCompany"
                    type="text"
                    required
                    className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="regionState"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Region / State
                </label>
                <input
                  id="regionState"
                  name="regionState"
                  type="text"
                  required
                  className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="yearsInExistence"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Years in existence
                  </label>
                  <input
                    id="yearsInExistence"
                    name="yearsInExistence"
                    type="number"
                    min={0}
                    required
                    className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="currentState"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Select current state
                  </label>
                  <select
                    id="currentState"
                    name="currentState"
                    required
                    className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select current state
                    </option>
                    <option value="mold-genesis-first-registration">
                      Mold genesis / first registration
                    </option>
                    <option value="ownership-or-custody-transfer">
                      Ownership or custody transfer
                    </option>
                    <option value="validation-run-completed">
                      Validation run completed
                    </option>
                    <option value="pm-completed">PM completed</option>
                    <option value="major-overhaul-refurbishment">
                      Major overhaul / refurbishment
                    </option>
                    <option value="certified-failure-event">
                      Certified failure event
                    </option>
                    <option value="rul-threshold-breach">
                      RUL threshold breach
                    </option>
                    <option value="oversight-engineer-signoff">
                      Oversight engineer signoff
                    </option>
                    <option value="approved-vendor-completion">
                      Approved vendor completion
                    </option>
                    <option value="settlement-relevant-event">
                      Settlement-relevant event
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="ownershipType"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Type of ownership
                </label>
                <select
                  id="ownershipType"
                  name="ownershipType"
                  required
                  className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select ownership type
                  </option>
                  <option value="oem">OEM</option>
                  <option value="custom-molder">Custom Molder</option>
                  <option value="mold-maker">Mold maker</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="moldCostOriginal"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Mold cost (original build cost in USD)
                  </label>
                  <input
                    id="moldCostOriginal"
                    name="moldCostOriginal"
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="moldCostRegistry"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Mold cost for registry
                  </label>
                  <input
                    id="moldCostRegistry"
                    name="moldCostRegistry"
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Same as above / depreciated"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Comments by user / Name and Company
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  required
                  className="mt-2 w-full rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--input))] px-3 py-2.5 text-[rgb(var(--foreground))] shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-[rgb(var(--border))] text-blue-600 focus:ring-2 focus:ring-blue-200"
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-sm text-slate-600"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Terms and Conditions
                  </Link>
                  .
                </label>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Submitting..." : "Submit Entry"}
              </button>

              {status === "error" && (
                <p className="text-sm text-red-600">
                  {errorMessage || "Failed to submit registry entry."}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
