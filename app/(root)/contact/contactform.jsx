"use client";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2, CheckCircle2, HelpCircle, Bug, MessageCircle, MoreHorizontal } from "lucide-react";
import React, { useState } from "react";

const messageTypes = [
  { value: "feedback", label: "Feedback", icon: MessageCircle, description: "Share your thoughts" },
  { value: "question", label: "Question", icon: HelpCircle, description: "Ask us anything" },
  { value: "help", label: "Help", icon: MessageSquare, description: "Need assistance" },
  { value: "bug", label: "Bug Report", icon: Bug, description: "Report an issue" },
  { value: "other", label: "Other", icon: MoreHorizontal, description: "Something else" },
];

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  // Honeypot field - should remain empty
  const [website, setWebsite] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!name.trim() || !email.trim() || !message.trim() || !type) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (message.trim().length < 10) {
      setError("Message must be at least 10 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          type,
          honeypot: website, // Honeypot field
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.code === "RATE_LIMITED" || data.code === "BLOCKED" || data.code === "EMAIL_RATE_LIMITED") {
          setError(data.error || "Too many requests. Please try again later.");
        } else {
          setError(data.error || "Failed to send message. Please try again.");
        }
        return;
      }
      
      setIsSuccess(true);
      // Reset form after success
      setName("");
      setEmail("");
      setMessage("");
      setType("");
      
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAnother = () => {
    setIsSuccess(false);
    setError("");
  };
  
  // Success state
  if (isSuccess) {
    return (
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="font-bebas text-3xl md:text-4xl text-primary mb-3">
            Message Sent!
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-md mb-6">
            Thank you for reaching out! We've received your message and will get back to you as soon as possible.
          </p>
          <Button 
            onClick={handleSendAnother}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

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
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Message Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              What can we help you with? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {messageTypes.map((option) => {
                const Icon = option.icon;
                const isSelected = type === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : ""}`} />
                    <span className={`text-xs font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

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
              maxLength={100}
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
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Tell us how we can help you..."
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {message.length}/2000 characters
            </p>
          </div>
          
          {/* Honeypot field - hidden from users but bots will fill it */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            variant="brand" 
            className="w-full"
            disabled={!type || !name.trim() || !email.trim() || !message.trim()}
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
