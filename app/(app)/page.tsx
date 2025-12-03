import Hero from "@/components/Home_components/Hero";
import FeaturesGrid from "@/components/Home_components/FeaturesGrid";
import HowItWorks from "@/components/Home_components/HowItWorks";
import FeaturedVenues from "@/components/Home_components/FeaturedVenues";
import FindVenues from "@/components/Home_components/FindVenues";
import Testimonials from "@/components/Home_components/Testimonials";
import VenueMember from "@/components/Home_components/VenueMember";
import FAQ from "@/components/Home_components/FAQ";
import Newsletter from "@/components/Home_components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <FeaturesGrid /> */}
      <HowItWorks />
      <FeaturedVenues />
      <FindVenues />
      <Testimonials />
      <VenueMember />
      <FAQ />
      <Newsletter />
    </>
  );
}