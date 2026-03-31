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
      <div className="eye" style={{ fontFamily: FONT.mono }}>TRUST INFRASTRUCTURE v0.3</div>
      <h1 className="h1" style={{ fontSize: 64, marginBottom: 8 }}>Thiqa</h1>
      <p style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 700, color: C.cuHi, marginBottom: 21 }}>
        Every job counts.
      </p>
      <p className="p">
        A verifiable trust layer for informal economy workers. No bank account needed. No credit history required. Just work — attested, scored, and portable.
      </p>
      <p className="p" style={{ color: C.t3 }}>
        Plumbers, traders, painters, delivery riders — anyone whose livelihood depends on trust but who has no institutional mechanism to prove reliability.
      </p>

      <div style={{ display: 'flex', gap: 16, marginTop: 34, flexWrap: 'wrap' }}>
        {entities.map((e) => (
          <div key={e.key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: C.s2, borderTop: `2px solid ${ENTITY_COLORS[e.key].stroke}` }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ENTITY_COLORS[e.key].stroke }} />
            <span style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: C.t1, letterSpacing: '.04em' }}>
              {e.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
