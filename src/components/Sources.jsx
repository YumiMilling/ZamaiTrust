import { C, FONT } from '../theme';

const GROUPS = [
  {
    key: 'fisp',
    label: 'FISP e-voucher modernisation',
    color: C.egHi,
    items: [
      { who: 'Efficacy News', what: 'Gov\u2019t to Fully Implement E-Voucher System in 2025/2026 Farming Season' },
      { who: 'Presidential Delivery Unit', what: 'How FISP e-Voucher Is Delivering Support Where It Matters Most' },
      { who: 'Parliament of Zambia', what: 'Ministerial Statement on the future of FISP \u2014 Hon. Mtolo Phiri' },
    ],
  },
  {
    key: 'catsp',
    label: 'CATSP & reform policy',
    color: C.cuHi,
    items: [
      { who: 'Ministry of Agriculture', what: 'Draft Comprehensive Agricultural Transformation Support Programme (CATSP) v02, April 2023' },
      { who: 'Open Zambia', what: 'Government Approves CATSP' },
      { who: 'DT Global', what: 'Driving Agricultural Reform and Market Resilience in Zambia (USAID)' },
      { who: 'Agrilinks', what: 'Harnessing Private Sector Feedback to Grow Zambia\u2019s Agriculture Sector' },
    ],
  },
  {
    key: 'fra',
    label: 'FRA scaling-down & fiscal position',
    color: C.purple,
    items: [
      { who: 'Cornell Zambia Social Science Journal', what: 'Achieving More with Less: Reform and Scaling Down of FRA and FISP, and Boosting Social Protection' },
      { who: 'Zambian Observer', what: 'FRA\u2019s Deepening Fiscal Trap: Zambia\u2019s Maize Crisis and the 2026/2027 Black Hole' },
      { who: 'IMF', what: 'Staff Country Report 2023/257 \u2014 Boosting Productivity and Climate Resilience in Zambia\u2019s Agriculture Sector' },
    ],
  },
  {
    key: 'trans',
    label: 'Diversification & transformation',
    color: C.coral,
    items: [
      { who: 'FAO', what: 'Policymaking for agrifood systems transformation in Zambia' },
    ],
  },
];

export default function Sources() {
  return (
    <section id="sources" className="sec">
      <div className="eye">SOURCES</div>
      <h2 className="h2">What this note is grounded in</h2>
      <p className="p">
        The framing above is built on public policy documents, independent academic work and fiscal reporting. Each group below maps to one claim the document relies on. URLs intentionally omitted here \u2014 add them before any external circulation.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, marginTop: 34 }}>
        {GROUPS.map((g) => (
          <div key={g.key} style={{
            padding: 24,
            background: C.s2,
            border: `1px solid ${C.s3}`,
            borderTop: `3px solid ${g.color}`,
            borderRadius: 8,
          }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: '.1em', color: g.color, marginBottom: 10 }}>
              {g.label.toUpperCase()}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {g.items.map((it, i) => (
                <li key={i} style={{
                  fontFamily: FONT.body, fontSize: 14, color: C.t1, lineHeight: 1.6,
                  padding: '8px 0',
                  borderTop: i === 0 ? 'none' : `1px solid ${C.s3}`,
                }}>
                  <div style={{ fontWeight: 600, color: C.t1 }}>{it.who}</div>
                  <div style={{ color: C.t2, fontSize: 13, marginTop: 2 }}>{it.what}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 28, padding: '16px 22px', background: C.s1,
        borderLeft: `3px solid ${C.t3}`, borderRadius: 6,
      }}>
        <span style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2 }}>
          <strong style={{ color: C.t1 }}>Editorial note:</strong> where this document describes FISP and FRA, the framing follows the Cornell / DT Global / IMF consensus (reform, not abolition). Where it describes the 2026/27 fiscal position, the framing follows the Zambian Observer reporting on the FRA debt overhang. Neither framing is speculative \u2014 both are grounded in the sources above.
        </span>
      </div>
    </section>
  );
}
