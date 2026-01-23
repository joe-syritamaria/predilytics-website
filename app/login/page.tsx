"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "sign_in" | "sign_up";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(
    () => createSupabaseBrowserClient(),
    []
  );
  const [mode, setMode] = useState<AuthMode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }
      if (data.session) {
        router.replace("/demo");
      }
    });
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setIsSubmitting(true);

    try {
      if (mode === "sign_in") {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        router.replace("/demo");
        return;
      }

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login`
          : undefined;
      const { error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
          },
        });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setStatus(
        "Check your email to verify your account before signing in."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-12">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/40">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Predylitics Demo
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            {mode === "sign_in"
              ? "Sign in to continue"
              : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Access the MoldPredict demo with your verified email.
          </p>

          <div className="mt-6 flex gap-2 text-xs font-semibold uppercase tracking-wide">
            <button
              type="button"
              onClick={() => setMode("sign_in")}
              className={`rounded-full px-4 py-2 ${
                mode === "sign_in"
                  ? "bg-slate-100 text-slate-900"
                  : "border border-slate-700 text-slate-300"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("sign_up")}
              className={`rounded-full px-4 py-2 ${
                mode === "sign_up"
                  ? "bg-slate-100 text-slate-900"
                  : "border border-slate-700 text-slate-300"
              }`}
            >
              Sign up
            </button>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-300">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 shadow-sm focus:border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 shadow-sm focus:border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
            </label>

            {error ? (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}
            {status ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {status}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting
                ? "Working..."
                : mode === "sign_in"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
