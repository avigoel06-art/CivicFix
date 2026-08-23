import React, { useEffect, useState } from 'react';
import { getComplaints } from '../../services/complaintService';
import { Link } from 'react-router-dom';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';

const OfficialComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setComplaints(getComplaints());
  }, []);

  const filtered = complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 className="mb-lg">Manage Complaints</h2>

      <div className="card mb-lg flex gap-md flex-wrap items-center">
        <input 
          type="text" 
          placeholder="Search ID, title, or location..." 
          className="form-control"
          style={{ flex: 1, minWidth: '250px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
          <option value="Reopened">Reopened</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Location</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(complaint => (
                <tr key={complaint.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                    <div>{complaint.id}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 400 }}>{complaint.category}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {complaint.location.address}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}><PriorityBadge priority={complaint.priority} /></td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.5rem' }}><StatusBadge status={complaint.status} /></td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Link to={`/official/complaint/${complaint.id}`} className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>Manage</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No complaints found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OfficialComplaints;
