import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const INFERENCE_URL = process.env.INFERENCE_URL;

export async function POST(request: Request) {
  if (!INFERENCE_URL) {
    return NextResponse.json(
      { error: "Missing INFERENCE_URL configuration." },
      { status: 500 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;
  if (sessionError || !accessToken) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
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
