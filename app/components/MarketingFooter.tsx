import Link from "next/link";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-blue-100 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Contact Us
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">
              Ready to talk?
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Connect with our team to learn how Predilytics can support your
              next predictive analytics initiative.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Contact Us
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Product
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/moldpredict" className="hover:text-blue-700">
                    MoldPredict
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Resources
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/moldpredict/ticket" className="hover:text-blue-700">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="hover:text-blue-700">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/whitepapers" className="hover:text-blue-700">
                    White Papers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Company
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/about" className="hover:text-blue-700">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-700">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Legal
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/privacy-policy" className="hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="hover:text-blue-700">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-blue-100 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>Building predictive confidence for manufacturers.</p>
          <p className="sm:text-right">
            Copyright 2026 Predilytics, Inc. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
