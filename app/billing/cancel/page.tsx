export default function BillingCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold">Checkout canceled</h1>
          <p className="text-slate-600">
            Your payment was canceled. No charges were made.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-700">
            If you still want Enterprise access, you can start checkout again from the pricing page.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/pricing"
              className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Back to pricing
            </a>
            <a
              href="/"
              className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
            >
              Return to main website
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Need help?</h2>
          <p className="mt-2 text-sm text-slate-600">
            If you ran into issues during checkout, contact support and we can help.
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
