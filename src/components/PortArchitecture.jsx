import { useState } from 'react';
import { C, PORT_COLORS, FONT } from '../theme';

const hexPoints = (cx, cy, r) => {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
};

const PORTS = [
  { key: 'payment',      label: 'Payment',      sub: 'CGrate 543',        sub2: 'MTN / Airtel Money',
    desc: 'All money moves through CGrate 543. 1.75% platform fee — 1.25% CGrate, 0.5% ZamAi. MTN Money and Airtel Money as rails. No bank account required.' },
  { key: 'identity',     label: 'Identity',      sub: 'Phone-based',       sub2: 'No KYC required',
    desc: 'Phone number is the identity anchor. No KYC gatekeeping. Trust is earned through activity, not paperwork. SIM registration provides a baseline.' },
  { key: 'location',     label: 'Location',      sub: 'GPS verification',  sub2: 'Geo-fencing',
    desc: 'GPS coordinates captured at attestation time. Enables geographic impossibility detection for fraud prevention. Location tags on events build spatial trust patterns.' },
  { key: 'time',         label: 'Time',          sub: 'Tamper-proof',      sub2: 'Timestamps',
    desc: 'Every event and attestation gets a tamper-proof timestamp. Enables sequence verification and temporal fraud detection. No retroactive modifications.' },
  { key: 'notification', label: 'Notification',  sub: 'SMS / WhatsApp',    sub2: 'Push alerts',
    desc: 'SMS for critical alerts — payment confirmation, suspension notice. WhatsApp for trust profile sharing and job completion notifications. Low-bandwidth first.' },
];

const CX = 350, CY = 250, DIST = 175, OUTER_R = 48, CENTER_R = 68;

// Position outer hexes at 72-degree intervals starting from top
const portPos = PORTS.map((_, i) => {
  const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
  return { x: CX + DIST * Math.cos(angle), y: CY + DIST * Math.sin(angle) };
});

export default function PortArchitecture() {
  const [selected, setSelected] = useState(null);
  const sel = selected !== null ? PORTS[selected] : null;

  return (
    <section id="ports" className="sec-eg">
      <div className="inner">
        <div className="eye">PORT ARCHITECTURE</div>
        <h2 className="h2">Hexagonal by design</h2>
        <p className="p">The core doesn't move money or verify identity itself. It orchestrates through pluggable ports.</p>

        <svg viewBox="0 0 700 500" style={{ width: '100%', maxWidth: 700, display: 'block', margin: '34px auto 0' }}>
          <defs>
            <filter id="portGlow">
              <feGaussianBlur stdDeviation="5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Connection lines */}
          {PORTS.map((p, i) => {
            const pos = portPos[i];
            const isActive = selected === i;
            const dimmed = selected !== null && !isActive;
            return (
              <line key={`line-${i}`}
                x1={pos.x} y1={pos.y} x2={CX} y2={CY}
                stroke={PORT_COLORS[p.key].stroke}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? 'none' : '6 4'}
                opacity={dimmed ? 0.15 : isActive ? 0.8 : 0.3}
                style={{ transition: 'all .3s' }}
              />
            );
          })}

          {/* Center hex */}
          <polygon points={hexPoints(CX, CY, CENTER_R)}
            fill={C.eg} stroke={C.egBr} strokeWidth={1.5}/>
          <text x={CX} y={CY - 8} textAnchor="middle"
            style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 800, fill: C.egHi }}>
            Thiqa Core
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle"
            style={{ fontFamily: FONT.body, fontSize: 8, fill: C.t3 }}>
            5 entities · tag-driven
          </text>
          <text x={CX} y={CY + 18} textAnchor="middle"
            style={{ fontFamily: FONT.body, fontSize: 8, fill: C.t3 }}>
            trust-weighted
          </text>

          {/* Outer port hexes */}
          {PORTS.map((p, i) => {
            const pos = portPos[i];
            const col = PORT_COLORS[p.key];
            const isActive = selected === i;
            const dimmed = selected !== null && !isActive;
            return (
              <g key={p.key}
                onClick={() => setSelected(isActive ? null : i)}
                style={{ cursor: 'pointer', transition: 'opacity .3s' }}
                opacity={dimmed ? 0.25 : 1}
                filter={isActive ? 'url(#portGlow)' : undefined}>
                <polygon points={hexPoints(pos.x, pos.y, OUTER_R)}
                  fill={col.fill} stroke={col.stroke} strokeWidth={isActive ? 2 : 1}/>
                <text x={pos.x} y={pos.y - 6} textAnchor="middle"
                  style={{ fontFamily: FONT.display, fontSize: 11, fontWeight: 700, fill: col.stroke }}>
                  {p.label}
                </text>
                <text x={pos.x} y={pos.y + 7} textAnchor="middle"
                  style={{ fontFamily: FONT.body, fontSize: 8, fill: C.t3 }}>
                  {p.sub}
                </text>
                <text x={pos.x} y={pos.y + 17} textAnchor="middle"
                  style={{ fontFamily: FONT.body, fontSize: 7, fill: C.t4 }}>
                  {p.sub2}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Detail panel */}
        {sel ? (
          <div style={{
            marginTop: 21, padding: 24, background: 'rgba(12,11,10,.5)',
            borderLeft: `3px solid ${PORT_COLORS[sel.key].stroke}`,
            animation: 'fadeUp .3s ease-out',
          }}>
            <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: PORT_COLORS[sel.key].stroke, marginBottom: 6 }}>
              {sel.label} Port
            </div>
            <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t2, lineHeight: 1.75, margin: 0 }}>
              {sel.desc}
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.t4, textAlign: 'center', marginTop: 21 }}>
            Click a port to see details
          </p>
        )}
      </div>
    </section>
  );
}
