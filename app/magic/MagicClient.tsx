"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

const APP_REDIRECT = "moldpredict://auth/callback";

function getApiBase() {
  const fromEnv = (process.env.NEXT_PUBLIC_DESKTOP_API_BASE_URL || "").trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://moldpredict-desktop.onrender.com";
}

export default function MagicClient() {
  const params = useSearchParams();
  const ticket = params?.get("token") ?? null;
  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth();
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState("");
  const apiBase = useMemo(() => getApiBase(), []);

  useEffect(() => {
    if (!ticket) {
      setError("Missing magic link token.");
      return;
    }
    if (!signInLoaded || !signIn) return;

    let cancelled = false;

    (async () => {
      try {
        setStatus("Verifying link...");
        const result = await signIn.create({
          strategy: "ticket",
          ticket,
        });

        if (cancelled) return;

        if (result.status === "complete" && result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          setStatus("Exchanging session...");
        } else {
          setError("Sign-in could not be completed.");
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ticket, signInLoaded, signIn, setActive]);

  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;

    let cancelled = false;

    (async () => {
      try {
        setStatus("Finishing sign-in...");
        const clerkToken = await getToken({ template: "default" });
        if (!clerkToken) throw new Error("Missing Clerk session token.");

        const res = await fetch(`${apiBase}/auth/exchange`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clerkToken}`,
          },
        });
        const text = await res.text();
        if (!res.ok) throw new Error(text || "Exchange failed.");
        const data = JSON.parse(text);
        const appToken = data.access_token;
        if (!appToken) throw new Error("Missing app token.");

        if (cancelled) return;
        window.location.href = `${APP_REDIRECT}?app_token=${encodeURIComponent(
          appToken
        )}`;
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoaded, isSignedIn, getToken, apiBase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 text-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <div className="text-lg font-semibold">Signing you in...</div>
        <div className="mt-2 text-sm text-gray-600">{status}</div>
        {error && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
