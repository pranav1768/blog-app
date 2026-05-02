import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostForm from '../components/PostForm';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // fetch by ID for edit (admin endpoint)
    api.get(`/admin/posts`).then(r => {
      const found = r.data.posts.find(p => p._id === id);
      if (found) {
        // fetch full content
        api.get(`/posts/${found.slug}`).then(r2 => setPost(r2.data.post));
      }
    }).catch(() => {
      // fallback: user owns post
      api.get('/posts/mine').then(r => {
        const found = r.data.posts.find(p => p._id === id);
        if (found) api.get(`/posts/${found.slug}`).then(r2 => setPost(r2.data.post));
        else navigate('/dashboard');
      });
    });
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await api.put(`/posts/${id}`, data);
      navigate(`/posts/${res.data.post.slug}`);
    } finally {
      setSaving(false);
    }
  };

  if (!post) return <div className="spinner" />;

  return (
    <div className="page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', marginBottom: '2rem' }}>
        Edit post
      </h1>
      <PostForm initial={post} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
