import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import './Home.css';

export default function Home() {
  const [posts, setPosts]     = useState([]);
  const [meta, setMeta]       = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch]   = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [tag, setTag]         = useState('');
  const [sort, setSort]       = useState('-createdAt');
  const [page, setPage]       = useState(1);
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
    } catch {} finally { setLoading(false); }
  }, [page, search, tag, sort]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const featured = posts[0];
  const sidebar  = posts.slice(1, 5);
  const rest     = posts.slice(5);
  const isFiltered = search || tag || page > 1;

  return (
    <div className="page home-page">
      {/* Breaking bar */}
      <div className="breaking-bar">
        <div className="container breaking-inner">
          <span className="breaking-label">Latest</span>
          <span className="breaking-text">
            {featured ? featured.title : 'Welcome to BlogBase — the home for independent writers and curious readers.'}
          </span>
        </div>
      </div>

      <div className="container home-main">

        {/* Filter zone */}
        <div className="filter-zone">
          <form className="search-wrap" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search stories…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" type="submit">Search</button>
          </form>
          <div className="filter-pills">
            {['', 'technology', 'design', 'business', 'lifestyle'].map(t => (
              <button
                key={t}
                className={`filter-pill ${tag === t ? 'active' : ''}`}
                onClick={() => { setTag(t); setSearch(''); setSearchInput(''); setPage(1); }}
              >
                {t || 'All'}
              </button>
            ))}
          </div>
          <select
            className="sort-select"
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
          >
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="-title">A → Z</option>
            <option value="title">Z → A</option>
          </select>
        </div>

        {loading && <div className="spinner" />}

        {!loading && posts.length === 0 && (
          <div className="empty-state">
            <h3>No stories found</h3>
            <p>Try a different search or <Link to="/posts/new" style={{ color: 'var(--red)', fontWeight: 600 }}>write the first one</Link>.</p>
          </div>
        )}

        {!loading && posts.length > 0 && !isFiltered && (
          <>
            {/* Hero zone */}
            <div className="hero-zone">
              <div>
                <div className="section-label">Top Story</div>
                {featured && <PostCard post={featured} featured={true} />}
              </div>
              <aside className="hero-sidebar">
                <div className="sidebar-title">More Stories</div>
                {sidebar.map(p => (
                  <PostCard key={p._id} post={p} horizontal={true} />
                ))}
              </aside>
            </div>

            {/* Rest grid */}
            {rest.length > 0 && (
              <>
                <div className="section-header">
                  <h2 className="section-title">Latest Stories</h2>
                  <span style={{ fontSize: '.8rem', color: 'var(--gray4)' }}>{meta.total} articles</span>
                </div>
                <div className="posts-grid">
                  {rest.map((p, i) => <PostCard key={p._id} post={p} index={i} />)}
                </div>
              </>
            )}
          </>
        )}

        {/* Filtered view: flat grid */}
        {!loading && posts.length > 0 && isFiltered && (
          <>
            <div className="section-header">
              <h2 className="section-title">
                {search ? `Results for "${search}"` : tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : 'All Stories'}
              </h2>
              <span style={{ fontSize: '.8rem', color: 'var(--gray4)' }}>{meta.total} articles</span>
            </div>
            <div className="posts-grid">
              {posts.map((p, i) => <PostCard key={p._id} post={p} index={i} />)}
            </div>
          </>
        )}

        {/* Pagination */}
        {meta.pages > 1 && (
          <div className="pagination">
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>← Prev</button>
            <span className="page-info">{page} / {meta.pages}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p + 1)} disabled={page >= meta.pages}>Next →</button>
          </div>
        )}
      </div>

      {/* Newsletter strip */}
      <div className="newsletter-strip">
        <div className="container">
          <h3>Stay in the loop</h3>
          <p>Get the best stories delivered straight to your inbox.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="your@email.com" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}
