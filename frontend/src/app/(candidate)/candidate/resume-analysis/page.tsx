import ResumeAnalysisView from "@/components/candidate/resume-analysis/ResumeAnalysisView";
import SEO from "@/components/SEO";

export default function ResumeAnalysisPage() {
  return (
    <>
      <SEO
        props={{
          title: "AI Resume Analysis | AIJobFit",
          description: "Get detailed AI-powered insights and feedback on your resume to improve your job matches.",
          keywords: "resume analysis, AI resume reviewer, CV feedback, AIJobFit",
          url: "/candidate/resume-analysis",
          noIndex: true,
        }}
      />
      <main className="w-full min-h-screen bg-surface">
        <ResumeAnalysisView />
      </main>
    </>
  );
}
