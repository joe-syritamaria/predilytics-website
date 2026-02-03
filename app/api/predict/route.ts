// /app/api/predict/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const inferenceUrl = process.env.INFERENCE_URL;

  if (!inferenceUrl) {
    return NextResponse.json({ error: "Missing INFERENCE_URL." }, { status: 500 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
    console.log("Payload received:", payload);
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  let upstream: Response;
  try {
    console.log("Calling inference service at:", `${inferenceUrl}/api/molds/predict`);

    // Demo mode: never send Authorization header
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    upstream = await fetch(`${inferenceUrl}/api/molds/predict`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to reach inference service:", err);
    return NextResponse.json({ error: "Failed to reach inference service." }, { status: 502 });
  }

  const text = await upstream.text();
  const contentType = upstream.headers.get("content-type") ?? "application/json";
  console.log("Upstream response status:", upstream.status);

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  });
}
