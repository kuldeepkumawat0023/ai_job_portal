import UsersView from "@/components/admin/users/UsersView";
import SEO from "@/components/SEO";

export default function UsersPage() {
  return (
    <>
      <SEO
        props={{
          title: "User Management | AIJobFit - Platform Super Admin Panel",
          description:
            "Manage all candidate and recruiter users on the AIJobFit platform. Approve, suspend, or audit user profiles and access control privileges.",
          keywords:
            "user management, admin user control, candidate accounts, recruiter profiles, moderate accounts",
          url: "/users",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <UsersView />
      </main>
    </>
  );
}
