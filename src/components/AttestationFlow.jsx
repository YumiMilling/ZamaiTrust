import { useState } from 'react';
import { C, FONT } from '../theme';

const STEPS = [
  { label: 'Event recorded',    color: '#059669', desc: 'Pack-house in Chipata records: "Received 480kg Hass from Kanyanta Orchard, moisture 74%, grade A." GPS and timestamp captured at the receiving bay.' },
  { label: 'Attestation',       color: '#B45309', desc: 'The orchard co-op clerk scans the pack-house QR code. Both devices record the mutual attestation locally — no internet needed on the orchard side.' },
  { label: 'Trust validation',  color: '#0D9488', desc: 'Both events sync. Quantities match within tolerance: Tier 1 mutual attestation. Pack-house trust weight: 0.91. Orchard: 0.78. The event hardens.' },
  { label: 'Action triggered',  color: '#EA580C', desc: 'Downstream handshake fires. The batch enters the pack-house stock ledger. A WhatsApp receipt with a permanent verification URL goes to the co-op clerk.' },
  { label: 'Credential updated',color: '#7C3AED', desc: "The orchard's trust profile now shows 23 verified deliveries across 2 pack-houses over 8 months. The buyer's EUDR origin dossier picks up the orchard geolocation automatically." },
];

const W = 960, H = 200, nodeW = 156, nodeH = 70;
const gap = (W - STEPS.length * nodeW) / (STEPS.length + 1);
const nodeX = (i) => gap + i * (nodeW + gap);
const nodeY = 60;

export default function AttestationFlow() {
  const [step, setStep] = useState(0);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id="af-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round"/>
          </marker>
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
              strokeWidth={active ? 1.8 : 1}
              markerEnd="url(#af-arrow)"
            />
          );
        })}

        {/* Nodes */}
        {STEPS.map((s, i) => {
          const x = nodeX(i);
          const isActive = i === step;
          const isPast = i < step;
          const opacity = isActive ? 1 : isPast ? 0.75 : 0.45;
          return (
            <g key={i} onClick={() => setStep(i)} style={{ cursor: 'pointer' }} opacity={opacity}>
              <rect x={x} y={nodeY} width={nodeW} height={nodeH} rx={6}
                fill="#FFFFFF" stroke={s.color} strokeWidth={isActive ? 2.5 : 1}/>
              <text x={x + nodeW / 2} y={nodeY + nodeH / 2 - 6} textAnchor="middle"
                style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, fill: s.color }}>
                {s.label}
              </text>
              <text x={x + nodeW / 2} y={nodeY + nodeH / 2 + 14} textAnchor="middle"
                style={{ fontFamily: FONT.mono, fontSize: 11, fill: C.t3 }}>
                Step {i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Description panel */}
      <div style={{
        marginTop: 18, padding: 22, background: C.s2,
        border: `1px solid ${C.s3}`,
        borderLeft: `3px solid ${STEPS[step].color}`,
        borderRadius: 4,
      }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 10, color: STEPS[step].color,
          letterSpacing: '.1em', marginBottom: 6,
        }}>
          STEP {step + 1} · {STEPS[step].label.toUpperCase()}
        </div>
        <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t1, lineHeight: 1.7, margin: 0 }}>
          {STEPS[step].desc}
        </p>
      </div>

      <div style={{
        marginTop: 10, fontFamily: FONT.mono, fontSize: 11, color: C.t4,
        textAlign: 'center', letterSpacing: '.06em',
      }}>
        Click a step to advance the example.
      </div>
    </div>
  );
}
