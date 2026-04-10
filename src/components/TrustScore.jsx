import { C, FONT } from '../theme';

const BARS = [
  { label: 'Attestation count',        pct: 75, color: C.egHi },
  { label: 'Attestor diversity',       pct: 60, color: C.cuHi },
  { label: 'Recency',                  pct: 85, color: '#059669' },
  { label: 'Dispute rate (low=good)',  pct: 5,  color: '#7C3AED' },
];

// Trust curve path: flat during probation (0-20), steep after, plateau at ~0.85
const curvePath = 'M 60 260 C 80 258, 140 255, 200 250 C 240 246, 260 230, 280 200 C 320 130, 360 80, 400 55 C 430 42, 455 38, 480 36';

export default function TrustScore() {
  return (
    <div>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        {/* Chart */}
        <div style={{ flex: '1 1 440px', minWidth: 300 }}>
          <svg viewBox="0 0 520 300" style={{ width: '100%' }}>
            {/* Grid */}
            {[0.25, 0.5, 0.75, 1.0].map((v) => {
              const y = 260 - v * 224;
              return <line key={v} x1={60} y1={y} x2={490} y2={y} stroke={C.s3} strokeWidth={0.5}/>;
            })}
            {[20, 40, 60].map((v) => {
              const x = 60 + (v / 60) * 430;
              return <line key={v} x1={x} y1={36} x2={x} y2={260} stroke={C.s3} strokeWidth={0.5}/>;
            })}

            {/* Probation zone */}
            <rect x={60} y={36} width={(20 / 60) * 430} height={224} fill={C.redLt} opacity={0.55}/>
            <line x1={60 + (20 / 60) * 430} y1={36} x2={60 + (20 / 60) * 430} y2={260}
              stroke={C.red} strokeWidth={1} strokeDasharray="4 3"/>
            <text x={60 + (10 / 60) * 430} y={150} textAnchor="middle"
              style={{ fontFamily: FONT.mono, fontSize: 11, fontWeight: 600, fill: C.red, letterSpacing: '.08em' }}>
              PROBATION
            </text>
            <text x={60 + (10 / 60) * 430} y={164} textAnchor="middle"
              style={{ fontFamily: FONT.mono, fontSize: 10, fill: '#B91C1C' }}>
              Min weight
            </text>

            {/* Axes */}
            <line x1={60} y1={260} x2={490} y2={260} stroke={C.s4} strokeWidth={1}/>
            <line x1={60} y1={36} x2={60} y2={260} stroke={C.s4} strokeWidth={1}/>

            {/* Y labels */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((v) => (
              <text key={v} x={52} y={260 - v * 224 + 3} textAnchor="end"
                style={{ fontFamily: FONT.mono, fontSize: 11, fill: C.t3 }}>
                {v.toFixed(2)}
              </text>
            ))}
            {/* X labels */}
            {[0, 20, 40, 60].map((v) => (
              <text key={v} x={60 + (v / 60) * 430} y={276} textAnchor="middle"
                style={{ fontFamily: FONT.mono, fontSize: 11, fill: C.t3 }}>
                {v}
              </text>
            ))}
            <text x={275} y={294} textAnchor="middle"
              style={{ fontFamily: FONT.body, fontSize: 12, fill: C.t3 }}>
              Transactions
            </text>
            <text x={20} y={150} textAnchor="middle" transform="rotate(-90 20 150)"
              style={{ fontFamily: FONT.body, fontSize: 12, fill: C.t3 }}>
              Trust score
            </text>

            {/* Trust curve */}
            <path d={curvePath} fill="none" stroke={C.egHi} strokeWidth={2.5} strokeLinecap="round"/>
          </svg>
        </div>

        {/* Score breakdown */}
        <div style={{ flex: '1 1 260px', minWidth: 240 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4, letterSpacing: '.08em', marginBottom: 14 }}>
            SCORE COMPONENTS
          </div>

          {BARS.map((b) => (
            <div key={b.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: FONT.body, fontSize: 13, color: C.t2 }}>{b.label}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 12, color: b.color, fontWeight: 600 }}>{b.pct}%</span>
              </div>
              <div style={{ height: 6, background: C.s3, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${b.pct}%`, height: '100%', background: b.color, borderRadius: 3 }}/>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20, padding: 16, background: C.redLt, borderLeft: `3px solid ${C.red}`, borderRadius: 4 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.red, letterSpacing: '.1em', marginBottom: 4 }}>
              PROBATION ZONE
            </div>
            <p style={{ fontFamily: FONT.body, fontSize: 12, color: C.t2, lineHeight: 1.65, margin: 0 }}>
              First 20 transactions carry minimal weight regardless of speed. A fresh fake account cannot immediately co-sign high-value events. Trust is earned through accumulated, verified activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
