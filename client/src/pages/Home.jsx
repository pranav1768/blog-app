import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import './Home.css';

export default function Home() {
  const [posts, setPosts]   = useState([]);
  const [meta, setMeta]     = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [tag, setTag]       = useState('');
  const [sort, setSort]     = useState('-createdAt');
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, sort, limit: 9 };
      if (search) params.search = search;
      if (tag) params.tag = tag;
      const { data } = await api.get('/posts', { params });
      setPosts(data.posts);
      setMeta({ page: data.page, pages: data.pages, total: data.total });
    } catch {
      // handle
    } finally {
      setLoading(false);
    }
  }, [page, search, tag, sort]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="container">
          <h1>Stories worth reading.</h1>
          <p>Discover thoughtful writing on technology, design, and ideas that matter.</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search posts…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ maxWidth: 480 }}
            />
            <button className="btn btn-primary" type="submit">Search</button>
          </form>
        </div>
      </section>

      <div className="container">
        {/* Filters */}
        <div className="filter-bar">
          <div className="filter-tags">
            {['', 'technology', 'design', 'business', 'lifestyle'].map(t => (
              <button
                key={t}
                className={`filter-pill ${tag === t ? 'active' : ''}`}
                onClick={() => { setTag(t); setPage(1); }}
              >
                {t || 'All'}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
            style={{ width: 'auto', padding: '.4rem .8rem' }}>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="-title">A → Z</option>
            <option value="title">Z → A</option>
          </select>
        </div>

        {loading && <div className="spinner" />}

        {!loading && posts.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '4rem 0' }}>
            No posts found.
          </p>
        )}

        {!loading && (
          <div className="posts-grid">
            {posts.map(p => <PostCard key={p._id} post={p} />)}
          </div>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="pagination">
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
              ← Prev
            </button>
            <span>{page} / {meta.pages}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p + 1)} disabled={page >= meta.pages}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
