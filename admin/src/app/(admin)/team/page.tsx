import TeamView from "@/components/admin/team/TeamView";
import SEO from "@/components/SEO";

export default function TeamPage() {
  return (
    <>
      <SEO
        props={{
          title: "Team Management | AIJobFit - Platform Super Admin Panel",
          description:
            "Manage your platform administrators, set operation roles, control moderation privileges, and monitor audit trails.",
          keywords:
            "team management, administrative privileges, control team members, super admin roles",
          url: "/team",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <TeamView />
      </main>
    </>
  );
}
