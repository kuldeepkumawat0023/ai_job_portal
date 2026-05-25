import InterviewsView from "@/components/candidate/interviews/InterviewsView";
import SEO from "@/components/SEO";

export default function InterviewsPage() {
  return (
    <>
      <SEO
        props={{
          title: "My Interviews | AIJobFit",
          description: "Manage your upcoming interviews and track your interview pipeline with top employers.",
          keywords: "interviews, job interviews, AIJobFit, interview pipeline",
          url: "/candidate/interviews",
          noIndex: true,
        }}
      />
      <main className="w-full min-h-screen bg-surface">
        <InterviewsView />
      </main>
    </>
  );
}
