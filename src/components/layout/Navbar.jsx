import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMapPin } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center navbar-content">
        <Link to="/" className="navbar-logo flex items-center gap-sm">
          <FiMapPin className="logo-icon" />
          <span className="logo-text">CivicFix</span>
        </Link>
        
        <div className="navbar-links flex items-center gap-md">
          {!user ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/explore" className="nav-link">Explore</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          ) : (
            <>
              {user.role === 'citizen' && (
                <>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/report" className="nav-link">Report Issue</Link>
                  <Link to="/my-complaints" className="nav-link">My Complaints</Link>
                </>
              )}
              {user.role === 'official' && (
                <>
                  <Link to="/official" className="nav-link">Dashboard</Link>
                  <Link to="/official/complaints" className="nav-link">Complaints</Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="nav-link">Dashboard</Link>
                  <Link to="/admin/complaints" className="nav-link">Complaints</Link>
                  <Link to="/admin/audit" className="nav-link">Audit Logs</Link>
                </>
              )}
              <div className="user-profile flex items-center gap-sm">
                <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
