"use client";

import { CheckCircle, TrendingUp, Users, Shield, Calendar, BarChart, Headphones, Star } from "lucide-react";

const VenueMember = () => {
  const mainBenefits = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Increase Bookings",
      description: "Get more visibility and 30% higher booking rates",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Access Premium Network",
      description: "Connect with 50,000+ active players",
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "Real-time Analytics",
      description: "Track performance with detailed insights",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Smart Booking System",
      description: "Automated scheduling and payments",
    },
  ];

  const features = [
    "Priority listing in search results",
    "Verified badge for credibility",
    "Dedicated account manager",
    "Marketing & promotional support",
    "Equipment partnerships",
    "Training program integration",
    "24/7 customer support",
    "Revenue analytics dashboard",
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-primary" />
            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
              For Venue Owners
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            Grow Your{" "}
            <span className="text-gradient">Business</span>
            {" "}With Us
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join DreamSports as a partner venue and unlock powerful tools to maximize your court utilization and revenue.
          </p>
        </div>

        {/* Main Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
          {mainBenefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="text-gradient">
                  {benefit.icon}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="font-bold text-base sm:text-lg text-foreground mb-1 sm:mb-2 group-hover:text-[#097E52] transition-colors">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Features & CTA Section */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 border border-border shadow-soft max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            {/* Features List */}
            <div>
              <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-foreground mb-4 sm:mb-6">
                Everything You Need to Succeed
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#097E52] mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-[#097E52]/5 to-[#23B33A]/5 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#097E52]/20">
              <div className="text-center mb-6">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                
                <h4 className="font-bold text-lg sm:text-xl text-foreground mb-2">
                  Ready to Get Started?
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Join 500+ successful venues already on our platform
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Average revenue increase</span>
                  <span className="font-bold text-[#097E52]">+35%</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Setup time</span>
                  <span className="font-bold text-[#097E52]">24 hours</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Support response</span>
                  <span className="font-bold text-[#097E52]">&lt; 2 hours</span>
                </div>
              </div>

              <button className="
                w-full mt-6 sm:mt-8 py-3 sm:py-4 rounded-xl
                bg-gradient-primary text-white font-semibold text-sm sm:text-base
                hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                transition-all duration-300
                flex items-center justify-center gap-2
              ">
                <span>Schedule a Free Demo</span>
                <Calendar className="h-4 w-4" />
              </button>

              <p className="text-center text-xs text-muted-foreground mt-3">
                No commitment • 30-day trial • Cancel anytime
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mt-8 sm:mt-12">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">4.9/5</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Partner Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">500+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Active Venues</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">50K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Active Players</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1">98%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Retention Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueMember;