import React from 'react';
import PostJobView from '@/components/recruiter/job-board/PostJobView';

const Page = ({ params }: { params: { id: string } }) => {
  return <PostJobView jobId={params.id} />;
};

export default Page;
