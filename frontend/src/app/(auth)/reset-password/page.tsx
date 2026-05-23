import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import SEO from "@/components/SEO";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <>
      <SEO
        props={{
          title: "Reset Password - AIJobFit | Secure Your Account",

          description:
            "Reset your AIJobFit account password securely and regain access to AI-powered job matching, smart recruitment tools, and personalized career opportunities.",

          keywords:
            "AIJobFit reset password, forgot password, secure account recovery, AI hiring platform, password recovery, recruitment portal security, candidate account recovery",

          url: "/reset-password",
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <Suspense
          fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-white">
              Loading...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>
    </>
  );
}