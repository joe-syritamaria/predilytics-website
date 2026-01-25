"use client";
import { useState } from "react";

export default function WhitepapersPage() {
  // Example products array - add more products as needed
  const products = [
    {
      id: 1,
      name: "MoldPredict™",
      description:
        "Actionable insights for predictive maintenance, tooling lifecycle intelligence, and risk forecasting using AI and statistical modeling.",
      pdf: "/whitepapers/MoldPredict_White Paper.pdf",
      isAvailable: true,
    },
    {
      id: 2,
      name: "Coming Soon",
      description: "Future product research and whitepapers will appear here.",
      pdf: null,
      isAvailable: false,
    },
  ];

  // Track which PDFs are open
  const [openPdfIds, setOpenPdfIds] = useState<number[]>([]);

  const togglePdf = (id: number) => {
    setOpenPdfIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold text-slate-900">White Papers</h1>
        <p className="mt-4 text-lg text-slate-600">
          Technical research and applied insights from Predilytics on predictive analytics, reliability modeling, and event forecasting.
        </p>
      </div>

      {/* Product Panels */}
      <div className="space-y-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
          >
            {/* Panel Header */}
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-2 text-slate-600">{product.description}</p>
                {product.isAvailable && <p className="mt-2 text-sm text-slate-500">PDF • Technical White Paper</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 md:mt-0">
                {product.isAvailable && product.pdf ? (
                  <>
                    <button
                      onClick={() => togglePdf(product.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      {openPdfIds.includes(product.id) ? "Hide PDF" : "View PDF"}
                    </button>

                    <a
                      href={product.pdf}
                      download
                      className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Download PDF
                    </a>
                  </>
                ) : (
                  <span className="text-slate-500 italic">Coming Soon</span>
                )}
              </div>
            </div>

            {/* PDF Viewer Inline */}
            {product.isAvailable && product.pdf && openPdfIds.includes(product.id) && (
              <div className="h-[700px] w-full overflow-hidden border-t border-slate-200">
                <iframe
                  src={product.pdf}
                  className="h-full w-full"
                  title={`${product.name} White Paper`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
