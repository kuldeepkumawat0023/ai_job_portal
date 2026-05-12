import React from 'react';

const Page = ({ params }: { params: { id: string } }) => {
  return <div>Applicant Profile for ID: {params.id}</div>;
};

export default Page;
