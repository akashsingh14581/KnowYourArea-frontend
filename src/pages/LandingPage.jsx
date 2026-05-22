
import { useEffect } from "react";
import Hero from "../components/landing/Hero";
import LiveTicker from "../components/landing/LiveTracker";
import StatsBar from "../components/landing/StatsBar";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";

function LandingPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <LiveTicker />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  );
}

export default LandingPage;