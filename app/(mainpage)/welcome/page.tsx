export default function WelcomePage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-10 shadow-lg md:p-14">
        <div className="space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Welcome
          </p>
          <h1 className="text-4xl font-bold text-[rgb(var(--foreground))] md:text-5xl">
            Account Setup Complete!
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            We are thrilled to have you join the MoldPredict family. To start using
            the app with your organization&apos;s subscription, download it here.
          </p>
          <div className="flex justify-center">
            <a
              href="https://predilyticsinc.com/moldpredict/download"
              className="inline-flex items-center justify-center rounded-full bg-blue-700 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-800"
            >
              Download MoldPredict
            </a>
          </div>
          <p className="text-slate-600">
            Enjoy predicting future mold repairs!
          </p>
          <p className="text-slate-700 font-semibold">- The Predilytics Team.</p>
        </div>
      </div>
    </section>
  );
}
