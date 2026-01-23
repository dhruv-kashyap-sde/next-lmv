import PolicySidebar from "@/components/PolicySidebar";

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Your Information" },
  { id: "information-sharing", title: "4. Information Sharing" },
  { id: "data-security", title: "5. Data Security" },
  { id: "cookies", title: "6. Cookies & Tracking" },
  { id: "your-rights", title: "7. Your Rights" },
  { id: "childrens-privacy", title: "8. Children's Privacy" },
  { id: "changes", title: "9. Changes to Policy" },
  { id: "contact", title: "10. Contact Us" },
];

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how Loot My Vouchers collects, uses, and protects your personal information. Your privacy is important to us.",
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative py-20 md:py-28 border-b border-zinc-800">
        <div className="absolute inset-0 bg-background/20" />
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-primary font-medium tracking-wider text-sm md:text-base mb-4 uppercase">
            Loot My Vouchers
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-bebas text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-secondary-foreground md:text-lg max-w-2xl">
            Your privacy is important to us. This policy explains how we collect,
            use, and protect your personal information.
          </p>
          <p className="text-zinc-500 text-sm mt-6">
            Last updated: January 22, 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation (Client Component) */}
          <PolicySidebar sections={sections} />

          {/* Content Area */}
          <main className="flex-1 max-w-3xl">
            <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 md:p-10">
              {/* Section 1 */}
              <section id="introduction" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    Welcome to Loot My Vouchers. We are committed to protecting your personal
                    information and your right to privacy. This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when you visit our
                    website and use our services.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    By accessing or using our services, you agree to the terms of this Privacy
                    Policy. If you do not agree with the terms of this policy, please do not
                    access the site or use our services.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="information-we-collect" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                    <li>
                      <span className="font-medium text-foreground">Personal Information:</span> Name,
                      email address, phone number, and other contact details you provide during
                      registration or account creation.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Account Data:</span> Username,
                      password, account preferences, and profile information.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Transaction Information:</span>{" "}
                      Details about vouchers you redeem, purchases, and transaction history.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Communication Data:</span> Messages,
                      feedback, and correspondence you send to us.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Technical Data:</span> IP address,
                      browser type, device information, operating system, and usage patterns.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section id="how-we-use" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    We use the information we collect for various purposes, including:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                    <li>To provide, maintain, and improve our services</li>
                    <li>To process transactions and send related information</li>
                    <li>To send promotional communications (with your consent)</li>
                    <li>To respond to your comments, questions, and requests</li>
                    <li>To monitor and analyze trends, usage, and activities</li>
                    <li>To detect, investigate, and prevent fraudulent transactions</li>
                    <li>To personalize and improve your experience</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section id="information-sharing" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Information Sharing</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    We may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                    <li>
                      <span className="font-medium text-foreground">Service Providers:</span> With
                      third-party vendors who perform services on our behalf.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Business Partners:</span> With
                      voucher providers and brands to facilitate redemptions.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Legal Requirements:</span> When
                      required by law or to protect our rights and safety.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Business Transfers:</span> In
                      connection with mergers, acquisitions, or asset sales.
                    </li>
                  </ul>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    We do not sell your personal information to third parties for marketing purposes.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="data-security" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    We implement appropriate technical and organizational security measures to
                    protect your personal information against unauthorized access, alteration,
                    disclosure, or destruction. These measures include encryption, secure servers,
                    and access controls.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    However, no method of transmission over the Internet or electronic storage is
                    100% secure. While we strive to protect your personal information, we cannot
                    guarantee its absolute security.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies & Tracking Technologies</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    We use cookies and similar tracking technologies to collect and track
                    information about your browsing activities. Cookies help us improve your
                    experience, remember your preferences, and analyze site traffic.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    You can control cookie settings through your browser. However, disabling
                    cookies may affect the functionality of our website.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="your-rights" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    Depending on your location, you may have the following rights:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                    <li>
                      <span className="font-medium text-foreground">Access:</span> Request access to
                      your personal data we hold.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Correction:</span> Request
                      correction of inaccurate or incomplete data.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Deletion:</span> Request deletion
                      of your personal data in certain circumstances.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Portability:</span> Request a copy
                      of your data in a portable format.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Opt-out:</span> Opt out of
                      marketing communications at any time.
                    </li>
                  </ul>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    To exercise these rights, please contact us using the details provided below.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="childrens-privacy" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    Our services are not intended for individuals under the age of 18. We do not
                    knowingly collect personal information from children. If we become aware that
                    we have collected personal information from a child without parental consent,
                    we will take steps to delete that information.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to This Policy</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of
                    any changes by posting the new Privacy Policy on this page and updating the
                    "Last updated" date. We encourage you to review this policy periodically.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    Your continued use of our services after any changes indicates your acceptance
                    of the updated Privacy Policy.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section id="contact" className="mb-4">
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Us</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    If you have any questions or concerns about this Privacy Policy or our data
                    practices, please contact us:
                  </p>
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <p className="text-foreground font-medium">Loot My Vouchers</p>
                    <p className="text-zinc-400 mt-2">
                      Email:{" "}
                      <a
                        href="mailto:support@lootmyvouchers.in"
                        className="text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        support@lootmyvouchers.in
                      </a>
                    </p>
                    <p className="text-zinc-400">
                      Website:{" "}
                      <a
                        href="https://lootmyvouchers.in"
                        className="text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        lootmyvouchers.in
                      </a>
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
