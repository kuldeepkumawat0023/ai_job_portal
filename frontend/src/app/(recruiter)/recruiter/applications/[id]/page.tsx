'use client';

import React from 'react';
import CandidateDetailsView from '@/components/recruiter/applications/CandidateDetailsView';

const Page = ({ params }: { params: Promise<{ id: string }> | { id: string } }) => {
  // Safely unwrap params if it is a Promise (Next 15+) or standard object
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  
  return <CandidateDetailsView id={unwrappedParams.id} />;
};

export default Page;
