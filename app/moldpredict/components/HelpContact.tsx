"use client";

import Link from "next/link";
import { useState } from "react";
import AIChat from "./AIChat"; // Make sure path is correct

export default function HelpContact() {
  // State to control AI chat panel
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section className="py-24 bg-blue-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-blue-700">Need Help?</h2>

        <p className="mt-6 text-gray-600 text-lg">
          Get support through our AI assistant, submit a ticket,
          or speak directly with our engineering team.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {/* AI Chat */}
          <div
            className="bg-white border rounded-2xl p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
            onClick={() => setIsChatOpen(true)} // Open chat when card clicked
          >
            <h3 className="text-xl font-semibold text-blue-700">AI Assistant</h3>
            <p className="mt-3 text-gray-600 text-center">
              Get instant answers and guidance powered by AI.
            </p>

            <div className="mt-6 w-full">
              {/* Show a small prompt to click */}
              <button
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Chat Now
              </button>
            </div>
          </div>

          {/* Ticket */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-blue-700">Submit a Ticket</h3>
            <p className="mt-3 text-gray-600">
              Report issues or request help from our support team.
            </p>
            <Link
              href="/moldpredict/ticket"
              className="mt-6 block w-full rounded-xl border border-blue-600 py-3 text-center text-blue-600 transition hover:bg-blue-100"
            >
              Submit Ticket
            </Link>
          </div>

          {/* Call / Phone */}
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-blue-700">Talk to Us</h3>
            <p className="mt-3 text-gray-600">
              Schedule a call with our engineers for hands-on help.
            </p>

            <div className="mt-6 w-full py-3 border border-blue-600 text-blue-600 rounded-xl">
              +1 (415) 907-0704
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Component */}
      <AIChat isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </section>
  );
}
