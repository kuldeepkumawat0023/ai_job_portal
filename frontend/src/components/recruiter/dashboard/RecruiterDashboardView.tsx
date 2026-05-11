import React from 'react';

const RecruiterDashboardView = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recruiter Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">Active Jobs: 24</div>
        <div className="bg-white p-4 rounded-lg shadow">Total Applicants: 1,482</div>
        <div className="bg-white p-4 rounded-lg shadow">Shortlisted: 86</div>
        <div className="bg-white p-4 rounded-lg shadow">Hired (MTD): 12</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">AI Talent Matcher</div>
        <div className="bg-white p-4 rounded-lg shadow">Pipeline Overview</div>
      </div>
    </div>
  );
};

export default RecruiterDashboardView;
