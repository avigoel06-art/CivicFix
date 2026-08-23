import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComplaints } from '../../services/complaintService';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { FiAlertCircle, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';

const OfficialDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, slaBreached: 0 });

  useEffect(() => {
    // In a real app, we would filter by the official's department or ward
    // For demo, we show all or a subset
    const allComplaints = getComplaints();
    setComplaints(allComplaints);
    
    // SLA Mock Logic: Any pending/in progress issue older than 48h is breached
    const now = new Date().getTime();
    let breached = 0;
    allComplaints.forEach(c => {
      if (c.status !== 'Resolved' && c.status !== 'Closed') {
        const age = now - new Date(c.createdAt).getTime();
        if (age > 48 * 60 * 60 * 1000) breached++;
      }
    });
    
    setStats({
      total: allComplaints.length,
      pending: allComplaints.filter(c => c.status === 'Pending').length,
      inProgress: allComplaints.filter(c => c.status === 'In Progress').length,
      resolved: allComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
      slaBreached: breached
    });
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <header className="mb-xl flex justify-between items-end">
        <div>
          <h2>Official Dashboard</h2>
          <p className="text-muted">Welcome back, Officer {user.name.split(' ')[0]} ({user.department} Dept)</p>
        </div>
        <Link to="/official/complaints" className="btn btn-primary">Manage Complaints</Link>
      </header>

      {/* Stats Cards */}
      <div className="grid-cards mb-xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-info-light)', color: 'var(--color-info)', borderRadius: '50%' }}>
            <FiFileText size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Total Assigned</p>
            <h3>{stats.total}</h3>
          </div>
        </div>
        
        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: '50%' }}>
            <FiClock size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Pending Action</p>
            <h3>{stats.pending}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '50%' }}>
            <FiCheckCircle size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Resolved</p>
            <h3>{stats.resolved}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-md" style={{ border: stats.slaBreached > 0 ? '1px solid var(--color-danger)' : '' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: '50%' }}>
            <FiAlertCircle size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>SLA Breached</p>
            <h3 style={{ color: stats.slaBreached > 0 ? 'var(--color-danger)' : 'inherit' }}>{stats.slaBreached}</h3>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }} className="flex justify-between items-center">
          <h3 style={{ margin: 0 }}>Recent Assignments</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.slice(0, 5).map(complaint => (
                <tr key={complaint.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{complaint.id}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{complaint.category}</td>
                  <td style={{ padding: '1rem 1.5rem' }}><PriorityBadge priority={complaint.priority} /></td>
                  <td style={{ padding: '1rem 1.5rem' }}><StatusBadge status={complaint.status} /></td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Link to={`/official/complaint/${complaint.id}`} style={{ color: 'var(--color-secondary)', fontWeight: 500 }}>Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficialDashboard;
