import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { saveComplaint, findSimilarComplaints, supportComplaint } from '../../services/complaintService';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const ReportIssue = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    duration: '',
    severity: 'Medium',
    evidenceUrl: null,
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: ''
    }
  });

  const [similarIssues, setSimilarIssues] = useState([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const categories = [
    'Street Light', 'Garbage', 'Road Damage', 'Water Supply', 
    'Electricity', 'Drainage', 'Public Safety', 'Other'
  ];

  const handleNext = () => {
    // Before moving to Review step, check for duplicates
    if (step === 4) {
      const similar = findSimilarComplaints(formData.category, formData.location.lat, formData.location.lng);
      if (similar.length > 0) {
        setSimilarIssues(similar);
        setShowDuplicateWarning(true);
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSupportExisting = (id) => {
    supportComplaint(id, user.id);
    navigate(`/complaint/${id}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, evidenceUrl: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const submitComplaint = () => {
    const newComplaint = saveComplaint({
      ...formData,
      userId: user.id
    });
    // Normally redirect to success or details
    navigate(`/complaint/${newComplaint.id}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2 className="mb-lg">Report Civic Issue</h2>
      
      {/* Progress Bar */}
      <div className="flex justify-between mb-xl" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: 0, right: 0, height: '4px', backgroundColor: '#e2e8f0', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '15px', left: 0, width: `${((step - 1) / 4) * 100}%`, height: '4px', backgroundColor: 'var(--color-secondary)', zIndex: 0, transition: 'width 0.3s' }}></div>
        
        {['Category', 'Details', 'Evidence', 'Location', 'Review'].map((label, index) => (
          <div key={index} className="flex-col items-center gap-xs" style={{ zIndex: 1 }}>
            <div style={{ 
              width: '34px', height: '34px', borderRadius: '50%', 
              backgroundColor: step > index ? 'var(--color-secondary)' : (step === index + 1 ? 'var(--color-surface)' : '#e2e8f0'),
              border: step === index + 1 ? '2px solid var(--color-secondary)' : 'none',
              color: step > index ? 'white' : (step === index + 1 ? 'var(--color-secondary)' : '#94a3b8'),
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
            }}>
              {index + 1}
            </div>
            <span style={{ fontSize: '0.8rem', color: step >= index + 1 ? 'var(--color-heading)' : '#94a3b8' }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        {step === 1 && (
          <div className="flex-col gap-md">
            <h3>Select Issue Category</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  className={`card ${formData.category === cat ? 'active' : ''}`}
                  style={{ 
                    border: formData.category === cat ? '2px solid var(--color-secondary)' : '1px solid #e2e8f0',
                    textAlign: 'center', cursor: 'pointer', padding: '1.5rem 1rem'
                  }}
                  onClick={() => setFormData({...formData, category: cat})}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-col gap-md">
            <h3>Issue Details</h3>
            <div className="form-group">
              <label className="form-label">Issue Title</label>
              <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Broken street light near park" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the problem in detail..."></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">How long has the problem existed?</label>
              <input type="text" className="form-control" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 2 weeks" />
            </div>
            <div className="form-group">
              <label className="form-label">Severity</label>
              <select className="form-control" value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})}>
                <option value="Low">Low - Minor cosmetic issue</option>
                <option value="Medium">Medium - Regular maintenance needed</option>
                <option value="High">High - Significant disruption</option>
                <option value="Critical">Critical - Public safety hazard</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-col gap-md text-center">
            <h3>Upload Evidence</h3>
            <p className="text-muted">Evidence strengthens your complaint and helps authorities resolve it faster.</p>
            
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '3rem', backgroundColor: '#f8fafc', marginTop: '1rem' }}>
              {formData.evidenceUrl ? (
                <div>
                  <p>File uploaded successfully!</p>
                  {formData.evidenceUrl.startsWith('data:image') && (
                    <img src={formData.evidenceUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', margin: '1rem 0', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                  <br />
                  <button className="btn btn-outline mt-md" onClick={() => setFormData({...formData, evidenceUrl: null})}>Remove</button>
                </div>
              ) : (
                <div>
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload" className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                    Browse Files
                  </label>
                  <p className="text-muted mt-sm" style={{ fontSize: '0.8rem' }}>Upload Image or Video</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-col gap-md">
            <h3>Issue Location</h3>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input type="text" className="form-control" value={formData.location.address} onChange={e => setFormData({...formData, location: {...formData.location, address: e.target.value}})} placeholder="Enter exact street address or landmark" />
            </div>
            
            <div style={{ height: '300px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
               <MapContainer 
                 center={[formData.location.lat, formData.location.lng]} 
                 zoom={13} 
                 style={{ height: '100%', width: '100%', borderRadius: '8px' }}
               >
                 <TileLayer
                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 />
                 <LocationMarker 
                   position={{ lat: formData.location.lat, lng: formData.location.lng }}
                   setPosition={(pos) => setFormData({...formData, location: {...formData.location, lat: pos.lat, lng: pos.lng}})}
                 />
               </MapContainer>
            </div>
            <div className="flex gap-sm">
              <button 
                className="btn btn-outline" 
                style={{flex: 1}}
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setFormData({
                          ...formData, 
                          location: {
                            ...formData.location, 
                            lat: position.coords.latitude, 
                            lng: position.coords.longitude
                          }
                        });
                      },
                      (err) => {
                        console.error(err);
                        alert("Could not get location. Please click on the map.");
                      }
                    );
                  }
                }}
              >
                Use My Current Location
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex-col gap-md">
            <h3>Review Complaint</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
              <p><strong>Category:</strong> {formData.category}</p>
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Description:</strong> {formData.description}</p>
              <p><strong>Severity:</strong> {formData.severity}</p>
              <p><strong>Location:</strong> {formData.location.address}</p>
              <p><strong>Evidence attached:</strong> {formData.evidenceUrl ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-xl pt-md" style={{ borderTop: '1px solid #e2e8f0' }}>
          <button className="btn btn-outline" onClick={handleBack} disabled={step === 1}>Back</button>
          
          {step < 5 ? (
            <button className="btn btn-primary" onClick={handleNext} disabled={step === 1 && !formData.category}>Next</button>
          ) : (
            <button className="btn btn-primary" onClick={submitComplaint}>Submit Complaint</button>
          )}
        </div>
      </div>

      {/* Duplicate Warning Modal */}
      {showDuplicateWarning && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h3 style={{ color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚠ Similar Issue Found
            </h3>
            <p className="mt-sm mb-md text-muted">A complaint matching this issue already exists nearby.</p>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <p><strong>{similarIssues[0].id}</strong> - {similarIssues[0].title}</p>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>{similarIssues[0].location.address}</p>
              <div className="mt-sm"><span className="badge badge-info">{similarIssues[0].status}</span></div>
            </div>

            <p className="mt-md text-center">Instead of creating another complaint, you can support the existing issue.</p>
            
            <div className="flex justify-between mt-lg">
              <button className="btn btn-outline" onClick={() => { setShowDuplicateWarning(false); setStep(5); }}>
                Submit New Anyway
              </button>
              <button className="btn btn-primary" onClick={() => handleSupportExisting(similarIssues[0].id)}>
                Support Existing Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;
