import { Link } from 'react-router-dom';
import './PostCard.css';

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <article className="post-card">
      {post.coverImage && (
        <Link to={`/posts/${post.slug}`} className="card-img-wrap">
          <img src={post.coverImage} alt={post.title} loading="lazy" />
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
        <p className="card-excerpt">{post.excerpt}</p>
        <div className="card-meta">
          <span>{post.author?.name}</span>
          <span className="dot">·</span>
          <span>{date}</span>
        </div>
      </div>
    </article>
  );
}
