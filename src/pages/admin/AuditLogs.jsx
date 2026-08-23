import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../../services/complaintService';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <header className="mb-lg">
        <h2>System Audit Logs</h2>
        <p className="text-muted">Tracking all actions for transparency and accountability.</p>
      </header>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Log ID</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Complaint ID</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Action</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>User ID</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: '#64748b' }}>{log.id}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--color-secondary)' }}>{log.complaintId}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{log.action}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>{log.userId}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
