import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const CATS = [
  { label: 'Home',       path: '/' },
  { label: 'Technology', path: '/?tag=technology' },
  { label: 'Design',     path: '/?tag=design' },
  { label: 'Business',   path: '/?tag=business' },
  { label: 'Lifestyle',  path: '/?tag=lifestyle' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { close(); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const initial = user?.name?.[0]?.toUpperCase() || '?';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <header>
      {/* Top bar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <span className="topbar-date">{today}</span>
          <div className="topbar-links">
            <a href="/?tag=technology">Tech</a>
            <a href="/?tag=design">Design</a>
            <a href="/?tag=business">Business</a>
          </div>
        </div>
      </div>

      {/* Brand row — user controls clearly here */}
      <div className={`brand-row${elevated ? ' scrolled' : ''}`}>
        <div className="container brand-inner">
          <div>
            <Link to="/" className="brand-logo">Blog<span>Base</span></Link>
            <p className="brand-tagline">Insight · Analysis · Opinion</p>
          </div>

          <div className="brand-actions">
            {!user ? (
              <>
                <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-dark btn-sm">Subscribe Free</Link>
              </>
            ) : (
              <>
                <Link to="/posts/new" className="btn btn-primary btn-sm">+ Write</Link>
                <Link to="/dashboard" className="user-pill">
                  <span className="user-avatar">{initial}</span>
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav className={`cat-nav${elevated ? ' elevated' : ''}`}>
        <div className="container cat-nav-inner">
          <button
            className={`nav-toggle${open ? ' open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="menu"
          >
            <span /><span /><span />
          </button>

          <ul className={`cat-links${open ? ' open' : ''}`}>
            {CATS.map(c => (
              <li key={c.label}>
                <Link
                  to={c.path}
                  className={(location.pathname + location.search) === c.path ? 'cat-active' : ''}
                  onClick={close}
                >
                  {c.label}
                </Link>
              </li>
            ))}
            {user?.role === 'admin' && (
              <li><Link to="/admin" onClick={close}>Admin</Link></li>
            )}
          </ul>

          <div className="nav-right-actions">
            {user
              ? <Link to="/posts/new" className="btn btn-primary btn-sm">+ Write Story</Link>
              : <Link to="/register"  className="btn btn-primary btn-sm">Get Started</Link>
            }
          </div>
        </div>
      </nav>
    </header>
  );
}
