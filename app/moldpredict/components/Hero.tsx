import Link from "next/link";

interface HeroProps {
  onSeeHow: () => void; // define the prop for the "See How It Works" button
}

export default function Hero({ onSeeHow }: HeroProps) {
  return (
    <section
      id="download"
      className="max-w-7xl mx-auto px-6 py-28 text-center"
    >
      <h1 className="text-5xl md:text-6xl font-bold text-blue-700 leading-tight">
        Manage Mold Repair
        <span className="block text-blue-600">
          before they even happen!
        </span>
      </h1>

      <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
        MoldPredict™ employs data science to predict mold health with confidence.
        Forecast time and cost with feedback from the molding shop 
      </p>

      <div className="mt-10 flex justify-center gap-4">
        {/* Try It Out button styled like the previous Download button */}
        <Link
          href="/demo"
          className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition duration-300"
        >
          Try It Out
        </Link>

        {/* See How It Works button keeps secondary style */}
        <button
          onClick={onSeeHow} // trigger the HowItWorks modal
          className="px-8 py-4 border border-blue-600 text-blue-600 rounded-xl text-lg font-medium hover:bg-blue-100 transform hover:scale-105 transition duration-300"
        >
          See How It Works
        </button>
      </div>
    </section>
  );
}
