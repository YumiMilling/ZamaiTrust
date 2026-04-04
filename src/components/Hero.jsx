import { C, ENTITY_COLORS, FONT } from '../theme';

const primitives = [
  { key: 'party', label: 'Party' },
  { key: 'event', label: 'Event' },
  { key: 'attestation', label: 'Attestation' },
];

const verticals = [
  { label: 'Agriculture', color: C.green },
  { label: 'Services', color: C.cuHi },
  { label: 'Transport', color: C.purple },
  { label: 'Construction', color: C.coral },
];

export default function Hero() {
  return (
    <section className="sec" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="eye" style={{ fontFamily: FONT.mono, fontSize: 14 }}>TRUST INFRASTRUCTURE · ARCHITECTURE NOTE</div>
      <h1 className="h1" style={{ fontSize: 72, marginBottom: 12 }}>Thiqa</h1>
      <p style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, color: C.cuHi, marginBottom: 28 }}>
        The verification layer for the real economy.
      </p>
      <p className="p" style={{ fontSize: 20 }}>
        85% of Zambian employment is informal. The formal economy outside banking and mining isn't much better. Nobody can verify anything without physically being present or trusting a piece of paper.
      </p>
      <p className="p" style={{ fontSize: 18, color: C.t2 }}>
        Thiqa is the trust layer. It doesn't replace the actors or the transactions. It makes them <strong>visible</strong>, <strong>verifiable</strong>, and <strong>trustworthy</strong>. A grain delivery, a plumbing job, a rent payment — same primitive. Two parties, an event, an attestation.
      </p>

      <div style={{ display: 'flex', gap: 16, marginTop: 44, flexWrap: 'wrap' }}>
        {primitives.map((e) => (
          <div key={e.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: C.s2, borderTop: `2px solid ${ENTITY_COLORS[e.key].stroke}`, borderRadius: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: ENTITY_COLORS[e.key].stroke }} />
            <span style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1, letterSpacing: '.04em' }}>
              {e.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        {verticals.map((v) => (
          <span key={v.label} style={{
            fontFamily: FONT.mono, fontSize: 13, padding: '6px 14px', borderRadius: 4,
            background: C.base, border: `1px solid ${C.s3}`, color: v.color, fontWeight: 500,
          }}>{v.label}</span>
        ))}
        <span style={{
          fontFamily: FONT.mono, fontSize: 13, padding: '6px 14px', borderRadius: 4,
          background: C.base, border: `1px dashed ${C.s4}`, color: C.t4,
        }}>Domain-agnostic</span>
      </div>
    </section>
  );
}
