import React from 'react';

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white md:w-1/4 w-full shadow rounded-lg p-4 flex items-center dark:bg-gray-800">
      <div className="text-blue-500 p-3 rounded-lg bg-blue-100 dark:bg-blue-900">{icon}</div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    </div>
  );
  
};

export default OverviewCard;
