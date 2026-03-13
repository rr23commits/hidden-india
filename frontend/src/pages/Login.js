import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await login(form);
      authLogin(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-bg">
          <img src="https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=900&q=80" alt="" />
        </div>
        <div className="auth-visual-content">
          <h1>Every great journey starts with curiosity</h1>
          <p>Sign in and continue exploring destinations most travelers never find.</p>
          <div className="auth-destinations">
            {['Spiti Valley', 'Ziro Valley', 'Majuli Island', 'Hampi', 'Mawlynnong'].map((d) => (
              <div key={d} className="auth-dest-tag">{d}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Link to="/" className="auth-logo">
            Hidden<span className="auth-logo-dot">.</span>India
          </Link>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">No account? <Link to="/signup">Create one free</Link></p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Your password"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn-terra auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
