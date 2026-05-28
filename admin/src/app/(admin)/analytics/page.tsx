import AnalyticsView from "@/components/admin/analytics/AnalyticsView";
import SEO from "@/components/SEO";

export default function AnalyticsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Platform Analytics | AIJobFit - Platform Super Admin Panel",
          description:
            "View platform growth data, candidate registration rates, recruiter onboarding speeds, and compute active daily user trends.",
          keywords:
            "platform growth charts, user registration metrics, onboarding analytics, DAU tracking",
          url: "/analytics",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <AnalyticsView />
      </main>
    </>
  );
}
