import ReactivateAccountForm from "@/components/auth/ReactivateAccountForm";
import SEO from "@/components/SEO";
import { Suspense } from "react";

export default function ReactivateAccountPage() {
  return (
    <>
      <SEO
        props={{
          title: "Reactivate Account - AIJobFit | Restore Your Access",

          description:
            "Reactivate your AIJobFit account securely and continue accessing AI-powered job matching, recruitment tools, resume optimization, and personalized career opportunities.",

          keywords:
            "AIJobFit reactivate account, restore account access, AI hiring platform, account recovery, recruitment portal reactivation, candidate account activation",

          url: "/reactivate-account",
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
          <ReactivateAccountForm />
        </Suspense>
      </main>
    </>
  );
}