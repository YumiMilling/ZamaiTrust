import { useState } from 'react';
import { C, FONT } from '../theme';

const PHASES = [
  {
    phase: 1,
    label: 'Pasa payments',
    status: 'Half-built',
    statusColor: C.cuHi,
    color: C.egHi,
    items: [
      'Self-attested events',
      'Payment port (CGrate 543)',
      'Person identity (Google + SIM)',
      'Trust API deployed as service',
    ],
    revenue: 'Pasa pay-per-plan exam prep',
    unlocks: 'Simplest end-to-end flow. Proves the API, identity, and payment plumbing.',
  },
  {
    phase: 2,
    label: 'Deliveries + documents',
    status: 'Next',
    statusColor: C.egHi,
    color: C.egHi,
    items: [
      'Multi-signature attestation',
      'Business identity (domain verification)',
      'Document port (upload, hash, extract)',
      'Verification port (email validation)',
      'Workshop attendance tool (CATSP)',
      'First Tier 2 attestations',
    ],
    revenue: 'Depot tool SaaS (NewGrowCo, 18 depots) + workshop fees (CATSP partners)',
    unlocks: 'Real counterparty validation. Document provenance. Institutional identity.',
  },
  {
    phase: 3,
    label: 'Operator connectivity',
    status: 'Planned',
    statusColor: C.t3,
    color: C.cuHi,
    items: [
      'Sovereign instances (Yumi + NewGrowCo)',
      '/connect handshake + API key exchange',
      'Tier 1 mutual attestation on grain purchases',
      'First bilateral reconciliation',
      'WhatsApp Business as Tier 2 channel',
    ],
    revenue: 'Operator subscriptions + CCSMP per-school fees',
    unlocks: 'Goods-flow tracking is live. Two independent databases agreeing on reality.',
  },
  {
    phase: 4,
    label: 'Trust profiles + financing',
    status: 'Planned',
    statusColor: C.t3,
    color: C.purple,
    items: [
      '/trust endpoint goes live',
      'Operators share profiles with lenders',
      'Supplier credit based on visible trade history',
      'Input-grain exchange tracking',
      'Daily Merkle roots over events',
    ],
    revenue: 'Paid trust profile queries (lenders, insurers)',
    unlocks: 'The credit-file substitute. Months of accumulated data make this credible.',
  },
  {
    phase: 5,
    label: 'Third-party API',
    status: 'Future',
    statusColor: C.t4,
    color: C.coral,
    items: [
      'Public API documentation',
      'Paid tier pricing for fintechs, insurers, government',
      'verify.zamai.pro goes public',
      'PACRA API integration (when available)',
      'Cross-sector expansion (construction, transport, services)',
    ],
    revenue: 'API query fees + verification fees',
    unlocks: 'The trust layer is infrastructure. Third parties build on it.',
  },
];

export default function BuildSequence() {
  const [expanded, setExpanded] = useState(0);

  return (
    <section id="phases" className="sec-alt">
      <div className="inner">
        <div className="eye">BUILD SEQUENCE</div>
        <h2 className="h2">Five phases</h2>
        <p className="p">
          Tools are the cost centre. Verified, queryable trust data is the revenue. Tool fees fund Phases 1–3. Query revenue kicks in at Phase 4.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 34 }}>
          {PHASES.map((p, i) => {
            const isExpanded = expanded === i;
            return (
              <div key={p.phase}
                onClick={() => setExpanded(isExpanded ? -1 : i)}
                style={{ cursor: 'pointer' }}>
                {/* Phase header row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '20px 24px',
                  background: isExpanded ? C.s2 : 'transparent',
                  border: isExpanded ? `1px solid ${C.s3}` : '1px solid transparent',
                  borderBottom: isExpanded ? 'none' : `1px solid ${C.s3}`,
                  borderRadius: isExpanded ? '8px 8px 0 0' : 0,
                  transition: 'background .2s',
                }}>
                  {/* Phase number */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: isExpanded ? p.color : C.s1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background .2s',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 600, color: isExpanded ? '#FFFFFF' : C.t2 }}>
                      {p.phase}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, color: C.t1 }}>
                      {p.label}
                    </span>
                  </div>

                  <span style={{
                    fontFamily: FONT.mono, fontSize: 12, padding: '4px 10px',
                    background: isExpanded ? `${p.statusColor}18` : C.s1,
                    color: p.statusColor, borderRadius: 4,
                  }}>
                    {p.status}
                  </span>

                  <span style={{ fontFamily: FONT.body, fontSize: 18, color: C.t3, transition: 'transform .2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                    ▾
                  </span>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{
                    padding: '20px 24px 24px',
                    background: C.s2,
                    border: `1px solid ${C.s3}`,
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    animation: 'fadeUp .2s ease-out',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      {/* What gets built */}
                      <div>
                        <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.t3, marginBottom: 8, letterSpacing: '.08em' }}>BUILDS</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {p.items.map((item, j) => (
                            <li key={j} style={{
                              fontFamily: FONT.body, fontSize: 14, color: C.t1, lineHeight: 1.65,
                              padding: '4px 0', paddingLeft: 16, position: 'relative',
                            }}>
                              <span style={{ position: 'absolute', left: 0, color: p.color }}>·</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Revenue + unlocks */}
                      <div>
                        <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.t3, marginBottom: 8, letterSpacing: '.08em' }}>REVENUE</div>
                        <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t1, lineHeight: 1.65, marginBottom: 16 }}>
                          {p.revenue}
                        </p>

                        <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.t3, marginBottom: 8, letterSpacing: '.08em' }}>UNLOCKS</div>
                        <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
                          {p.unlocks}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Economics callout */}
        <div style={{
          marginTop: 28, padding: '20px 26px',
          background: C.eg, border: `1px solid ${C.egBr}`,
          borderLeft: `4px solid ${C.egHi}`,
          borderRadius: 8,
        }}>
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.egHi, marginBottom: 6 }}>
            The economics
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t1, lineHeight: 1.75, margin: 0 }}>
            Event creation and attestation are <strong>free</strong>. Trust profile queries and document uploads are <strong>paid</strong> for third-party consumers. The tools generate the data. The API monetises the intelligence. The gap between creation (free) and consumption (paid) is the business.
          </p>
        </div>
      </div>
    </section>
  );
}
