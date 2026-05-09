import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form.name, form.email, form.password); navigate('/'); }
    catch (err) { setError(err.response?.data?.error || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page auth-page">
      <div className="auth-left">
        <div className="auth-left-logo">Blog<span>Base</span></div>
        <h2>Your ideas deserve an audience.</h2>
        <p>Join thousands of writers sharing stories on technology, design, business, and lifestyle.</p>
        <ul className="auth-bullets">
          <li><span className="auth-bullet-dot" />Free to write and publish</li>
          <li><span className="auth-bullet-dot" />Role-based access control</li>
          <li><span className="auth-bullet-dot" />SEO-optimised from day one</li>
          <li><span className="auth-bullet-dot" />Draft & publish workflow</li>
        </ul>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-brand-small">Blog<span>Base</span></div>
          <h1>Create Account</h1>
          <p>Start writing in under a minute.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Full Name
              <input type="text" required autoFocus value={form.name} onChange={set('name')} placeholder="Your name" />
            </label>
            <label>Email Address
              <input type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
            </label>
            <label>Password
              <input type="password" required minLength={6} value={form.password} onChange={set('password')} placeholder="Min. 6 characters" />
            </label>
            {error && <p className="error-msg">{error}</p>}
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '.8rem' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
}
