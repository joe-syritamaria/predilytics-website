export default function PrivacyPolicyPage() {
  return (
    <div className="relative mx-auto max-w-5xl px-6 py-12">
      {/* Side download button */}
      <div className="sticky top-24 float-right ml-8 hidden md:block">
        <a
          href="/privacypolicy/privacy-policy.pdf"
          download
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          Download Full Privacy Policy (PDF)
        </a>
      </div>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-lg font-semibold tracking-tight">
          Predilytics Inc. Privacy Policy
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Last Updated: Jan 24, 2026
        </p>
      </header>

      {/* Policy body */}
      <div className="space-y-3 text-[11px] leading-tight text-gray-800">
        <p>
          This Privacy Policy (“Privacy Policy”) describes the practices of
          Predilytics Inc. (“we,” “us,” “our”) with respect to the Personal
          Information we collect from or about you when you use our websites,
          applications, and services (collectively, the “Services”).
        </p>

        <p>
          We are committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, share, and protect your information, and
          your rights regarding your information. By using the Services, you
          consent to the practices described herein.
        </p>

        <h2 className="font-semibold">1. INFORMATION WE COLLECT</h2>

        <p className="font-semibold">1.1 Personal Information You Provide</p>
        <p>
          We may collect Personal Information that you voluntarily provide when
          interacting with the Services, including, but not limited to: - Contact
          information such as name, email address, phone number; - Account
          credentials and login information; - Communications with us through
          email, support tickets, or other channels; - Any other information you
          provide through forms, surveys, or correspondence.
        </p>

        <p className="font-semibold">1.2 Information Collected Automatically</p>
        <p>
          We and our service providers may automatically collect information when
          you use or interact with the Services, including, but not limited to:
          - Log Data: IP address, browser type, operating system, date and time of
          interaction; - Usage Data: Pages visited, actions taken, features used,
          navigation paths; - Device Information: Device type, unique identifiers,
          operating system; - Location Information: General location inferred
          from IP address; - Cookies and Tracking: Cookies, pixels, and similar
          technologies to analyze usage, personalize experience, and improve the
          Services.
        </p>

        <p className="font-semibold">1.3 Information From Third Parties</p>
        <p>
          We may receive information from vendors, service providers, or other
          third parties. This information may be combined with information we
          collect directly from you.
        </p>

        <h2 className="font-semibold">2. HOW WE USE PERSONAL INFORMATION</h2>
        <p>
          We use Personal Information for purposes including: - Providing,
          operating, and improving the Services; - Responding to inquiries,
          support requests, or feedback; - Monitoring and analyzing usage trends
          and service performance; - Preventing fraud, abuse, or illegal
          activity; - Ensuring the safety, security, and integrity of users and
          the Services; - Marketing and communication (where permitted by law); -
          Compliance with legal obligations, including responding to subpoenas or
          court orders; - Any other purpose for which we provide notice.
        </p>

        <p>
          Aggregated or de-identified information may be used for any purpose,
          including analytics, research, and service improvement.
        </p>

        <h2 className="font-semibold">3. DISCLOSURE OF PERSONAL INFORMATION</h2>
        <p>
          We may disclose Personal Information to: - Affiliates and subsidiaries;
          - Vendors, contractors, and service providers performing services on
          our behalf (including Supabase, Vercel, Render); - Legal authorities or
          third parties when required by law or to protect rights or safety; -
          Business partners in connection with mergers, acquisitions, or business
          transfers; - Third parties with your consent.
        </p>

        <p>
          We do not sell or otherwise disclose Personal Information to third
          parties for unrelated commercial purposes without your consent, except
          as described under California law (see Section 6).
        </p>

        <h2 className="font-semibold">4. COOKIES AND TRACKING TECHNOLOGIES</h2>
        <p>
          We and our vendors may use cookies, pixels, and other tracking
          technologies to analyze website traffic and usage patterns, remember
          your preferences, personalize content, and measure the effectiveness
          of marketing or analytics. You may manage or disable cookies via your
          browser settings, but certain features of the Services may not function
          properly if cookies are disabled.
        </p>

        <h2 className="font-semibold">5. YOUR RIGHTS</h2>
        <p>
          Depending on your location, you may have rights under applicable privacy laws, including: 
          The right to access your Personal Information; 
          The right to receive information about how we process your Personal Information; 
          The right to correct inaccurate Personal Information; 
          The right to delete Personal Information; 
          The right to transfer your Personal Information to a third party; 
          The right to restrict how we process your Personal Information; 
          The right to object to how we process your Personal Information; and 
          The right to lodge a complaint with your local data protection authority. 
        </p>

        <h2 className="font-semibold">6. CALIFORNIA RESIDENTS</h2>
        <p>
        If you are a California resident, the following additional rights may apply under the 
        CCPA/CPRA:
        </p>

        <p className="font-semibold">6.1  Categories of Personal Information Collected </p>
        <p>
          Such as - Identifiers (name, email, IP address); - Internet/network activity 
          (usage and browsing data); - Device information; - Sensitive Personal Information 
          (account credentials)
        </p>

        <p className="font-semibold">6.2  Your CCPA/CPRA Rights </p>
        <p>
        California residents may: - Request categories and specific pieces of Personal Information collected; 
        - Request deletion of Personal Information, subject to legal exceptions; - Opt out of sale or sharing 
        of Personal Information; 
        You also have the right to not be discriminated against (as provided for in applicable law) 
        for exercising certain of your rights. Certain information may be exempt from such requests 
        under applicable law. We need certain types of information so that we can provide the 
        Services to you. If you ask us to delete such information, you may no longer be able to access 
        or use the Services. Please note that we do not use or disclose sensitive personal 
        information other than for purposes for which you cannot opt out under the CCPA.
        </p>

        <p className="font-semibold">6.3 Exercise of Rights </p>
        <p>
        To exercise your California privacy rights, contact us at support@predilyticsinc.com. We may 
        require identity verification before fulfilling requests. Authorized agents may act on your 
        behalf with proper documentation.
        </p>

        <p className="font-semibold">6.4 “Sale” and “Sharing” of Personal Information </p>
        <p>
        We may provide Personal Information to third-party analytics or advertising providers. Such 
        disclosures may constitute “sales” or “sharing” under the CCPA. California residents may opt 
        out by contacting us. 
        </p>

        <p className="font-semibold">6.5 Shine the Light  </p>
        <p>
        California residents may request disclosure of information shared for direct marketing 
        purposes. We do not share Personal Information for third-party direct marketing.  
        </p>

        <h2 className="font-semibold">7. CHILDREN’S PRIVACY</h2>
        <p>
        We do not knowingly collect Personal Information from children under 18, and no part of 
        our Services are directed to children. If you learn that a child has provided us with Personal 
        Information in violation of this Privacy Policy, then you may alert us at 
        support@predilyticsinc.com. 
        </p>

        <h2 className="font-semibold">8. SECURITY</h2>
        <p>
        We implement reasonable administrative, technical, and physical measures to protect 
        Personal Information. However, as no electronic transmission or storage of personal 
        information can be entirely secure, we can make no guarantees as to the security or privacy 
        of your personal information.
        </p>

        <h2 className="font-semibold">9. RETENTION</h2>
        <p>
        We retain Personal Information only as long as necessary for the purposes described herein 
        or as required by law. The length of time for which we retain Personal Information depends 
        on the purposes for which we collected and use it and your choices, after which time we may 
        delete and/or aggregate it.  

        </p>

        <h2 className="font-semibold">10. CONSENT TO TRANSFER</h2>
        <p>
        By using the Services, or providing us with any information, you consent to the collection, 
        processing, maintenance, and transfer of such information in and to the United States and 
        other applicable countries in which the privacy laws may not be as comprehensive as, or 
        equivalent to, those in the country where you reside and/or are a citizen. 
        </p>

        <h2 className="font-semibold">11. THIRD-PARTY LINKS AND SERVICES</h2>
        <p>
        The Services may contain links to third-party sites or services. We are not responsible for 
        their privacy practices. Please be aware that this Privacy Policy does not apply to your 
        activities on these third-party services or to any Personal Information you disclose to these 
        third parties. We encourage you to review their privacy policies before providing Personal 
        Information.
        </p>

        <h2 className="font-semibold">12. CHANGES TO THIS PRIVACY POLICY</h2>
        <p>
        We may update this Privacy Policy at any time. The “Last Updated” date will reflect the most 
        recent changes. By continuing to use the Services, you are confirming that you have read and 
        understood the latest version of this Privacy Policy.
        </p>

        <h2 className="font-semibold">13. CONTACT US</h2>
        <p>For questions regarding this Privacy Policy, please contact us at: 
        support@predilyticsinc.com.</p>
      </div>

      {/* Bottom notice */}
      <footer className="mt-10 border-t pt-4 text-[10px] text-gray-500">
        This Privacy Policy is provided for convenience and readability. The
        legally binding and complete version of this Privacy Policy is available
        in PDF format.{' '}
        <a
          href="/privacypolicy/privacy-policy.pdf"
          download
          className="underline hover:text-gray-700"
        >
          Download the full legal version here.
        </a>
      </footer>
    </div>
  );
}
