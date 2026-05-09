import { Link } from 'react-router-dom';
import './PostCard.css';

export default function PostCard({ post, featured = false, horizontal = false, index = 0 }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
  const letter = post.title?.[0]?.toUpperCase() || 'B';
  const delay = `${index * 0.07}s`;

  return (
    <article
      className={`post-card fade-up${featured ? ' featured' : ''}${horizontal ? ' horizontal' : ''}`}
      style={{ animationDelay: delay }}
    >
      {post.coverImage ? (
        <Link to={`/posts/${post.slug}`} className="card-img-wrap">
          <img src={post.coverImage} alt={post.title} loading="lazy" />
          {featured && <div className="featured-overlay" />}
        </Link>
      ) : (
        <Link to={`/posts/${post.slug}`} className="card-img-wrap">
          <div className="card-no-img">{letter}</div>
          {featured && <div className="featured-overlay" />}
        </Link>
      )}

      <div className="card-body">
        {post.tags?.length > 0 && (
          <div className="card-tags">
            {post.tags.slice(0, 2).map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
        <h2 className="card-title">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
        {!horizontal && <p className="card-excerpt">{post.excerpt}</p>}
        <div className="card-meta">
          <span className="card-author">{post.author?.name}</span>
          <span className="dot">·</span>
          <span>{date}</span>
        </div>
        {!horizontal && (
          <Link to={`/posts/${post.slug}`} className="card-read-more">
            Read more <span className="read-arrow">→</span>
          </Link>
        )}
      </div>
    </article>
  );
}
