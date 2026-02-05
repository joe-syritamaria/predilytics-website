import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { currency } = await req.json();

  // TODO: Stripe integration will go here
  // const priceId = STRIPE_PRICES[currency].enterprise;

  return NextResponse.json({
    error: "Stripe not configured yet",
  });
}
