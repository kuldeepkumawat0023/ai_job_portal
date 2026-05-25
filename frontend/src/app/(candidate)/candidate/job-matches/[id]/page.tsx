import React, { use } from 'react';

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  return <div>Job Details for ID: {resolvedParams.id}</div>;
};

export default Page;
