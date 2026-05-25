import AISuggestionsView from "@/components/candidate/ai-suggestions/AISuggestionsView";
import SEO from "@/components/SEO";

export default function AISuggestionsPage() {
  return (
    <>
      <SEO
        props={{
          title: "AI Job Suggestions | AIJobFit",
          description: "Discover personalized job suggestions tailored to your skills and career goals by AIJobFit.",
          keywords: "AI job suggestions, personalized jobs, AIJobFit, smart job match",
          url: "/candidate/ai-suggestions",
        }}
      />
      <main className="w-full min-h-screen bg-surface">
        <AISuggestionsView />
      </main>
    </>
  );
}
