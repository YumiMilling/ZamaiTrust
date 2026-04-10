import { C, FONT } from '../theme';

const TRIGGERS = [
  {
    name: 'Circular attestation',
    desc: 'A attests for B who attests for A. Longer cycles are detected via asynchronous graph analysis.',
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
    name: 'Geographic impossibility',
    desc: "An attester's trajectory over time is inconsistent with the claimed location of their current attestation.",
    visual: (
      <svg width="120" height="40" viewBox="0 0 120 40">
        <circle cx="20" cy="20" r="5" fill={C.red} opacity={0.6}/>
        <circle cx="100" cy="20" r="5" fill={C.red} opacity={0.6}/>
        <line x1="27" y1="20" x2="93" y2="20" stroke={C.red} strokeWidth="1" strokeDasharray="4 3"/>
        <text x="60" y="13" textAnchor="middle" style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 600, fill: C.red }}>500km</text>
        <text x="60" y="36" textAnchor="middle" style={{ fontFamily: FONT.mono, fontSize: 10, fill: C.t4 }}>3 min</text>
      </svg>
    ),
  },
  {
    name: 'Volume spike',
    desc: 'Sudden surge in transaction frequency beyond expected seasonal bounds for the party.',
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
    name: 'Amount clustering',
    desc: 'Suspiciously uniform transaction amounts suggesting structured evasion. Exempts published commodity rates.',
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
    name: 'Ghost counterparty',
    desc: "A party appearing only in one other party's attestation history, with no independent activity.",
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
    name: 'Device compromise',
    desc: "Anomalous signing patterns suggesting a party's device or key has been compromised.",
    visual: (
      <svg width="120" height="40" viewBox="0 0 120 40">
        <rect x="45" y="5" width="30" height="30" rx="4" fill="none" stroke={C.red} strokeWidth="1"/>
        <text x="60" y="24" textAnchor="middle" style={{ fontSize: 12, fill: C.red, fontWeight: 700 }}>!</text>
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
    <div>
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <marker id="fArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M2 2L8 5L2 8" fill={C.red}/>
          </marker>
        </defs>
      </svg>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {TRIGGERS.map((t, i) => (
          <div key={i} style={{
            padding: 20,
            background: C.s2,
            border: `1px solid ${C.s3}`,
            borderTop: `3px solid ${C.red}`,
            borderRadius: 6,
          }}>
            <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
              {t.name}
            </div>
            <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, lineHeight: 1.65, marginBottom: 12 }}>
              {t.desc}
            </p>
            {t.visual}
          </div>
        ))}
      </div>

      {/* Three-tier response model */}
      <div style={{ marginTop: 30, fontFamily: FONT.mono, fontSize: 11, color: C.t4, letterSpacing: '.1em', marginBottom: 10 }}>
        THREE-TIER RESPONSE · NOT INSTANT SUSPENSION
      </div>
      <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t3, lineHeight: 1.7, marginBottom: 16, maxWidth: 780 }}>
        Automated detection is good. Automated <strong style={{ color: C.red }}>suspension</strong> without human review damages platform trust. False positives happen — GPS inaccuracy on rural orchards, harvest-season volume spikes, ZNFU-published commodity rates.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div style={{ padding: 18, background: C.amberLt, border: `1px solid ${C.cuMid}`, borderTop: `3px solid ${C.amber}`, borderRadius: 6 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.amber, letterSpacing: '.1em', marginBottom: 4 }}>
            YELLOW
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
            Weight reduction
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.t3, lineHeight: 1.6, margin: 0 }}>
            Soft signals (volume spikes, amount clustering). Events still processed but trust weight drops temporarily. Recovers as normal activity resumes.
          </p>
        </div>
        <div style={{ padding: 18, background: C.coralLt, border: `1px solid ${C.coral}40`, borderTop: `3px solid ${C.coral}`, borderRadius: 6 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.coral, letterSpacing: '.1em', marginBottom: 4 }}>
            ORANGE
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
            Attestation hold
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.t3, lineHeight: 1.6, margin: 0 }}>
            Medium signals (geographic impossibility, ghost counterparties). Attestations held 24 hours before finalising. Party notified. Not publicly visible.
          </p>
        </div>
        <div style={{ padding: 18, background: C.redLt, border: `1px solid ${C.red}40`, borderTop: `3px solid ${C.red}`, borderRadius: 6 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.red, letterSpacing: '.1em', marginBottom: 4 }}>
            RED
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
            Manual review
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.t3, lineHeight: 1.6, margin: 0 }}>
            Hard signals (circular attestation, device compromise). Flagged for human review. Public suspension only after confirmed fraud.
          </p>
        </div>
      </div>

      <div style={{
        marginTop: 18, padding: '14px 18px',
        background: C.s1, borderLeft: `3px solid ${C.t3}`,
        borderRadius: 4, fontFamily: FONT.body, fontSize: 13,
        color: C.t2, lineHeight: 1.65,
      }}>
        <strong style={{ color: C.t1 }}>Zambian tuning:</strong> GPS threshold 500m, not 50m. Volume baselines use seasonal norms, not rolling averages. Amount clustering exempts FRA and ZNFU published commodity rates.
      </div>
    </div>
  );
}
