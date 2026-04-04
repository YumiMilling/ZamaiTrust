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
    desc: 'All money moves through CGrate 543. 1.75% platform fee — 1.25% CGrate, 0.5% ZamAi. MTN Money and Airtel Money as rails. Degradation path: if CGrate is down, events still record — payment settles when the port recovers.' },
  { key: 'identity',     label: 'Identity',      sub: 'Google + SIM OTP', sub2: 'Domain for business',
    desc: 'Person identity: Google OAuth + SIM-bound OTP. Neither alone is sufficient — together they bind digital identity to a physical person. Business identity: anchored to domain (MX lookup). Optional PACRA cross-check. WhatsApp Business as future Tier 2 channel.' },
  { key: 'location',     label: 'Location',      sub: 'GPS + cell tower',  sub2: '500m threshold',
    desc: 'GPS coordinates captured at attestation time. Threshold set to 500m for rural Zambia — not 50m. Cell tower fallback for devices without GPS. Location tags build spatial trust patterns.' },
  { key: 'notification', label: 'Notification',  sub: 'WhatsApp first',    sub2: 'SMS fallback',
    desc: 'WhatsApp via Meta Business API for attestation requests, receipts, and trust profile sharing. SMS fallback for feature phones. Email for institutional Tier 2 validation (Resend/Postmark with signed URLs).' },
  { key: 'evidence',     label: 'Evidence',      sub: 'SHA-256 + storage', sub2: 'Merkle roots (v2)',
    desc: 'Documents hashed with SHA-256 on upload. Stored in Supabase Storage. v1: per-event hashing for verification. v2: daily Merkle roots for tamper-proof audit trail. External anchoring deferred until the data is important enough to survive ZamAi disappearing.' },
  { key: 'verification', label: 'Verification',  sub: 'MX + signed URLs',  sub2: 'verify.zamai.pro',
    desc: 'Institutional domain validation via MX lookup + transactional email with signed time-limited URLs. Public hash verification at verify.zamai.pro — drag a file, get provenance or "no match." No login, no account. Client-side hashing — only the hash hits the server.' },
  { key: 'time',         label: 'Time',          sub: 'Dual timestamps',   sub2: 'Device + server',
    desc: 'device_timestamp (when created) and sync_timestamp (when received by server). Both recorded, never merged. Large gaps flagged but not blocked — a 2-hour gap is normal in rural Zambia. NTP cross-check planned for v2.' },
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
    <section id="ports" className="sec-eg">
      <div className="inner">
        <div className="eye">PORT ARCHITECTURE</div>
        <h2 className="h2">Hexagonal by design</h2>
        <p className="p">The core doesn't move money or verify identity itself. It orchestrates through pluggable ports.</p>

        <svg viewBox="0 0 700 560" style={{ width: '100%', maxWidth: 700, display: 'block', margin: '34px auto 0' }}>
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
            fill={C.eg} stroke={C.egVi} strokeWidth={1.5}/>
          <text x={CX} y={CY - 10} textAnchor="middle"
            style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 800, fill: C.egHi }}>
            ZamAi Core
          </text>
          <text x={CX} y={CY + 8} textAnchor="middle"
            style={{ fontFamily: FONT.body, fontSize: 11, fill: C.t2 }}>
            party · event · attestation
          </text>
          <text x={CX} y={CY + 22} textAnchor="middle"
            style={{ fontFamily: FONT.body, fontSize: 11, fill: C.t2 }}>
            7 swappable ports
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
                <text x={pos.x} y={pos.y - 8} textAnchor="middle"
                  style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, fill: col.stroke }}>
                  {p.label}
                </text>
                <text x={pos.x} y={pos.y + 7} textAnchor="middle"
                  style={{ fontFamily: FONT.body, fontSize: 11, fill: C.t1 }}>
                  {p.sub}
                </text>
                <text x={pos.x} y={pos.y + 20} textAnchor="middle"
                  style={{ fontFamily: FONT.body, fontSize: 10, fill: C.t2 }}>
                  {p.sub2}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Detail panel */}
        {sel ? (
          <div style={{
            marginTop: 28, padding: 28, background: '#FFFFFF',
            border: `1px solid ${C.s3}`,
            borderLeft: `4px solid ${PORT_COLORS[sel.key].stroke}`,
            borderRadius: 8,
            animation: 'fadeUp .3s ease-out',
          }}>
            <div style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: PORT_COLORS[sel.key].stroke, marginBottom: 8 }}>
              {sel.label} Port
            </div>
            <p style={{ fontFamily: FONT.body, fontSize: 17, color: C.t1, lineHeight: 1.8, margin: 0 }}>
              {sel.desc}
            </p>
          </div>
        ) : (
          <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t2, textAlign: 'center', marginTop: 24 }}>
            Click a port to see details
          </p>
        )}
      </div>
    </section>
  );
}
