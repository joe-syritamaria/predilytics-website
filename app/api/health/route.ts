import { NextResponse } from "next/server";

const INFERENCE_URL = process.env.INFERENCE_URL;

export async function GET() {
  if (!INFERENCE_URL) {
    return NextResponse.json(
      { error: "Missing INFERENCE_URL configuration." },
      { status: 500 }
    );
  }

  const candidates = [
    `${INFERENCE_URL}/health`,
    `${INFERENCE_URL}/docs`,
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        return NextResponse.json(
          { ok: true, source: url },
          { status: 200 }
        );
      }
    } catch (error) {
      continue;
    }
  }

  return NextResponse.json(
    { ok: false, error: "Inference service unavailable." },
    { status: 502 }
  );
}
