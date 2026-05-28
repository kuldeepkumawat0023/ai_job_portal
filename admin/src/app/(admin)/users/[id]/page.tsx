import UserDetailView from "@/components/admin/users/UserDetailView";
import SEO from "@/components/SEO";
import { use } from "react";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <>
      <SEO
        props={{
          title: "User Profile Details | AIJobFit Admin Panel",
          description:
            "View candidate or recruiter profile data, contact details, work history, skills, and account active status.",
          keywords: "user details, view candidate profile, recruiter account, admin audit",
          url: `/users/${resolvedParams.id}`,
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <UserDetailView />
      </main>
    </>
  );
}
