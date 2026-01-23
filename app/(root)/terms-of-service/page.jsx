import PolicySidebar from "@/components/PolicySidebar";

const sections = [
  { id: "agreements", title: "1. Agreements" },
  { id: "services", title: "2. Services & Subscriptions" },
  { id: "user-accounts", title: "3. User Accounts" },
  { id: "rights-and-laws", title: "4. Rights & Laws" },
  { id: "intellectual-property", title: "5. Intellectual Property" },
  { id: "user-content", title: "6. User Content" },
  { id: "prohibited-activities", title: "7. Prohibited Activities" },
  { id: "limitation-liability", title: "8. Limitation of Liability" },
  { id: "indemnification", title: "9. Indemnification" },
  { id: "termination", title: "10. Termination" },
  { id: "governing-law", title: "11. Governing Law" },
  { id: "changes", title: "12. Changes to Terms" },
  { id: "contact", title: "13. Contact Us" },
];

export const metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using Loot My Vouchers. Understand your rights and responsibilities when using our platform.",
  alternates: {
    canonical: "/terms-of-service",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen ">
      {/* Hero Header */}
      <div className="relative py-20 md:py-28 border-b border-zinc-800">
        <div className="absolute inset-0 bg-background/20" />
        <div className="container mx-auto px-4 relative z-10">
          <p className="text-primary font-medium tracking-wider text-sm md:text-base mb-4 uppercase">
            Loot My Vouchers
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-bebas text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-secondary-foreground md:text-lg max-w-2xl">
            Please read these terms and conditions carefully before using our
            website and services.
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
              <section id="agreements" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Agreements</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <h3 className="text-lg font-semibold text-primary mb-2">Introduction</h3>
                  <p className="text-zinc-300 leading-relaxed">
                    These Website Standard Terms and Conditions written on this webpage shall
                    manage your use of our website, Loot My Vouchers, accessible at
                    lootmyvouchers.in.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    These Terms will be applied fully and affect your use of this Website. By
                    using this Website, you agree to accept all terms and conditions written in
                    here. You must not use this Website if you disagree with any of these Website
                    Standard Terms and Conditions.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    Minors or people below 18 years old are not allowed to use this Website
                    without parental consent.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="services" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Services & Subscriptions</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    Loot My Vouchers provides a platform for users to discover, collect, and
                    redeem vouchers and discount codes from various brands and retailers.
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                    <li>
                      <span className="font-medium text-foreground">Free Services:</span> Basic access
                      to voucher listings and redemption features.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Premium Features:</span> Enhanced
                      features may be offered through paid subscriptions.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Third-Party Vouchers:</span> We
                      facilitate access to vouchers but are not responsible for third-party
                      merchant terms.
                    </li>
                  </ul>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    We reserve the right to modify, suspend, or discontinue any service at any
                    time without prior notice.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section id="user-accounts" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    When you create an account with us, you must provide accurate, complete, and
                    current information. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Ensuring your contact information is up to date</li>
                  </ul>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    We reserve the right to suspend or terminate accounts that violate these
                    terms or engage in fraudulent activity.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section id="rights-and-laws" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Rights & Laws</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    You agree to use our services only for lawful purposes and in accordance with
                    these Terms. You agree not to use our services:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
                    <li>In any way that violates any applicable law or regulation</li>
                    <li>To transmit any harmful, threatening, or objectionable material</li>
                    <li>To infringe upon the rights of others</li>
                    <li>To attempt to gain unauthorized access to our systems</li>
                    <li>To engage in any activity that disrupts our services</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section id="intellectual-property" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Intellectual Property Rights</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    Other than the content you own, under these Terms, Loot My Vouchers and/or
                    its licensors own all the intellectual property rights and materials
                    contained in this Website.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    You are granted limited license only for purposes of viewing the material
                    contained on this Website. You must not:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
                    <li>Republish material from this Website</li>
                    <li>Sell, rent, or sub-license material from this Website</li>
                    <li>Reproduce, duplicate, or copy material from this Website</li>
                    <li>Redistribute content from this Website without permission</li>
                  </ul>
                </div>
              </section>

              {/* Section 6 */}
              <section id="user-content" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. User Content</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    By posting content on our Website, you grant us a non-exclusive, worldwide,
                    royalty-free license to use, modify, publicly perform, publicly display,
                    reproduce, and distribute such content on and through our services.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    You represent and warrant that:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-2">
                    <li>You own or have the rights to the content you post</li>
                    <li>Your content does not violate the rights of any third party</li>
                    <li>Your content is accurate and not misleading</li>
                  </ul>
                </div>
              </section>

              {/* Section 7 */}
              <section id="prohibited-activities" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Prohibited Activities</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    You are prohibited from using the site or its content for:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                    <li>Creating fraudulent vouchers or codes</li>
                    <li>Automated scraping or data collection without permission</li>
                    <li>Circumventing security features of the site</li>
                    <li>Impersonating another person or entity</li>
                    <li>Spamming or sending unsolicited communications</li>
                    <li>Uploading malware or malicious code</li>
                    <li>Interfering with the proper working of the site</li>
                    <li>Engaging in any activity that could damage our reputation</li>
                  </ul>
                </div>
              </section>

              {/* Section 8 */}
              <section id="limitation-liability" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    In no event shall Loot My Vouchers, nor any of its officers, directors, and
                    employees, be held liable for anything arising out of or in any way connected
                    with your use of this Website, whether such liability is under contract.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    Loot My Vouchers, including its officers, directors, and employees, shall not
                    be held liable for any indirect, consequential, or special liability arising
                    out of or in any way related to your use of this Website.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    We are not responsible for the actions, products, or content of any third
                    parties, including merchants whose vouchers are listed on our platform.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section id="indemnification" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Indemnification</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    You hereby indemnify to the fullest extent Loot My Vouchers from and against
                    any and/or all liabilities, costs, demands, causes of action, damages, and
                    expenses arising in any way related to your breach of any of the provisions
                    of these Terms.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section id="termination" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Termination</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    We may terminate or suspend your account and access to our services
                    immediately, without prior notice or liability, for any reason whatsoever,
                    including without limitation if you breach these Terms.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    Upon termination, your right to use our services will cease immediately. All
                    provisions of the Terms which by their nature should survive termination
                    shall survive, including ownership provisions, warranty disclaimers,
                    indemnity, and limitations of liability.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section id="governing-law" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    These Terms shall be governed and construed in accordance with the laws of
                    India, without regard to its conflict of law provisions.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    Our failure to enforce any right or provision of these Terms will not be
                    considered a waiver of those rights. If any provision of these Terms is held
                    to be invalid or unenforceable by a court, the remaining provisions of these
                    Terms will remain in effect.
                  </p>
                </div>
              </section>

              {/* Section 12 */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to Terms</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    We reserve the right, at our sole discretion, to modify or replace these
                    Terms at any time. If a revision is material, we will try to provide at least
                    30 days' notice prior to any new terms taking effect.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    By continuing to access or use our service after those revisions become
                    effective, you agree to be bound by the revised terms. If you do not agree to
                    the new terms, please stop using the service.
                  </p>
                </div>
              </section>

              {/* Section 13 */}
              <section id="contact" className="mb-4">
                <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Us</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    If you have any questions about these Terms, please contact us:
                  </p>
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <p className="text-foreground font-medium">Loot My Vouchers</p>
                    <p className="text-zinc-400 mt-2">
                      Email:{" "}
                      <a
                        href="mailto:support@lootmyvouchers.in"
                        className="text-primary hover:text-amber-300 transition-colors"
                      >
                        support@lootmyvouchers.in
                      </a>
                    </p>
                    <p className="text-zinc-400">
                      Website:{" "}
                      <a
                        href="https://lootmyvouchers.in"
                        className="text-primary hover:text-amber-300 transition-colors"
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
