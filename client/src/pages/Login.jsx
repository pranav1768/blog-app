import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/'); }
    catch (err) { setError(err.response?.data?.error || 'Invalid credentials.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page auth-page">
      <div className="auth-left">
        <div className="auth-left-logo">Blog<span>Base</span></div>
        <h2>Welcome back to the conversation.</h2>
        <p>Sign in to access your dashboard, manage posts, and continue writing.</p>
        <ul className="auth-bullets">
          <li><span className="auth-bullet-dot" />Publish with one click</li>
          <li><span className="auth-bullet-dot" />SEO-friendly slug URLs</li>
          <li><span className="auth-bullet-dot" />Full editorial control</li>
        </ul>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-brand-small">Blog<span>Base</span></div>
          <h1>Sign In</h1>
          <p>Access your account to continue.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Email Address
              <input type="email" required autoFocus value={form.email} onChange={set('email')} placeholder="you@example.com" />
            </label>
            <label>Password
              <input type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" />
            </label>
            {error && <p className="error-msg">{error}</p>}
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '.8rem' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="auth-switch">No account? <Link to="/register">Create one →</Link></p>
        </div>
      </div>
    </div>
  );
}
