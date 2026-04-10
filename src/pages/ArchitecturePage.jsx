import { C, FONT } from '../theme';
import EntityMap from '../components/EntityMap';
import AttestationFlow from '../components/AttestationFlow';
import TrustTiers from '../components/TrustTiers';
import TrustScore from '../components/TrustScore';
import FraudDetection from '../components/FraudDetection';
import PortArchitecture from '../components/PortArchitecture';
import OfflineSync from '../components/OfflineSync';
import DisputeResolution from '../components/DisputeResolution';

const HANDSHAKES = [
  { name: 'Dispatch–Receipt',     desc: 'One party attests dispatch, a different party attests receipt. Must match in identity, quantity, and timing within defined tolerances. This is the handshake that closes on the orchard → pack-house edge.' },
  { name: 'Receipt–Stock',        desc: 'A receipt attestation is reconciled against a running stock ledger to confirm incorporation into inventory. Closes the pack-house → cold store edge.' },
  { name: 'Stock–Consumption',    desc: 'Stock ledger balances are reconciled against attested consumption events (dispatches to vessels, production inputs, feeding days). Closes the cold store → container → vessel edge.' },
  { name: 'Outcome–Verification', desc: 'Final outcome claims are cross-validated against independent data sources — lab results, cold chain traces, EU port-of-entry scans. Closes the batch → buyer compliance file edge.' },
];

export default function ArchitecturePage() {
  return (
    <div>
      {/* Header */}
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
        lineHeight: 1.7, maxWidth: 760, marginBottom: 14,
      }}>
        Domain specificity lives in the tag vocabulary and the port configurations, not in the core schema. Adding a new domain does not require a schema migration. It requires a new tag vocabulary and potentially new port adapters. This is what makes the architecture domain-general — an agricultural export batch, a services invoice, and a community ledger cycle are all built from the same five primitives, with no extensions.
      </p>
      <p style={{
        fontFamily: FONT.body, fontSize: 14, color: C.t4,
        lineHeight: 1.7, maxWidth: 760, marginBottom: 40,
      }}>
        The visuals below are read top-to-bottom. Each one describes a single load-bearing piece of the architecture. They are clickable where clicking reveals additional specificity, and static everywhere else.
      </p>

      {/* Section 1 — Entities */}
      <Section
        num="01"
        eyebrow="CORE ENTITIES"
        title="Five building blocks"
        lede="The Trust Layer defines five types of thing. Every claim the architecture has to reason about — who did what, when, where, to whom — is expressed as some combination of these five. There is nothing else."
      >
        <EntityMap />
      </Section>

      {/* Section 2 — Attestation lifecycle */}
      <Section
        num="02"
        eyebrow="ATTESTATION LIFECYCLE"
        title="How an event becomes credible"
        lede="A worked example from the avocado case: a 480kg Hass consignment leaving Kanyanta Orchard and arriving at the Chipata pack-house. The same five-step flow applies regardless of domain."
      >
        <AttestationFlow />
      </Section>

      {/* Section 3 — Tiers */}
      <Section
        num="03"
        eyebrow="ATTESTATION TIERS"
        title="Three strengths of attestation"
        lede="Not all attestations are worth the same. The tier is fixed at attestation time — it does not get upgraded retroactively. A Tier 3 record with a real document is worth less than a Tier 1 record with nothing but two matching quantities."
      >
        <TrustTiers />
      </Section>

      {/* Section 4 — Trust score and probation */}
      <Section
        num="04"
        eyebrow="TRUST SCORING"
        title="Trust is earned, not given"
        lede="New parties enter a probation zone. During probation, attestations carry minimal weight regardless of speed, and the party cannot be the sole attester for any event above a defined value floor. Probation exists to prevent coordinated fake-account rings from bootstrapping trust faster than the system can detect the pattern."
      >
        <TrustScore />
      </Section>

      {/* Section 5 — Handshakes */}
      <Section
        num="05"
        eyebrow="HANDSHAKE TYPES"
        title="Four patterns that close the chain"
        lede="A handshake is a rule that says: events of these types, attested by these parties, within these tolerances, are considered reconciled. The avocado batch uses all four in sequence. The adjacent cases use subsets."
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {HANDSHAKES.map((h) => (
            <div key={h.name} style={{
              padding: '18px 22px',
              background: C.s2,
              border: `1px solid ${C.s3}`,
              borderLeft: `3px solid ${C.green}`,
              borderRadius: 4,
            }}>
              <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
                {h.name}
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, lineHeight: 1.65 }}>
                {h.desc}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 6 — Ports */}
      <Section
        num="06"
        eyebrow="PORT ARCHITECTURE"
        title="Hexagonal by design"
        lede="The core does not move money, verify identity, or store files itself. It orchestrates through six pluggable ports. Each port is an adapter contract — swap CGrate for SWIFT, GPS for cell-tower, WhatsApp for SMS — without touching the core."
      >
        <PortArchitecture />
      </Section>

      {/* Section 7 — Offline-first */}
      <Section
        num="07"
        eyebrow="OFFLINE-FIRST DESIGN"
        title="Record now, attest later, sync when online"
        lede="A depot clerk in rural Eastern Province has no signal. A farmer delivers. Both need a record. The system handles this natively, not as an edge case. Every event carries two timestamps — when created, and when received — and never silently merges."
      >
        <OfflineSync />
      </Section>

      {/* Section 8 — Anti-fraud */}
      <Section
        num="08"
        eyebrow="AUTOMATIC ANTI-FRAUD"
        title="Six triggers, three response tiers"
        lede="The adversarial case. These triggers fire without manual review. The response is graduated — weight reduction, attestation hold, manual review — because false positives are inevitable and automated public suspension destroys platform trust."
      >
        <FraudDetection />
      </Section>

      {/* Section 9 — Disputes */}
      <Section
        num="09"
        eyebrow="DISPUTE RESOLUTION"
        title="Record reality, do not adjudicate"
        lede="The trust layer is not a court. It records what each party claims and makes discrepancies visible. Unresolved disputes are data, not errors. Corrections are new events, not edits. The history is preserved."
      >
        <DisputeResolution />
      </Section>

      {/* Closing frame */}
      <div style={{
        marginTop: 60,
        padding: 26,
        background: C.s1,
        border: `1px solid ${C.s3}`,
        borderLeft: `4px solid ${C.egHi}`,
        borderRadius: 6,
      }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
          letterSpacing: '.12em', marginBottom: 8,
        }}>
          WHAT THIS GETS YOU
        </div>
        <p style={{
          fontFamily: FONT.body, fontSize: 14, color: C.t2,
          lineHeight: 1.7, margin: 0, maxWidth: 760,
        }}>
          Five entities, six ports, four handshake types, six anti-fraud triggers, three attestation tiers, one probation zone. That is the entire surface area of the architecture. Every case in the prototype — the avocado export, the plumber, the translator, the savings group — is constructed from exactly these primitives, with no extensions. The corporate due-diligence file on the avocado batch reconciles down to the orchard because the primitives compose that way, not because the avocado case got special treatment.
        </p>
      </div>
    </div>
  );
}

function Section({ num, eyebrow, title, lede, children }) {
  return (
    <div style={{ marginBottom: 60 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 13, color: C.t4,
          letterSpacing: '.1em', fontWeight: 600,
        }}>
          {num}
        </div>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
          letterSpacing: '.12em',
        }}>
          {eyebrow}
        </div>
      </div>
      <h2 style={{
        fontFamily: FONT.display, fontSize: 24, fontWeight: 800,
        color: C.t1, lineHeight: 1.2, marginBottom: 10,
      }}>
        {title}
      </h2>
      <p style={{
        fontFamily: FONT.body, fontSize: 15, color: C.t3,
        lineHeight: 1.7, maxWidth: 780, marginBottom: 26,
      }}>
        {lede}
      </p>
      {children}
    </div>
  );
}
