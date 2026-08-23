import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    ward: 'Ward 1'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        ward: formData.ward
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="card flex-col gap-md items-center">
          <div style={{ color: 'var(--color-success)', fontSize: '3rem' }}>✓</div>
          <h2>Account Created Successfully</h2>
          <p className="text-muted">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '4rem auto' }}>
      <div className="card flex-col gap-lg">
        <div className="text-center">
          <h2>Create an Account</h2>
          <p className="text-muted mt-sm">Join CivicFix to report and track issues</p>
        </div>

        {error && <div style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-light)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-sm">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Ward / Area</label>
            <select className="form-control" name="ward" value={formData.ward} onChange={handleChange}>
              <option value="Ward 1">Ward 1</option>
              <option value="Ward 2">Ward 2</option>
              <option value="Ward 3">Ward 3</option>
              <option value="Ward 7">Ward 7</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary mt-sm" style={{ width: '100%' }}>Register</button>
        </form>

        <p className="text-center text-muted">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
