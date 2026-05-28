import RecruiterSettingsView from "@/components/recruiter/settings/RecruiterSettingsView";
import SEO from "@/components/SEO";

export default function SecuritySettingsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Security Settings | AIJobFit Recruiter",
          description: "Update password, enable two-factor authentication, and monitor recruiter account security actions.",
          url: "/recruiter/settings/security",
          noIndex: true,
        }}
      />
      <RecruiterSettingsView initialTab="security" />
    </>
  );
}
