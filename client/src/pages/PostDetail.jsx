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
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${post._id}`);
    navigate('/');
  };

  if (loading) return <div className="spinner" />;
  if (!post) return null;

  const canEdit = user && (user._id === post.author?._id || user.role === 'admin');
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="page post-detail">
      {post.coverImage && (
        <div className="detail-cover">
          <img src={post.coverImage} alt={post.title} />
        </div>
      )}
      <div className="container detail-body">
        <header className="detail-header">
          <div className="detail-tags">
            {post.tags?.map(t => <Link to={`/?tag=${t}`} key={t} className="tag">{t}</Link>)}
          </div>
          <h1 className="detail-title">{post.title}</h1>
          <div className="detail-meta">
            <span>By <strong>{post.author?.name}</strong></span>
            <span className="dot">·</span>
            <span>{date}</span>
            {canEdit && (
              <div className="detail-actions">
                <Link to={`/posts/${post._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>
        </header>
        <div className="divider" />
        <div
          className="detail-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
