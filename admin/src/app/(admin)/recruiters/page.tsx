import RecruitersView from "@/components/admin/recruiters/RecruitersView";
import SEO from "@/components/SEO";

export default function RecruitersPage() {
  return (
    <>
      <SEO
        props={{
          title: "Recruiter Management | AIJobFit - Platform Super Admin Panel",
          description:
            "Moderate corporate partner accounts, verify recruiter credentials, track subscription plan statuses, and manage billing profiles.",
          keywords:
            "recruiters management, verification status, corporate subscriptions, recruiter verification list",
          url: "/recruiters",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <RecruitersView />
      </main>
    </>
  );
}
