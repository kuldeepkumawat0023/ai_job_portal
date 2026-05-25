'use client';

import React from 'react';
import CandidateDetailsView from '@/components/recruiter/applications/CandidateDetailsView';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const unwrappedParams = React.use(params);
  
  return <CandidateDetailsView id={unwrappedParams.id} />;
};

export default Page;
