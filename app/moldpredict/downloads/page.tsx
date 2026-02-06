export default function MoldPredictDownloadsPage() {
  const downloadsBase = process.env.NEXT_PUBLIC_DOWNLOADS_BASE_URL;
  const windowsUrl = downloadsBase
    ? `${downloadsBase}/Predilytics-Enterprise-Setup.exe`
    : "#";
  const macUrl = downloadsBase ? `${downloadsBase}/Predilytics-Enterprise.dmg` : "#";
  const linuxUrl = downloadsBase ? `${downloadsBase}/Predilytics-Enterprise.AppImage` : "#";

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-12 text-slate-900">
      <div className="mx-auto w-full max-w-4xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold">Predilytics Enterprise Downloads</h1>
          <p className="text-slate-600">
            Download the desktop app and follow the setup steps below.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Downloads</h2>
          <p className="mt-2 text-sm text-slate-600">
            Choose the installer for your operating system.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <a
              href={windowsUrl}
              className="rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-slate-800 transition"
            >
              Windows (.exe)
            </a>
            <a
              href={macUrl}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
            >
              macOS (.dmg)
            </a>
            <a
              href={linuxUrl}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
            >
              Linux (.AppImage)
            </a>
          </div>
          {!downloadsBase ? (
            <p className="mt-4 text-sm text-amber-600">
              Missing `NEXT_PUBLIC_DOWNLOADS_BASE_URL`. Set it to your S3 public base URL.
            </p>
          ) : null}
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
