import SEO from "@/components/SEO";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <SEO
        props={{
          title: "Create Account - AIJobFit",

          description:
            "Create your AIJobFit account to access AI-powered resume optimization, smart job matching, mock interviews, and career growth tools.",

          keywords:
            "AIJobFit register, create account, AI recruitment platform, AI hiring, resume optimization, smart job matching, career platform",

          url: "/register",
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <RegisterForm />
      </main>
    </>
  );
}