import React, { use } from 'react';
import SEO from '@/components/SEO';

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
      <div>Job Details for ID: {resolvedParams.id}</div>
    </>
  );
};

export default Page;
