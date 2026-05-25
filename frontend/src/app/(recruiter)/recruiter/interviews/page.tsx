import InterviewsView from "@/components/recruiter/interviews/RecruiterInterviewsView";
import SEO from "@/components/SEO";

export default function InterviewsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Scheduled Interviews | AIJobFit Recruiter",
          description: "Schedule, coordinate, and review active candidate interviews with integrated meeting links.",
          url: "/recruiter/interviews",
          noIndex: true,
        }}
      />
      <InterviewsView />
    </>
  );
}
