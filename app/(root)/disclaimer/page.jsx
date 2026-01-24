import PolicySidebar from "@/components/PolicySidebar";
import Link from "next/link";
import { AlertTriangle, Building2, Mail, Shield, Heart, Users } from "lucide-react";

const sections = [
  { id: "general", title: "1. General Disclaimer" },
  { id: "non-profit", title: "2. Non-Profit Nature" },
  { id: "brand-affiliation", title: "3. Brand Affiliation" },
  { id: "voucher-accuracy", title: "4. Voucher Accuracy" },
  { id: "third-party", title: "5. Third-Party Links" },
  { id: "brand-rights", title: "6. Brand Rights & Removal" },
  { id: "sponsorship", title: "7. Sponsorship Inquiries" },
  { id: "limitation", title: "8. Limitation of Liability" },
  { id: "contact", title: "9. Contact Us" },
];

export const metadata = {
  title: "Disclaimer",
  description: "Read our disclaimer about voucher accuracy, brand affiliations, and limitations of liability. Loot My Vouchers is an independent, non-profit platform.",
  alternates: {
    canonical: "/disclaimer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerPage() {
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
            Disclaimer
          </h1>
          <p className="text-secondary-foreground md:text-lg max-w-2xl">
            Important information about our platform, brand relationships, and
            limitations of our services.
          </p>
          <p className="text-zinc-500 text-sm mt-6">
            Last updated: January 24, 2026
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <PolicySidebar sections={sections} />

          {/* Content Area */}
          <main className="flex-1 max-w-3xl">
            <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6 md:p-10">
              
              {/* Important Notice Banner */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-10 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-200 font-medium mb-1">Important Notice</p>
                  <p className="text-zinc-300 text-sm">
                    Loot My Vouchers is an independent, non-profit platform developed and 
                    maintained by a single individual. We are not affiliated with, sponsored by, 
                    or endorsed by any brand or company listed on our website.
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <section id="general" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. General Disclaimer</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    The information provided on Loot My Vouchers (lootmyvouchers.in) is for 
                    general informational purposes only. All vouchers, discount codes, and deals 
                    are shared in good faith, but we make no representation or warranty of any 
                    kind, express or implied, regarding the accuracy, adequacy, validity, 
                    reliability, availability, or completeness of any information on our website.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    Your use of the website and reliance on any information on the site is 
                    solely at your own risk. We encourage users to verify voucher details 
                    directly with the respective brands or retailers before making any purchase 
                    decisions.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="non-profit" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-400" />
                  2. Non-Profit Nature
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <div className="bg-zinc-800/50 rounded-lg p-5 border border-zinc-700 mb-4">
                    <p className="text-primary font-medium mb-2">Key Points:</p>
                    <ul className="list-disc list-inside text-zinc-300 space-y-2">
                      <li>Loot My Vouchers is a <span className="text-primary font-medium">non-profit initiative</span></li>
                      <li>Developed and maintained by a <span className="text-primary font-medium">single person</span></li>
                      <li>Created with the sole purpose of helping users save money</li>
                      <li>We do not charge users for accessing vouchers</li>
                      <li>No commercial interests influence our voucher listings</li>
                    </ul>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    This platform was created out of a genuine desire to help people save money 
                    on their purchases. The vouchers shared here are collected from various 
                    legitimate sources and are provided completely free of charge. We do not 
                    receive any payment or commission from brands for listing their vouchers.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section id="brand-affiliation" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-400" />
                  3. Brand Affiliation Disclaimer
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                    <p className="text-blue-200 font-medium">No Affiliation Statement</p>
                    <p className="text-zinc-300 text-sm mt-1">
                      Loot My Vouchers has no partnership, sponsorship, endorsement, or any 
                      formal relationship with any brand, company, or retailer whose vouchers 
                      appear on our platform.
                    </p>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    All brand names, logos, trademarks, and registered trademarks mentioned on 
                    this website are the property of their respective owners. Their use on our 
                    platform is purely for identification purposes and does not imply any 
                    association, sponsorship, or endorsement.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    We want to be completely transparent:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-2">
                    <li>We do <span className="font-medium text-foreground">NOT</span> receive any financial benefits from brands</li>
                    <li>We do <span className="font-medium text-foreground">NOT</span> have any partnership agreements with brands</li>
                    <li>We do <span className="font-medium text-foreground">NOT</span> represent or speak on behalf of any brand</li>
                    <li>Brands do <span className="font-medium text-foreground">NOT</span> pay us to list their vouchers</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section id="voucher-accuracy" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Voucher Accuracy</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    While we strive to ensure all vouchers and discount codes are accurate and 
                    working, we cannot guarantee:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
                    <li>That all vouchers will work at the time of use</li>
                    <li>The exact discount amount or percentage</li>
                    <li>Availability of the voucher for all users or regions</li>
                    <li>Compatibility with other offers or promotions</li>
                    <li>The validity period of any voucher</li>
                  </ul>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    Vouchers may expire, reach usage limits, or be modified by brands at any 
                    time without notice. Always verify the terms and conditions of each voucher 
                    directly with the respective brand or retailer.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="third-party" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Third-Party Links</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    Our website may contain links to external websites that are not operated by 
                    us. We have no control over the content and practices of these sites and 
                    cannot accept responsibility or liability for their respective privacy 
                    policies or content.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    When you click on a voucher link that takes you to a third-party website, 
                    you are subject to that website's terms and conditions and privacy policy. 
                    We recommend reviewing these policies before making any purchases.
                  </p>
                </div>
              </section>

              {/* Section 6 - Brand Rights */}
              <section id="brand-rights" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  6. Brand Rights & Removal Requests
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-5 mb-4">
                    <p className="text-green-200 font-medium mb-2">For Brand Representatives:</p>
                    <p className="text-zinc-300 text-sm">
                      If you represent a brand and wish to have your vouchers or brand information 
                      removed from our platform, we fully respect your rights and will comply with 
                      your request promptly.
                    </p>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    We recognize that brands have complete rights over their intellectual property, 
                    vouchers, and promotional materials. If your brand is listed on our website 
                    and you would like it removed, you have the absolute right to request removal.
                  </p>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    <span className="font-medium text-foreground">To request removal:</span>
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-2">
                    <li>Send an email to <a href="mailto:support@lootmyvouchers.in" className="text-primary hover:text-amber-300">support@lootmyvouchers.in</a></li>
                    <li>Use the subject line: "Brand Removal Request - [Your Brand Name]"</li>
                    <li>Include proof of brand representation or authorization</li>
                    <li>Specify which vouchers or content you want removed</li>
                  </ul>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    We commit to processing all valid removal requests within <span className="text-primary font-medium">48-72 hours</span> of 
                    receiving the request. No questions asked – we respect brand autonomy and 
                    intellectual property rights.
                  </p>
                </div>
              </section>

              {/* Section 7 - Sponsorship */}
              <section id="sponsorship" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  7. Sponsorship & Partnership Inquiries
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-5 mb-4">
                    <p className="text-purple-200 font-medium mb-2">Open to Collaboration</p>
                    <p className="text-zinc-300 text-sm">
                      While we currently operate as an independent, non-profit platform, we are 
                      open to discussions with brands interested in official partnerships or 
                      sponsorships.
                    </p>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    If your brand is interested in:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-2">
                    <li>Official sponsorship or partnership opportunities</li>
                    <li>Featured placement of your vouchers</li>
                    <li>Exclusive deals for our users</li>
                    <li>Any other form of collaboration</li>
                  </ul>
                  <p className="text-zinc-300 leading-relaxed mt-4">
                    Please reach out to us at <a href="mailto:support@lootmyvouchers.in" className="text-primary hover:text-amber-300">support@lootmyvouchers.in</a> with 
                    the subject line "Sponsorship Inquiry - [Your Brand Name]". We would be 
                    happy to discuss how we can work together while maintaining our commitment 
                    to providing free value to our users.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="limitation" className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed">
                    To the maximum extent permitted by applicable law, Loot My Vouchers and its 
                    operator shall not be liable for any indirect, incidental, special, 
                    consequential, or punitive damages, or any loss of profits or revenues, 
                    whether incurred directly or indirectly, or any loss of data, use, goodwill, 
                    or other intangible losses, resulting from:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
                    <li>Your use or inability to use our services</li>
                    <li>Any voucher that doesn't work as expected</li>
                    <li>Any unauthorized access to or use of our servers</li>
                    <li>Any errors, mistakes, or inaccuracies of content</li>
                    <li>Any third-party actions, products, or services</li>
                  </ul>
                </div>
              </section>

              {/* Section 9 */}
              <section id="contact" className="mb-4">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6 text-primary" />
                  9. Contact Us
                </h2>
                <div className="prose prose-invert prose-zinc max-w-none">
                  <p className="text-zinc-300 leading-relaxed mb-4">
                    If you have any questions about this Disclaimer, or if you're a brand 
                    representative with removal or partnership inquiries, please contact us:
                  </p>
                  <div className="bg-zinc-800/50 rounded-lg p-5 border border-zinc-700">
                    <p className="text-foreground font-medium text-lg">Loot My Vouchers</p>
                    <div className="mt-3 space-y-2">
                      <p className="text-zinc-400">
                        <span className="text-zinc-500">General Inquiries:</span>{" "}
                        <a
                          href="mailto:support@lootmyvouchers.in"
                          className="text-primary hover:text-amber-300 transition-colors"
                        >
                          support@lootmyvouchers.in
                        </a>
                      </p>
                      <p className="text-zinc-400">
                        <span className="text-zinc-500">Brand Removal:</span>{" "}
                        <span className="text-zinc-300">Subject: "Brand Removal Request"</span>
                      </p>
                      <p className="text-zinc-400">
                        <span className="text-zinc-500">Sponsorship:</span>{" "}
                        <span className="text-zinc-300">Subject: "Sponsorship Inquiry"</span>
                      </p>
                      <p className="text-zinc-400">
                        <span className="text-zinc-500">Website:</span>{" "}
                        <a
                          href="https://lootmyvouchers.in"
                          className="text-primary hover:text-amber-300 transition-colors"
                        >
                          lootmyvouchers.in
                        </a>
                      </p>
                    </div>
                  </div>
                  <p className="text-zinc-500 text-sm mt-4">
                    We typically respond to all inquiries within 24-48 hours.
                  </p>
                </div>
              </section>

              {/* Related Pages */}
              <div className="mt-10 pt-6 border-t border-zinc-800">
                <p className="text-zinc-400 text-sm mb-3">Related Pages:</p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/privacy-policy" 
                    className="text-primary hover:text-amber-300 text-sm transition-colors"
                  >
                    Privacy Policy →
                  </Link>
                  <Link 
                    href="/terms-of-service" 
                    className="text-primary hover:text-amber-300 text-sm transition-colors"
                  >
                    Terms of Service →
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-primary hover:text-amber-300 text-sm transition-colors"
                  >
                    About Us →
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-primary hover:text-amber-300 text-sm transition-colors"
                  >
                    Contact Us →
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}