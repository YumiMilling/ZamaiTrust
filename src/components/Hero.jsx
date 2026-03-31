import { C, ENTITY_COLORS, FONT } from '../theme';

const entities = [
  { key: 'party', label: 'Party' },
  { key: 'event', label: 'Event' },
  { key: 'attestation', label: 'Attestation' },
  { key: 'action', label: 'Action' },
  { key: 'credential', label: 'Credential' },
];

export default function Hero() {
  return (
    <section className="sec" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="eye" style={{ fontFamily: FONT.mono, fontSize: 14 }}>TRUST INFRASTRUCTURE v0.3</div>
      <h1 className="h1" style={{ fontSize: 72, marginBottom: 12 }}>Thiqa</h1>
      <p style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, color: C.cuHi, marginBottom: 28 }}>
        Every job counts.
      </p>
      <p className="p" style={{ fontSize: 20 }}>
        A verifiable trust layer for informal economy workers. No bank account needed. No credit history required. Just work — attested, scored, and portable.
      </p>
      <p className="p" style={{ fontSize: 18, color: C.t3 }}>
        Plumbers, traders, painters, delivery riders — anyone whose livelihood depends on trust but who has no institutional mechanism to prove reliability.
      </p>

      <div style={{ display: 'flex', gap: 16, marginTop: 44, flexWrap: 'wrap' }}>
        {entities.map((e) => (
          <div key={e.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: C.s2, borderTop: `2px solid ${ENTITY_COLORS[e.key].stroke}` }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: ENTITY_COLORS[e.key].stroke }} />
            <span style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1, letterSpacing: '.04em' }}>
              {e.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
