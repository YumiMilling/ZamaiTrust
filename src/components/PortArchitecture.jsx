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
  { key: 'payment',      label: 'Payment',      sub: 'CGrate 543 / SWIFT',  sub2: 'Mobile money + rails',
    desc: 'Money movement and settlement. First adapter in Zambian deployments: CGrate 543 (MTN and Airtel Money). Degradation path: if the payment rail is down, events still record — settlement reconciles when the port recovers.' },
  { key: 'identity',     label: 'Identity',     sub: 'OAuth + SIM OTP',      sub2: 'Domain for orgs',
    desc: 'Party authentication. Person identity: Google OAuth + SIM-bound OTP — neither alone is sufficient. Business identity: anchored to verified domain (MX lookup). Optional PACRA cross-check. Keys rotate on device change.' },
  { key: 'location',     label: 'Location',     sub: 'GPS + cell tower',     sub2: '500m threshold',
    desc: 'Geolocation with pluggable sources. GPS captured at attestation time, cell-tower fallback for devices without GPS. 500m threshold for rural sites (not 50m). Each source carries its own confidence metadata.' },
  { key: 'notification', label: 'Notification', sub: 'WhatsApp · SMS · email',sub2: 'Signed links',
    desc: 'Outbound messaging to parties. WhatsApp via Meta Business API as default. SMS fallback for feature phones. Email with signed time-limited URLs for institutional Tier 2 validation.' },
  { key: 'evidence',     label: 'Evidence',     sub: 'SHA-256 + storage',    sub2: 'Merkle roots',
    desc: 'Attestation payloads that cannot be represented in tags alone — lab reports, bills of lading, cold chain traces. Hashed SHA-256 on upload. Daily Merkle roots. External anchoring deferred until the data is valuable enough to survive the platform disappearing.' },
  { key: 'time',         label: 'Time',         sub: 'Dual timestamps',      sub2: 'Device + server',
    desc: 'Timestamping and synchronisation. Two timestamps recorded: device_timestamp (when created) and sync_timestamp (when received). Large gaps are flagged, not blocked — a 2-hour gap is normal for an offline-first deployment.' },
];

const CX = 350, CY = 280, DIST = 200, OUTER_R = 54, CENTER_R = 74;

// Position outer hexes evenly around center
const portPos = PORTS.map((_, i) => {
  const angle = (Math.PI * 2 / PORTS.length) * i - Math.PI / 2;
  return { x: CX + DIST * Math.cos(angle), y: CY + DIST * Math.sin(angle) };
});

export default function PortArchitecture() {
  const [selected, setSelected] = useState(null);
  const sel = selected !== null ? PORTS[selected] : null;

  return (
    <div>
      <svg viewBox="0 0 700 560" style={{ width: '100%', maxWidth: 700, display: 'block', margin: '0 auto' }}>
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
              opacity={dimmed ? 0.18 : isActive ? 0.85 : 0.45}
            />
          );
        })}

        {/* Center hex */}
        <polygon points={hexPoints(CX, CY, CENTER_R)}
          fill={C.eg} stroke={C.egVi} strokeWidth={1.5}/>
        <text x={CX} y={CY - 10} textAnchor="middle"
          style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 800, fill: C.egHi }}>
          Trust Core
        </text>
        <text x={CX} y={CY + 8} textAnchor="middle"
          style={{ fontFamily: FONT.body, fontSize: 11, fill: C.t2 }}>
          party · event · attestation
        </text>
        <text x={CX} y={CY + 22} textAnchor="middle"
          style={{ fontFamily: FONT.body, fontSize: 11, fill: C.t2 }}>
          6 swappable ports
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
              style={{ cursor: 'pointer' }}
              opacity={dimmed ? 0.3 : 1}>
              <polygon points={hexPoints(pos.x, pos.y, OUTER_R)}
                fill={col.fill} stroke={col.stroke} strokeWidth={isActive ? 2.5 : 1}/>
              <text x={pos.x} y={pos.y - 8} textAnchor="middle"
                style={{ fontFamily: FONT.display, fontSize: 13, fontWeight: 700, fill: col.stroke }}>
                {p.label}
              </text>
              <text x={pos.x} y={pos.y + 6} textAnchor="middle"
                style={{ fontFamily: FONT.body, fontSize: 10, fill: C.t1 }}>
                {p.sub}
              </text>
              <text x={pos.x} y={pos.y + 19} textAnchor="middle"
                style={{ fontFamily: FONT.body, fontSize: 10, fill: C.t3 }}>
                {p.sub2}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Detail panel */}
      {sel ? (
        <div style={{
          marginTop: 16, padding: 22, background: C.s2,
          border: `1px solid ${C.s3}`,
          borderLeft: `3px solid ${PORT_COLORS[sel.key].stroke}`,
          borderRadius: 4,
        }}>
          <div style={{
            fontFamily: FONT.mono, fontSize: 10, color: PORT_COLORS[sel.key].stroke,
            letterSpacing: '.1em', marginBottom: 6,
          }}>
            {sel.label.toUpperCase()} PORT
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t1, lineHeight: 1.7, margin: 0 }}>
            {sel.desc}
          </p>
        </div>
      ) : (
        <div style={{
          marginTop: 14, fontFamily: FONT.mono, fontSize: 11, color: C.t4,
          textAlign: 'center', letterSpacing: '.06em',
        }}>
          Click any port to see its adapter contract.
        </div>
      )}
    </div>
  );
}
