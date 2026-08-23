import React from 'react';

const SuspiciousComplaints = () => {
  // Mock data for suspicious complaints
  const suspicious = [
    {
      id: 'CIV-10391',
      reason: 'Multiple similar complaints from same account in 1hr',
      risk: 'Medium'
    },
    {
      id: 'CIV-10355',
      reason: 'Location coordinates appear to be spoofed',
      risk: 'High'
    }
  ];

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 className="mb-lg text-danger">Suspicious Activity Monitoring</h2>
      <div className="flex-col gap-md">
        {suspicious.map(s => (
          <div key={s.id} className="card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="flex items-center gap-sm">
                  ⚠ Suspicious Complaint <span className="text-muted" style={{ fontSize: '1rem' }}>{s.id}</span>
                </h3>
                <p className="mt-sm"><strong>Reason:</strong> {s.reason}</p>
                <p><strong>Risk Level:</strong> <span style={{ color: s.risk === 'High' ? 'var(--color-danger)' : 'var(--color-warning)' }}>{s.risk}</span></p>
              </div>
              <div className="flex gap-sm">
                <button className="btn btn-primary" style={{ backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}>Review</button>
                <button className="btn btn-outline" style={{ color: 'var(--color-text-light)', borderColor: '#e2e8f0' }}>Dismiss Flag</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspiciousComplaints;
