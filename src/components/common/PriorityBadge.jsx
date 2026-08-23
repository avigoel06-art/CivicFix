import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getBadgeClass = () => {
    switch(priority) {
      case 'Critical': return 'badge-danger';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-info';
      case 'Low': return 'badge-success';
      default: return 'badge-info';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
