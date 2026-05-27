import JobPostsView from "@/components/admin/job-posts/JobPostsView";
import SEO from "@/components/SEO";

export default function JobPostsPage() {
  return (
    <>
      <SEO
        props={{
          title: "Job Listings | AIJobFit - Platform Super Admin Panel",
          description:
            "Review, approve, or report job listings across the network. Manage platform job pools, filter spam postings, and audit active hirings.",
          keywords:
            "job listings moderation, platform job pool, active job vacancies, approve job posts, spam filters",
          url: "/job-posts",
          noIndex: true,
        }}
      />

      <main className="w-full min-h-screen bg-surface">
        <JobPostsView />
      </main>
    </>
  );
}
