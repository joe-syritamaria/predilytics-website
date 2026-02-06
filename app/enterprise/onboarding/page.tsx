"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function EnterpriseOnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      router.replace("/sign-in?redirect_url=/enterprise/onboarding");
      return;
    }

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Organization name is required.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/orgs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    setLoading(false);

    if (res.status === 401) {
      router.replace("/sign-in?redirect_url=/enterprise/onboarding");
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Failed to create organization.");
      return;
    }

    router.replace("/enterprise/checkout");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Create your organization</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enterprise subscriptions must be attached to an organization.
        </p>
        {!isLoaded ? (
          <p className="mt-4 text-sm text-slate-500">Loading your session…</p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Organization name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isLoaded || !isSignedIn}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              placeholder="Acme Manufacturing"
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || !isLoaded || !isSignedIn}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-70"
          >
            {loading ? "Creating…" : "Create and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
