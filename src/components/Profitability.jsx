import { C, FONT } from '../theme';

// --- Unit economics ---------------------------------------------------------
// All figures illustrative. ZMW/USD rate assumed at ~26 ZMW = 1 USD (April 2026).
// The point is to show the shape of the model, not to forecast the business.

const UNITS = [
  {
    line: 'Event creation',
    who: 'Operator, farmer, worker',
    price: 'Free',
    priceNote: 'Zero marginal cost to the party generating data.',
    rationale: 'Data generation must be free, or the graph never reaches critical mass. This is the loss leader.',
    sign: '−',
    color: C.t3,
  },
  {
    line: 'Depot / workshop tool',
    who: 'NewGrowCo, CATSP partners, cooperatives',
    price: 'ZMW 2,500',
    priceNote: 'per depot / month · SaaS',
    rationale: 'Operational tool that happens to emit attestations. The tool is the wedge. The data is the product.',
    sign: '+',
    color: C.egHi,
  },
  {
    line: 'Per-school feeding fee',
    who: 'CCSMP programme / donor line',
    price: 'ZMW 120',
    priceNote: 'per school / month',
    rationale: 'Covers feeding-day reconciliation and EMIS cross-validation. Procured as a line item in the programme budget.',
    sign: '+',
    color: C.egHi,
  },
  {
    line: 'Trust profile query',
    who: 'Lenders, insurers, buyers',
    price: 'ZMW 8',
    priceNote: 'per query',
    rationale: 'A lender looking up a trader\'s history. Priced as a credit-bureau substitute, not as a data product.',
    sign: '+',
    color: C.cuHi,
  },
  {
    line: 'Export compliance dossier',
    who: 'EU importers, retailers, traders (corporate)',
    price: 'USD 180',
    priceNote: 'per batch · EUDR + CSDDD + MRL + cold chain',
    rationale: 'A full reconcilable evidence chain for one container, sized against the cost a corporation would otherwise pay an auditor for the same assurance. Priced below the internal cost of a compliance analyst hour, not above.',
    sign: '+',
    color: C.cuHi,
    primary: true,
  },
  {
    line: 'Enterprise compliance contract',
    who: 'EU corporate buyers with portfolio exposure',
    price: 'USD 60–220k',
    priceNote: 'per year · unlimited batches on one commodity',
    rationale: 'For a corporation sourcing thousands of containers, per-batch pricing is friction. Annual contracts are priced against the EUDR / CSDDD fine envelope — a single violation is multi-million, which makes this line item invisible.',
    sign: '+',
    color: C.cuHi,
    primary: true,
  },
  {
    line: 'Third-party API call',
    who: 'Fintechs, insurers, govt systems',
    price: 'USD 0.02',
    priceNote: 'per verify call · volume tiered',
    rationale: 'Infrastructure pricing. Per-call fee scales with usage; large consumers negotiate annual commits.',
    sign: '+',
    color: C.cuHi,
  },
];

// --- Revenue ramp -----------------------------------------------------------
// Five-phase ramp aligned with BuildSequence. Figures in ZMW per month,
// approximated against the unit economics above.

const RAMP = [
  {
    phase: 'P1',
    label: 'Pilot',
    when: 'Q2 2026',
    rev: 8,
    detail: 'Pasa pilot fees only. Not yet a business.',
    color: C.t4,
  },
  {
    phase: 'P2',
    label: 'Depot SaaS + first dossiers',
    when: 'Q4 2026',
    rev: 85,
    detail: '18 depots × ZMW 2,500/mo + ~30 export dossiers/mo at USD 180. First corporate cash.',
    color: C.egBr,
  },
  {
    phase: 'P3',
    label: 'First enterprise contract',
    when: 'Q2 2027',
    rev: 290,
    detail: 'Depot SaaS + CCSMP line + first corporate annual contract (USD ~80k/yr on one commodity). Breakeven crossed.',
    color: C.egVi,
  },
  {
    phase: 'P4',
    label: 'Three enterprise contracts',
    when: 'Q4 2027',
    rev: 620,
    detail: 'Three corporate buyers on annual contracts + growing dossier volume + trust queries. Corporate compliance is now the dominant line.',
    color: C.egHi,
  },
  {
    phase: 'P5',
    label: 'Platform margins',
    when: '2028+',
    rev: 1350,
    detail: '8+ enterprise contracts, API usage from fintechs and insurers, export dossiers at 400+/mo. Operating on infrastructure margins.',
    color: C.cuHi,
  },
];

// --- Cost baseline ----------------------------------------------------------

const COSTS = [
  { line: 'Engineering (2 devs + founder time)', amt: 80 },
  { line: 'Field ops (2 coordinators)',           amt: 40 },
  { line: 'Hosting, storage, DB',                 amt: 15 },
  { line: 'CGrate / SMS / gateway fees',          amt: 10 },
];
const COST_TOTAL = COSTS.reduce((s, c) => s + c.amt, 0); // 145

// Helper: format ZMW in thousands ("ZMW 145k")
const zmwK = (n) => `ZMW ${n}k`;

const RAMP_MAX = Math.max(...RAMP.map((r) => r.rev));

export default function Profitability({ embedded = false }) {
  const Wrapper = embedded ? 'div' : 'section';
  const wrapperProps = embedded ? { id: 'profitability' } : { id: 'profitability', className: 'sec' };
  return (
    <Wrapper {...wrapperProps}>
      {!embedded && <div className="eye">PROFITABILITY · UNIT ECONOMICS · PATH TO BREAKEVEN</div>}
      {!embedded && <h2 className="h2">Profitability is the prerequisite for sustainability</h2>}
      {!embedded && (
        <p className="p">
          A trust layer for the real economy has to pay for itself, or the real economy will stop using it the moment donor money dries up. The numbers below are illustrative, but they are sized against real cost lines and real counterparties. They are here so the model can be argued with, not admired.
        </p>
      )}

      {/* ============================================================== */}
      {/* Unit economics table                                            */}
      {/* ============================================================== */}
      <div style={{ marginTop: embedded ? 0 : 44 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.t3, letterSpacing: '.08em', marginBottom: 14 }}>
          UNIT ECONOMICS · WHAT IS PAID, BY WHOM, FOR WHAT
        </div>

        <div style={{
          background: C.s2,
          border: `1px solid ${C.s3}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          {/* Header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.4fr 1fr 2fr',
            gap: 16,
            padding: '14px 22px',
            background: C.s1,
            borderBottom: `1px solid ${C.s3}`,
            fontFamily: FONT.mono,
            fontSize: 11,
            color: C.t3,
            letterSpacing: '.08em',
          }}>
            <div>LINE</div>
            <div>WHO PAYS</div>
            <div style={{ textAlign: 'right' }}>PRICE</div>
            <div>WHY IT IS PRICED THIS WAY</div>
          </div>

          {UNITS.map((u, i) => (
            <div key={u.line} style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.4fr 1fr 2fr',
              gap: 16,
              padding: '18px 22px',
              borderBottom: i === UNITS.length - 1 ? 'none' : `1px solid ${C.s3}`,
              alignItems: 'start',
              background: u.primary ? C.eg : 'transparent',
              borderLeft: u.primary ? `3px solid ${C.egHi}` : '3px solid transparent',
            }}>
              {/* Line name with sign marker */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{
                  fontFamily: FONT.mono, fontSize: 15, fontWeight: 700,
                  color: u.color, lineHeight: 1.4,
                }}>
                  {u.sign}
                </span>
                <div>
                  <span style={{
                    fontFamily: FONT.display, fontSize: 15, fontWeight: 700,
                    color: C.t1, lineHeight: 1.4,
                  }}>
                    {u.line}
                  </span>
                  {u.primary && (
                    <div style={{
                      fontFamily: FONT.mono, fontSize: 9, color: C.egHi,
                      letterSpacing: '.1em', marginTop: 2,
                    }}>
                      PRIMARY REVENUE
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.55 }}>
                {u.who}
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: FONT.mono, fontSize: 15, fontWeight: 600,
                  color: u.color, lineHeight: 1.3,
                }}>
                  {u.price}
                </div>
                <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4, marginTop: 2 }}>
                  {u.priceNote}
                </div>
              </div>

              <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, lineHeight: 1.6 }}>
                {u.rationale}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.t4, marginTop: 12, fontStyle: 'italic' }}>
          Creation is free; consumption is paid. The gap between a party writing a verified event and a third party reading it is where the business lives.
        </p>
      </div>

      {/* ============================================================== */}
      {/* Revenue ramp chart                                              */}
      {/* ============================================================== */}
      <div style={{ marginTop: 70 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 13, color: C.t3, letterSpacing: '.08em', marginBottom: 14 }}>
          REVENUE RAMP · MONTHLY GROSS, ZMW THOUSANDS
        </div>

        <div style={{
          background: C.s2,
          border: `1px solid ${C.s3}`,
          borderRadius: 8,
          padding: '38px 36px 32px',
        }}>
          {/* Cost baseline legend */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            fontFamily: FONT.mono, fontSize: 12, color: C.t3,
            marginBottom: 22,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 2, background: C.red }} />
              <span>Cost baseline {zmwK(COST_TOTAL)}/mo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, background: C.egHi, borderRadius: 2 }} />
              <span>Monthly revenue</span>
            </div>
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {RAMP.map((r) => {
              const widthPct = (r.rev / RAMP_MAX) * 100;
              const costPct = (COST_TOTAL / RAMP_MAX) * 100;
              const profitable = r.rev >= COST_TOTAL;
              return (
                <div key={r.phase}>
                  {/* Labels above bar */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    marginBottom: 6,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                      <span style={{
                        fontFamily: FONT.mono, fontSize: 12, fontWeight: 600,
                        color: r.color,
                      }}>
                        {r.phase}
                      </span>
                      <span style={{
                        fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1,
                      }}>
                        {r.label}
                      </span>
                      <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4 }}>
                        {r.when}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: FONT.mono, fontSize: 14, fontWeight: 600,
                      color: profitable ? C.egHi : C.t2,
                    }}>
                      {zmwK(r.rev)}
                      {profitable && <span style={{ color: C.egHi, marginLeft: 6 }}>▲</span>}
                    </span>
                  </div>

                  {/* Bar with cost baseline overlaid */}
                  <div style={{
                    position: 'relative',
                    height: 22,
                    background: C.s1,
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${widthPct}%`,
                      height: '100%',
                      background: r.color,
                      borderRadius: 3,
                      transition: 'width .8s ease-out',
                    }} />
                    {/* Cost baseline line */}
                    <div style={{
                      position: 'absolute',
                      top: 0, bottom: 0,
                      left: `${costPct}%`,
                      width: 2,
                      background: C.red,
                    }} />
                  </div>

                  {/* Detail */}
                  <div style={{
                    fontFamily: FONT.body, fontSize: 13, color: C.t3,
                    marginTop: 5, lineHeight: 1.55,
                  }}>
                    {r.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.t4, marginTop: 12, fontStyle: 'italic' }}>
          Breakeven is crossed in Phase 4 as trust-profile queries begin. Before that, depot SaaS and programme fees carry the burn. The cost baseline is held flat; the whole thesis collapses if cost grows with revenue.
        </p>
      </div>

      {/* ============================================================== */}
      {/* Cost structure + breakeven math                                 */}
      {/* ============================================================== */}
      <div style={{
        marginTop: 70,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24,
      }}>
        {/* Cost baseline */}
        <div style={{
          background: C.s2,
          border: `1px solid ${C.s3}`,
          borderTop: `3px solid ${C.red}`,
          borderRadius: 8,
          padding: 30,
        }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.red, letterSpacing: '.08em', marginBottom: 8 }}>
            MONTHLY COST BASELINE
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 800, color: C.t1, marginBottom: 4 }}>
            {zmwK(COST_TOTAL)} <span style={{ fontSize: 15, fontWeight: 500, color: C.t3 }}>/ month</span>
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, marginBottom: 22 }}>
            ≈ USD {Math.round((COST_TOTAL * 1000) / 26).toLocaleString()} at 26 ZMW/USD
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {COSTS.map((c) => (
              <div key={c.line} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                paddingBottom: 8,
                borderBottom: `1px dashed ${C.s3}`,
              }}>
                <span style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2 }}>
                  {c.line}
                </span>
                <span style={{ fontFamily: FONT.mono, fontSize: 14, color: C.t1, fontWeight: 600 }}>
                  {zmwK(c.amt)}
                </span>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: FONT.body, fontSize: 13, color: C.t3,
            lineHeight: 1.65, marginTop: 18, marginBottom: 0,
          }}>
            The baseline is deliberately small. The architecture is designed so that one engineering team can run the rail for the whole country. If staff scales linearly with transactions, the model is wrong and must be rebuilt.
          </p>
        </div>

        {/* Breakeven math */}
        <div style={{
          background: C.eg,
          border: `1px solid ${C.egBr}`,
          borderTop: `3px solid ${C.egHi}`,
          borderRadius: 8,
          padding: 30,
        }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.egHi, letterSpacing: '.08em', marginBottom: 8 }}>
            BREAKEVEN · WHAT IT TAKES
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 800, color: C.t1, marginBottom: 14 }}>
            {zmwK(COST_TOTAL)} <span style={{ fontSize: 15, fontWeight: 500, color: C.t3 }}>/ month to clear</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <BreakevenRow
              a="Enterprise contracts alone"
              b="1 contract"
              c="USD 80k/yr"
              highlight
            />
            <BreakevenRow
              a="Export dossiers alone"
              b="~32 batches/mo"
              c="USD 180 each"
            />
            <BreakevenRow
              a="Depot SaaS alone"
              b="58 depots"
              c="ZMW 2,500 each"
            />
            <BreakevenRow
              a="Trust queries alone"
              b="18,125 queries/mo"
              c="ZMW 8 each"
            />
          </div>

          <p style={{
            fontFamily: FONT.body, fontSize: 13, color: C.t2,
            lineHeight: 1.65, marginTop: 22, marginBottom: 0,
          }}>
            <strong>One enterprise corporate contract clears the whole cost baseline.</strong> Everything else — depot SaaS, trust queries, CCSMP fees — is redundancy and substrate, not the thesis. The thesis is that EUDR and CSDDD have put a number on what a credible evidence chain is worth, and the number is large enough that an honest implementation can run for a year on one signature.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* Honest closing                                                  */}
      {/* ============================================================== */}
      <div style={{
        marginTop: 60,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 22, fontStyle: 'italic',
        color: C.t2, lineHeight: 1.55,
        borderLeft: `3px solid ${C.egVi}`,
        paddingLeft: 30,
        maxWidth: 720,
      }}>
        "A trust infrastructure that can't pay its engineers is an NGO project with a whitepaper. The reason profitability is stated up front, with numbers, is because <em style={{ color: C.egHi, fontStyle: 'normal', fontWeight: 600 }}>it is the only honest way</em> to argue that this is infrastructure and not a pitch."
      </div>

      <p style={{
        fontFamily: FONT.body, fontSize: 15, color: C.t2,
        lineHeight: 1.75, marginTop: 24, maxWidth: 780,
      }}>
        The figures above will be wrong in specific ways — unit prices will move, depot counts will slip, donor lines will close and reopen. What matters is the shape: free creation, paid consumption, a flat cost baseline, and at least four independent revenue lines of which any one can carry the rail. If the shape holds, the business holds. If the shape doesn't hold, the prototype should be abandoned before it becomes infrastructure that other people depend on.
      </p>
    </Wrapper>
  );
}

// Small helper for the breakeven rows
function BreakevenRow({ a, b, c, highlight = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      paddingBottom: 10, paddingTop: highlight ? 4 : 0,
      paddingLeft: highlight ? 10 : 0, paddingRight: highlight ? 10 : 0,
      background: highlight ? '#FFFFFF' : 'transparent',
      borderLeft: highlight ? `3px solid ${C.egHi}` : 'none',
      borderRadius: highlight ? 4 : 0,
      borderBottom: highlight ? 'none' : `1px dashed ${C.egBr}`,
      marginBottom: highlight ? 4 : 0,
    }}>
      <span style={{
        fontFamily: FONT.body, fontSize: highlight ? 14 : 13,
        color: highlight ? C.t1 : C.t2,
        fontWeight: highlight ? 700 : 400,
      }}>
        {a}
      </span>
      <span style={{ textAlign: 'right' }}>
        <span style={{
          fontFamily: FONT.mono,
          fontSize: highlight ? 16 : 14,
          fontWeight: 700, color: C.egHi,
        }}>
          {b}
        </span>
        <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4, marginLeft: 8 }}>@ {c}</span>
      </span>
    </div>
  );
}
