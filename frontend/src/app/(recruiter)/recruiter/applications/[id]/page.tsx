'use client';

import React from 'react';
import CandidateDetailsView from '@/components/recruiter/applications/CandidateDetailsView';
import SEO from '@/components/SEO';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const unwrappedParams = React.use(params);
  
  return (
    <>
      <SEO
        props={{
          title: "Candidate Profile Details | AIJobFit Recruiter",
          description: "Review applicant profile, skills matching, and assessment data.",
          url: `/recruiter/applications/${unwrappedParams.id}`,
          noIndex: true,
        }}
      />
      <CandidateDetailsView id={unwrappedParams.id} />
    </>
  );
};

export default Page;
