import RecruiterSettingsView from "@/components/recruiter/settings/RecruiterSettingsView";
import SEO from "@/components/SEO";

export default function RecruiterSettingsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Recruiter Settings | AIJobFit Recruiter",
          description: "Manage recruiter account configurations, workspace options, team members, and hiring settings.",
          url: "/recruiter/settings",
          noIndex: true,
        }}
      />
      <RecruiterSettingsView initialTab="team" />
    </>
  );
}
