import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as authLogin } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const user = authLogin(email, password);
      login(user);
      
      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'official') navigate('/official');
      else navigate('/dashboard');
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '4rem auto' }}>
      <div className="card flex-col gap-lg">
        <div className="text-center">
          <h2>Welcome Back</h2>
          <p className="text-muted mt-sm">Log in to your CivicFix account</p>
        </div>

        {error && <div style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-light)', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-md">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Login</button>
        </form>

        <div className="demo-accounts" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '1rem' }}>
          <p className="text-center text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Demo Accounts</p>
          <div className="flex gap-sm justify-center flex-wrap">
            <button onClick={() => handleDemoLogin('citizen@civicfix.demo', '123')} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Demo Citizen</button>
            <button onClick={() => handleDemoLogin('official@civicfix.demo', '123')} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Demo Official</button>
            <button onClick={() => handleDemoLogin('admin@civicfix.demo', '123')} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>Demo Admin</button>
          </div>
        </div>

        <p className="text-center text-muted">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
