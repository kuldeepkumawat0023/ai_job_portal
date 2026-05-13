import React from 'react';
import Hero from "@/components/landing/home/Hero";
import Stats from "@/components/landing/home/Stats";
import VideoWalkthrough from "@/components/landing/home/VideoWalkthrough";
import Features from "@/components/landing/home/Features";
import Process from "@/components/landing/home/Process";
import Pricing from "@/components/landing/home/Pricing";
import Testimonials from "@/components/landing/home/Testimonials";
import Newsletter from "@/components/landing/home/Newsletter";


export default function LandingPage() {
  return (
    <div className="flex flex-col gap-0">
      <Hero />
      <Stats />
      <VideoWalkthrough />
      <Features />
      <Process />
      <Pricing />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
