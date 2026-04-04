import { C, FONT } from '../theme';

const TRIGGERS = [
  {
    name: 'Circular Attestation',
    desc: 'A attests for B who attests for A. Detected instantly.',
    visual: (
      <svg width="120" height="40" viewBox="0 0 120 40">
        <circle cx="20" cy="20" r="6" fill={C.red} opacity={0.6}/>
        <circle cx="60" cy="10" r="6" fill={C.red} opacity={0.6}/>
        <circle cx="100" cy="20" r="6" fill={C.red} opacity={0.6}/>
        <path d="M26 18 L54 12" stroke={C.red} strokeWidth="1" markerEnd="url(#fArrow)"/>
        <path d="M66 12 L94 18" stroke={C.red} strokeWidth="1" markerEnd="url(#fArrow)"/>
        <path d="M94 26 L26 26" stroke={C.red} strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#fArrow)"/>
      </svg>
    ),
  },
  {
    name: 'Geographic Impossibility',
    desc: 'Two attestations 500km apart within minutes.',
    visual: (
      <svg width="120" height="40" viewBox="0 0 120 40">
        <circle cx="20" cy="20" r="5" fill={C.red} opacity={0.6}/>
        <circle cx="100" cy="20" r="5" fill={C.red} opacity={0.6}/>
        <line x1="27" y1="20" x2="93" y2="20" stroke={C.red} strokeWidth="1" strokeDasharray="4 3"/>
        <text x="60" y="13" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, fontWeight: 600, fill: C.red }}>500km</text>
        <text x="60" y="36" textAnchor="middle" style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, fill: '#C5BFB8' }}>3 min</text>
      </svg>
    ),
  },
  {
    name: 'Volume Spikes',
    desc: 'Sudden surge in transaction frequency.',
    visual: (
      <svg width="120" height="40" viewBox="0 0 120 40">
        {[12, 14, 10, 35, 12].map((h, i) => (
          <rect key={i} x={10 + i * 22} y={40 - h} width={14} height={h} rx={2}
            fill={i === 3 ? C.red : C.s4}/>
        ))}
      </svg>
    ),
  },
  {
    name: 'Amount Clustering',
    desc: 'Suspiciously uniform transaction amounts.',
    visual: (
      <svg width="120" height="40" viewBox="0 0 120 40">
        {[20, 20, 20, 20].map((h, i) => (
          <rect key={i} x={12 + i * 26} y={40 - h} width={16} height={h} rx={2} fill={C.red} opacity={0.5}/>
        ))}
        <line x1="8" y1="20" x2="112" y2="20" stroke={C.red} strokeWidth="0.5" strokeDasharray="3 2"/>
      </svg>
    ),
  },
  {
    name: 'Ghost Counterparties',
    desc: 'Parties who only appear in one person\'s transactions.',
    visual: (
      <svg width="120" height="40" viewBox="0 0 120 40">
        <circle cx="30" cy="20" r="8" fill={C.s4} stroke={C.red} strokeWidth="1" strokeDasharray="3 2"/>
        <circle cx="80" cy="12" r="4" fill={C.red} opacity={0.4}/>
        <circle cx="90" cy="28" r="4" fill={C.red} opacity={0.4}/>
        <circle cx="100" cy="16" r="4" fill={C.red} opacity={0.4}/>
        <line x1="38" y1="17" x2="74" y2="13" stroke={C.red} strokeWidth="0.8"/>
        <line x1="38" y1="23" x2="84" y2="27" stroke={C.red} strokeWidth="0.8"/>
        <line x1="38" y1="18" x2="94" y2="16" stroke={C.red} strokeWidth="0.8"/>
      </svg>
    ),
  },
  {
    name: 'Device Compromise',
    desc: 'Same device used by multiple identities.',
    visual: (
      <svg width="120" height="40" viewBox="0 0 120 40">
        <rect x="45" y="5" width="30" height="30" rx="4" fill="none" stroke={C.red} strokeWidth="1"/>
        <text x="60" y="24" textAnchor="middle" style={{ fontSize: 12, fill: C.red }}>!</text>
        <circle cx="20" cy="12" r="4" fill={C.red} opacity={0.5}/>
        <circle cx="20" cy="28" r="4" fill={C.red} opacity={0.5}/>
        <circle cx="100" cy="12" r="4" fill={C.red} opacity={0.5}/>
        <line x1="24" y1="12" x2="44" y2="18" stroke={C.red} strokeWidth="0.6"/>
        <line x1="24" y1="28" x2="44" y2="24" stroke={C.red} strokeWidth="0.6"/>
        <line x1="76" y1="18" x2="96" y2="12" stroke={C.red} strokeWidth="0.6"/>
      </svg>
    ),
  },
];

export default function FraudDetection() {
  return (
    <section id="fraud" className="sec">
      <div className="eye" style={{ color: C.red }}>FRAUD DETECTION</div>
      <h2 className="h2">Six automatic triggers</h2>
      <p className="p">No manual review. The system detects irregularities in real time and acts immediately.</p>

      <div className="card-grid" style={{ marginTop: 34 }}>
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <marker id="fArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M2 2L8 5L2 8" fill={C.red}/>
            </marker>
          </defs>
        </svg>

        {TRIGGERS.map((t, i) => (
          <div key={i} className="fraud-card">
            <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>
              {t.name}
            </div>
            <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t2, lineHeight: 1.7, marginBottom: 16 }}>
              {t.desc}
            </p>
            {t.visual}
          </div>
        ))}
      </div>

      {/* Three-tier response model */}
      <div style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: C.t1, marginTop: 40, marginBottom: 16 }}>
        Three-tier response — not instant suspension
      </div>
      <p style={{ fontFamily: FONT.body, fontSize: 16, color: C.t2, lineHeight: 1.75, marginBottom: 20, maxWidth: 780 }}>
        Automated detection is good. Automated <em style={{ color: C.red, fontStyle: 'normal', fontWeight: 600 }}>suspension</em> without human review damages platform trust. False positives happen — GPS inaccuracy in rural Zambia, harvest-season volume spikes, standardised commodity pricing.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ padding: '24px', background: '#FFFBEB', border: '1px solid #FCD34D', borderTop: '3px solid #D97706', borderRadius: 8 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: '#D97706', marginBottom: 6 }}>
            Yellow — Weight reduction
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.65, margin: 0 }}>
            Soft signals (volume spikes, amount clustering). Events still processed but trust weight drops temporarily. Recovers as normal activity resumes.
          </p>
        </div>
        <div style={{ padding: '24px', background: '#FFF7ED', border: '1px solid #FDBA74', borderTop: '3px solid #EA580C', borderRadius: 8 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: '#EA580C', marginBottom: 6 }}>
            Orange — Attestation hold
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.65, margin: 0 }}>
            Medium signals (geographic impossibility, ghost counterparties). Attestations held 24 hours before finalising. Party notified. Not publicly visible.
          </p>
        </div>
        <div style={{ padding: '24px', background: C.redLt, border: `1px solid ${C.red}`, borderTop: `3px solid ${C.red}`, borderRadius: 8 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.red, marginBottom: 6 }}>
            Red — Manual review
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.65, margin: 0 }}>
            Hard signals (circular attestation, device compromise). Flagged for human review. Public suspension only after confirmed fraud.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 20, padding: '16px 22px', background: C.s1, borderLeft: `3px solid ${C.t3}`, borderRadius: 6 }}>
        <span style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2 }}>
          <strong style={{ color: C.t1 }}>Zambian tuning:</strong> GPS threshold 500m (not 50m). Volume baselines use seasonal norms, not rolling averages. Amount clustering exempts FRA/ZNFU published rates.
        </span>
      </div>
    </section>
  );
}
