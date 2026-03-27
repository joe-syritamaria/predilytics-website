export default function ProblemSolution() {
  return (
    <section
      id="solution"
      className="bg-[rgb(var(--card))] py-24 px-6"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* PROBLEM */}
        <div>
          <h2 className="text-3xl font-bold text-[rgb(var(--foreground))]">
            The Challenge
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Mold maintenance today is reactive and disconnected from real production data.
            Spare strategies are defined early — but quickly become outdated as conditions change.
          </p>

          <ul className="mt-6 space-y-3 text-gray-600 list-disc list-inside">
            <li>No visibility into real mold wear vs. assumptions</li>
            <li>Spare parts lists become incomplete or obsolete</li>
            <li>Unexpected failures disrupt production schedules</li>
            <li>Manual PM decisions vary by operator or facility</li>
            <li>Downtime, rushed repairs, and reduced mold lifespan</li>
          </ul>
        </div>

        {/* SOLUTION */}
        <div className="bg-[rgb(var(--input))] border border-[rgb(var(--border))] rounded-2xl p-10 shadow-sm">
          <h2 className="text-3xl font-bold text-[rgb(var(--foreground))]">
            Our Solution
          </h2>

          <p className="mt-4 text-lg text-gray-800 dark:text-gray-200">
            MoldPredict™ transforms real shop-floor data into predictive, actionable insights —
            helping teams plan maintenance, validate decisions, and standardize performance across operations.
          </p>

          <ul className="mt-6 space-y-3 text-gray-600 list-disc list-inside">
            <li>Predict wear and overhaul timing using live + historical data</li>
            <li>Generate AI-driven maintenance recommendations (“AI Insights”)</li>
            <li>Standardize decisions across roles (Operator → Engineer → Admin)</li>
            <li>Enable proactive planning instead of reactive repairs</li>
            <li>Improve uptime, part quality, and mold lifecycle ROI</li>
          </ul>
        </div>
      </div>
    </section>
  );
}