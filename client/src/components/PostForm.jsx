import { useState } from 'react';
import './PostForm.css';

export default function PostForm({ initial = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title:       initial.title       || '',
    content:     initial.content     || '',
    excerpt:     initial.excerpt     || '',
    coverImage:  initial.coverImage  || '',
    tags:        initial.tags?.join(', ') || '',
    published:   initial.published   ?? false,
  });
  const [error, setError] = useState('');

  const set = (key) => (e) =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <label className="form-label">Title *
        <input type="text" required value={form.title} onChange={set('title')}
          placeholder="Your post title…" />
      </label>

      <label className="form-label">Cover Image URL
        <input type="url" value={form.coverImage} onChange={set('coverImage')}
          placeholder="https://example.com/image.jpg" />
      </label>

      <label className="form-label">Tags
        <input type="text" value={form.tags} onChange={set('tags')}
          placeholder="technology, design, life (comma separated)" />
      </label>

      <label className="form-label">Excerpt
        <textarea rows={2} value={form.excerpt} onChange={set('excerpt')}
          placeholder="Short summary shown on cards (optional)" />
      </label>

      <label className="form-label">Content *
        <textarea rows={16} required value={form.content} onChange={set('content')}
          placeholder="Write your post here… HTML is supported." />
      </label>

      <label className="publish-toggle">
        <input type="checkbox" checked={form.published} onChange={set('published')} />
        <span>Publish immediately</span>
      </label>

      {error && <p className="error-msg">{error}</p>}

      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save Post'}
        </button>
      </div>
    </form>
  );
}
