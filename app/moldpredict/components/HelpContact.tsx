export default function HelpContact() {
  return (
    <section className="py-24 bg-blue-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-700">
          Need Help?
        </h2>

        <p className="mt-6 text-gray-600 text-lg">
          Get support through our AI assistant, submit a ticket,
          or speak directly with our engineering team.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {/* AI Chat */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-blue-700">
              AI Assistant
            </h3>
            <p className="mt-3 text-gray-600">
              Get instant answers and guidance powered by AI.
            </p>
            <button className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              Chat Now
            </button>
          </div>

          {/* Ticket */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-blue-700">
              Submit a Ticket
            </h3>
            <p className="mt-3 text-gray-600">
              Report issues or request help from our support team.
            </p>
            <button className="mt-6 w-full py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-100 transition">
              Submit Ticket
            </button>
          </div>

          {/* Call */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-blue-700">
              Talk to Us
            </h3>
            <p className="mt-3 text-gray-600">
              Schedule a call with our engineers for hands-on help.
            </p>
            <button className="mt-6 w-full py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-100 transition">
              Book a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
