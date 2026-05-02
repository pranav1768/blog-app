import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-ink">Ink</span>well
        </Link>
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="menu">
          <span /><span /><span />
        </button>
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
          {!user && <>
            <li><Link to="/login" onClick={() => setOpen(false)}>Login</Link></li>
            <li>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </li>
          </>}
          {user && <>
            <li><Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link></li>
            <li><Link to="/posts/new" onClick={() => setOpen(false)}>Write</Link></li>
            {user.role === 'admin' && (
              <li><Link to="/admin" onClick={() => setOpen(false)}>Admin</Link></li>
            )}
            <li>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>}
        </ul>
      </div>
    </nav>
  );
}
