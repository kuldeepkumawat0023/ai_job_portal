import TeamMemberEdit from "@/components/admin/team/TeamMemberEdit";
import SEO from "@/components/SEO";
import { use } from "react";

export default function TeamMemberEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <>
      <SEO
        props={{
          title: "Edit Team Member | AIJobFit Admin Panel",
          description:
            "Edit team member role and manage their access level on the platform.",
          keywords: "edit team member, change role, admin access",
          url: `/team/${resolvedParams.id}/edit`,
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <TeamMemberEdit />
      </main>
    </>
  );
}

