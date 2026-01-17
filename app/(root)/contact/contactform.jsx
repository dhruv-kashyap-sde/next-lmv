'use client';
// import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";
import React, { useState } from "react";

const ContactForm = () => {
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
  return (
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
                    <p className="text-gray-400 text-sm md:text-base">
                      Sending your message...
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 md:space-y-6"
                  >
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
                      className="w-full  md:p-8"
                    >
                      Send Message
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                )}
              </div>
  );
};

export default ContactForm;
