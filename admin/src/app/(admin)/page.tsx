import DashboardView from "@/components/admin/dashboard/DashboardView";
import SEO from "@/components/SEO";

export default function DashboardPage() {
  return (
    <>
      <SEO
        props={{
          title: "Super Admin Dashboard | AIJobFit - Platform Super Admin Panel",
          description:
            "Access the super admin dashboard for the AIJobFit ecosystem. Monitor platform metrics, analyze user and recruiter engagement, view monthly revenue, and configure platform settings.",
          keywords:
            "super admin dashboard, admin control panel, platform metrics, user management dashboard, recruiter stats, hiring analytics",
          url: "/",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <DashboardView />
      </main>
    </>
  );
}
