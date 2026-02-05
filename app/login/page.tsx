"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { DEMO_MODE } from "@/lib/demo";

type AuthMode = "sign_in" | "sign_up";

export default function LoginPage() {
  const router = useRouter();

  // ✅ ALL HOOKS MUST BE CALLED UNCONDITIONALLY
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

  // 🔓 DEMO MODE: immediately redirect
  useEffect(() => {
    if (DEMO_MODE) {
      router.replace("/demo");
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        router.replace("/demo");
      }
    });

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  // ⛔ Do not render login UI in demo mode
  if (DEMO_MODE) {
    return null;
  }

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
          {/* UI unchanged */}
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* unchanged */}
          </form>
        </div>
      </div>
    </main>
  );
}
