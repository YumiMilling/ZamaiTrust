import { C, ENTITY_COLORS, FONT } from '../theme';

const primitives = [
  { key: 'party', label: 'Party' },
  { key: 'event', label: 'Event' },
  { key: 'attestation', label: 'Attestation' },
];

const verticals = [
  { label: 'Soya (pilot)', color: C.green },
  { label: 'Maize', color: C.cuHi },
  { label: 'Legumes & oilseeds', color: C.purple },
  { label: 'Beyond agriculture', color: C.coral },
];

export default function Hero() {
  return (
    <section className="sec" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="eye" style={{ fontFamily: FONT.mono, fontSize: 14 }}>CONCEPT NOTE v2.1 · APRIL 2026</div>
      <h1 className="h1" style={{ fontSize: 72, marginBottom: 12 }}>Thiqa</h1>
      <p style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 700, color: C.cuHi, marginBottom: 28 }}>
        The verification layer for a market that is quietly being rebuilt.
      </p>
      <p className="p" style={{ fontSize: 20 }}>
        Zambia’s state marketing apparatus is in transition. FISP has been digitised and opened to 973 private agro-dealers. FRA is under fiscal pressure that will force it back toward a pure reserve role by the 2026/27 season.
      </p>
      <p className="p" style={{ fontSize: 18 }}>
        At the same time, two independent corporate money pools now sit on exactly the data this creates demand for: European importers under the EU Deforestation Regulation, and signatory banks under UNEP FI’s Principles for Responsible Banking, Net-Zero Banking Alliance and PCAF financed-emissions methodology. Each has its own legal or reputational reason to pay for verified plot-level provenance on the same farmer.
      </p>
      <p className="p" style={{ fontSize: 18, color: C.t2 }}>
        Facts converging, pains already funded. <strong>Thiqa is the verification fabric that makes the private-sector alternatives legible.</strong> Two parties, an event, an attestation. Soya delivery, grain inspection, warehouse receipt, rent payment — same primitive.
      </p>

      <div style={{ display: 'flex', gap: 16, marginTop: 44, flexWrap: 'wrap' }}>
        {primitives.map((e) => (
          <div key={e.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: C.s2, borderTop: `2px solid ${ENTITY_COLORS[e.key].stroke}`, borderRadius: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: ENTITY_COLORS[e.key].stroke }} />
            <span style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1, letterSpacing: '.04em' }}>
              {e.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        {verticals.map((v) => (
          <span key={v.label} style={{
            fontFamily: FONT.mono, fontSize: 13, padding: '6px 14px', borderRadius: 4,
            background: C.base, border: `1px solid ${C.s3}`, color: v.color, fontWeight: 500,
          }}>{v.label}</span>
        ))}
        <span style={{
          fontFamily: FONT.mono, fontSize: 13, padding: '6px 14px', borderRadius: 4,
          background: C.base, border: `1px dashed ${C.s4}`, color: C.t4,
        }}>Domain-agnostic by design</span>
      </div>
    </section>
  );
}
