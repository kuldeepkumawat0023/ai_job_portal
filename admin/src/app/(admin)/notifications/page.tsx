import NotificationsView from "@/components/admin/notifications/NotificationsView";
import SEO from "@/components/SEO";

export default function NotificationsPage() {
  return (
    <>
      <SEO
        props={{
          title: "System Broadcasts | AIJobFit - Platform Super Admin Panel",
          description:
            "Create system-wide notifications and configure automated email templates. Broadcast alerts to candidates, recruiters, or operations staff.",
          keywords:
            "system notifications, platform broadcast alerts, candidate notifications, recruiter communications",
          url: "/notifications",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <NotificationsView />
      </main>
    </>
  );
}
