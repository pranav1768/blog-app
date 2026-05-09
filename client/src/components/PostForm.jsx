import { useState } from 'react';
import './PostForm.css';

export default function PostForm({ initial = {}, onSubmit, loading, title = 'Write a new story' }) {
  const [form, setForm] = useState({
    title:      initial.title      || '',
    content:    initial.content    || '',
    excerpt:    initial.excerpt    || '',
    coverImage: initial.coverImage || '',
    tags:       initial.tags?.join(', ') || '',
    published:  initial.published  ?? false,
  });
  const [error, setError] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const toggle = () => setForm(f => ({ ...f, published: !f.published }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await onSubmit({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div>
      <div className="post-form-header">
        <h1>{title}</h1>
        <p>Compose · Draft · Publish</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="post-form-layout">
          {/* Main */}
          <div className="post-form-main">
            <div className="form-group">
              <input
                className="title-input"
                type="text" required
                value={form.title} onChange={set('title')}
                placeholder="Story headline…"
              />
            </div>

            <div className="form-group">
              <label className="form-lbl">Excerpt / Summary</label>
              <textarea rows={2} value={form.excerpt} onChange={set('excerpt')}
                placeholder="A short summary shown on the homepage cards (optional)…" />
            </div>

            <div className="form-group">
              <label className="form-lbl">Body *</label>
              <textarea rows={24} required value={form.content} onChange={set('content')}
                placeholder="Write your story here… HTML is supported." />
            </div>

            {error && <p className="error-msg">{error}</p>}
          </div>

          {/* Sidebar */}
          <div className="post-form-side">
            {/* Publish card */}
            <div className="side-card">
              <div className="side-card-title">Publishing</div>
              <div className="publish-row" onClick={toggle}>
                <span className="publish-row-label">
                  {form.published ? '✅ Publish' : '📋 Save as draft'}
                </span>
                <div className={`toggle-pill ${form.published ? 'on' : ''}`} />
              </div>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? 'Saving…' : form.published ? 'Publish Story' : 'Save Draft'}
              </button>
            </div>

            {/* Details card */}
            <div className="side-card">
              <div className="side-card-title">Story Details</div>
              <div className="form-group">
                <label className="form-lbl">Tags (comma-separated)</label>
                <input type="text" value={form.tags} onChange={set('tags')}
                  placeholder="technology, design, life" />
              </div>
              <div className="form-group">
                <label className="form-lbl">Cover Image URL</label>
                <input type="url" value={form.coverImage} onChange={set('coverImage')}
                  placeholder="https://…" />
                {form.coverImage && (
                  <img
                    src={form.coverImage} alt="Cover preview"
                    className="cover-preview"
                    onError={e => e.target.style.display = 'none'}
                  />
                )}
              </div>
            </div>

            {/* Tips card */}
            <div className="side-card">
              <div className="side-card-title">Tips</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                {[
                  'Use HTML tags for formatting',
                  '<h2> for section headings',
                  '<blockquote> for pull quotes',
                  '<strong> to emphasise key points',
                ].map(t => (
                  <li key={t} style={{ fontSize: '.78rem', color: 'var(--gray4)', display: 'flex', gap: '.4rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--red)', fontWeight: 700, marginTop: '.05rem' }}>·</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
