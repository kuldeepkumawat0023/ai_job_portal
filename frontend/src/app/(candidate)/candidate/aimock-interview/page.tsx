import MockInterviewView from "@/components/candidate/mock-interview/MockInterviewView";
import SEO from "@/components/SEO";

export default function MockInterviewPage() {
  return (
    <>
      <SEO
        props={{
          title: "AI Mock Interviews | AIJobFit",
          description: "Practice your interview skills with AI-driven mock interviews tailored to your target jobs.",
          keywords: "AI mock interview, interview practice, AIJobFit, interview preparation",
          url: "/candidate/aimock-interview",
          noIndex: true,
        }}
      />
      <main className="w-full min-h-screen bg-surface">
        <MockInterviewView />
      </main>
    </>
  );
}
