import { useState } from 'react';
import { C, FONT } from '../theme';

const PHASES = [
  {
    phase: 1,
    label: 'Primitives live',
    status: 'Built',
    statusColor: C.green,
    color: C.egHi,
    items: [
      'Party / Event / Attestation as an API service',
      'Person identity (Google OAuth + SIM OTP)',
      'Payment port on CGrate 543 (MTN / Airtel Money)',
      'Self-attested Tier 3 events working end-to-end',
    ],
    revenue: 'Pay-per-plan exam prep and early depot trials cover hosting and dev costs.',
    unlocks: 'The plumbing is real. Identity, payments and the trust API all exist as running services, not slideware.',
  },
  {
    phase: 2,
    label: 'Depot + warehouse pilot',
    status: 'Next',
    statusColor: C.egHi,
    color: C.egHi,
    items: [
      'Depot tool for soya deliveries (single pilot site)',
      'First Tier 1 mutual attestations on real grain',
      'Business identity via domain verification',
      'EUDR-grade warehouse receipt, issued once against a single pilot corporate buyer',
      'Document port (upload, hash, provenance URL)',
    ],
    revenue: 'Depot tool SaaS (NewGrowCo or comparable pilot) + receipt issuance fees paid by the corporate buyer.',
    unlocks: 'One real soya load moves from farmer to EU-compliant buyer with a verifiable provenance chain. The mechanism is provable, not hypothetical.',
  },
  {
    phase: 3,
    label: 'Input-rail linkage',
    status: 'Planned',
    statusColor: C.cuHi,
    color: C.cuHi,
    items: [
      'Agro-dealer redemption recorded against the same farmer identity',
      'FISP e-voucher delivery as a Tier 1 attestation on the input side',
      'Full-season provenance for a single cohort: inputs in, harvest out',
      'WhatsApp Business as the Tier 2 attestation channel',
      'Bilateral reconciliation between independent operator databases',
    ],
    revenue: 'Per-transaction fees on agro-dealer redemptions + seasonal cohort subscriptions.',
    unlocks: 'One farmer carries one identity across both rails. The story "inputs on the e-voucher, harvest on the receipt" becomes real for a measurable cohort.',
  },
  {
    phase: 4,
    label: 'Trust profiles open to lenders',
    status: 'Planned',
    statusColor: C.t3,
    color: C.purple,
    items: [
      '/trust endpoint goes live',
      'Farmers and operators share profiles with lenders and insurers',
      'Supplier credit based on visible trade history',
      'Daily Merkle roots over events for tamper-proof audit',
      'First paid queries from a microfinance or input-credit partner',
    ],
    revenue: 'Paid trust-profile queries (lenders, insurers, corporate buyers).',
    unlocks: 'The credit-file substitute exists. A season of accumulated attestations is what makes it credible \u2014 not a pitch deck.',
  },
  {
    phase: 5,
    label: 'Third-party API & cross-sector',
    status: 'Future',
    statusColor: C.t4,
    color: C.coral,
    items: [
      'Public API documentation and pricing',
      'verify.zamai.pro opens to the public',
      'PACRA cross-check integration (when available)',
      'Cross-sector expansion (services, transport, construction)',
      'Sovereign operator instances for scaled deployments',
    ],
    revenue: 'Query fees + verification fees + sovereign instance licensing.',
    unlocks: 'Trust becomes infrastructure. Third parties build on it. Soya was just the worked example.',
  },
];

export default function BuildSequence() {
  const [expanded, setExpanded] = useState(0);

  return (
    <section id="phases" className="sec-alt">
      <div className="inner">
        <div className="eye">BUILD SEQUENCE</div>
        <h2 className="h2">Five phases, anchored to one cohort</h2>
        <p className="p">
          Soya is the worked example because it is EUDR-captured and it rotates with maize \u2014 the mechanism itself is domain-agnostic. Tools are the cost centre. Verified, queryable trust data is the revenue. Tool fees and receipt issuance fund Phases 1\u20133; query revenue kicks in at Phase 4.
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
                    \u25be
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
                              <span style={{ position: 'absolute', left: 0, color: p.color }}>\u00b7</span>
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
            Event creation and attestation are <strong>free</strong>. Trust profile queries, document uploads and warehouse receipts are <strong>paid</strong> \u2014 by lenders, insurers and corporate buyers whose own obligations are priced by law. The tools generate the data, the API monetises the intelligence, and the funding sits on the side where legal compliance makes non-payment impossible.
          </p>
        </div>
      </div>
    </section>
  );
}
