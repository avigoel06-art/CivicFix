import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComplaints } from '../../services/complaintService';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import { FiFileText, FiClock, FiCheckCircle, FiHeart, FiMapPin } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [myComplaints, setMyComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, inProgress: 0, resolved: 0, supported: 0 });

  useEffect(() => {
    const allComplaints = getComplaints();
    const mine = allComplaints.filter(c => c.userId === user.id);
    const supported = allComplaints.filter(c => c.supporters.includes(user.id) && c.userId !== user.id);
    
    setMyComplaints(mine);
    
    setStats({
      total: mine.length,
      inProgress: mine.filter(c => c.status === 'In Progress').length,
      resolved: mine.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
      supported: supported.length
    });
  }, [user]);

  return (
    <div style={{ padding: '2rem 0' }}>
      <header className="mb-xl">
        <h2>Good morning, {user.name.split(' ')[0]} 👋</h2>
        <p className="text-muted">Together, we can improve our city.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid-cards mb-xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-info-light)', color: 'var(--color-info)', borderRadius: '50%' }}>
            <FiFileText size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>My Complaints</p>
            <h3>{stats.total}</h3>
          </div>
        </div>
        
        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: '50%' }}>
            <FiClock size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>In Progress</p>
            <h3>{stats.inProgress}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '50%' }}>
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Resolved</p>
            <h3>{stats.resolved}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: '50%' }}>
            <FiHeart size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Supported Issues</p>
            <h3>{stats.supported}</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-lg flex justify-between items-center">
        <h3>Recent Complaints</h3>
        <Link to="/my-complaints" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>View All</Link>
      </div>

      <div className="flex-col gap-md">
        {myComplaints.slice(0, 3).map(complaint => (
          <div key={complaint.id} className="card flex justify-between items-center">
            <div className="flex-col gap-xs">
              <div className="flex items-center gap-sm">
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>{complaint.id}</span>
                <StatusBadge status={complaint.status} />
              </div>
              <h4 style={{ margin: '0.2rem 0' }}>{complaint.title}</h4>
              <div className="flex items-center gap-xs text-muted" style={{ fontSize: '0.85rem' }}>
                <FiMapPin /> <span>{complaint.location.address}</span>
                <span style={{ margin: '0 0.5rem' }}>•</span>
                <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <Link to={`/complaint/${complaint.id}`} className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Track</Link>
            </div>
          </div>
        ))}
        {myComplaints.length === 0 && (
          <div className="card text-center text-muted" style={{ padding: '3rem' }}>
            You haven't reported any issues yet.
            <br />
            <Link to="/report" className="btn btn-primary mt-md">Report an Issue</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
