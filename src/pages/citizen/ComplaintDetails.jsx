import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintById, updateComplaintStatus } from '../../services/complaintService';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { FiCheckCircle, FiClock, FiMapPin, FiCalendar, FiUser, FiInfo } from 'react-icons/fi';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const data = getComplaintById(id);
    if (data) {
      setComplaint(data);
    } else {
      navigate('/dashboard');
    }
  }, [id, navigate]);

  const handleConfirmResolution = (isFixed) => {
    const status = isFixed ? 'Closed' : 'Reopened';
    const note = isFixed ? 'Citizen confirmed resolution.' : 'Citizen reopened issue (Not fixed).';
    const updated = updateComplaintStatus(id, status, 'System', note);
    setComplaint(updated);
  };

  if (!complaint) return <div>Loading...</div>;

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
      </div>

      <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="flex-col gap-lg">
          {/* Details */}
          <div className="card">
            <h3 className="mb-md">Description</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{complaint.description}</p>
            
            <div className="mt-md pt-md" style={{ borderTop: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Category</p>
                <p style={{ fontWeight: '500' }}>{complaint.category}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Severity</p>
                <p style={{ fontWeight: '500' }}>{complaint.severity}</p>
              </div>
            </div>
          </div>

          {/* Evidence Comparison */}
          {complaint.evidenceUrl && (
            <div className="card">
              <h3 className="mb-md">Evidence</h3>
              <div style={{ display: 'grid', gridTemplateColumns: complaint.resolutionEvidence ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                <div className="flex-col gap-sm text-center">
                  <p className="text-muted" style={{ fontWeight: '600' }}>REPORTED</p>
                  <img src={complaint.evidenceUrl} alt="Reported issue" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
                {complaint.resolutionEvidence && (
                  <div className="flex-col gap-sm text-center">
                    <p className="text-success" style={{ fontWeight: '600', color: 'var(--color-success)' }}>RESOLVED</p>
                    <img src={complaint.resolutionEvidence} alt="Resolved issue" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resolution Confirmation */}
          {complaint.status === 'Resolved' && (
            <div className="card" style={{ borderLeft: '4px solid var(--color-success)', backgroundColor: 'var(--color-success-light)' }}>
              <div className="flex items-start gap-md">
                <FiInfo size={24} color="var(--color-success)" style={{ marginTop: '4px' }} />
                <div>
                  <h3 className="mb-sm">Is the issue actually fixed?</h3>
                  <p className="mb-md">The department has marked this issue as resolved. Please confirm.</p>
                  <div className="flex gap-md">
                    <button className="btn" style={{ backgroundColor: 'var(--color-success)', color: 'white' }} onClick={() => handleConfirmResolution(true)}>
                      Yes, Problem Fixed
                    </button>
                    <button className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }} onClick={() => handleConfirmResolution(false)}>
                      No, Problem Still Exists
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline Sidebar */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3 className="mb-md">Timeline</h3>
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
                  <p className="text-muted" style={{ fontSize: '0.8rem', margin: '2px 0' }}>{new Date(item.timestamp).toLocaleString()}</p>
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

export default ComplaintDetails;
