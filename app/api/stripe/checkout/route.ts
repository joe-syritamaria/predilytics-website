import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";
import { stripe } from "@/lib/stripe/server";

type CheckoutPayload = {
  priceId?: string;
  currency?: string;
  lookupKey?: string;
};

function resolveLookupKey(currency?: string, lookupKey?: string) {
  if (lookupKey) return lookupKey;
  if (currency) {
    const key = `STRIPE_LOOKUP_KEY_${currency.toUpperCase()}`;
    const value = process.env[key];
    if (value) return value;
  }
  return process.env.STRIPE_LOOKUP_KEY_DEFAULT || process.env.STRIPE_LOOKUP_KEY || "";
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CheckoutPayload = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  let priceId = body.priceId || process.env.STRIPE_PRICE_ID || "";

  if (!priceId) {
    const lookupKey = resolveLookupKey(body.currency, body.lookupKey);
    if (!lookupKey) {
      return NextResponse.json({ error: "Missing price lookup key." }, { status: 400 });
    }

    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      active: true,
      limit: 1,
    });

    const price = prices.data[0];
    if (!price) {
      return NextResponse.json({ error: "Invalid price lookup key." }, { status: 400 });
    }

    priceId = price.id;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_APP_URL." }, { status: 500 });
  }

  const supabase = getEnterpriseSupabase();
  const { data: member, error: memberError } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  if (!member) {
    return NextResponse.json({ error: "User has no org." }, { status: 409 });
  }

  const { data: org, error: orgError } = await supabase
  .from("orgs")
  .select("stripe_customer_id, name")
  .eq("id", member.org_id)
  .maybeSingle();

if (orgError) {
  return NextResponse.json({ error: orgError.message }, { status: 500 });
}
if (!org) {
  return NextResponse.json({ error: "Org not found." }, { status: 404 });
}

let stripeCustomerId = org.stripe_customer_id as string | null;

if (!stripeCustomerId) {
  const customer = await stripe.customers.create({
    metadata: { org_id: member.org_id },
    // optional niceties:
    // name: org.name ?? undefined,
  });

  stripeCustomerId = customer.id;

  const { error: updateOrgErr } = await supabase
    .from("orgs")
    .update({ stripe_customer_id: stripeCustomerId })
    .eq("id", member.org_id);

  if (updateOrgErr) {
    return NextResponse.json({ error: updateOrgErr.message }, { status: 500 });
  }
}

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/billing/cancel`,
    client_reference_id: userId,
    metadata: {
      org_id: member.org_id,
      user_id: userId,
    },
    subscription_data: {
      metadata: {
        org_id: member.org_id,
        user_id: userId,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
