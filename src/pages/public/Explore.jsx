import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComplaints } from '../../services/complaintService';
import StatusBadge from '../../components/common/StatusBadge';
import { FiMapPin, FiHeart } from 'react-icons/fi';
// In a real app we would use react-leaflet MapContainer here
// However, mapping complex coordinates on a static demo requires full Leaflet integration
// For simplicity in this step, we will focus on the list view.

const Explore = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    setComplaints(getComplaints());
  }, []);

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? c.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="flex justify-between items-center mb-xl">
        <h2>Explore Civic Issues</h2>
      </div>

      <div className="card mb-lg flex gap-md flex-wrap items-center">
        <input 
          type="text" 
          placeholder="Search issues, IDs..." 
          className="form-control"
          style={{ flex: 1, minWidth: '250px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-control"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Street Light">Street Light</option>
          <option value="Garbage">Garbage</option>
          <option value="Road Damage">Road Damage</option>
          <option value="Water">Water</option>
          <option value="Drainage">Drainage</option>
          <option value="Electricity">Electricity</option>
        </select>
      </div>

      <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredComplaints.length > 0 ? filteredComplaints.map(complaint => (
          <div key={complaint.id} className="card flex-col gap-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>{complaint.id}</span>
              <StatusBadge status={complaint.status} />
            </div>
            
            <h3 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{complaint.title}</h3>
            
            <div className="flex items-center gap-xs text-muted">
              <FiMapPin /> <span>{complaint.location?.address || 'Unknown Location'}</span>
            </div>
            
            <div className="flex justify-between items-center mt-md pt-sm" style={{ borderTop: '1px solid #e2e8f0' }}>
              <div className="flex items-center gap-xs text-muted" style={{ color: 'var(--color-danger)' }}>
                <FiHeart /> <span>{complaint.supportCount} supporters</span>
              </div>
              <Link to={`/login`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                View Issue
              </Link>
            </div>
          </div>
        )) : (
          <div className="text-center text-muted" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
            No complaints found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
