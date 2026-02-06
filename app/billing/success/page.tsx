import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getEnterpriseSupabase } from "@/lib/supabase/enterprise";

export default async function BillingSuccessPage() {
  const previewMode = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";
  const { userId } = await auth();

  if (!userId && !previewMode) {
    redirect("/sign-in?redirect_url=/billing/success");
  }

  if (previewMode && !userId) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
        <div className="mx-auto w-full max-w-4xl space-y-10">
          <header className="space-y-3">
            <h1 className="text-3xl font-semibold">Payment successful</h1>
            <p className="text-slate-600">
              Preview mode is enabled. This page is showing mock subscription data.
            </p>
          </header>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Subscription details</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <div>
                <span className="font-medium text-slate-900">Organization:</span> Acme Molding Co.
              </div>
              <div>
                <span className="font-medium text-slate-900">Status:</span> active
              </div>
              <div>
                <span className="font-medium text-slate-900">Renews / ends:</span>{" "}
                {new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toLocaleDateString()}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Downloads</h2>
            <p className="mt-2 text-sm text-slate-600">
              Download the desktop app and follow the setup steps below.
            </p>
            <a
              href="/moldpredict/downloads"
              className="mt-6 inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Go to downloads
            </a>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Install Steps</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <p>1. Download the installer for your operating system.</p>
              <p>2. Run the installer and follow the on-screen steps.</p>
              <p>3. Launch Predilytics Enterprise and sign in with your Clerk account.</p>
              <p>4. Your subscription will be detected automatically and access will be granted.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Need help?</h2>
            <p className="mt-2 text-sm text-slate-600">
              If you run into any issues, contact support and include your organization name.
            </p>
            <a
              href="/support"
              className="mt-4 inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
            >
              Contact Support
            </a>
          </section>
        </div>
      </div>
    );
  }

  const supabase = getEnterpriseSupabase();

  const { data: member } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", userId)
    .maybeSingle();

  const orgId = member?.org_id ?? null;
  let orgName: string | null = null;
  let status: string | null = null;
  let currentPeriodEnd: string | null = null;

  if (orgId) {
    const { data: org } = await supabase
      .from("orgs")
      .select("name")
      .eq("id", orgId)
      .maybeSingle();
    orgName = org?.name ?? null;

    const { data: sub } = await supabase
      .from("org_subscriptions")
      .select("status, current_period_end")
      .eq("org_id", orgId)
      .maybeSingle();
    status = sub?.status ?? null;
    currentPeriodEnd = sub?.current_period_end ?? null;
  }

  const downloadsHref = "/moldpredict/downloads";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-4xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold">Payment successful</h1>
          <p className="text-slate-600">
            Your subscription has been activated. If you do not see the status updated yet, wait a
            minute and refresh this page.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Subscription details</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-700">
            <div>
              <span className="font-medium text-slate-900">Organization:</span>{" "}
              {orgName ?? "Not available"}
            </div>
            <div>
              <span className="font-medium text-slate-900">Status:</span>{" "}
              {status ?? "Pending"}
            </div>
            <div>
              <span className="font-medium text-slate-900">Renews / ends:</span>{" "}
              {currentPeriodEnd ? new Date(currentPeriodEnd).toLocaleDateString() : "Not available"}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Downloads</h2>
          <p className="mt-2 text-sm text-slate-600">
            Download the desktop app and follow the setup steps below.
          </p>
          <a
            href={downloadsHref}
            className="mt-6 inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Go to downloads
          </a>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Install Steps</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-700">
            <p>1. Download the installer for your operating system.</p>
            <p>2. Run the installer and follow the on-screen steps.</p>
            <p>3. Launch Predilytics Enterprise and sign in with your Clerk account.</p>
            <p>4. Your subscription will be detected automatically and access will be granted.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Need help?</h2>
          <p className="mt-2 text-sm text-slate-600">
            If you run into any issues, contact support and include your organization name.
          </p>
          <a
            href="/support"
            className="mt-4 inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
          >
            Contact Support
          </a>
        </section>
      </div>
    </div>
  );
}
