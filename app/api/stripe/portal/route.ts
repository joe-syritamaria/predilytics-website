import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";
import { stripe } from "@/lib/stripe/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "User has no org.", code: "no_org" }, { status: 409 });
  }

  const { data: org, error: orgError } = await supabase
    .from("orgs")
    .select("stripe_customer_id")
    .eq("id", member.org_id)
    .maybeSingle();

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 500 });
  }

  const { data: subscription } = await supabase
    .from("org_subscriptions")
    .select("status")
    .eq("org_id", member.org_id)
    .maybeSingle();

  if (!subscription) {
    return NextResponse.json(
      { error: "No subscription detected.", code: "no_subscription" },
      { status: 409 }
    );
  }

  const customerId = org?.stripe_customer_id as string | null;
  if (!customerId) {
    return NextResponse.json({ error: "Missing Stripe customer." }, { status: 409 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/billing/portal`,
  });

  return NextResponse.json({ url: session.url });
}
