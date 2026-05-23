import React from "react";

import SEO from "@/components/SEO";

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
    <>
      <SEO
        props={{
          title: "AIJobFit - Precision Hiring & AI Recruitment",

          description:
            "AIJobFit helps job seekers and recruiters connect through AI-powered hiring, resume matching, and smart recruitment tools.",

          keywords:
            "AI jobs, AI hiring, recruitment platform, career portal, resume matching, job search",

          url: "/",
        }}
      />

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
    </>
  );
}