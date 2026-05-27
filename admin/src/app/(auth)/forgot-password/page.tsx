import SEO from "@/components/SEO";
import AdminForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function AdminForgotPasswordPage() {
  return (
    <>
      <SEO
        props={{
          title: "Forgot Password - AIJobFit Admin | Reset Admin Account",
          description:
            "Reset your AI JobFit Admin Panel password securely. Enter your admin email to receive a 6-digit OTP reset code and regain access to the super admin dashboard.",
          keywords:
            "AIJobFit admin forgot password, admin password reset, super admin recovery, admin account recovery, AI job portal admin",
          url: "/forgot-password",
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <AdminForgotPasswordForm />
      </main>
    </>
  );
}
