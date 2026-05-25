import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import SEO from "@/components/SEO";

export default function ForgotPasswordPage() {
  return (
    <>
      <SEO
        props={{
          title: "Forgot Password - AIJobFit | Recover Your Account",

          description:
            "Recover your AIJobFit account securely. Reset your password and regain access to AI-powered job matching, recruitment tools, and personalized career opportunities.",

          keywords:
            "AIJobFit forgot password, recover account, password reset, AI recruitment platform, account recovery, AI hiring portal, secure login recovery",

          url: "/forgot-password",
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <ForgotPasswordForm />
      </main>
    </>
  );
}