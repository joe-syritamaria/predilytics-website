import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";
import type Stripe from "stripe";

async function setOrgStripeCustomerId(orgId: string, customerId: string) {
  const supabase = getEnterpriseSupabase();
  const { error } = await supabase
    .from("orgs")
    .update({ stripe_customer_id: customerId })
    .eq("id", orgId);

  if (error) throw new Error(error.message);
}

async function setOrgClerkOrgId(orgId: string, clerkOrgId: string) {
  const supabase = getEnterpriseSupabase();
  const { error } = await supabase
    .from("orgs")
    .update({ clerk_org_id: clerkOrgId })
    .eq("id", orgId);

  if (error) throw new Error(error.message);
}

async function upsertOrgSubscription(params: {
  orgId: string;
  stripeSubscriptionId: string | null;
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
      stripe_subscription_id: params.stripeSubscriptionId,
      plan: params.plan,
      status: params.status,
      current_period_end: currentPeriodEnd,
      updated_at: now,
    },
    { onConflict: "org_id" },
  );

  if (error) throw new Error(error.message);
}

async function getOrgIdByStripeSubscriptionId(stripeSubscriptionId: string) {
  const supabase = getEnterpriseSupabase();
  const { data, error } = await supabase
    .from("org_subscriptions")
    .select("org_id")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.org_id ?? null;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    // 1) INITIAL LINK: org_id + customer + subscription
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.org_id;

      const customerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!orgId) throw new Error("Missing org_id in session metadata.");
      if (!customerId) throw new Error("Missing customer on checkout session.");
      if (!subscriptionId) throw new Error("Missing subscription on checkout session.");

      // Store customer id for Customer Portal
      await setOrgStripeCustomerId(orgId, customerId);

      const clerkOrgId = session.metadata?.clerk_org_id;
      if (clerkOrgId) {
        await setOrgClerkOrgId(orgId, clerkOrgId);
      }

      // Pull subscription for status + current_period_end
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const planId = subscription.items.data[0]?.price?.id ?? null;

      await upsertOrgSubscription({
        orgId,
        stripeSubscriptionId: subscriptionId,
        plan: planId,
        status: subscription.status ?? null,
        currentPeriodEnd: subscription.current_period_end ?? null,
      });
    }

    // 2) SUBSCRIPTION EVENTS: use subscription.id -> find org
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const subscriptionId = subscription.id;
      const planId = subscription.items.data[0]?.price?.id ?? null;
      const clerkOrgId = subscription.metadata?.clerk_org_id ?? null;

      // Prefer mapping by stored subscription id (reliable)
      let orgId = await getOrgIdByStripeSubscriptionId(subscriptionId);

      // Fallback: ONLY if you *also* set subscription.metadata.org_id somewhere else
      if (!orgId) orgId = subscription.metadata?.org_id ?? null;

      if (orgId) {
        if (clerkOrgId) {
          await setOrgClerkOrgId(orgId, clerkOrgId);
        }
        await upsertOrgSubscription({
          orgId,
          stripeSubscriptionId: subscriptionId,
          plan: planId,
          status: subscription.status ?? null,
          currentPeriodEnd: subscription.current_period_end ?? null,
        });
      }
    }

    // 3) INVOICE EVENTS: invoice.subscription -> find org -> update status
    if (
      event.type === "invoice.payment_failed" ||
      event.type === "invoice.payment_succeeded"
    ) {
      const invoice = event.data.object as Stripe.Invoice;

      const subscriptionId =
        typeof invoice.subscription === "string"
          ? invoice.subscription
          : invoice.subscription?.id;

      if (!subscriptionId) {
        // Some invoices may not be tied to a subscription; ignore safely
        return NextResponse.json({ received: true });
      }

      const orgId = await getOrgIdByStripeSubscriptionId(subscriptionId);
      if (!orgId) {
        // If you can't map it, ignore (or log)
        return NextResponse.json({ received: true });
      }

      // Best: retrieve subscription to get authoritative status/period end
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const planId = subscription.items.data[0]?.price?.id ?? null;
      const clerkOrgId = subscription.metadata?.clerk_org_id ?? null;

      if (clerkOrgId) {
        await setOrgClerkOrgId(orgId, clerkOrgId);
      }

      await upsertOrgSubscription({
        orgId,
        stripeSubscriptionId: subscriptionId,
        plan: planId,
        status: subscription.status ?? null,
        currentPeriodEnd: subscription.current_period_end ?? null,
      });
    }
  } catch (err) {
    // Optional: log err for debugging
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
