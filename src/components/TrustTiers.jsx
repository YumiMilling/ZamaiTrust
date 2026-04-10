import { useState } from 'react';
import { C, FONT } from '../theme';

const TIERS = [
  {
    tier: 1,
    label: 'Mutual attestation',
    strength: 'Strongest',
    color: C.green,
    colorLt: C.greenLt,
    pct: 100,
    desc: "Both parties are on the platform. Both record the same event from their own side. Their devices exchange signed confirmations. If the numbers match — verified. If they don't — both parties see the discrepancy.",
    example: 'The orchard clerk records "dispatched 480kg Hass to Chipata pack-house." The pack-house records "received 480kg Hass from Kanyanta Orchard." The two events are matched by time, location, and quantity.',
  },
  {
    tier: 2,
    label: 'Institutional attestation',
    strength: 'Strong',
    color: C.cuHi,
    colorLt: C.cu,
    pct: 65,
    desc: 'One party is on the platform. The counterparty confirms via institutional email from a verified domain, or through an accredited signer relationship. No platform account required for the counterparty. The domain provides organisational identity.',
    example: 'The pack-house uploads the MRL residue report. A validation email goes to lab@agristudies.co.zm. One click — confirm or dispute. Personal emails are blocked. ISO/IEC 17025 accreditation is part of the attestation metadata.',
  },
  {
    tier: 3,
    label: 'Self-reported',
    strength: 'Recorded only',
    color: C.t3,
    colorLt: C.s1,
    pct: 20,
    desc: "One party uploads a document — a receipt, an invoice, a delivery note. No counterparty response. The record exists, the document is hashed and timestamped, but it's self-reported and carries minimal weight in any downstream computation.",
    example: 'An exporter uploads a handwritten gate pass. SHA-256 hash locks the file. Anyone can later verify the document existed at this timestamp. But no one else confirmed what the document claims.',
  },
];

export default function TrustTiers() {
  const [selected, setSelected] = useState(null);
  const sel = selected !== null ? TIERS[selected] : null;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {TIERS.map((t, i) => {
          const isActive = selected === i;
          return (
            <div
              key={t.tier}
              onClick={() => setSelected(isActive ? null : i)}
              style={{
                padding: 22,
                background: C.s2,
                border: `1px solid ${C.s3}`,
                borderTop: `3px solid ${t.color}`,
                borderRadius: 6,
                cursor: 'pointer',
                outline: isActive ? `2px solid ${t.color}` : 'none',
                outlineOffset: -1,
              }}
            >
              <div style={{ fontFamily: FONT.mono, fontSize: 11, color: t.color, fontWeight: 600, marginBottom: 4, letterSpacing: '.08em' }}>
                TIER {t.tier}
              </div>
              <div style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, color: C.t1, marginBottom: 12 }}>
                {t.label}
              </div>

              {/* Strength bar */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: FONT.body, fontSize: 12, color: C.t3 }}>Weight</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: 12, color: t.color, fontWeight: 600 }}>{t.strength}</span>
                </div>
                <div style={{ height: 5, background: C.s3, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${t.pct}%`, height: '100%', background: t.color }} />
                </div>
              </div>

              <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, lineHeight: 1.65, margin: 0 }}>
                {t.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      {sel ? (
        <div style={{
          marginTop: 16, padding: 22, background: sel.colorLt,
          border: `1px solid ${C.s3}`,
          borderLeft: `3px solid ${sel.color}`,
          borderRadius: 4,
        }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: sel.color, letterSpacing: '.1em', marginBottom: 6 }}>
            EXAMPLE · TIER {sel.tier}
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t1, lineHeight: 1.7, margin: 0 }}>
            {sel.example}
          </p>
        </div>
      ) : (
        <div style={{
          marginTop: 14, fontFamily: FONT.mono, fontSize: 11, color: C.t4,
          textAlign: 'center', letterSpacing: '.06em',
        }}>
          Click any tier for a worked example.
        </div>
      )}

      <div style={{
        marginTop: 18, padding: '14px 18px',
        background: C.s1, borderLeft: `3px solid ${C.t3}`,
        borderRadius: 4, fontFamily: FONT.body, fontSize: 13,
        color: C.t2, lineHeight: 1.65,
      }}>
        <strong style={{ color: C.t1 }}>Tier is fixed at attestation time.</strong> A Tier 3 record does not get upgraded if better evidence appears later — a new, higher-tier attestation is created instead. The history is preserved.
      </div>
    </div>
  );
}
