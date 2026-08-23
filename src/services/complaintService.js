import { getItem, setItem, generateId } from './localStorage';

export const getComplaints = () => {
  return getItem('complaints', []);
};

export const getComplaintById = (id) => {
  const complaints = getComplaints();
  return complaints.find(c => c.id === id);
};

export const saveComplaint = (complaintData) => {
  const complaints = getComplaints();
  const id = generateId('CIV');
  
  const newComplaint = {
    ...complaintData,
    id,
    status: 'Pending',
    supportCount: 1,
    supporters: [complaintData.userId],
    timeline: [
      { status: 'Submitted', timestamp: new Date().toISOString(), note: 'Complaint submitted by citizen.' }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  complaints.unshift(newComplaint);
  setItem('complaints', complaints);
  
  // Log audit
  addAuditLog(id, 'Created', complaintData.userId);
  
  return newComplaint;
};

export const updateComplaintStatus = (id, newStatus, officialId, note = '', evidenceUrl = null) => {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  
  if (index !== -1) {
    complaints[index].status = newStatus;
    complaints[index].updatedAt = new Date().toISOString();
    
    if (evidenceUrl) {
      complaints[index].resolutionEvidence = evidenceUrl;
    }
    
    complaints[index].timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note,
      officialId
    });
    
    setItem('complaints', complaints);
    addAuditLog(id, `Status changed to ${newStatus}`, officialId);
    return complaints[index];
  }
  return null;
};

export const supportComplaint = (id, userId) => {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  
  if (index !== -1) {
    if (!complaints[index].supporters.includes(userId)) {
      complaints[index].supportCount += 1;
      complaints[index].supporters.push(userId);
      setItem('complaints', complaints);
      return true;
    }
  }
  return false;
};

export const findSimilarComplaints = (category, lat, lng) => {
  const complaints = getComplaints();
  return complaints.filter(c => {
    // Basic similarity check based on category and status
    if (c.category !== category) return false;
    if (c.status === 'Resolved' || c.status === 'Closed') return false;
    
    // In a real app, calculate actual distance. Here we do simple mock logic
    // Just returning any active complaint in the same category for demo
    return true; 
  }).slice(0, 3);
};

// Audit logs
export const getAuditLogs = () => {
  return getItem('auditLogs', []);
};

export const addAuditLog = (complaintId, action, userId) => {
  const logs = getAuditLogs();
  logs.unshift({
    id: generateId('AUD'),
    complaintId,
    action,
    userId,
    timestamp: new Date().toISOString()
  });
  setItem('auditLogs', logs);
};

export const getDashboardStats = () => {
  const complaints = getComplaints();
  return {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
  };
};
