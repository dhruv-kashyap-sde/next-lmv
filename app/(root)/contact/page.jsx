"use client";

import { useState } from "react";
// import emailjs from "@emailjs/browser";
import {
  Mail,
  MapPin,
  Headphones,
  Send,
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const serviceId = "service_vm2zrc9";
  const templateId = "template_zfenwia";
  const publicKey = "wANMLvVwjTB7NrdU_";

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: "Dhruv Kashyap",
      message,
    };

    // emailjs
    //   .send(serviceId, templateId, templateParams, publicKey)
    //   .then((response) => {
    //     console.log("sent", response);
    //     alert("Message sent successfully!");
    //     setName("");
    //     setEmail("");
    //     setMessage("");
    //     setIsLoading(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error", error);
    //     alert("Failed to send message. Please try again.");
    //     setIsLoading(false);
    //   });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@voucherhub.com",
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
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <MessageSquare className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  <h2 className="font-bebas text-2xl md:text-3xl lg:text-4xl text-primary">
                    Send us a Message
                  </h2>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 md:py-20">
                    <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-primary animate-spin mb-4" />
                    <p className="text-gray-400 text-sm md:text-base">Sending your message...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="brand"        
                      className="w-full p-8"            >
                      Send Message
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                )}
              </div>
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
