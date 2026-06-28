import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe/server";
import { GEMLA_PRODUCT_ID } from "@/lib/gemla/products";
import { logGemlaEvent } from "@/lib/gemla/audit";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const priceId = process.env.STRIPE_GEMLA_ZETA_V1_PRICE_ID;

  if (!appUrl || !priceId) {
    return NextResponse.json(
      { error: "Missing GEMLA checkout configuration." },
      { status: 500 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/gemla-zeta/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/gemla-zeta/cancel`,
    client_reference_id: userId,
    metadata: {
      user_id: userId,
      product_id: GEMLA_PRODUCT_ID,
      license_type: "one_time",
    },
  });

  await logGemlaEvent({
    userId,
    productId: GEMLA_PRODUCT_ID,
    eventType: "checkout_started",
    request,
    metadata: { session_id: session.id },
  });

  return NextResponse.json({ url: session.url });
}