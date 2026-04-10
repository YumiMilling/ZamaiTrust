import { useState } from 'react';
import { C, FONT } from '../theme';

const FACTS = [
  {
    key: 'fisp',
    tag: 'INPUT SIDE',
    tagColor: C.egHi,
    headline: 'FISP has been digitised, not dismantled.',
    body: 'The 2025/26 season completed the full migration from Direct Input Supply to an electronic voucher. All 116 districts. Over one million farmers. 973 approved private agro-dealers now sit inside the official input supply chain — the first time the private input channel has been formally integrated into FISP. The farmer still pays K400 against a K8,000 state contribution. The subsidy stayed. What changed is who touches the inputs on the way through.',
    figures: [
      { v: '973', k: 'private agro-dealers in the chain' },
      { v: '1.0M+', k: 'enrolled beneficiaries' },
      { v: '212,851', k: 'ineligible beneficiaries removed in 2024/25' },
      { v: 'K325.4M', k: 'savings from competitive pricing (2024/25)' },
    ],
  },
  {
    key: 'fra',
    tag: 'OUTPUT SIDE',
    tagColor: C.cuHi,
    headline: 'FRA is scheduled to recede. Fiscal math will enforce it.',
    body: 'CATSP’s declared policy is to limit FRA to a Strategic Food Reserve role with explicit annual purchase caps and clearer market-entry rules. Practice diverged: in 2024/25, following a presidential directive, FRA bought more than 1.7 million MT of maize — well above its financing envelope and storage capacity. The 2026 national budget allocates only K2.1 billion to the Strategic Food Reserve, barely enough to cover a 500,000 MT target for the 2026/27 season, let alone service the debt from the 2024/25 over-purchase. The scale-down is real as policy and chaotic as implementation. 2026/27 is where political pressure and fiscal reality collide.',
    figures: [
      { v: '1.7M MT', k: 'FRA maize purchases in 2024/25 (over envelope)' },
      { v: 'K2.1B', k: 'Strategic Food Reserve allocation, 2026 budget' },
      { v: '500K MT', k: 'planned 2026/27 intake target' },
      { v: '2026/27', k: 'the season where something has to give' },
    ],
  },
  {
    key: 'money',
    tag: 'THE MONEY',
    tagColor: C.purple,
    headline: 'Corporate money is already committed to exactly this data.',
    body: 'Two independent obligation layers converge on Zambian soya. First: the EU Deforestation Regulation creates binding legal duties on European importers — plot-level traceability, deforestation-free attestation, five-year retention, fines scaling to 4% of EU turnover. Second: more than 350 signatory banks under UNEP FI’s Principles for Responsible Banking — together with the Net-Zero Banking Alliance and the PCAF financed-emissions methodology — are committed to measure and reduce the nature and climate impact of their entire agricultural loan book. UNEP FI’s Sector Action Guidance for Nature names soy on a short priority commodity list alongside palm, cattle, wood, bauxite and copper. The buyers are different. The data is the same.',
    figures: [
      { v: '$8.7T', k: 'AUM committed to tackle ag-commodity deforestation (UNEP FI coalition)' },
      { v: '350+', k: 'PRB signatory banks taking action on nature' },
      { v: 'Soy', k: 'on UNEP FI’s priority commodity list' },
      { v: 'EUDR', k: 'binding EU legal obligation, 4% fine ceiling' },
    ],
  },
];

export default function Context() {
  const [selected, setSelected] = useState('fisp');
  const sel = FACTS.find(f => f.key === selected);

  return (
    <section id="context" className="sec-alt">
      <div className="inner">
        <div className="eye">THE WINDOW</div>
        <h2 className="h2">Three things that were not true a year ago</h2>
        <p className="p">
          The architecture that follows is not a bet on change — it is a response to change that has already happened. Three independent facts, converging for the first time on the 2026/27 farming season.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginTop: 34, flexWrap: 'wrap' }}>
          {FACTS.map((f) => {
            const isActive = selected === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setSelected(f.key)}
                style={{
                  fontFamily: FONT.mono, fontSize: 12, fontWeight: 600,
                  letterSpacing: '.12em',
                  padding: '10px 18px',
                  border: `1px solid ${isActive ? f.tagColor : C.s3}`,
                  background: isActive ? C.s2 : 'transparent',
                  color: isActive ? f.tagColor : C.t3,
                  borderRadius: 4, cursor: 'pointer', transition: 'all .2s',
                }}
              >
                {f.tag}
              </button>
            );
          })}
        </div>

        {/* Selected fact */}
        <div style={{
          marginTop: 16, padding: 34, background: C.s2,
          border: `1px solid ${C.s3}`, borderLeft: `4px solid ${sel.tagColor}`,
          borderRadius: 8,
        }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: '.12em', color: sel.tagColor, marginBottom: 10 }}>
            {sel.tag}
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.t1, lineHeight: 1.25, marginBottom: 16 }}>
            {sel.headline}
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 17, color: C.t2, lineHeight: 1.8, marginBottom: 26 }}>
            {sel.body}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {sel.figures.map((f) => (
              <div key={f.k} style={{
                padding: '14px 16px', background: C.s1,
                border: `1px solid ${C.s3}`, borderRadius: 6,
              }}>
                <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 800, color: sel.tagColor, lineHeight: 1.1 }}>
                  {f.v}
                </div>
                <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, marginTop: 4, lineHeight: 1.45 }}>
                  {f.k}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pull" style={{ marginTop: 44 }}>
          "Both transitions create structural demand for private-sector market infrastructure — not to replace state mechanisms, but to give smallholders commercial alternatives as the state share of marketing <em>recedes</em>."
        </div>
      </div>
    </section>
  );
}
