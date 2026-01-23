import { NextResponse } from "next/server";

const parseJwt = (token: string) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch (error) {
    return null;
  }
};

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const INFERENCE_URL = process.env.INFERENCE_URL;

export async function POST(request: Request) {
  if (!INFERENCE_URL) {
    return NextResponse.json(
      { error: "Missing INFERENCE_URL configuration." },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (sessionError || !accessToken) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }
  const tokenPayload = parseJwt(accessToken);
  const tokenIssuer =
    typeof tokenPayload?.iss === "string"
      ? tokenPayload.iss
      : "";
  if (tokenIssuer) {
    console.log("[predict] token iss:", tokenIssuer);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${INFERENCE_URL}/api/molds/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (error) {
      data = { raw: text };
    }

    const headers =
      tokenIssuer && process.env.NODE_ENV !== "production"
        ? new Headers({ "X-Token-Iss": tokenIssuer })
        : undefined;
    return NextResponse.json(
      { data },
      { status: response.status, headers }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reach inference service." },
      { status: 502 }
    );
  }
}
