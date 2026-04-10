import { useState } from 'react';
import { C, FONT } from '../theme';

const INPUT_RAIL = {
  key: 'input',
  tag: 'INPUT RAIL',
  color: C.egHi,
  colorLt: C.eg,
  label: 'E-voucher → Agro-dealer → Seed & fertiliser',
  steps: [
    { label: 'State allocation', sub: 'K8,000 / farmer', detail: 'FISP e-voucher posted to farmer NRC against eligible beneficiary list.' },
    { label: 'Farmer contribution', sub: 'K400', detail: 'Paid via mobile money at redemption. Mutual attestation on both sides.' },
    { label: 'Agro-dealer redemption', sub: '1 of 973', detail: 'Private agro-dealer issues seed, fertiliser, inoculant. Delivery is a Tier 1 event.' },
    { label: 'Inputs on farm', sub: 'soya, rotation', detail: 'GPS-tagged delivery confirmed by farmer device. First attestation of the season.' },
  ],
  funding: 'Funded by the state (K8,000) plus the farmer (K400). This rail exists as of the 2025/26 season.',
};

const OUTPUT_RAIL = {
  key: 'output',
  tag: 'OUTPUT RAIL',
  color: C.cuHi,
  colorLt: C.cu,
  label: 'Harvest → Warehouse receipt → EU compliance buyer',
  steps: [
    { label: 'Harvest & grading', sub: 'volume, moisture', detail: 'Farmer delivers soya to a pilot warehouse. Mutual attestation on weight and grade.' },
    { label: 'Warehouse receipt', sub: 'EUDR-grade', detail: 'Receipt references the farmer identity, GPS plot, and the input rail that fed it. Provenance is structurally complete.' },
    { label: 'Compliance buyer', sub: 'EU corporate', detail: 'Buyer legally required to hold 5-year deforestation-free provenance. Pays a compliance premium for receipt-grade stock.' },
    { label: 'Payment to farmer', sub: 'visible history', detail: 'Settlement recorded against the same profile. Farmer now has a verified season, end to end.' },
  ],
  funding: 'Funded by corporate EU buyers under legal duress (EUDR). No public envelope required.',
};

function Rail({ rail, active, setActive }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
        <span style={{
          fontFamily: FONT.mono, fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
          padding: '4px 10px', borderRadius: 4, background: rail.colorLt, color: rail.color,
        }}>
          {rail.tag}
        </span>
        <span style={{ fontFamily: FONT.body, fontSize: 15, color: C.t2 }}>
          {rail.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {rail.steps.map((s, i) => {
          const isActive = active === `${rail.key}-${i}`;
          return (
            <div
              key={i}
              onClick={() => setActive(isActive ? null : `${rail.key}-${i}`)}
              style={{
                padding: '16px 14px', background: C.s2,
                border: `1px solid ${isActive ? rail.color : C.s3}`,
                borderTop: `3px solid ${rail.color}`,
                borderRadius: 6, cursor: 'pointer',
                transition: 'all .2s',
                outline: isActive ? `1px solid ${rail.color}` : 'none',
                outlineOffset: -1,
              }}
            >
              <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.t4, letterSpacing: '.08em', marginBottom: 4 }}>
                STEP {i + 1}
              </div>
              <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1, lineHeight: 1.3, marginBottom: 3 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, color: rail.color }}>
                {s.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TwoRails() {
  const [active, setActive] = useState(null);
  const activeRail = active?.startsWith('input') ? INPUT_RAIL : active?.startsWith('output') ? OUTPUT_RAIL : null;
  const activeStep = active ? Number(active.split('-')[1]) : null;
  const activeDetail = activeRail ? activeRail.steps[activeStep] : null;

  return (
    <section id="rails" className="sec">
      <div className="eye">TWO RAILS, ONE IDENTITY</div>
      <h2 className="h2">The input rail met the output rail</h2>
      <p className="p">
        For the first time, both sides of a smallholder’s commercial year can exist outside state marketing. The input rail is real because FISP was digitised. The output rail is real because EU law now pays for plot-level provenance. What has been missing is the identity layer that makes them the same story.
      </p>
      <p className="p" style={{ color: C.t2 }}>
        Thiqa is that layer. Not a market, not a subsidy, not a buyer — a verification fabric that lets one farmer carry the same identity across both rails, and lets everyone downstream trust what they see. Soya is the worked example because it is EUDR-captured and rotates with maize; the mechanism is domain-agnostic.
      </p>

      <div style={{ marginTop: 34, padding: 28, background: C.s1, border: `1px solid ${C.s3}`, borderRadius: 8 }}>
        <Rail rail={INPUT_RAIL} active={active} setActive={setActive} />

        {/* Identity spine */}
        <div style={{
          margin: '22px 0',
          padding: '16px 22px',
          background: C.s2,
          border: `1px dashed ${C.s4}`,
          borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: C.eg, border: `2px solid ${C.egHi}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 800, color: C.egHi }}>1</span>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1 }}>
              Single farmer identity
            </div>
            <div style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.55 }}>
              Same NRC, same device, same GPS plot, same trust profile. Input rail events and output rail events accumulate against one identity — that is what makes the story tellable.
            </div>
          </div>
          <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t3, letterSpacing: '.08em' }}>
            party · event · attestation
          </div>
        </div>

        <Rail rail={OUTPUT_RAIL} active={active} setActive={setActive} />
      </div>

      {/* Detail panel */}
      {activeDetail && activeRail && (
        <div style={{
          marginTop: 20, padding: 24, background: C.s2,
          border: `1px solid ${C.s3}`, borderLeft: `4px solid ${activeRail.color}`,
          borderRadius: 8,
          animation: 'fadeUp .3s ease-out',
        }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 11, color: activeRail.color, letterSpacing: '.1em', marginBottom: 4 }}>
            {activeRail.tag} · STEP {activeStep + 1}
          </div>
          <div style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>
            {activeDetail.label}
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t2, lineHeight: 1.75, margin: 0 }}>
            {activeDetail.detail}
          </p>
        </div>
      )}

      {/* Funding contrast */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 28 }}>
        <div style={{ padding: 22, background: C.eg, border: `1px solid ${C.egBr}`, borderLeft: `3px solid ${C.egHi}`, borderRadius: 6 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.egHi, marginBottom: 6 }}>
            Who funds the input rail
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.7, margin: 0 }}>
            {INPUT_RAIL.funding}
          </p>
        </div>
        <div style={{ padding: 22, background: C.cu, border: `1px solid ${C.cuMid}`, borderLeft: `3px solid ${C.cuHi}`, borderRadius: 6 }}>
          <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.cuHi, marginBottom: 6 }}>
            Who funds the output rail
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 14, color: C.t2, lineHeight: 1.7, margin: 0 }}>
            {OUTPUT_RAIL.funding}
          </p>
        </div>
      </div>

      <div className="pull" style={{ marginTop: 44 }}>
        "This is the story that only became writable in the last six months. Inputs on the e-voucher rail, harvest on the receipt rail, one identity on both. <em>That</em> is the wedge."
      </div>
    </section>
  );
}
