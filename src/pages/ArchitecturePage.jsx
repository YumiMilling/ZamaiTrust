import { C, FONT } from '../theme';

const ENTITIES = [
  { name: 'Party',       desc: 'Any actor who participates in a transaction — individual, organisation, or instrument. Has an identity, a public key, and an accumulated trust profile.' },
  { name: 'Event',       desc: 'A real-world occurrence recorded in the system. Typed by tags rather than by a fixed schema. Has a timestamp, a location, tags, and party references.' },
  { name: 'Attestation', desc: "A claim signed by one party about an event. Has a subject, an attester, a timestamp, tags, and optionally a payload. Immutable once signed." },
  { name: 'Action',      desc: 'An automated or manual response triggered by events, attestations, or rule evaluations. Actions are themselves recorded as events, so the action history is auditable.' },
  { name: 'Credential',  desc: 'A computed view over accumulated attestations, presentable to third parties. Constructed on demand, carries hashes linking back to source data.' },
];

const PORTS = [
  { name: 'Payment',      desc: 'Money movement and settlement. First adapter in Zambian deployments: CGrate 543 (MTN and Airtel Money).' },
  { name: 'Identity',     desc: 'Party authentication and key management.' },
  { name: 'Location',     desc: 'Geolocation with pluggable sources for GPS, cell-tower triangulation, and manual entry with confidence metadata.' },
  { name: 'Notification', desc: 'Outbound messages to parties. SMS, WhatsApp, email.' },
  { name: 'Evidence',     desc: 'Attestation payloads that cannot be represented in tags alone. Deliberately minimal — photos removed because generative AI made photo attestation unreliable.' },
  { name: 'Time',         desc: 'Timestamping and synchronisation, with fallback to local clock for offline operation.' },
];

const HANDSHAKES = [
  { name: 'Dispatch–Receipt',      desc: 'One party attests dispatch, a different party attests receipt. Must match in identity, quantity, and timing within defined tolerances.' },
  { name: 'Receipt–Stock',         desc: 'A receipt attestation is reconciled against a running stock ledger to confirm incorporation into inventory.' },
  { name: 'Stock–Consumption',     desc: 'Stock ledger balances are reconciled against attested consumption events (feeding days, dispatches, production inputs).' },
  { name: 'Outcome–Verification',  desc: 'Final outcome claims are cross-validated against independent data sources — lab results, EMIS enrolment, cold chain traces.' },
];

const TRIGGERS = [
  { name: 'Circular attestation',   desc: 'A attests for B who attests for A, and longer cycles through asynchronous graph analysis.' },
  { name: 'Geographic impossibility', desc: "An attester's location trajectory over time is inconsistent with the claimed location of their current attestation." },
  { name: 'Volume spike',           desc: 'Sudden surge in transaction frequency beyond expected bounds for the party.' },
  { name: 'Amount clustering',      desc: 'Suspiciously uniform transaction amounts suggesting structured evasion.' },
  { name: 'Ghost counterparty',     desc: "A party appearing only in one other party's attestation history, with no independent activity." },
  { name: 'Device compromise',      desc: "Anomalous signing patterns suggesting a party's device or key has been compromised." },
];

export default function ArchitecturePage() {
  return (
    <div>
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
        letterSpacing: '.12em', marginBottom: 10,
      }}>
        ARCHITECTURE
      </div>
      <h1 style={{
        fontFamily: FONT.display, fontSize: 34, fontWeight: 800,
        color: C.t1, lineHeight: 1.15, marginBottom: 14,
      }}>
        Five entities, six ports, free tags, a handshake chain
      </h1>
      <p style={{
        fontFamily: FONT.body, fontSize: 16, color: C.t3,
        lineHeight: 1.7, maxWidth: 760, marginBottom: 40,
      }}>
        Domain specificity lives in the tag vocabulary and the port configurations, not in the core schema. Adding a new domain does not require a schema migration. It requires only a new tag vocabulary and potentially new port adapters. This is what makes the architecture domain-general.
      </p>

      {/* Five entities */}
      <Block title="FIVE ENTITIES">
        <Grid items={ENTITIES} color={C.egHi} />
      </Block>

      {/* Six ports */}
      <Block title="SIX PORTS">
        <Grid items={PORTS} color={C.purple} />
      </Block>

      {/* Handshakes */}
      <Block title="HANDSHAKE TYPES">
        <Grid items={HANDSHAKES} color={C.green} />
      </Block>

      {/* Anti-fraud */}
      <Block title="AUTOMATIC ANTI-FRAUD TRIGGERS">
        <Grid items={TRIGGERS} color={C.red} />
      </Block>

      {/* Probation zone note */}
      <div style={{
        marginTop: 40, padding: 24,
        background: C.s1,
        border: `1px solid ${C.s3}`,
        borderLeft: `4px solid ${C.red}`,
        borderRadius: 6,
      }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.red,
          letterSpacing: '.1em', marginBottom: 6,
        }}>
          PROBATION ZONE
        </div>
        <div style={{ fontFamily: FONT.display, fontSize: 17, fontWeight: 700, color: C.t1, marginBottom: 8 }}>
          First 20 transactions, minimal weight
        </div>
        <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.7, margin: 0 }}>
          During probation, a party's attestations carry minimal weight regardless of how quickly they accumulate, and the party cannot be the sole attester for any event above a defined value floor. Probation exists to prevent coordinated fake-account rings from bootstrapping trust faster than the system can detect the pattern.
        </p>
      </div>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.t4,
        letterSpacing: '.1em', marginBottom: 14,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Grid({ items, color }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {items.map((it) => (
        <div key={it.name} style={{
          padding: '16px 20px',
          background: C.s2,
          border: `1px solid ${C.s3}`,
          borderLeft: `3px solid ${color}`,
          borderRadius: 4,
        }}>
          <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
            {it.name}
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, lineHeight: 1.6 }}>
            {it.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
