"use client";

import { Mail, Bell, CheckCircle, Send } from "lucide-react";
import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail("");
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#097E52]/5 via-white to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-[#097E52]" />
              <span className="text-xs sm:text-sm font-medium text-[#097E52]">
                Stay Updated
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
              Never Miss{" "}
              <span className="text-gradient">Court Updates</span>
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Get exclusive access to new venues, special offers, tournaments, and badminton tips
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">2x</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Weekly Updates</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">0%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Spam</div>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="relative">
            {isSubscribed ? (
              // Success State
              <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-[#097E52]/30 shadow-medium">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-primary/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-[#097E52]" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-foreground mb-2">
                  You&apos;re Subscribed! 🎉
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Welcome to the DreamSports community! Check your inbox for our welcome email.
                </p>
              </div>
            ) : (
              // Newsletter Form
              <form
                onSubmit={handleSubmit}
                className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-border shadow-medium"
              >
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-bold text-lg sm:text-xl text-foreground mb-1">
                    Join Our Community
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Get weekly updates on new courts, tournaments, and exclusive offers
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email Input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#097E52]/30 focus:border-[#097E52] transition-all"
                      required
                    />
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#097E52]" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Exclusive offers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#097E52]" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Court availability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#097E52]" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Tournament alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#097E52]" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Training tips</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      w-full py-3 sm:py-4 rounded-xl
                      bg-gradient-primary text-white font-semibold text-sm sm:text-base
                      hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                      disabled:opacity-70 disabled:cursor-not-allowed
                      transition-all duration-300
                      flex items-center justify-center gap-2
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe Now
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Privacy Note */}
                <p className="text-center text-xs text-muted-foreground mt-4 sm:mt-6">
                  By subscribing, you agree to our{" "}
                  <a href="#" className="text-[#097E52] hover:underline">
                    Privacy Policy
                  </a>
                  . No spam, unsubscribe anytime.
                </p>
              </form>
            )}

            {/* Decorative Elements */}
            <div className="absolute -top-3 -right-3 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-primary/20 animate-ping opacity-75" />
            <div className="absolute -bottom-3 -left-3 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-primary/20 animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Testimonial */}
          <div className="mt-6 sm:mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              <span>&quot;The best way to stay updated on local badminton events!&quot; - Alex, Regular Subscriber</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;