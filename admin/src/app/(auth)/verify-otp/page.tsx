import { Suspense } from "react";
import SEO from "@/components/SEO";
import AdminVerifyOtpForm from "@/components/auth/VerifyOtpForm";

export default function AdminVerifyOtpPage() {
  return (
    <>
      <SEO
        props={{
          title: "Verify OTP - AIJobFit Admin | Email Verification Code",
          description:
            "Enter the 6-digit verification code sent to your admin email to securely verify your identity and proceed with the AI JobFit Admin Panel password reset.",
          keywords:
            "AIJobFit admin OTP verification, admin email verification, super admin security code, admin OTP code, password reset verification",
          url: "/verify-otp",
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <Suspense fallback={null}>
          <AdminVerifyOtpForm />
        </Suspense>
      </main>
    </>
  );
}
