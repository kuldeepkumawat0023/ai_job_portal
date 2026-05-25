import React from "react";

import SEO from "@/components/SEO";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <SEO
        props={{
          title: "Login | AIJobFit - AI Powered Career Platform",

          description:
            "Login to AIJobFit and access AI-powered resume analysis, smart job matching, mock interviews, and career growth tools.",

          keywords:
            "AIJobFit login, AI career platform, resume analysis, AI recruitment, smart hiring, mock interview, job portal login",

          url: "/login",
        }}
      />

      <main
        className="w-full min-h-screen bg-surface"
        role="main"
        aria-label="AI JobFit Login Page"
      >
        {/* SEO Friendly Hidden Content */}
        <h1 className="sr-only">
          Login to AIJobFit Career Platform
        </h1>

        <p className="sr-only">
          Sign in to access AI-powered hiring tools, resume optimization,
          smart job matching, and mock interview preparation features.
        </p>

        <LoginForm />
      </main>
    </>
  );
}