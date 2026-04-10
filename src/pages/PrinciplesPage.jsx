import { C, FONT } from '../theme';

const PRINCIPLES = [
  {
    n: 1,
    title: 'Trust is an evidence chain, not a reputation score.',
    body: "A star rating tells you how people feel. An evidence chain tells you what happened and who confirmed it. 'Forty-seven jobs completed, multi-attested, payments confirmed, hashes verifiable' is a different kind of claim than '4.7 stars from two hundred reviews.'",
  },
  {
    n: 2,
    title: 'Trust is earned through accumulated, verified activity, not granted by credentialing authorities.',
    body: 'New parties enter a probation zone where their attestations carry minimal weight. Trust accrues through history, not through a centralised decision about who may participate. This is what makes the system inclusive of populations who cannot access traditional credentialing infrastructure.',
  },
  {
    n: 3,
    title: "Attestations are weighted by the attester's own earned trust.",
    body: 'A party with no history cannot bootstrap another party into legitimacy. This is the Sybil resistance mechanism — what makes the system robust against coordinated fake-account attacks that have killed most prior attempts at decentralised reputation.',
  },
  {
    n: 4,
    title: 'Every attestation is anchored to a verified event in the real world.',
    body: 'A transaction, a delivery, a measurement, a completion. Attestations that float free of events are not admitted. This distinguishes trust infrastructure from opinion aggregation.',
  },
  {
    n: 5,
    title: 'The architecture is indifferent to domain.',
    body: 'The same five entities — Party, Event, Attestation, Action, Credential — apply to agricultural exports, informal services, digital work, cooperative exchange, and environmental outcomes. Domain specificity lives in the tag vocabulary and the port configurations, not in the core schema.',
  },
  {
    n: 6,
    title: 'The evidence chain is auditable by anyone with permission.',
    body: 'Trust infrastructure cannot itself be opaque. The code is AGPL. The architecture specification is CC BY-SA. Data trails are verifiable by any party in the transaction. The moat is execution, not secrecy.',
  },
  {
    n: 7,
    title: 'Value flows to the parties who create it.',
    body: "A worker's accumulated trust profile belongs to the worker, not to the platform. It is portable. It travels wherever the worker goes. No platform can capture a user's reputation and use it as leverage against them.",
  },
];

export default function PrinciplesPage() {
  return (
    <div>
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
        letterSpacing: '.12em', marginBottom: 10,
      }}>
        SEVEN PRINCIPLES
      </div>
      <h1 style={{
        fontFamily: FONT.display, fontSize: 34, fontWeight: 800,
        color: C.t1, lineHeight: 1.15, marginBottom: 14,
      }}>
        The content of the architecture
      </h1>
      <p style={{
        fontFamily: FONT.body, fontSize: 16, color: C.t3,
        lineHeight: 1.7, maxWidth: 760, marginBottom: 40,
      }}>
        Stated as design commitments, not marketing language. Each one has consequences in the data model, the attestation logic, and the interface. Open to revision before the prototype ships.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 820 }}>
        {PRINCIPLES.map((p) => (
          <div key={p.n} style={{
            display: 'flex', gap: 20,
            padding: 24,
            background: C.s2,
            border: `1px solid ${C.s3}`,
            borderRadius: 6,
          }}>
            <div style={{
              flexShrink: 0,
              width: 36, height: 36,
              borderRadius: '50%',
              background: C.eg,
              border: `1px solid ${C.egBr}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color: C.egHi,
            }}>
              {p.n}
            </div>
            <div>
              <div style={{
                fontFamily: FONT.display, fontSize: 16, fontWeight: 700,
                color: C.t1, lineHeight: 1.4, marginBottom: 6,
              }}>
                {p.title}
              </div>
              <div style={{
                fontFamily: FONT.body, fontSize: 14, color: C.t2,
                lineHeight: 1.7,
              }}>
                {p.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
