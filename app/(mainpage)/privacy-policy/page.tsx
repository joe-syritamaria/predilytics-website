import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="py-24 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>

        {/* Intro paragraph */}
        {/* Inspired by Promise Legal Template - introduction section */}
        <p className="mb-6 text-gray-700">
          Your privacy is critically important to us. This Privacy Policy describes how we collect, use, and share information about you when you use our website and services. Please read it carefully.
        </p>

        {/* 1. Information We Collect */}
        {/* Based on Promise Legal Sections: "Information We Collect" */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Information We Collect
          </h2>
          <p className="mb-2 text-gray-700">
            We may collect the following types of information:
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Personal Information:</strong> Name, email address, and other information you provide when contacting us or signing up for services.</li>
            <li><strong>Usage Information:</strong> Information automatically collected by our services or third-party providers, such as your IP address, browser type, device information, pages you visit, and time spent on our site.</li>
            <li><strong>Service Data:</strong> Data associated with your use of Supabase-hosted features, Render-hosted deployments, and other services integrated with our platform. {/* Adapted for your stack */}</li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        {/* Based on Promise Legal: "How We Use Information" */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-2">
            We use your information to:
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Provide, operate, and maintain our website and services.</li>
            <li>Respond to inquiries, support requests, and feedback.</li>
            <li>Analyze usage patterns to improve the performance and functionality of our services.</li>
            <li>Comply with legal obligations and protect our rights and property.</li>
          </ul>
        </section>

        {/* 3. Sharing and Disclosure */}
        {/* Based on Promise Legal & YC privacy policy example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. Sharing and Disclosure
          </h2>
          <p className="text-gray-700 mb-2">
            We do not sell your personal information. We may share your information:
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>With third-party service providers who perform services on our behalf (e.g., Supabase for database and authentication, Vercel for hosting, Render for deployments). {/* Adapted for your stack */}</li>
            <li>When required by law, regulation, legal process, or enforceable governmental request.</li>
            <li>To protect the rights, property, or safety of our company, users, or the public.</li>
          </ul>
        </section>

        {/* 4. Cookies and Tracking */}
        {/* Based on Promise Legal template section for cookies, adapted for future use */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Cookies and Tracking
          </h2>
          <p className="text-gray-700 mb-2">
            We may use cookies and similar tracking technologies to enhance your experience, remember your preferences, and improve our website. Cookies are small files stored on your device that help us recognize you and provide a smoother user experience.
          </p>
          <p className="text-gray-700 mb-2">
            Types of cookies we may use in the future:
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Essential Cookies:</strong> Required for core functionality, such as authentication and service performance.</li>
            <li><strong>Analytical Cookies:</strong> Help us understand how users interact with the website to improve functionality.</li>
            <li><strong>Advertising/Marketing Cookies:</strong> May be used if we implement promotional services or third-party advertising.</li>
          </ul>
          <p className="text-gray-700">
            You can manage or disable cookies through your browser settings, but some features of the website may not function properly if cookies are disabled.
          </p>
        </section>

        {/* 5. Data Retention */}
        {/* Promise Legal inspiration */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Data Retention
          </h2>
          <p className="text-gray-700">
            We retain personal information only as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce agreements.
          </p>
        </section>

        {/* 6. Data Security */}
        {/* Promise Legal + YC example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Data Security
          </h2>
          <p className="text-gray-700">
            We implement appropriate administrative, technical, and physical measures to protect your information from unauthorized access, use, or disclosure. However, no system is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* 7. Your Rights */}
        {/* Promise Legal template for user rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            7. Your Rights
          </h2>
          <p className="text-gray-700">
            Depending on your location, you may have rights under data protection laws, including the right to access, correct, or delete your personal information. To exercise your rights, contact us at{" "}
            <a href="mailto:support@example.com" className="text-blue-600 underline">
              support@example.com
            </a>.
          </p>
        </section>

        {/* 8. Third-Party Services */}
        {/* Adapted for your stack (Supabase, Vercel, Render) */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            8. Third-Party Services
          </h2>
          <p className="text-gray-700">
            We use the following third-party services in our operations:
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li><strong>Supabase:</strong> Database and authentication platform.</li>
            <li><strong>Vercel:</strong> Hosting and deployment platform for our website.</li>
            <li><strong>Render:</strong> Hosting platform for additional services or applications.</li>
          </ul>
          <p className="text-gray-700 mt-2">
            These services may process user data on our behalf. We ensure they adhere to appropriate privacy and security standards.
          </p>
        </section>

        {/* 9. Changes to This Policy */}
        {/* Promise Legal inspiration */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            9. Changes to This Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with the date of the latest revision. We encourage you to review this page periodically.
          </p>
        </section>

        {/* 10. Contact */}
        {/* Promise Legal + YC example */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            10. Contact Us
          </h2>
          <p className="text-gray-700">
            For questions or concerns regarding this Privacy Policy, please contact us at:{" "}
            <a href="mailto:support@example.com" className="text-blue-600 underline">
              support@example.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  );
}
