import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostForm from '../components/PostForm';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Uses the new /posts/edit/:id route — works for drafts + published, owner or admin
    api.get(`/posts/edit/${id}`)
      .then(r => setPost(r.data.post))
      .catch(err => {
        const msg = err.response?.data?.error || 'Could not load post.';
        setError(msg);
      });
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await api.put(`/posts/${id}`, data);
      navigate(`/posts/${res.data.post.slug}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (error) return (
    <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
      <p className="error-msg" style={{ fontSize: '1rem' }}>{error}</p>
      <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate(-1)}>
        ← Go Back
      </button>
    </div>
  );

  if (!post) return <div className="spinner" />;

  return (
    <div className="page container post-form-page">
      <PostForm initial={post} onSubmit={handleSubmit} loading={saving} title="Edit story" />
    </div>
  );
}
