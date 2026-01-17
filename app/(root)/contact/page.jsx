import {
  Mail,
  MapPin,
  Headphones,
  Github,
  Linkedin,
  Twitter,
  Loader2,
} from "lucide-react";
import ContactForm from "./contactform";

export const metadata = {
  title: "Contact Us - LMV | Get Support & Send Feedback",
  description: "Get in touch with LMV for support, feedback, or questions about vouchers and deals. Our team is available 24/7 to help you save money with genuine discount codes.",
  keywords: [
    "contact lmv",
    "customer support",
    "voucher help",
    "feedback",
    "contact us",
    "support 24/7",
    "loot my vouchers contact",
    "get help",
  ],
  openGraph: {
    title: "Contact LMV - Customer Support & Feedback",
    description: "Need help with vouchers or have feedback? Contact LMV's support team. We're here 24/7 to assist you with any questions.",
    type: "website",
    url: "https://lootmyvouchers.com/contact",
    siteName: "LMV - Loot My Vouchers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LMV Contact Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact LMV - Get Support & Send Feedback",
    description: "Get in touch with LMV for support, feedback, or questions. Available 24/7 to help you.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://lootmyvouchers.com/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@lootmyvouchers.com",
      description: "Get in touch for support",
      color: "text-blue-400",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "India",
      description: "Serving customers worldwide",
      color: "text-green-400",
    },
    {
      icon: Headphones,
      title: "Support",
      value: "24/7 Available",
      description: "We're here to help you",
      color: "text-purple-400",
    },
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", color: "hover:bg-gray-700" },
    { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-600" },
    { icon: Twitter, label: "Twitter", color: "hover:bg-sky-500" },
  ];

  return (
    <div id="contact" className="py-12 md:py-16 lg:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 gradient text-transparent bg-clip-text">
            Get in Touch
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            Have questions, feedback, or need support? We'd love to hear from
            you!
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 md:h-full">
          {/* Contact Form - Left Side (50%) */}
          <div className="w-full md:w-1/2 h-full ">
            <div className="relative bg-white/5 backdrop-blur-sm border rounded-md p-6 md:p-8 md:pb-14 h-full overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/5 blur-xl" />

              {/* Form Content */}
              <ContactForm />
            </div>
          </div>

          {/* Contact Info Cards - Right Side (50%) */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-6">
            {/* Contact Info Cards */}
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-md p-5 md:p-6 hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="gradient rounded-full p-3 md:p-4 shrink-0">
                      <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bebas text-xl md:text-2xl text-foreground mb-1">
                        {info.title}
                      </h3>
                      <p className="text-primary font-semibold text-sm md:text-base mb-1 truncate">
                        {info.value}
                      </p>
                      <p className="text-xs md:text-sm text-gray-400">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Social Media Card */}
            <div className="gradient rounded-md p-4 text-center">
              <h3 className="font-bebas text-2xl md:text-3xl text-background mb-4">
                Follow Us
              </h3>
              <div className="flex justify-center gap-2 md:gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <button
                      key={index}
                      aria-label={social.label}
                      className={`bg-black/10 hover:bg-black/30 text-black p-3 md:p-4 rounded-full transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg ${social.color}`}
                    >
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs md:text-sm text-black/80 mt-4 md:mt-6">
                Stay updated with our latest vouchers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
