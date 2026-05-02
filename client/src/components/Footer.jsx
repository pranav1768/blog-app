import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--paper-dim)',
      padding: '2rem 0',
      textAlign: 'center',
      color: 'var(--muted)',
      fontSize: '.85rem',
      marginTop: '4rem',
    }}>
      <div className="container">
        <p>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', color: 'var(--ink)' }}>
            <span style={{ color: 'var(--gold)' }}>Ink</span>well
          </span>
          {'  ·  '}
          <Link to="/" style={{ color: 'var(--muted)' }}>Home</Link>
          {'  ·  '}
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
