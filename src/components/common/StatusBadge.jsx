import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeClass = () => {
    switch(status) {
      case 'Pending': return 'badge-warning';
      case 'In Progress': return 'badge-info';
      case 'Resolved': 
      case 'Closed': return 'badge-success';
      case 'Reopened': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
