import FeedbackView from "@/components/recruiter/feedback/FeedbackView";
import SEO from "@/components/SEO";

export default function FeedbackPage() {
  return (
    <>
      <SEO
        props={{
          title: "Candidate Feedback | AIJobFit Recruiter",
          description: "Submit candidate evaluation feedback and review AI assessment scores for interviews.",
          url: "/recruiter/feedback",
          noIndex: true,
        }}
      />
      <FeedbackView />
    </>
  );
}
