import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts/mine')
      .then(r => setPosts(r.data.posts))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return;
    await api.delete(`/posts/${id}`);
    setPosts(ps => ps.filter(p => p._id !== id));
  };

  const published = posts.filter(p => p.published).length;
  const drafts    = posts.filter(p => !p.published).length;

  return (
    <div className="page container dashboard">
      <div className="dash-header">
        <div>
          <h1 className="dash-greeting">
            Hello, <span>{user.name.split(' ')[0]}</span>
          </h1>
          <p className="dash-sub">Your writing dashboard</p>
        </div>
        <Link to="/posts/new" className="btn btn-primary">+ New Story</Link>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-val">{posts.length}</div>
          <div className="dash-stat-lbl">Total Posts</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-val red">{published}</div>
          <div className="dash-stat-lbl">Published</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-val">{drafts}</div>
          <div className="dash-stat-lbl">Drafts</div>
        </div>
      </div>

      {loading && <div className="spinner" />}

      {!loading && posts.length === 0 && (
        <div className="dash-empty">
          <h3>No stories yet</h3>
          <p>Your published and draft posts will appear here.</p>
          <Link to="/posts/new" className="btn btn-primary">Write your first story</Link>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <>
          <h2 className="dash-section-title">Your Stories</h2>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(p => (
                <tr key={p._id}>
                  <td>
                    <Link to={`/posts/${p.slug}`} className="post-link">{p.title}</Link>
                  </td>
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
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
