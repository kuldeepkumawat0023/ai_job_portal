import AnalyticsView from "@/components/recruiter/analytics/AnalyticsView";
import SEO from "@/components/SEO";

export default function AnalyticsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Hiring Analytics | AIJobFit Recruiter",
          description: "Monitor job postings engagement, applicant views, application conversion rate, and pipeline progress with AI analytics.",
          url: "/recruiter/analytics",
          noIndex: true,
        }}
      />
      <AnalyticsView />
    </>
  );
}
