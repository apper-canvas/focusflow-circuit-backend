import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ iconName, label, value, subLabel }) => {
  return (
    <div className="text-center">
      <div className="flex items-center gap-1 mb-1 justify-center">
        <ApperIcon name={iconName} size={16} />
        <span className="text-xs opacity-80">{label}</span>
      </div>
      <div className="text-xl font-bold">
        {value}
      </div>
      {subLabel && (
        <div className="text-xs opacity-60">
          {subLabel}
        </div>
      )}
    </div>
  );
};

export default StatCard;