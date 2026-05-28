import SettingsView from "@/components/admin/settings/SettingsView";
import SEO from "@/components/SEO";

export default function SettingsPage() {
  return (
    <>
      <SEO
        props={{
          title: "System Settings | AIJobFit - Platform Super Admin Panel",
          description:
            "Configure admin security metrics, system thresholds, toggle external API services, and audit platform parameters.",
          keywords:
            "system settings, security parameters, system configurations, API credentials settings",
          url: "/settings",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <SettingsView />
      </main>
    </>
  );
}
