export default function ProblemSolution() {
  return (
    <section
      id="solution"
      className="bg-white py-24 px-6"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* PROBLEM */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            The Challenge
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Mold makers traditionally rely on costly trial runs,
            intuition, and historical guesswork to decide when
            a mold needs service. And periodic mantenence is costly. 
            This leads to delays, scrap, and expensive rework.
            The result:
          </p>

          <ul className="mt-6 space-y-3 text-gray-600 list-disc list-inside">
            <li>Unplanned downtime and rushed repairs</li>
            <li>Over- or under-maintaining molds</li>
            <li>Inaccurate cost forecasting</li>
            <li>Lost production time and shortened mold life</li>
          </ul>
        </div>

        {/* SOLUTION */}
        <div className="bg-blue-50 rounded-2xl p-10 shadow-sm">
          <h2 className="text-3xl font-bold text-blue-700">
            Our Solution
          </h2>

          <p className="mt-4 text-lg text-blue-800">
            MoldPredict™ uses machine learning models trained on real
            manufacturing data to predict mold overhaul timing and costs
            before it happens — giving engineers clarity and confidence.
          </p>

          <ul className="mt-6 space-y-3 text-blue-700 list-disc list-inside">
            <li>Act early, don’t just react</li>
            <li>Reduce unexpected repairs</li>
            <li>Optimize production time</li>
            <li>Data-backed engineering decisions</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
