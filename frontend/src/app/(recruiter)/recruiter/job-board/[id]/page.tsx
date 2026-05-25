import React, { use } from 'react';
import JobDetailView from '@/components/recruiter/job-board/JobDetailView';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  return <JobDetailView jobId={resolvedParams.id} />;
};

export default Page;
