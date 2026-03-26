import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getClientIdentifier, rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const clientId = getClientIdentifier(req);
  const limit = rateLimit(`registry:${clientId}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": Math.ceil(limit.retryAfterMs / 1000).toString() } }
    );
  }

  const registryApiUrl = process.env.REGISTRY_API_URL;
  if (!registryApiUrl) {
    return NextResponse.json({ ok: false, error: "Missing REGISTRY_API_URL." }, { status: 500 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "https";
  const fallbackSiteUrl = host ? `${proto}://${host}` : undefined;
  const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl;

  let upstream: Response;
  try {
    upstream = await fetch(`${registryApiUrl}/api/registry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(publicSiteUrl ? { "x-public-site-url": publicSiteUrl } : {}),
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to reach registry service." }, { status: 502 });
  }

  const text = await upstream.text();
  const contentType = upstream.headers.get("content-type") ?? "application/json";

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  });
}
