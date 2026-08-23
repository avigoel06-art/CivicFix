import React from 'react';
import OfficialComplaints from '../official/Complaints';

// Reusing OfficialComplaints for Admin as they have similar viewing needs
const AdminComplaints = () => {
  return (
    <div>
      <OfficialComplaints />
    </div>
  );
};

export default AdminComplaints;
