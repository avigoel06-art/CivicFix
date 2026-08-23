import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { seedInitialData } from './services/demoData';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Explore from './pages/public/Explore';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Citizen Pages
import CitizenDashboard from './pages/citizen/Dashboard';
import ReportIssue from './pages/citizen/ReportIssue';
import MyComplaints from './pages/citizen/MyComplaints';
import ComplaintDetails from './pages/citizen/ComplaintDetails';

// Official Pages
import OfficialDashboard from './pages/official/Dashboard';
import OfficialComplaints from './pages/official/Complaints';
import OfficialComplaintDetails from './pages/official/ComplaintDetails';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import SuspiciousComplaints from './pages/admin/SuspiciousComplaints';
import AuditLogs from './pages/admin/AuditLogs';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={
          <div className="container" style={{textAlign: 'center', padding: '100px 20px'}}>
            <h1>403 - Access Restricted</h1>
            <p>You do not have permission to access this area.</p>
          </div>
        } />
      </Route>

      {/* Citizen Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <DashboardLayout role="citizen" />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/complaint/:id" element={<ComplaintDetails />} />
      </Route>

      {/* Official Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['official']}>
          <DashboardLayout role="official" />
        </ProtectedRoute>
      }>
        <Route path="/official" element={<OfficialDashboard />} />
        <Route path="/official/complaints" element={<OfficialComplaints />} />
        <Route path="/official/complaint/:id" element={<OfficialComplaintDetails />} />
      </Route>

      {/* Admin Routes */}
      <Route element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout role="admin" />
        </ProtectedRoute>
      }>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/suspicious" element={<SuspiciousComplaints />} />
        <Route path="/admin/audit" element={<AuditLogs />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  useEffect(() => {
    // Seed data on first load if localStorage is empty
    seedInitialData();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
