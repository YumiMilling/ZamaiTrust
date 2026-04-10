import { useState, useEffect } from 'react';
import { C, FONT } from '../theme';

const STEPS = [
  { label: 'Event Created',     color: '#1D9E75', desc: 'NewGrowCo depot in Choma records: "Purchased 2.4t soya from farmer Grace Banda. K18,000. Moisture 12%." GPS and timestamp captured.' },
  { label: 'Attestation',       color: '#E8AE68', desc: 'Grace scans the depot clerk\'s QR code with her phone. Both apps record the mutual attestation locally — no internet needed at the depot.' },
  { label: 'Trust Validation',  color: '#19C8CC', desc: 'Both events sync. Amounts match: Tier 1 mutual attestation. Grace\'s trust weight: 0.78. NewGrowCo\'s: 0.91. Transaction verified.' },
  { label: 'Action Triggered',  color: '#D85A30', desc: 'Payment of K18,000 confirmed. WhatsApp receipt sent to Grace with a permanent verification URL. Document hash: SHA-256.' },
  { label: 'Profile Updated',   color: '#8B83DB', desc: "Grace's trust profile: 23 verified deliveries across 2 depots. Consistent volumes over 8 months. Visible to any lender she authorises." },
];

const W = 960, H = 210, nodeW = 152, nodeH = 72;
const gap = (W - STEPS.length * nodeW) / (STEPS.length + 1);
const nodeX = (i) => gap + i * (nodeW + gap);
const nodeY = 68;

export default function AttestationFlow() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep(s => s >= STEPS.length - 1 ? 0 : s + 1), 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="flow" className="sec-eg">
      <div className="inner">
        <div className="eye">ATTESTATION LIFECYCLE</div>
        <h2 className="h2">How trust flows</h2>
        <p className="p">A worked example: a soya delivery at a pilot depot, on its way to a warehouse receipt. Watch each stage light up. The same primitive handles a workshop attendance or a rent payment.</p>

        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', margin: '34px auto 0' }}>
          <defs>
            <marker id="flowArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round"/>
            </marker>
            <filter id="stepGlow">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Arrows between nodes */}
          {STEPS.slice(0, -1).map((_, i) => {
            const x1 = nodeX(i) + nodeW;
            const x2 = nodeX(i + 1);
            const active = i < step;
            return (
              <line key={i}
                x1={x1 + 4} y1={nodeY + nodeH / 2} x2={x2 - 4} y2={nodeY + nodeH / 2}
                stroke={active ? STEPS[i + 1].color : C.s4}
                strokeWidth={active ? 2 : 1}
                strokeDasharray={active ? 'none' : '4 3'}
                markerEnd="url(#flowArrow)"
                style={{ transition: 'all .5s' }}
              />
            );
          })}

          {/* Nodes */}
          {STEPS.map((s, i) => {
            const x = nodeX(i);
            const isActive = i === step;
            const isPast = i < step;
            const opacity = isActive ? 1 : isPast ? 0.6 : 0.25;
            return (
              <g key={i} onClick={() => setStep(i)} style={{ cursor: 'pointer', transition: 'opacity .4s' }} opacity={opacity}
                filter={isActive ? 'url(#stepGlow)' : undefined}>
                <rect x={x} y={nodeY} width={nodeW} height={nodeH} rx={12}
                  fill="#FFFFFF" stroke={s.color} strokeWidth={isActive ? 2.5 : 1}/>
                <text x={x + nodeW / 2} y={nodeY + nodeH / 2 - 6} textAnchor="middle"
                  style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, fill: s.color }}>
                  {s.label}
                </text>
                <text x={x + nodeW / 2} y={nodeY + nodeH / 2 + 14} textAnchor="middle"
                  style={{ fontFamily: FONT.body, fontSize: 12, fill: C.t2 }}>
                  Step {i + 1}
                </text>
              </g>
            );
          })}

          {/* Moving packet */}
          <circle
            cx={nodeX(step) + nodeW / 2} cy={nodeY - 14} r={6}
            fill={STEPS[step].color}
            style={{ transition: 'cx .5s ease-in-out', filter: 'url(#stepGlow)' }}
          />
        </svg>

        {/* Description panel */}
        <div style={{
          marginTop: 28, padding: 28, background: '#FFFFFF',
          border: `1px solid ${C.s3}`,
          borderLeft: `4px solid ${STEPS[step].color}`,
          borderRadius: 8,
          transition: 'border-color .3s',
        }}>
          <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: STEPS[step].color, marginBottom: 8 }}>
            Step {step + 1}: {STEPS[step].label}
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 17, color: C.t1, lineHeight: 1.8, margin: 0 }}>
            {STEPS[step].desc}
          </p>
        </div>

        <button onClick={() => setStep(0)} style={{
          marginTop: 16, padding: '10px 24px', background: 'transparent',
          border: `1px solid ${C.egBr}`, color: C.egHi, fontFamily: FONT.body,
          fontSize: 14, fontWeight: 600, cursor: 'pointer', letterSpacing: '.1em',
        }}>
          REPLAY
        </button>
      </div>
    </section>
  );
}
