import React from 'react';

const DashboardView = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Candidate Dashboard</h1>
      {/* Dashboard widgets will go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">Resume Analysis Card</div>
        <div className="bg-white p-4 rounded-lg shadow">Top AI Job Matches</div>
        <div className="bg-white p-4 rounded-lg shadow">Application Pipeline</div>
      </div>
    </div>
  );
};

export default DashboardView;
