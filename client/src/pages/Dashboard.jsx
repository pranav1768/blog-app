import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    api.get('/posts/mine')
      .then(r => setPosts(r.data.posts))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    setPosts(ps => ps.filter(p => p._id !== id));
  };

  return (
    <div className="page container dashboard">
      <div className="dash-header">
        <div>
          <h1>Hello, {user.name} 👋</h1>
          <p className="dash-sub">Manage your posts below</p>
        </div>
        <Link to="/posts/new" className="btn btn-primary">+ New Post</Link>
      </div>

      {loading && <div className="spinner" />}

      {!loading && posts.length === 0 && (
        <div className="dash-empty">
          <p>You haven't written anything yet.</p>
          <Link to="/posts/new" className="btn btn-outline" style={{ marginTop: '1rem' }}>
            Write your first post
          </Link>
        </div>
      )}

      {!loading && posts.length > 0 && (
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
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="dash-actions">
                  <Link to={`/posts/${p._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
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
