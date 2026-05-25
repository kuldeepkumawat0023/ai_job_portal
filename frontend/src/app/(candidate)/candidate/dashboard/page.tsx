import DashboardView from "@/components/candidate/dashboard/DashboardView";
import SEO from "@/components/SEO";

export default function DashboardPage() {
  return (
    <>
      <SEO
        props={{
          title: "Candidate Dashboard | AIJobFit - AI Job Matching Platform",

          description:
            "View your AI-powered job dashboard with resume analysis, job recommendations, application tracking, interview status, and personalized career insights on AIJobFit.",

          keywords:
            "AI job dashboard, candidate dashboard, AI job matching, resume score, job application tracking, interview pipeline, AIJobFit dashboard",

          url: "/candidate/dashboard",
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <DashboardView />
      </main>
    </>
  );
}