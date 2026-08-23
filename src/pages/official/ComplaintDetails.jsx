import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById, updateComplaintStatus } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { FiMapPin, FiCalendar, FiUser, FiClock } from 'react-icons/fi';

const OfficialComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  
  // Update state
  const [newStatus, setNewStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [resolutionEvidence, setResolutionEvidence] = useState('');

  useEffect(() => {
    const data = getComplaintById(id);
    if (data) {
      setComplaint(data);
      setNewStatus(data.status);
    } else {
      navigate('/official/complaints');
    }
  }, [id, navigate]);

  const handleUpdate = () => {
    if (!newStatus || !updateNote) {
      alert("Status and note are required");
      return;
    }
    
    // In a real app we'd upload the file and get URL. Here we mock it.
    let evidence = null;
    if (newStatus === 'Resolved' && resolutionEvidence) {
      evidence = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop';
    }

    const updated = updateComplaintStatus(id, newStatus, user.id, updateNote, evidence);
    setComplaint(updated);
    setUpdateNote('');
    setResolutionEvidence('');
  };

  if (!complaint) return <div>Loading...</div>;

  // Calculate mock SLA
  const hoursSinceCreation = (new Date().getTime() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60);
  const slaLimit = complaint.category === 'Garbage' ? 24 : 48; // Mock rule
  const slaRemaining = Math.max(0, slaLimit - hoursSinceCreation);
  const isSlaBreached = hoursSinceCreation > slaLimit && !['Resolved', 'Closed'].includes(complaint.status);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="flex justify-between items-start mb-lg">
        <div>
          <div className="flex items-center gap-sm mb-sm">
            <span className="text-muted">{complaint.id}</span>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
          <h2>{complaint.title}</h2>
          <div className="flex items-center gap-md text-muted mt-sm">
            <span className="flex items-center gap-xs"><FiMapPin /> {complaint.location.address}</span>
            <span className="flex items-center gap-xs"><FiCalendar /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-xs"><FiUser /> {complaint.supportCount} Supporters</span>
          </div>
        </div>
        
        <div className="card" style={{ padding: '0.8rem 1.5rem', backgroundColor: isSlaBreached ? 'var(--color-danger-light)' : 'var(--color-surface)', border: isSlaBreached ? '1px solid var(--color-danger)' : '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-sm">
            <FiClock color={isSlaBreached ? 'var(--color-danger)' : 'var(--color-text)'} />
            <div style={{ color: isSlaBreached ? 'var(--color-danger)' : 'var(--color-heading)' }}>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>SLA Status</p>
              <p style={{ fontWeight: 600, margin: 0 }}>
                {isSlaBreached ? '⚠ BREACHED' : `${Math.floor(slaRemaining)}h ${Math.floor((slaRemaining % 1) * 60)}m remaining`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="flex-col gap-lg">
          {/* Details */}
          <div className="card flex-col gap-sm">
            <h3>Complaint Details</h3>
            <p><strong>Citizen Description:</strong></p>
            <p className="text-muted" style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
              {complaint.description}
            </p>
            {complaint.evidenceUrl && (
              <div className="mt-sm">
                <p><strong>Citizen Evidence:</strong></p>
                <img src={complaint.evidenceUrl} alt="Reported issue" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginTop: '0.5rem' }} />
              </div>
            )}
          </div>
          
          {/* Action Panel */}
          {complaint.status !== 'Closed' && (
            <div className="card flex-col gap-md">
              <h3>Take Action</h3>
              
              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select className="form-control" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress (Assign)</option>
                  <option value="Resolved">Mark as Resolved</option>
                  <option value="Escalated">Escalate</option>
                </select>
              </div>

              {newStatus === 'Resolved' && (
                <div className="form-group">
                  <label className="form-label">Resolution Evidence (Required)</label>
                  <input type="file" className="form-control" onChange={(e) => setResolutionEvidence(e.target.value)} />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Action Note / Progress Update</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="E.g. Technician dispatched to location..."
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                ></textarea>
              </div>

              <button className="btn btn-primary" onClick={handleUpdate}>Update Complaint</button>
            </div>
          )}
        </div>

        <div>
          {/* Timeline */}
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3 className="mb-md">Audit Timeline</h3>
            <div className="timeline" style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: 0, width: '2px', backgroundColor: '#e2e8f0' }}></div>
              
              {complaint.timeline.map((item, index) => (
                <div key={index} className="timeline-item mb-md" style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', left: '-25px', top: '4px', width: '16px', height: '16px', borderRadius: '50%',
                    backgroundColor: index === complaint.timeline.length - 1 ? 'var(--color-secondary)' : '#94a3b8',
                    border: '3px solid var(--color-surface)', zIndex: 1
                  }}></div>
                  <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.status}</p>
                  <p className="text-muted" style={{ fontSize: '0.8rem', margin: '2px 0' }}>{new Date(item.timestamp).toLocaleString()} {item.officialId ? `by ${item.officialId}` : ''}</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialComplaintDetails;
