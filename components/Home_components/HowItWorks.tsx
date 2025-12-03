"use client";

import { UserPlus, MapPin, CalendarCheck, CheckCircle } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    number: "01",
    icon: <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />,
    title: "Create Your Account",
    description: "Sign up in under 2 minutes with email or social login. No commitments, free to explore.",
    details: ["No credit card required", "Free trial period", "Profile customization"],
    gradient: "from-[#006177] to-[#269089]",
    bgColor: "bg-gradient-to-r from-[#006177]/5 to-[#269089]/5",
    borderColor: "border-[#006177]/20",
  },
  {
    number: "02",
    icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />,
    title: "Find Perfect Courts",
    description: "Browse premium sports venues near you with real-time availability and ratings.",
    details: ["Advanced filters", "Real-time availability", "User reviews & ratings"],
    gradient: "from-[#269089] to-[#7ABC82]",
    bgColor: "bg-gradient-to-r from-[#269089]/5 to-[#7ABC82]/5",
    borderColor: "border-[#269089]/20",
  },
  {
    number: "03",
    icon: <CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />,
    title: "Book & Play",
    description: "Secure your time slot instantly with easy payment and immediate confirmation.",
    details: ["Instant confirmation", "Secure payments", "Booking management"],
    gradient: "from-[#097E52] to-[#23B33A]",
    bgColor: "bg-gradient-to-r from-[#097E52]/5 to-[#23B33A]/5",
    borderColor: "border-[#097E52]/20",
  },
];

const HowItWorks = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-primary" />
            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
              How It Works
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            Start Playing in{" "}
            <span className="text-gradient">3 Easy Steps</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of players who found their perfect court through DreamSports
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Step Card */}
              <div className={`
                relative bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8
                border border-border
                transition-all duration-300
                ${hoveredIndex === index 
                  ? 'shadow-xl -translate-y-2 border-[#097E52]/30' 
                  : 'shadow-soft hover:shadow-md hover:-translate-y-1'
                }
                h-full flex flex-col
              `}>
                
                {/* Step Number */}
                <div className="absolute -top-3 sm:-top-4 left-4 sm:left-6">
                  <div className={`
                    relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center
                    text-white font-bold text-xs sm:text-sm md:text-base
                    bg-gradient-to-r ${step.gradient} shadow-md
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    {step.number}
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-75" />
                  </div>
                </div>

                {/* Icon */}
                <div className={`
                  ${step.bgColor} h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16
                  rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 md:mb-6
                  transition-all duration-300 group-hover:scale-110 self-start
                  ${step.borderColor} border
                `}>
                  <div className={`text-transparent bg-clip-text bg-gradient-to-r ${step.gradient}`}>
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2 sm:space-y-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3">
                        <div className={`${step.bgColor} p-1 rounded-full ${step.borderColor} border`}>
                          <CheckCircle className={`h-3 w-3 sm:h-4 sm:w-4 text-transparent bg-clip-text bg-gradient-to-r ${step.gradient}`} />
                        </div>
                        <span className="text-xs sm:text-sm text-foreground font-medium">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow for Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className={`
                      h-8 w-8 rounded-full bg-white border border-border flex items-center justify-center
                      transition-all duration-300
                      ${hoveredIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                      shadow-sm group-hover:opacity-100 group-hover:scale-100
                    `}>
                      <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${steps[index + 1].gradient}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Connector */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Next:</span>
                    <span className="font-medium text-foreground">{steps[index + 1].title.split(' ')[0]}</span>
                    <div className={`p-0.5 rounded-full bg-gradient-to-r ${steps[index + 1].gradient}`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Progress Dots */}
        <div className="md:hidden flex justify-center gap-2 mt-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`
                h-2 rounded-full transition-all duration-300
                ${hoveredIndex === index || hoveredIndex === null
                  ? `w-6 bg-gradient-to-r ${steps[index].gradient}`
                  : 'w-2 bg-border'
                }
              `}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <button className="
            inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full
            bg-gradient-primary text-white font-semibold text-sm sm:text-base
            hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300
          ">
            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
            Start Your Journey
          </button>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3">
            No credit card required • Free 7-day trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;