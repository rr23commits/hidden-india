import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Signup = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      authLogin(res.data.user, res.data.token);
      toast.success(`Welcome, ${res.data.user.name}`);
      navigate('/explore');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    ['Atlas AI', 'Ask our travel intelligence anything about India\'s hidden places'],
    ['Traveler Chat', 'Talk with people currently at the same destination'],
    ['Write Reviews', 'Help the next traveler with your real experience'],
    ['Nearby Services', 'Find hospitals, hotels and emergency contacts instantly'],
  ];

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-bg">
          <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=80" alt="" />
        </div>
        <div className="auth-visual-content">
          <h1>Your account, your advantage</h1>
          <p>Members get tools that make traveling India's hidden places safer and richer.</p>
          <div className="auth-benefits">
            {benefits.map(([title, desc]) => (
              <div key={title} className="benefit-item-auth">
                <div className="benefit-icon-auth">
                  <span>&#10003;</span>
                </div>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Link to="/" className="auth-logo">
            Hidden<span className="auth-logo-dot">.</span>India
          </Link>
          <h2>Create account</h2>
          <p className="auth-subtitle">Already have one? <Link to="/login">Sign in</Link></p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your name"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Repeat password"
                value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required />
            </div>
            <button type="submit" className="btn-terra auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="auth-terms">By signing up you agree to explore responsibly and respect local communities.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
