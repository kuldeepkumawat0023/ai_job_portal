import React, { use } from 'react';
import PostJobView from '@/components/recruiter/job-board/PostJobView';
import SEO from '@/components/SEO';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  return (
    <>
      <SEO
        props={{
          title: "Edit Job Posting | AIJobFit Recruiter",
          description: "Update details, requirements, and preferences for your job post.",
          url: `/recruiter/job-board/${resolvedParams.id}/edit`,
          noIndex: true,
        }}
      />
      <PostJobView jobId={resolvedParams.id} />
    </>
  );
};

export default Page;
