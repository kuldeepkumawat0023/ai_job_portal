import RecruiterDashboardView from "@/components/recruiter/dashboard/RecruiterDashboardView";
import SEO from "@/components/SEO";

export default function RecruiterDashboardPage() {
  return (
    <>
      <SEO
        props={{
          title: "Recruiter Dashboard | AIJobFit Recruiter",
          description: "Welcome to your Recruiter Dashboard. Monitor active jobs, track candidate matches, and manage your hiring pipelines.",
          url: "/recruiter/dashboard",
          noIndex: true,
        }}
      />
      <RecruiterDashboardView />
    </>
  );
}
