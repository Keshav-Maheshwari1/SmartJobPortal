import React, { useEffect } from "react";
import Hero from "../components/Hero";
import FeedBack from "../components/FeedBack";
import Features from "../components/Features";
import { useLocation } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";

const LandingPage = () => {
  const location = useLocation();
  const message = location?.state?.message;

  useEffect(() => {
    if (message) {
      alert(message);
      window.history.replaceState({}, document.title);
    }
    if (
      location.state?.from === "login" ||
      location.state?.from === "signup" ||
      location.state?.from === "profile"
    ) {
      window.location.reload();
      window.history.replaceState({}, document.title);
    }
  }, [location, message]);

  return (
    <main className="bg-gray-900 text-gray-100">
      <AnimatedSection className="py-2 bg-gray-900">
        <Hero />
      </AnimatedSection>

      <AnimatedSection className="py-2 bg-gray-800">
        <Features />
      </AnimatedSection>
      <AnimatedSection className="pb-2 bg-gray-800">
        <FeedBack />
      </AnimatedSection>
    </main>
  );
};

export default LandingPage;
