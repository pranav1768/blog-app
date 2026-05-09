import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', color: '#fff', marginTop: '4rem' }}>
      <div className="container" style={{ padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '.5rem' }}>
              Blog<span style={{ color: 'var(--red)' }}>Base</span>
            </div>
            <p style={{ fontSize: '.85rem', color: 'var(--gray3)', lineHeight: 1.6 }}>
              A platform for independent thinkers. Write, publish, and share stories that matter.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray3)', marginBottom: '.9rem' }}>Explore</h4>
            {['Technology', 'Design', 'Business', 'Lifestyle'].map(c => (
              <div key={c} style={{ marginBottom: '.4rem' }}>
                <Link to={`/?tag=${c.toLowerCase()}`} style={{ fontSize: '.88rem', color: 'var(--gray3)', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'var(--gray3)'}
                >{c}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gray3)', marginBottom: '.9rem' }}>Account</h4>
            {[['Sign In', '/login'], ['Create Account', '/register'], ['Write a Post', '/posts/new']].map(([l, h]) => (
              <div key={l} style={{ marginBottom: '.4rem' }}>
                <Link to={h} style={{ fontSize: '.88rem', color: 'var(--gray3)', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'var(--gray3)'}
                >{l}</Link>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '.78rem', color: 'var(--gray4)' }}>© {new Date().getFullYear()} BlogBase. All rights reserved.</p>
          <p style={{ fontSize: '.78rem', color: 'var(--gray4)' }}>Built for writers, readers, and thinkers.</p>
        </div>
      </div>
    </footer>
  );
}
