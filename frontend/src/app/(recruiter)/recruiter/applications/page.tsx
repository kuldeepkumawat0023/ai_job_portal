import RecruiterApplicationsView from "@/components/recruiter/applications/RecruiterApplicationsView";
import SEO from "@/components/SEO";

export default function RecruiterApplicationsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Recruiter Applications | AIJobFit Recruiter",
          description: "Manage candidate applications, view AI compatibility scores, and update applicant pipeline stages.",
          url: "/recruiter/applications",
          noIndex: true,
        }}
      />
      <RecruiterApplicationsView />
    </>
  );
}
