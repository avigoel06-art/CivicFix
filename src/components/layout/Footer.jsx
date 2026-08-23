import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand flex-col gap-sm">
          <h3 className="footer-logo">CivicFix</h3>
          <p className="footer-tagline">Building cleaner, safer and more responsive communities.</p>
        </div>
        <div className="footer-links flex gap-lg">
          <div className="footer-col flex-col gap-sm">
            <h4>Platform</h4>
            <a href="#">How It Works</a>
            <a href="#">Report Issue</a>
            <a href="#">Explore Issues</a>
          </div>
          <div className="footer-col flex-col gap-sm">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 CivicFix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
