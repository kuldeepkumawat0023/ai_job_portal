import RecruiterSettingsView from "@/components/recruiter/settings/RecruiterSettingsView";
import SEO from "@/components/SEO";

export default function NotificationsSettingsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Notification Settings | AIJobFit Recruiter",
          description: "Manage notification alerts for job applications, match score updates, message pings, and dashboard activity.",
          url: "/recruiter/settings/notifications",
          noIndex: true,
        }}
      />
      <RecruiterSettingsView initialTab="notifications" />
    </>
  );
}
