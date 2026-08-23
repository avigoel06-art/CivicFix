import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { FiGrid, FiFileText, FiMap, FiAlertCircle, FiSettings, FiUsers } from 'react-icons/fi';
import './DashboardLayout.css';

const DashboardLayout = ({ role }) => {
  const location = useLocation();

  const citizenLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/report', label: 'Report Issue', icon: <FiAlertCircle /> },
    { to: '/my-complaints', label: 'My Complaints', icon: <FiFileText /> },
  ];

  const officialLinks = [
    { to: '/official', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/official/complaints', label: 'Complaints', icon: <FiFileText /> },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/admin/complaints', label: 'All Complaints', icon: <FiFileText /> },
    { to: '/admin/suspicious', label: 'Suspicious', icon: <FiAlertCircle /> },
    { to: '/admin/audit', label: 'Audit Logs', icon: <FiFileText /> },
  ];

  const getLinks = () => {
    switch (role) {
      case 'citizen': return citizenLinks;
      case 'official': return officialLinks;
      case 'admin': return adminLinks;
      default: return [];
    }
  };

  const links = getLinks();

  return (
    <div className="flex-col" style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Navbar />
      
      <div className="container dashboard-container flex gap-lg">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav flex-col gap-sm">
            {links.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`sidebar-link flex items-center gap-sm ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
