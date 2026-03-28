export default function NoSubscriptionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">No subscription detected</h1>
        <p className="mt-2 text-sm text-slate-600">
          Please purchase a subscription to access this page.
        </p>
        <a
          href="/pricing"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
        >
          Go to pricing
        </a>
      </div>
    </div>
  );
}
