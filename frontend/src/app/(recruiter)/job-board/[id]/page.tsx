import React from 'react';

const Page = ({ params }: { params: { id: string } }) => {
  return <div>Job Stats for ID: {params.id}</div>;
};

export default Page;
