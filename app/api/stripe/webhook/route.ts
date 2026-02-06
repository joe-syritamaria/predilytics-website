import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";
import type Stripe from "stripe";

async function upsertOrgSubscription(params: {
  orgId: string;
  plan: string | null;
  status: string | null;
  currentPeriodEnd: number | null;
}) {
  const supabase = getEnterpriseSupabase();
  const now = new Date().toISOString();
  const currentPeriodEnd = params.currentPeriodEnd
    ? new Date(params.currentPeriodEnd * 1000).toISOString()
    : null;

  const { error } = await supabase.from("org_subscriptions").upsert(
    {
      org_id: params.orgId,
      plan: params.plan,
      status: params.status,
      current_period_end: currentPeriodEnd,
      updated_at: now,
    },
    { onConflict: "org_id" },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature." }, { status: 400 });
  }

  const payload = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.org_id;

      if (orgId && session.subscription) {
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const planId = subscription.items.data[0]?.price?.id ?? null;

        await upsertOrgSubscription({
          orgId,
          plan: planId,
          status: subscription.status ?? null,
          currentPeriodEnd: subscription.current_period_end ?? null,
        });
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const orgId = subscription.metadata?.org_id;
      const planId = subscription.items.data[0]?.price?.id ?? null;

      if (orgId) {
        await upsertOrgSubscription({
          orgId,
          plan: planId,
          status: subscription.status ?? null,
          currentPeriodEnd: subscription.current_period_end ?? null,
        });
      }
    }
  } catch (err) {
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
