"use client";

import { useEffect, useRef, useState } from "react";

export default function GemlaCheckoutClient() {
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function startCheckout() {
      try {
        const response = await fetch("/api/gemla/checkout", {
          method: "POST",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data?.url) {
          setError(data?.error ?? "Unable to start checkout.");
          return;
        }

        window.location.href = data.url;
      } catch {
        setError("Unable to start checkout.");
      }
    }

    startCheckout();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[rgb(var(--background))] p-6 text-[rgb(var(--foreground))]">
      <div className="w-full max-w-md rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-blue-600">
          Preparing secure checkout...
        </h1>

        <p className="mt-2 text-sm text-[rgb(var(--muted-foreground))]">
          We are creating your one-time GEMLA-Zeta license checkout.
        </p>

        {error ? (
          <p className="mt-6 text-sm text-red-500">{error}</p>
        ) : null}
      </div>
    </main>
  );
}