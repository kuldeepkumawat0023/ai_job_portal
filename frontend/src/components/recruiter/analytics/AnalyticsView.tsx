import React from 'react';

const AnalyticsView = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hiring Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow h-64">Market Reputation: 4.8/5</div>
        <div className="bg-white p-4 rounded-lg shadow h-64">Recruiter Responsiveness: 98%</div>
      </div>
    </div>
  );
};

export default AnalyticsView;
