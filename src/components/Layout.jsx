import { Link, NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { C, FONT } from '../theme';

const CASES = [
  { slug: 'avocado', label: 'Hass avocado → EU', tag: 'Case', color: C.egHi },
];

const META = [
  { path: '/principles',   label: 'Principles' },
  { path: '/architecture', label: 'Architecture' },
];

export default function Layout() {
  const loc = useLocation();
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'architecture' ? 'architecture' : 'application';
  const showToggle = loc.pathname.startsWith('/case/');

  const setView = (v) => {
    const next = new URLSearchParams(params);
    if (v === 'application') next.delete('view');
    else next.set('view', v);
    setParams(next, { replace: true });
  };

  return (
    <div>
      {/* Top nav */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(250,250,247,.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.s3}`,
        display: 'flex', alignItems: 'center',
        padding: '0 28px', height: 58, gap: 20,
      }}>
        <Link to="/" style={{
          fontFamily: FONT.display, fontSize: 16, fontWeight: 800,
          color: C.egHi, textDecoration: 'none', letterSpacing: '.02em',
          display: 'flex', alignItems: 'baseline', gap: 8,
        }}>
          Thiqa Trust Layer
          <span style={{
            fontFamily: FONT.mono, fontSize: 10, fontWeight: 500,
            color: C.t4, letterSpacing: '.1em',
          }}>
            REFERENCE PROTOTYPE
          </span>
        </Link>

        <div style={{ flex: 1 }} />

        {META.map((m) => (
          <NavLink key={m.path} to={m.path} style={({ isActive }) => ({
            fontFamily: FONT.body, fontSize: 13, fontWeight: 500,
            color: isActive ? C.egHi : C.t3,
            textDecoration: 'none',
            letterSpacing: '.02em',
          })}>
            {m.label}
          </NavLink>
        ))}

        {showToggle && (
          <ViewToggle view={view} setView={setView} />
        )}
      </header>

      {/* Sidebar + content */}
      <div style={{ display: 'flex', paddingTop: 58, minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside style={{
          width: 260,
          borderRight: `1px solid ${C.s3}`,
          padding: '32px 24px',
          background: C.base,
          position: 'sticky',
          top: 58,
          height: 'calc(100vh - 58px)',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: FONT.mono, fontSize: 11, color: C.t4,
            letterSpacing: '.1em', marginBottom: 14,
          }}>
            WORKED CASE
          </div>
          {CASES.map((c) => (
            <NavLink key={c.slug} to={`/case/${c.slug}`}
              style={({ isActive }) => ({
                display: 'block',
                padding: '12px 14px',
                marginBottom: 6,
                background: isActive ? C.s2 : 'transparent',
                border: isActive ? `1px solid ${C.s3}` : '1px solid transparent',
                borderLeft: isActive ? `3px solid ${c.color}` : '3px solid transparent',
                borderRadius: 4,
                textDecoration: 'none',
                color: C.t1,
              })}>
              <div style={{
                fontFamily: FONT.mono, fontSize: 10, color: c.color,
                letterSpacing: '.08em', marginBottom: 2,
              }}>
                {c.tag.toUpperCase()}
              </div>
              <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1 }}>
                {c.label}
              </div>
            </NavLink>
          ))}

          <div style={{
            fontFamily: FONT.mono, fontSize: 11, color: C.t4,
            letterSpacing: '.1em', marginTop: 32, marginBottom: 14,
          }}>
            REFERENCE
          </div>
          <NavLink to="/principles" style={({ isActive }) => ({
            display: 'block', padding: '8px 14px',
            fontFamily: FONT.body, fontSize: 13,
            color: isActive ? C.egHi : C.t2,
            textDecoration: 'none',
            borderLeft: isActive ? `2px solid ${C.egHi}` : '2px solid transparent',
          })}>
            Seven principles
          </NavLink>
          <NavLink to="/architecture" style={({ isActive }) => ({
            display: 'block', padding: '8px 14px',
            fontFamily: FONT.body, fontSize: 13,
            color: isActive ? C.egHi : C.t2,
            textDecoration: 'none',
            borderLeft: isActive ? `2px solid ${C.egHi}` : '2px solid transparent',
          })}>
            Architecture
          </NavLink>
          <NavLink to="/economics" style={({ isActive }) => ({
            display: 'block', padding: '8px 14px',
            fontFamily: FONT.body, fontSize: 13,
            color: isActive ? C.egHi : C.t2,
            textDecoration: 'none',
            borderLeft: isActive ? `2px solid ${C.egHi}` : '2px solid transparent',
          })}>
            Economics
          </NavLink>

          <div style={{
            marginTop: 32, padding: '12px 14px',
            background: C.s1, borderRadius: 4,
            fontFamily: FONT.body, fontSize: 11, color: C.t4,
            lineHeight: 1.55,
          }}>
            Frontend-only prototype. All data illustrative.
            No backend, no live attestations.
          </div>
        </aside>

        {/* Main */}
        <main style={{
          flex: 1,
          minWidth: 0,
          padding: '40px 55px 80px',
          maxWidth: 1100,
        }}>
          <Outlet context={{ view }} />
        </main>
      </div>
    </div>
  );
}

function ViewToggle({ view, setView }) {
  const base = {
    fontFamily: FONT.mono, fontSize: 11, fontWeight: 600,
    letterSpacing: '.06em',
    padding: '7px 14px',
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
    color: C.t3,
    transition: 'all .15s',
  };
  const active = {
    ...base,
    background: C.s2,
    color: C.t1,
    boxShadow: '0 1px 3px rgba(0,0,0,.06)',
  };
  return (
    <div style={{
      display: 'flex',
      background: C.s1,
      border: `1px solid ${C.s3}`,
      borderRadius: 6,
      padding: 3,
    }}>
      <button style={view === 'application' ? active : base}
        onClick={() => setView('application')}>
        APPLICATION
      </button>
      <button style={view === 'architecture' ? active : base}
        onClick={() => setView('architecture')}>
        ARCHITECTURE
      </button>
    </div>
  );
}
