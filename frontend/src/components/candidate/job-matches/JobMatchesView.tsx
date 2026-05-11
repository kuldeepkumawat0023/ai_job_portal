import React from 'react';

const JobMatchesView = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Top AI Job Matches</h1>
      <div className="grid grid-cols-1 gap-4">
        {/* Job match cards will go here */}
        <p className="text-gray-500">Discover jobs tailored to your skills.</p>
      </div>
    </div>
  );
};

export default JobMatchesView;
