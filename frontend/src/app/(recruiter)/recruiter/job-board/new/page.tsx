import PostJobView from "@/components/recruiter/job-board/PostJobView";
import SEO from "@/components/SEO";

export default function PostJobPage() {
  return (
    <>
      <SEO
        props={{
          title: "Post a New Job | AIJobFit Recruiter",
          description: "Post a new job opening, define required skills, set salary range, and use AI to auto-generate high-performance job descriptions.",
          url: "/recruiter/job-board/new",
          noIndex: true,
        }}
      />
      <PostJobView />
    </>
  );
}
