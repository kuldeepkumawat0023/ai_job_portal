import RecruiterMessagesView from "@/components/recruiter/messages/RecruiterMessagesView";
import SEO from "@/components/SEO";

export default function RecruiterMessagesPage() {
  return (
    <>
      <SEO
        props={{
          title: "Recruiter Messages | AIJobFit Recruiter",
          description: "Connect and chat in real-time with applicants and potential hires on the integrated messaging system.",
          url: "/recruiter/messages",
          noIndex: true,
        }}
      />
      <RecruiterMessagesView />
    </>
  );
}
