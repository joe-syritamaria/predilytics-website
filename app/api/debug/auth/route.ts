import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, sessionId } = auth();

  return NextResponse.json({
    userId: userId ?? null,
    sessionId: sessionId ?? null,
  });
}
