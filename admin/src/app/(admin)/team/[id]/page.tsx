import TeamMemberView from "@/components/admin/team/TeamMemberView";
import SEO from "@/components/SEO";
import { use } from "react";

export default function TeamMemberViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <>
      <SEO
        props={{
          title: "Team Member Details | AIJobFit Admin Panel",
          description:
            "View team member profile, role, contact details, and account information.",
          keywords: "team member, admin profile, recruiter details",
          url: `/team/${resolvedParams.id}`,
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <TeamMemberView />
      </main>
    </>
  );
}

