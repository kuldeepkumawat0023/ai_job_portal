import { Suspense } from "react";
import SEO from "@/components/SEO";
import AdminReactivateAccountForm from "@/components/auth/ReactivateAccountForm";

export default function AdminReactivateAccountPage() {
  return (
    <>
      <SEO
        props={{
          title: "Reactivate Account - AIJobFit Admin | Restore Admin Access",
          description:
            "Reactivate your deactivated AI JobFit Super Admin account. Set a new secure password to restore full access to the admin control panel and platform management tools.",
          keywords:
            "AIJobFit admin reactivate account, super admin account restore, admin account unlock, AI job portal admin access, admin account reactivation",
          url: "/reactivate-account",
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <Suspense fallback={null}>
          <AdminReactivateAccountForm />
        </Suspense>
      </main>
    </>
  );
}
