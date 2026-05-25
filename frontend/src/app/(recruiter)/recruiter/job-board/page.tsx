import JobBoardView from "@/components/recruiter/job-board/JobBoardView";
import SEO from "@/components/SEO";

export default function JobBoardPage() {
  return (
    <>
      <SEO
        props={{
          title: "Job Board | AIJobFit Recruiter",
          description: "Manage your active job postings, check applicant engagement metrics, and optimize your listings with AI description builders.",
          url: "/recruiter/job-board",
          noIndex: true,
        }}
      />
      <JobBoardView />
    </>
  );
}
