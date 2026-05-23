import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import SEO from "@/components/SEO";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return (
    <>
      <SEO
        props={{
          title: "Verify OTP - AIJobFit | Secure Account Verification",

          description:
            "Verify your OTP securely to activate or recover your AIJobFit account and continue accessing AI-powered job matching and recruitment tools.",

          keywords:
            "AIJobFit OTP verification, verify account, email verification, secure authentication, AI hiring platform verification, account security, password reset OTP",

          url: "/verify-otp",
        }}
      />

      <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Background Abstract Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full blur-[60px] md:blur-[120px] -z-10 animate-pulse"></div>

        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <VerifyOtpForm />
        </Suspense>
      </main>
    </>
  );
}