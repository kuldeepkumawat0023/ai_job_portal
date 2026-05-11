import React from 'react';

const RecruiterMessagesView = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recruiter Messages</h1>
      <div className="flex h-[600px] bg-white rounded-lg shadow overflow-hidden">
        <div className="w-1/3 border-r p-4">Candidate Conversations</div>
        <div className="w-2/3 p-4">Chat Window</div>
      </div>
    </div>
  );
};

export default RecruiterMessagesView;
