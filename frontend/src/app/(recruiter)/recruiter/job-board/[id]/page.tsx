import React from 'react';
import JobDetailView from '@/components/recruiter/job-board/JobDetailView';

const Page = ({ params }: { params: { id: string } }) => {
  return <JobDetailView jobId={params.id} />;
};

export default Page;
