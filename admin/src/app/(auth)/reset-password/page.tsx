import { Suspense } from "react";
import SEO from "@/components/SEO";
import AdminResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function AdminResetPasswordPage() {
  return (
    <>
      <SEO
        props={{
          title: "Reset Password - AIJobFit Admin | Set New Admin Password",
          description:
            "Securely set a new password for your AI JobFit Super Admin account. Create a strong password to restore full access to the admin dashboard and management tools.",
          keywords:
            "AIJobFit admin reset password, super admin new password, admin account recovery, admin password update, AI job portal admin security",
          url: "/reset-password",
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <Suspense fallback={null}>
          <AdminResetPasswordForm />
        </Suspense>
      </main>
    </>
  );
}
