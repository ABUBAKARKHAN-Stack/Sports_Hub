"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Phone, Mail, MessageSquare } from "lucide-react";

const faqs = [
  {
    question: "How do I book a court?",
    answer: "Simply create an account, browse available courts in your area, select your preferred time slot, and complete the secure payment. You'll receive instant confirmation via email and in-app notification. Most bookings are confirmed within minutes.",
    category: "Booking"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards (Visa, MasterCard, American Express), digital wallets (Apple Pay, Google Pay), UPI, and net banking. All payments are secured with 256-bit SSL encryption.",
    category: "Payment"
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer: "Yes! You can cancel or reschedule your booking up to 24 hours before your session starts for a full refund. Cancellations within 24 hours may incur a small fee. You can manage all your bookings from your account dashboard.",
    category: "Booking"
  },
  {
    question: "Do you offer equipment rental?",
    answer: "Most of our premium venues offer equipment rental including professional rackets, shuttlecocks, shoes, and grip tape. You can add equipment during booking or rent directly on-site. Equipment quality is regularly inspected.",
    category: "Equipment"
  },
  {
    question: "Are coaching sessions available?",
    answer: "Yes! We offer both group coaching (4-6 players) and private one-on-one sessions with certified coaches. All coaches are verified professionals with competitive experience. Book coaching through our platform or at partnered venues.",
    category: "Training"
  },
  {
    question: "What safety measures are in place?",
    answer: "All venues maintain high safety standards including CCTV surveillance, first aid kits, emergency protocols, and regular equipment checks. We also verify all users and provide insurance coverage for registered players.",
    category: "Safety"
  },
  {
    question: "Do you host tournaments?",
    answer: "Yes! We organize regular tournaments for all skill levels - beginner, intermediate, and advanced. Check our Events section for upcoming tournaments or contact us to organize a custom tournament for your group or company.",
    category: "Events"
  },
  {
    question: "How do I become a venue partner?",
    answer: "Venue owners can apply through our Partner Portal. We offer comprehensive support including marketing, booking management, and revenue analytics. Our team will guide you through the simple onboarding process.",
    category: "Partnership"
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Booking", "Payment", "Equipment", "Training", "Safety", "Events", "Partnership"];
  
  const filteredFaqs = activeCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-primary" />
            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
              Need Help?
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions about booking, payments, and our services
          </p>
        </div>

        {/* Categories Filter - Desktop */}
        <div className="hidden md:flex justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeCategory === category
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'bg-card text-muted-foreground hover:text-foreground hover:bg-gray-100 border border-border'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Categories Filter - Mobile */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300
                ${activeCategory === category
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="space-y-3 sm:space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className={`
                  bg-card rounded-xl sm:rounded-2xl border border-border
                  transition-all duration-300 overflow-hidden
                  ${openIndex === index ? 'shadow-medium' : 'shadow-soft hover:shadow-md'}
                `}
              >
                <button
                  className="w-full p-4 sm:p-6 text-left flex justify-between items-center gap-4 hover:bg-gray-50/50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-primary/10 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-[#097E52]" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <span className="text-xs font-medium text-[#097E52] bg-[#097E52]/10 px-2 py-0.5 rounded-full">
                        {faq.category}
                      </span>
                      <h3 className="font-semibold text-base sm:text-lg text-foreground mt-1">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  
                  <ChevronDown
                    className={`
                      h-5 w-5 text-muted-foreground flex-shrink-0
                      transition-transform duration-300
                      ${openIndex === index ? "rotate-180" : ""}
                    `}
                  />
                </button>
                
                <div
                  className={`
                    overflow-hidden transition-all duration-300
                    ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                  `}
                >
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="pl-9 sm:pl-12 border-l-2 border-[#097E52]/30">
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 border border-border shadow-soft max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Our support team is here to help you 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 sm:p-6 rounded-xl border border-border hover:border-[#097E52]/30 transition-colors">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-[#097E52]" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Call Us</h4>
              <p className="text-sm text-muted-foreground mb-2">+1 (800) 123-4567</p>
              <p className="text-xs text-gray-500">Available 24/7</p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-xl border border-border hover:border-[#097E52]/30 transition-colors">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-[#097E52]" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Email Us</h4>
              <p className="text-sm text-muted-foreground mb-2">help@dreamsports.com</p>
              <p className="text-xs text-gray-500">Response within 2 hours</p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-xl border border-border hover:border-[#097E52]/30 transition-colors">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-[#097E52]" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Live Chat</h4>
              <p className="text-sm text-muted-foreground mb-2">Chat with support</p>
              <p className="text-xs text-gray-500">Instant response</p>
            </div>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <button className="
              inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full
              bg-gradient-primary text-white font-semibold text-sm sm:text-base
              hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-300
            ">
              <MessageSquare className="h-4 w-4" />
              Start Live Chat
            </button>
            <p className="text-xs text-muted-foreground mt-2">
              Average wait time: less than 30 seconds
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;