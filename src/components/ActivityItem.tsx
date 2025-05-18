import React from 'react';

const ActivityItem: React.FC = () => {
  const activities = [
    'New user registered',
    'Completed onboarding',
    'Created new dashboard',
    'Generated report',
    'Joined multiple sheets',
    'Exported analytics data'
  ];
  
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  const randomTime = Math.floor(Math.random() * 59) + 1;
  
  return (
    <div className="flex items-center py-3 border-b border-slate-800 last:border-0">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500/30 to-teal-500/30 flex items-center justify-center mr-4">
        <span className="text-xs">U{Math.floor(Math.random() * 99) + 1}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm">{randomActivity}</p>
        <p className="text-xs text-slate-500">{randomTime} minutes ago</p>
      </div>
      <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
        View
      </button>
    </div>
  );
};

export default ActivityItem;