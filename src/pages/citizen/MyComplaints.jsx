import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComplaints } from '../../services/complaintService';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { FiMapPin, FiCalendar } from 'react-icons/fi';

const MyComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  
  useEffect(() => {
    const allComplaints = getComplaints();
    const mine = allComplaints.filter(c => c.userId === user.id || c.supporters.includes(user.id));
    setComplaints(mine);
  }, [user]);

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 className="mb-lg">My Complaints</h2>

      {complaints.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p className="text-muted mb-md">You haven't reported or supported any issues yet.</p>
          <Link to="/report" className="btn btn-primary">Report an Issue</Link>
        </div>
      ) : (
        <div className="flex-col gap-md">
          {complaints.map(complaint => (
            <div key={complaint.id} className="card flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <div className="flex-col gap-sm" style={{ flex: 1, minWidth: '250px' }}>
                <div className="flex items-center gap-sm">
                  <span className="text-muted" style={{ fontWeight: '500' }}>{complaint.id}</span>
                  <StatusBadge status={complaint.status} />
                  <PriorityBadge priority={complaint.priority} />
                  {complaint.userId !== user.id && (
                    <span className="badge badge-info" style={{ backgroundColor: '#e2e8f0', color: '#64748b' }}>Supported</span>
                  )}
                </div>
                
                <h3 style={{ margin: '0.2rem 0' }}>{complaint.title}</h3>
                
                <div className="flex items-center gap-md text-muted" style={{ fontSize: '0.9rem' }}>
                  <div className="flex items-center gap-xs"><FiMapPin /> <span>{complaint.location.address}</span></div>
                  <div className="flex items-center gap-xs"><FiCalendar /> <span>{new Date(complaint.createdAt).toLocaleDateString()}</span></div>
                </div>
              </div>
              
              <div>
                <Link to={`/complaint/${complaint.id}`} className="btn btn-outline">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
