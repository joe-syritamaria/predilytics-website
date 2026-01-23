import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  const inferenceUrl = process.env.INFERENCE_URL;
  if (!inferenceUrl) {
    return NextResponse.json({ error: "Missing INFERENCE_URL configuration." }, { status: 500 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnon) {
    return NextResponse.json({ error: "Missing Supabase env vars." }, { status: 500 });
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => cookieStore.set({ name, value, ...options }),
      remove: (name, options) => cookieStore.set({ name, value: "", ...options }),
    },
  });

  const { data, error } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (error || !accessToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${inferenceUrl}/api/molds/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reach inference service." }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  const text = await upstream.text();

  // If upstream is JSON, forward it as JSON
  if (contentType.includes("application/json")) {
    try {
      const json = text ? JSON.parse(text) : null;
      return NextResponse.json(json, { status: upstream.status });
    } catch {
      return new NextResponse(text, { status: upstream.status, headers: { "Content-Type": contentType } });
    }
  }

  // Otherwise forward raw
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType || "text/plain" },
  });
}
