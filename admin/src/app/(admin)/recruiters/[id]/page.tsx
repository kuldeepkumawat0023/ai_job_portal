import RecruiterDetailView from "@/components/admin/recruiters/RecruiterDetailView";
import SEO from "@/components/SEO";
import { use } from "react";

export default function RecruiterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <>
      <SEO
        props={{
          title: "Recruiter Profile Details | AIJobFit Admin Panel",
          description:
            "View corporate partner profiles, associated company details, jobs hosted, subscription status, and contact details.",
          keywords: "recruiter details, view recruiter profile, company details, job posts",
          url: `/recruiters/${resolvedParams.id}`,
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <RecruiterDetailView />
      </main>
    </>
  );
}
