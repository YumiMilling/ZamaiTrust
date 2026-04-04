import { useState } from 'react';
import { C, FONT } from '../theme';

const TIERS = [
  {
    tier: 1,
    label: 'Mutual Attestation',
    strength: 'Strongest',
    color: C.green,
    colorLt: C.greenLt,
    pct: 100,
    desc: 'Both parties are on the platform. Both record the same event from their own side. Their apps exchange signed confirmations. If the numbers match — verified. If they don\'t — both parties see the discrepancy.',
    example: 'Yumi records "received 20t soya from NewGrowCo." NewGrowCo records "delivered 20t soya to Yumi." The trust API matches the two events.',
    icon: (col) => (
      <svg width="64" height="44" viewBox="0 0 64 44">
        <circle cx="16" cy="22" r="12" fill="none" stroke={col} strokeWidth="1.5"/>
        <circle cx="48" cy="22" r="12" fill="none" stroke={col} strokeWidth="1.5"/>
        <path d="M28 18 L36 22 L28 26" fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M36 18 L28 22 L36 26" fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    tier: 2,
    label: 'Institutional Attestation',
    strength: 'Strong',
    color: C.cuHi,
    colorLt: C.cu,
    pct: 65,
    desc: 'One party is on the platform. The counterparty confirms via institutional email from a verified domain. No platform account required. The domain provides organisational-level identity.',
    example: 'An operator uploads an invoice. A validation email goes to procurement@newgrowco.co.zm. One click — confirm or dispute. Personal emails (Gmail, Yahoo) are blocked.',
    icon: (col) => (
      <svg width="64" height="44" viewBox="0 0 64 44">
        <circle cx="16" cy="22" r="12" fill="none" stroke={col} strokeWidth="1.5"/>
        <rect x="36" y="12" width="24" height="20" rx="3" fill="none" stroke={col} strokeWidth="1.5"/>
        <path d="M36 14 L48 24 L60 14" fill="none" stroke={col} strokeWidth="1" opacity="0.6"/>
        <path d="M28 22 L36 22" fill="none" stroke={col} strokeWidth="1.5" strokeDasharray="3 2"/>
      </svg>
    ),
  },
  {
    tier: 3,
    label: 'Unverified',
    strength: 'Recorded',
    color: C.t3,
    colorLt: C.s1,
    pct: 20,
    desc: 'One party uploads a document — a receipt, an invoice, a delivery note. No counterparty response. The record exists, the document is hashed and timestamped, but it\'s self-reported.',
    example: 'A trader uploads a handwritten receipt. SHA-256 hash locks the file. Anyone can later verify the document existed at this timestamp. But no one else confirmed the transaction.',
    icon: (col) => (
      <svg width="64" height="44" viewBox="0 0 64 44">
        <circle cx="16" cy="22" r="12" fill="none" stroke={col} strokeWidth="1.5"/>
        <rect x="38" y="10" width="18" height="24" rx="2" fill="none" stroke={col} strokeWidth="1.5"/>
        <line x1="42" y1="18" x2="52" y2="18" stroke={col} strokeWidth="1" opacity="0.5"/>
        <line x1="42" y1="23" x2="52" y2="23" stroke={col} strokeWidth="1" opacity="0.5"/>
        <line x1="42" y1="28" x2="48" y2="28" stroke={col} strokeWidth="1" opacity="0.5"/>
        <text x="16" y="26" textAnchor="middle" style={{ fontSize: 10, fill: col, fontWeight: 600 }}>?</text>
      </svg>
    ),
  },
];

export default function TrustTiers() {
  const [selected, setSelected] = useState(null);
  const sel = selected !== null ? TIERS[selected] : null;

  return (
    <section id="tiers" className="sec-alt">
      <div className="inner">
        <div className="eye">ATTESTATION TIERS</div>
        <h2 className="h2">Three levels of trust</h2>
        <p className="p">Every transaction is assigned a tier at the time of attestation. It does not change retroactively. Trust is earned, not upgraded after the fact.</p>

        <div className="card-grid-3 stagger" style={{ marginTop: 34 }}>
          {TIERS.map((t, i) => {
            const isActive = selected === i;
            return (
              <div
                key={t.tier}
                className="card animate-in"
                style={{
                  borderTopColor: t.color,
                  cursor: 'pointer',
                  outline: isActive ? `2px solid ${t.color}` : 'none',
                  outlineOffset: -1,
                }}
                onClick={() => setSelected(isActive ? null : i)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 13, color: t.color, fontWeight: 500, marginBottom: 4 }}>
                      TIER {t.tier}
                    </div>
                    <div style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: C.t1 }}>
                      {t.label}
                    </div>
                  </div>
                  {t.icon(t.color)}
                </div>

                {/* Strength bar */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3 }}>Trust weight</span>
                    <span style={{ fontFamily: FONT.mono, fontSize: 13, color: t.color, fontWeight: 500 }}>{t.strength}</span>
                  </div>
                  <div style={{ height: 6, background: C.s3, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${t.pct}%`, height: '100%', background: t.color, borderRadius: 3, transition: 'width .6s ease-out' }} />
                  </div>
                </div>

                <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t2, lineHeight: 1.7, margin: 0 }}>
                  {t.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {sel && (
          <div style={{
            marginTop: 24, padding: 28, background: sel.colorLt,
            border: `1px solid ${C.s3}`,
            borderLeft: `4px solid ${sel.color}`,
            borderRadius: 8,
            animation: 'fadeUp .3s ease-out',
          }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 13, color: sel.color, marginBottom: 6 }}>EXAMPLE</div>
            <p style={{ fontFamily: FONT.body, fontSize: 16, color: C.t1, lineHeight: 1.75, margin: 0 }}>
              {sel.example}
            </p>
          </div>
        )}

        {/* Key principle */}
        <div className="pull" style={{ marginTop: 44 }}>
          "The strength of trust depends on how attestation was collected — not on who claims it. A Tier 3 record with a real document is worth less than a Tier 1 record with nothing but <em>two matching numbers</em>."
        </div>
      </div>
    </section>
  );
}
