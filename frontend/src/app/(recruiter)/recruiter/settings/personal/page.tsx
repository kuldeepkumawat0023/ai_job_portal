import RecruiterSettingsView from "@/components/recruiter/settings/RecruiterSettingsView";
import SEO from "@/components/SEO";

export default function PersonalSettingsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Personal Settings | AIJobFit Recruiter",
          description: "Manage personal profile details, upload avatar, set designation, and update contact information.",
          url: "/recruiter/settings/personal",
          noIndex: true,
        }}
      />
      <RecruiterSettingsView initialTab="profile" />
    </>
  );
}
