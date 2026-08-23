import { getItem, setItem } from './localStorage';

export const seedInitialData = () => {
  const users = getItem('users');
  if (users && users.length > 0) return; // Already seeded

  console.log('Seeding initial demo data...');

  // Seed Users
  const seedUsers = [
    {
      id: 'USR-1001',
      name: 'Demo Citizen',
      email: 'citizen@civicfix.demo',
      password: '123',
      role: 'citizen',
      ward: 'Ward 7',
      reliabilityScore: 92,
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR-2001',
      name: 'Demo Official',
      email: 'official@civicfix.demo',
      password: '123',
      role: 'official',
      department: 'Electrical',
      ward: 'Ward 7',
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR-3001',
      name: 'Demo Admin',
      email: 'admin@civicfix.demo',
      password: '123',
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ];
  setItem('users', seedUsers);

  // Seed Complaints
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const seedComplaints = [
    {
      id: 'CIV-10482',
      userId: 'USR-1001',
      title: 'Street Light Not Working',
      category: 'Street Light',
      description: 'The street light on main street has been off for 3 days. It is very dark and unsafe at night.',
      severity: 'Medium',
      status: 'In Progress',
      priority: 'Medium',
      location: { lat: 28.6139, lng: 77.2090, address: 'Main Street, Ward 7' },
      supportCount: 24,
      supporters: ['USR-1001'],
      createdAt: twoDaysAgo.toISOString(),
      updatedAt: yesterday.toISOString(),
      evidenceUrl: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=400&auto=format&fit=crop', // Dark street placeholder
      timeline: [
        { status: 'Submitted', timestamp: twoDaysAgo.toISOString(), note: 'Complaint submitted by citizen.' },
        { status: 'Assigned', timestamp: yesterday.toISOString(), note: 'Assigned to Electrical Department.', officialId: 'USR-2001' },
        { status: 'In Progress', timestamp: yesterday.toISOString(), note: 'Technician dispatched.', officialId: 'USR-2001' }
      ]
    },
    {
      id: 'CIV-10483',
      userId: 'USR-1001',
      title: 'Garbage Accumulation',
      category: 'Garbage',
      description: 'Large pile of garbage blocking the footpath.',
      severity: 'High',
      status: 'Pending',
      priority: 'High',
      location: { lat: 28.6145, lng: 77.2085, address: 'Market Road, Ward 3' },
      supportCount: 5,
      supporters: ['USR-1001'],
      createdAt: yesterday.toISOString(),
      updatedAt: yesterday.toISOString(),
      evidenceUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=400&auto=format&fit=crop', // Garbage placeholder
      timeline: [
        { status: 'Submitted', timestamp: yesterday.toISOString(), note: 'Complaint submitted by citizen.' }
      ]
    },
    {
      id: 'CIV-10480',
      userId: 'USR-1001',
      title: 'Major Pothole on Highway',
      category: 'Road Damage',
      description: 'Dangerous pothole causing traffic issues and damage to vehicles.',
      severity: 'Critical',
      status: 'Resolved',
      priority: 'Critical',
      location: { lat: 28.6120, lng: 77.2100, address: 'Highway 42, Ward 1' },
      supportCount: 42,
      supporters: ['USR-1001'],
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: yesterday.toISOString(),
      evidenceUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400&auto=format&fit=crop',
      resolutionEvidence: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop', // Fixed road
      timeline: [
        { status: 'Submitted', timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Complaint submitted.' },
        { status: 'In Progress', timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), note: 'Repair started.' },
        { status: 'Resolved', timestamp: yesterday.toISOString(), note: 'Pothole filled and road smoothed.' }
      ]
    }
  ];
  setItem('complaints', seedComplaints);

  // Seed Audit Logs
  const seedAuditLogs = [
    { id: 'AUD-001', complaintId: 'CIV-10482', action: 'Created', userId: 'USR-1001', timestamp: twoDaysAgo.toISOString() },
    { id: 'AUD-002', complaintId: 'CIV-10482', action: 'Status changed to In Progress', userId: 'USR-2001', timestamp: yesterday.toISOString() }
  ];
  setItem('auditLogs', seedAuditLogs);
};
