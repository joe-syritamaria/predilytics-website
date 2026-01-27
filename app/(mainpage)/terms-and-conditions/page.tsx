export default function TermsOfServicePage() {
  return (
    <main className="relative mx-auto max-w-5xl px-6 py-12">
      {/* Side download button */}
      <div className="sticky top-24 float-right ml-8 hidden md:block">
        <a
          href="/termsofservice/Terms of Service.pdf"
          download
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          Download Full Terms of Service (PDF)
        </a>
      </div>

        {/* TERMS CONTENT */}
        <section className="text-[11px] leading-tight text-neutral-800">
          <h1 className="mb-2 text-sm font-semibold uppercase tracking-wide">
            Predilytics Inc. Terms of Service
          </h1>
          <p className="mb-6 text-[10px] text-neutral-500">
            Last Updated: January 24, 2026
          </p>

          <p className="mb-4">
            Welcome, and thank you for your interest in Predilytics Inc.
            (“Predilytics,” “we,” “us,” or “our”). These Terms of Service
            (“Terms”) are a legally binding agreement between you and
            Predilytics governing your access to and use of our websites,
            applications, APIs, and related services (collectively, the
            “Services”).
          </p>

          <p className="mb-4 font-semibold uppercase">
            PLEASE READ THESE TERMS CAREFULLY.
          </p>

          <p className="mb-6">
            By accessing or using the Services, clicking “I accept,” creating
            an account, or otherwise indicating your assent, you agree to be
            bound by these Terms and our Privacy Policy. If you do not agree,
            you may not access or use the Services.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            1. Service Overview
          </h2>
          <p className="mb-4">
            Predilytics provides a data analytics, forecasting, and predictive
            intelligence platform offered on a subscription and/or usage-based
            basis. The Services may include dashboards, reports, APIs, data
            ingestion tools, and related functionality. We may modify, suspend,
            or discontinue any part of the Services at any time.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            2. Eligibility
          </h2>
          <p className="mb-4">
            You must be at least 18 years old to use the Services. By using the
            Services, you represent and warrant that you have not previously
            been suspended or removed from the Services and that your use
            complies with all applicable laws.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            3. Accounts and Registration
          </h2>
          <p className="mb-4">
            You may be required to create an account to access certain features.
            You are responsible for maintaining the confidentiality of your
            credentials and for all activities conducted through your account.
            You agree to provide accurate and current information at all times.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            4. Fees, Billing, and Refunds
          </h2>
          <p className="mb-4">
            Certain features require payment of fees. All fees are stated in
            U.S. dollars unless otherwise indicated. Fees may be charged on a
            subscription, usage-based, or pay-as-you-go basis. You authorize us
            and our payment processors to charge your designated payment method
            for all applicable fees and taxes.
          </p>
          <p className="mb-4">
            Except where required by law, fees are non-refundable. Refunds may
            be issued at our sole discretion, including for billing errors or
            service defects. If you cancel a subscription, you remain
            responsible for all charges incurred prior to cancellation.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            5. Ownership and Proprietary Rights
          </h2>
          <p className="mb-4">
            The Services, including all software, code, algorithms, models,
            designs, text, graphics, and documentation, are owned by
            Predilytics or its licensors and are protected by intellectual
            property laws. Except as expressly permitted, you may not copy,
            modify, distribute, sell, lease, reverse engineer, or create
            derivative works from the Services.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            6. License
          </h2>
          <p className="mb-4">
            Subject to your compliance with these Terms, we grant you a limited,
            non-exclusive, non-transferable, revocable license to access and
            use the Services solely for your internal business or personal
            purposes.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            7. Prohibited Conduct
          </h2>
          <p className="mb-4">
            You agree not to misuse the Services, interfere with their
            operation, access them without authorization, or use them for any
            unlawful or abusive purpose, including attempting to bypass
            security controls.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            8. Disclaimers
          </h2>
          <p className="mb-4 uppercase">
            THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL
            WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            9. Limitation of Liability
          </h2>
          <p className="mb-4 uppercase">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, PREDILYTICS SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, OR ANY LOSS OF DATA, PROFITS, OR REVENUE.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            10. Termination
          </h2>
          <p className="mb-4">
            We may suspend or terminate your access to the Services at any time
            for any reason. Upon termination, all licenses granted to you will
            immediately cease.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            11. Governing Law
          </h2>
          <p className="mb-4">
            These Terms are governed by the laws of the State of California,
            without regard to conflict-of-law principles. Any disputes shall be
            resolved exclusively in the state or federal courts located in San
            Francisco County, California.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            12. Changes
          </h2>
          <p className="mb-4">
            We may update these Terms at any time. Continued use of the Services
            constitutes acceptance of the revised Terms.
          </p>

          <h2 className="mt-6 font-semibold uppercase">
            13. Contact
          </h2>
          <p className="mb-8">
            For questions regarding these Terms, contact us at
            support@predilyticsinc.com.
          </p>

          {/* SUMMARY NOTICE */}
          <div className="mt-12 border-t border-neutral-300 pt-4 text-[10px] text-neutral-500">
            This Terms of Service page is provided for convenience and
            readability. The full, legally binding version of the Terms of
            Service is available for download and shall control in the event of
            any inconsistency.
          </div>
        </section>
    </main>
  );
}
