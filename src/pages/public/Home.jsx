import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiAlertTriangle, FiMap, FiShield } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container flex items-center justify-between gap-xl">
          <div className="hero-content flex-col gap-md">
            <h1 className="hero-title">Your City. Your Voice. Your Fix.</h1>
            <p className="hero-subtitle">
              Report civic problems, track real progress, and help build a better community.
            </p>
            <div className="hero-actions flex gap-md">
              <Link to="/report" className="btn btn-primary">Report a Problem</Link>
              <Link to="/explore" className="btn btn-outline">Explore Civic Issues</Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-stats-card card flex-col gap-sm">
              <div className="stat-item flex justify-between items-center">
                <span className="stat-label text-muted">Issues Reported</span>
                <span className="stat-value">12,480+</span>
              </div>
              <div className="stat-item flex justify-between items-center">
                <span className="stat-label text-muted">Issues Resolved</span>
                <span className="stat-value" style={{color: 'var(--color-success)'}}>9,840</span>
              </div>
              <div className="stat-item flex justify-between items-center">
                <span className="stat-label text-muted">Resolution Rate</span>
                <span className="stat-value">87%</span>
              </div>
              <div className="stat-item flex justify-between items-center">
                <span className="stat-label text-muted">Average Response</span>
                <span className="stat-value">24 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works bg-white section-padding">
        <div className="container">
          <h2 className="section-title text-center mb-xl">How CivicFix Works</h2>
          <div className="steps-grid">
            {[
              { num: '01', title: 'Report', desc: 'Take a photo, select category, and submit the issue.' },
              { num: '02', title: 'Verify', desc: 'System prevents duplicates and verifies location.' },
              { num: '03', title: 'Assign', desc: 'Routed automatically to the correct department.' },
              { num: '04', title: 'Resolve', desc: 'Officials fix the issue and upload proof.' },
              { num: '05', title: 'Confirm', desc: 'Citizen confirms if the problem is actually solved.' }
            ].map(step => (
              <div key={step.num} className="step-card flex-col items-center text-center gap-sm">
                <div className="step-num">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CivicFix */}
      <section className="why-civicfix section-padding">
        <div className="container">
          <h2 className="section-title text-center mb-xl">Why CivicFix?</h2>
          <div className="features-grid">
            <div className="feature-card card flex-col gap-sm">
              <FiShield className="feature-icon" />
              <h3>Verified Reporting</h3>
              <p className="text-muted">Evidence-based complaints with GPS location tracking ensure actionable data for authorities.</p>
            </div>
            <div className="feature-card card flex-col gap-sm">
              <FiCheckCircle className="feature-icon" />
              <h3>Transparent Tracking</h3>
              <p className="text-muted">Follow every step of your complaint from submission to final resolution with a clear timeline.</p>
            </div>
            <div className="feature-card card flex-col gap-sm">
              <FiMap className="feature-icon" />
              <h3>Smart Routing</h3>
              <p className="text-muted">Issues are automatically routed to the correct municipal department based on category and ward.</p>
            </div>
            <div className="feature-card card flex-col gap-sm">
              <FiAlertTriangle className="feature-icon" />
              <h3>Duplicate Prevention</h3>
              <p className="text-muted">Smart algorithms detect similar nearby complaints, encouraging community support over duplication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding bg-primary text-white text-center">
        <div className="container flex-col items-center gap-md">
          <h2>See a problem? Help fix it.</h2>
          <p>Join thousands of citizens making our city better every day.</p>
          <Link to="/report" className="btn btn-primary mt-sm" style={{backgroundColor: 'white', color: 'var(--color-primary)'}}>Report an Issue</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
