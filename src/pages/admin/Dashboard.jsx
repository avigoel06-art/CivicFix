import React, { useEffect, useState } from 'react';
import { getComplaints, getAuditLogs } from '../../services/complaintService';
import { getUsers } from '../../services/authService';
import { FiUsers, FiFileText, FiShield, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, officials: 0, complaints: 0, resolved: 0 });

  useEffect(() => {
    const users = getUsers();
    const complaints = getComplaints();
    
    setStats({
      users: users.length,
      officials: users.filter(u => u.role === 'official').length,
      complaints: complaints.length,
      resolved: complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length
    });
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <header className="mb-xl">
        <h2>Admin Control Center</h2>
        <p className="text-muted">System Overview & Analytics</p>
      </header>

      {/* Stats Cards */}
      <div className="grid-cards mb-xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary-light)', color: 'white', borderRadius: '50%' }}>
            <FiUsers size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Total Users</p>
            <h3>{stats.users}</h3>
          </div>
        </div>
        
        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-info-light)', color: 'var(--color-info)', borderRadius: '50%' }}>
            <FiShield size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Verified Officials</p>
            <h3>{stats.officials}</h3>
          </div>
        </div>

        <div className="card flex items-center gap-md">
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: '50%' }}>
            <FiFileText size={24} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Total Complaints</p>
            <h3>{stats.complaints}</h3>
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
      </div>

      <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card flex-col gap-sm">
          <h3>Complaint Distribution</h3>
          <div className="mt-md flex-col gap-sm">
            <div className="flex items-center gap-sm">
              <span style={{ width: '100px', fontSize: '0.85rem' }}>Street Light</span>
              <div style={{ flex: 1, backgroundColor: '#e2e8f0', height: '12px', borderRadius: '6px' }}>
                <div style={{ width: '45%', backgroundColor: 'var(--color-secondary)', height: '100%', borderRadius: '6px' }}></div>
              </div>
              <span className="text-muted" style={{ fontSize: '0.85rem', width: '30px', textAlign: 'right' }}>45%</span>
            </div>
            <div className="flex items-center gap-sm">
              <span style={{ width: '100px', fontSize: '0.85rem' }}>Garbage</span>
              <div style={{ flex: 1, backgroundColor: '#e2e8f0', height: '12px', borderRadius: '6px' }}>
                <div style={{ width: '30%', backgroundColor: 'var(--color-warning)', height: '100%', borderRadius: '6px' }}></div>
              </div>
              <span className="text-muted" style={{ fontSize: '0.85rem', width: '30px', textAlign: 'right' }}>30%</span>
            </div>
            <div className="flex items-center gap-sm">
              <span style={{ width: '100px', fontSize: '0.85rem' }}>Road Damage</span>
              <div style={{ flex: 1, backgroundColor: '#e2e8f0', height: '12px', borderRadius: '6px' }}>
                <div style={{ width: '15%', backgroundColor: 'var(--color-danger)', height: '100%', borderRadius: '6px' }}></div>
              </div>
              <span className="text-muted" style={{ fontSize: '0.85rem', width: '30px', textAlign: 'right' }}>15%</span>
            </div>
          </div>
        </div>
        
        <div className="card flex-col gap-sm">
          <h3>Recent System Activity</h3>
          <p className="text-muted mb-sm">Navigate to Audit Logs to see detailed tracking.</p>
          <div className="flex-col gap-xs mt-sm">
             <div className="p-sm bg-light rounded" style={{ padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '4px', fontSize: '0.85rem' }}>
               <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>CIV-10482</span> status changed to In Progress by USR-2001
             </div>
             <div className="p-sm bg-light rounded" style={{ padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '4px', fontSize: '0.85rem' }}>
               <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>CIV-10483</span> created by USR-1001
             </div>
             <div className="p-sm bg-light rounded" style={{ padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '4px', fontSize: '0.85rem' }}>
               <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>CIV-10480</span> marked as Resolved by USR-2001
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
