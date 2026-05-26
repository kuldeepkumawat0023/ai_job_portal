import React, { use } from 'react';
import SEO from '@/components/SEO';
import JobDetailView from '@/components/candidate/job-matches/JobDetailView';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  return (
    <>
      <SEO
        props={{
          title: "Job Matching Details | AIJobFit",
          description: "View dynamic matching metrics, AI analysis, and skill fit details for this job role.",
          url: `/candidate/job-matches/${resolvedParams.id}`,
          noIndex: true,
        }}
      />
      <JobDetailView jobId={resolvedParams.id} />
    </>
  );
};

export default Page;
