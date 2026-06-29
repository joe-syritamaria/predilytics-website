import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const priceId = process.env.STRIPE_GEMLA_ZETA_V1_PRICE_ID;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    if (!appUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL." },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_GEMLA_ZETA_V1_PRICE_ID." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/gemla-zeta/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/gemla-zeta/cancel`,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        product_id: "gemla_zeta_v1",
        license_type: "one_time",
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("GEMLA checkout error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start checkout.",
      },
      { status: 500 }
    );
  }
}