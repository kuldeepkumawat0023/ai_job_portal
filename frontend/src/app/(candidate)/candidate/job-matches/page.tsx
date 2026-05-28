import JobMatchesView from "@/components/candidate/job-matches/JobMatchesView";
import SEO from "@/components/SEO";

export default function JobMatchesPage() {
  return (
    <>
      <SEO
        props={{
          title: "AI Job Matches | AIJobFit",
          description: "Explore personalized AI job matches tailored to your resume, skills, and preferences.",
          keywords: "AI job matching, job recommendations, tailored jobs, AIJobFit",
          url: "/candidate/job-matches",
          noIndex: true,
        }}
      />
      <main className="w-full min-h-screen bg-surface">
        <JobMatchesView />
      </main>
    </>
  );
}
