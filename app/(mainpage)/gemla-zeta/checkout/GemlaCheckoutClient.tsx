"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function GemlaCheckoutClient() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace("/sign-in?redirect_url=/gemla-zeta/checkout");
      return;
    }

    let cancelled = false;

    async function startCheckout() {
      setError(null);

      const response = await fetch("/api/gemla/checkout", {
        method: "POST",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.url) {
        setError(data?.error ?? "Unable to start checkout.");
        return;
      }

      if (!cancelled) {
        window.location.href = data.url;
      }
    }

    startCheckout();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Preparing secure checkout...</h1>
        <p className="mt-2 text-sm text-slate-600">
          We are creating your one-time GEMLA-Zeta license checkout.
        </p>
        {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}
      </div>
    </main>
  );
}