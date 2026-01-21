import { NextResponse } from "next/server";

const INFERENCE_URL = process.env.INFERENCE_URL;

export async function POST(request: Request) {
  if (!INFERENCE_URL) {
    return NextResponse.json(
      { error: "Missing INFERENCE_URL configuration." },
      { status: 500 }
    );
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (error) {
      data = { raw: text };
    }

    return NextResponse.json(
      { data },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reach inference service." },
      { status: 502 }
    );
  }
}
