export default function ProductOverview() {
  return (
    <section className="py-24 bg-blue-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-700">
          About MoldPredict™
        </h2>

        <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg">
          MoldPredict™ analyzes mold process parameters, and
          historical production outcomes to generate actionable predictions.
          It is designed for engineers and clients — not data scientists —
          so teams can plan decisions before a repair happens.
        </p>

        {/* Video Placeholder */}
        <div className="mt-12 aspect-video bg-white border rounded-2xl flex items-center justify-center text-gray-400">
          Product setup & walkthrough video
        </div>
      </div>
    </section>
  );
}
