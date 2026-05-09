import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './AdminPanel.css';
import './Dashboard.css';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab]     = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users'),
      api.get('/admin/posts'),
    ]).then(([s, u, p]) => {
      setStats(s.data);
      setUsers(u.data.users);
      setPosts(p.data.posts);
    }).finally(() => setLoading(false));
  }, []);

  const changeRole = async (id, role) => {
    const { data } = await api.put(`/admin/users/${id}/role`, { role });
    setUsers(us => us.map(u => u._id === id ? data.user : u));
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(us => us.filter(u => u._id !== id));
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    setPosts(ps => ps.filter(p => p._id !== id));
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page container admin-panel">
      <div className="admin-header">
        <div>
          <h1 className="admin-title"><span>Admin</span> Panel</h1>
          <p style={{ fontSize: '.78rem', color: 'var(--gray4)', marginTop: '.3rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>
            Full editorial control
          </p>
        </div>
        <span className="admin-badge">Administrator</span>
      </div>

      <div className="admin-tabs">
        {[
          { id: 'stats', label: 'Overview' },
          { id: 'users', label: `Users (${users.length})` },
          { id: 'posts', label: `Posts (${posts.length})` },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'stats' && stats && (<div className="tab-content">
        <div className="tab-content">
        <div className="stats-grid">
          {[
            { icon: '👥', label: 'Total Users',  value: stats.totalUsers },
            { icon: '📝', label: 'Total Posts',  value: stats.totalPosts },
            { icon: '✅', label: 'Published',    value: stats.publishedPosts },
            { icon: '📋', label: 'Drafts',       value: stats.draftPosts },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (<div className="tab-content">
        <table className="dash-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: 600 }}>{u.name}</td>
                <td style={{ fontSize: '.82rem', color: 'var(--gray4)' }}>{u.email}</td>
                <td>
                  <select value={u.role} onChange={e => changeRole(u._id, e.target.value)}
                    style={{ width: 'auto', padding: '.3rem .5rem', fontSize: '.8rem' }}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={{ fontSize: '.8rem', color: 'var(--gray4)' }}>
                  {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Posts */}
      {tab === 'posts' && (<div className="tab-content">
        <table className="dash-table">
          <thead>
            <tr><th>Title</th><th>Author</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p._id}>
                <td><Link to={`/posts/${p.slug}`} className="post-link">{p.title}</Link></td>
                <td style={{ fontSize: '.85rem', color: 'var(--gray4)' }}>{p.author?.name}</td>
                <td>
                  <span className={`status-badge ${p.published ? 'pub' : 'draft'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ fontSize: '.8rem', color: 'var(--gray4)' }}>
                  {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td>
                  <div className="dash-actions">
                    <Link to={`/posts/${p._id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm" onClick={() => deletePost(p._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
