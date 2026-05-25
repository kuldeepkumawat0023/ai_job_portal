import React, { use } from 'react';
import PostJobView from '@/components/recruiter/job-board/PostJobView';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  return <PostJobView jobId={resolvedParams.id} />;
};

export default Page;
