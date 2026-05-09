import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './PostDetail.css';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts/${slug}`)
      .then(r => setPost(r.data.post))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post permanently?')) return;
    await api.delete(`/posts/${post._id}`);
    navigate('/');
  };

  if (loading) return <div className="spinner" />;
  if (!post) return null;

  const canEdit = user && (user._id === post.author?._id || user.role === 'admin');
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  const authorInitial = post.author?.name?.[0]?.toUpperCase() || 'B';

  return (
    <div className="page detail-page">
      {post.coverImage && (
        <div className="detail-cover">
          <img src={post.coverImage} alt={post.title} />
        </div>
      )}

      <div className="detail-layout">
        {/* Main content */}
        <main className="detail-main">
          <div className="detail-tags">
            {post.tags?.map(t => (
              <Link to={`/?tag=${t}`} key={t} className="tag">{t}</Link>
            ))}
          </div>

          <h1 className="detail-title">{post.title}</h1>

          <div className="detail-meta">
            <span>By</span>
            <span className="detail-author-name">{post.author?.name}</span>
            <span className="detail-dot">·</span>
            <span>{date}</span>
            {canEdit && (
              <div className="detail-actions">
                <Link to={`/posts/${post._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>

          {post.excerpt && (
            <p className="detail-lead">{post.excerpt}</p>
          )}

          <div
            className="detail-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray2)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-outline btn-sm">← Back to Home</Link>
            {post.tags?.map(t => (
              <Link to={`/?tag=${t}`} key={t} className="tag tag-outline">{t}</Link>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="detail-aside">
          <div className="aside-card">
            <div className="aside-title">About the Author</div>
            <div className="author-block">
              <div className={`author-av author-av-red`}>{authorInitial}</div>
              <div>
                <div className="author-name">{post.author?.name}</div>
                <div className="author-sub">Contributor</div>
              </div>
            </div>
          </div>

          <div className="aside-card">
            <div className="aside-title">Filed Under</div>
            <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
              {post.tags?.length
                ? post.tags.map(t => <Link to={`/?tag=${t}`} key={t} className="tag">{t}</Link>)
                : <span style={{ fontSize: '.85rem', color: 'var(--gray4)' }}>No tags</span>
              }
            </div>
          </div>

          <div className="aside-card">
            <div className="aside-title">BlogBase</div>
            <p style={{ fontSize: '.85rem', color: 'var(--gray4)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Independent writing platform. No paywalls. Just ideas.
            </p>
            <Link to="/register" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              Start Writing
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
