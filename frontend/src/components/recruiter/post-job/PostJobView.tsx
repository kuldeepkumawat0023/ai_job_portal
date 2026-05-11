import React from 'react';

const PostJobView = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Post a New Job</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
        <div className="space-y-4">
          <input type="text" placeholder="Job Title" className="w-full border p-2 rounded" />
          <textarea placeholder="Job Description" className="w-full border p-2 rounded h-32" />
          <button className="bg-blue-600 text-white px-6 py-2 rounded">Post Job with AI Assist</button>
        </div>
      </div>
    </div>
  );
};

export default PostJobView;
