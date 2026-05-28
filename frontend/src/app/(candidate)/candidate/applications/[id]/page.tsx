import React, { use } from 'react';
import ApplicationForm from '@/components/candidate/applications/ApplicationForm';
import SEO from '@/components/SEO';

const ApplicationPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);

  return (
    <>
      <SEO
        props={{
          title: "Job Application | AIJobFit",
          description: "Complete your profile details and submit your application for the job posting on AIJobFit.",
          url: `/candidate/applications/${resolvedParams.id}`,
          noIndex: true,
        }}
      />
      <div className="min-h-screen bg-surface-container-lowest/30 p-4 md:p-8">
        <ApplicationForm />
      </div>
    </>
  );
};

export default ApplicationPage;
