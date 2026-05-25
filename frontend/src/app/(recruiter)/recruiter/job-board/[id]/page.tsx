import React, { use } from 'react';
import JobDetailView from '@/components/recruiter/job-board/JobDetailView';
import SEO from '@/components/SEO';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  return (
    <>
      <SEO
        props={{
          title: "Job Details | AIJobFit Recruiter",
          description: "View details and manage candidate matches for this job post.",
          url: `/recruiter/job-board/${resolvedParams.id}`,
          noIndex: true,
        }}
      />
      <JobDetailView jobId={resolvedParams.id} />
    </>
  );
};

export default Page;
