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
            For a successful PM iteration of the mold tool, (Preventive/ Periodic Maintenance)
            many rely on replacement parts, inventoried since the mold is still brand new!  But
            becomes obsolete once a minor detail changes in the product, otherwise nonexistent  
            when it is time to install a broken item that didn´t make it to the list of spares built.
            This leads to delays and expedited repair work. The result:
          </p>

          <ul className="mt-6 space-y-3 text-gray-600 list-disc list-inside">
            <li>Unplanned downtime and rushed repairs</li>
            <li>Over- or under-maintaining molds</li>
            <li>Inaccurate supply performance affecting customer assembly lines and/or the end user.</li>
            <li>Lost production time and shortened mold life</li>
          </ul>
        </div>

        {/* SOLUTION */}
        <div className="bg-blue-50 rounded-2xl p-10 shadow-sm">
          <h2 className="text-3xl font-bold text-blue-700">
            Our Solution
          </h2>

          <p className="mt-4 text-lg text-blue-800">
            MoldPredict™ uses machine learning and statistical models coupled with real
            manufacturing data to predict mold overhaul before it happens — giving engineers
            clarity and confidence when it comes to deciding how long the mold can produce under
            the given process conditions. And the caveat is - it churns out the estimate for fund 
            approvals, ahead of time!
          </p>

          <ul className="mt-6 space-y-3 text-blue-700 list-disc list-inside">
            <li>Act early, no need to wait until it falls apart</li>
            <li>Thanks to Moldpredict, AI tool helps us translate mold diagnosis to planned refurbish!</li>
            <li>Optimize production time, have peace of mind.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
