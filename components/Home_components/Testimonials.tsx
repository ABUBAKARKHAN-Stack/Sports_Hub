"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Professional Player",
    rating: 5,
    content: "DreamSports transformed my training routine. The coaches are exceptional and the facilities are world-class. I've improved my game significantly since joining.",
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Weekly Player",
    rating: 5,
    content: "Booking courts has never been easier. The app is intuitive and the venues are always in perfect condition. Highly recommended for any serious player!",
    avatar: "MC",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Beginner",
    rating: 5,
    content: "As a complete beginner, I felt welcomed and supported. The group coaching sessions are fantastic and have helped me gain confidence on the court.",
    avatar: "ER",
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Tournament Organizer",
    rating: 5,
    content: "We've hosted multiple tournaments here. The organization and facilities are top-notch. Professional setup with excellent support staff.",
    avatar: "DW",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto play
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Touch swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) next(); // Swipe left
    if (touchStart - touchEnd < -50) prev(); // Swipe right
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-primary/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-primary" />
            <span className="text-xs sm:text-sm font-medium text-[#097E52]">
              Player Testimonials
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3">
            What Our{" "}
            <span className="text-gradient">Players</span>
            {" "}Say
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied badminton enthusiasts who trust DreamSports
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div 
            className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-medium border border-border"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Quote Icon */}
            <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-primary/20 mb-4 sm:mb-6" />
            
            {/* Content */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 sm:h-5 sm:w-5 fill-[#FFC107] text-[#FFC107]"
                    />
                  ))}
                </div>
                <span className="text-sm sm:text-base font-semibold text-foreground">
                  {testimonials[currentIndex].rating}.0 Rating
                </span>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed italic">
                "{testimonials[currentIndex].content}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">
                  {testimonials[currentIndex].avatar}
                </span>
              </div>
              
              <div>
                <h4 className="font-bold text-base sm:text-lg text-foreground">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Desktop */}
          <button
            onClick={prev}
            className="hidden sm:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white shadow-lg border border-border items-center justify-center hover:border-primary hover:scale-110 transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6 text-foreground" />
          </button>
          
          <button
            onClick={next}
            className="hidden sm:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-white shadow-lg border border-border items-center justify-center hover:border-primary hover:scale-110 transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 text-foreground" />
          </button>

          {/* Mobile Navigation Buttons */}
          <div className="sm:hidden flex justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="h-10 w-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center hover:border-primary transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            
            <button
              onClick={next}
              className="h-10 w-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center hover:border-primary transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${index === currentIndex
                    ? "w-8 bg-gradient-primary"
                    : "w-2 bg-border hover:bg-primary/50"
                  }
                `}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Additional Testimonials Grid - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8 lg:mt-12">
          {testimonials
            .filter((_, index) => index !== currentIndex)
            .slice(0, 3)
            .map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-border shadow-soft hover:shadow-medium transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 lg:h-4 lg:w-4 fill-[#FFC107] text-[#FFC107]"
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-sm lg:text-base text-foreground/90 line-clamp-3 mb-4 lg:mb-6">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-white text-xs lg:text-sm font-bold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm lg:text-base font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs lg:text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Rating Summary - Mobile */}
        <div className="md:hidden bg-card rounded-xl p-4 mt-6 border border-border shadow-soft">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#FFC107] text-[#FFC107]"
                />
              ))}
            </div>
            <span className="text-lg font-bold text-foreground">4.9</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Average rating from {testimonials.length * 50}+ reviews
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;