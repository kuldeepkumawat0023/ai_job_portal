import RevenueView from "@/components/admin/revenue/RevenueView";
import SEO from "@/components/SEO";

export default function RevenuePage() {
  return (
    <>
      <SEO
        props={{
          title: "Revenue Analysis | AIJobFit - Platform Super Admin Panel",
          description:
            "Track monthly recurring revenue, platform usage commissions, premium package sales metrics, and project financial forecasts.",
          keywords:
            "platform revenue dashboard, billing tracking, premium packages, financial metrics, MRR analytics",
          url: "/revenue",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <RevenueView />
      </main>
    </>
  );
}
