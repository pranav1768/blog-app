import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './AdminPanel.css';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('stats');
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
      <h1 className="admin-title">Admin Panel</h1>

      <div className="admin-tabs">
        {['stats', 'users', 'posts'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div className="stats-grid">
          {[
            { label: 'Total Users',      value: stats.totalUsers,     icon: '👥' },
            { label: 'Total Posts',      value: stats.totalPosts,     icon: '📝' },
            { label: 'Published',        value: stats.publishedPosts, icon: '✅' },
            { label: 'Drafts',           value: stats.draftPosts,     icon: '📋' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <table className="dash-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role}
                    onChange={e => changeRole(u._id, e.target.value)}
                    style={{ width: 'auto', padding: '.3rem .5rem', fontSize: '.85rem' }}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'posts' && (
        <table className="dash-table">
          <thead>
            <tr><th>Title</th><th>Author</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p._id}>
                <td><Link to={`/posts/${p.slug}`} className="post-link">{p.title}</Link></td>
                <td>{p.author?.name}</td>
                <td>
                  <span className={`status-badge ${p.published ? 'pub' : 'draft'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="dash-actions">
                  <Link to={`/posts/${p._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => deletePost(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
