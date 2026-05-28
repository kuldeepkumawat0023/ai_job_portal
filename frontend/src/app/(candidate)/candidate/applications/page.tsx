import ApplicationsView from "@/components/candidate/applications/ApplicationsView";
import SEO from "@/components/SEO";

export default function ApplicationsPage() {
  return (
    <>
      <SEO
        props={{
          title: "My Applications | AIJobFit",
          description: "Track your job applications, view status updates, and manage your job hunt efficiently.",
          keywords: "job applications, application tracking, AIJobFit",
          url: "/candidate/applications",
          noIndex: true,
        }}
      />
      <main className="w-full min-h-screen bg-surface">
        <ApplicationsView />
      </main>
    </>
  );
}
