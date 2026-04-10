import { useState } from 'react';
import { C, FONT } from '../theme';

const CUSTOMERS = [
  {
    key: 'importer',
    tag: 'EU IMPORTER',
    color: C.purple,
    colorLt: C.purpleLt,
    title: 'The EU corporate buyer',
    pain: 'EUDR makes plot-level, deforestation-free provenance a legal duty. Fines scale to 4% of EU turnover. Five-year retention on the underlying records. Existing paperwork is not enough — the obligation is structural.',
    need: 'A receipt-grade, EUDR-ready provenance trail that survives an audit and ties a specific shipment to a specific plot, farmer, and input history.',
    fit: 'Thiqa issues an EUDR-grade warehouse receipt that references the farmer identity, the GPS plot and the input rail that fed the harvest. Provenance is structurally complete, not stapled on.',
    price: 'Per-receipt issuance fee, paid by the buyer. Compliance premium is priced into the shipment.',
    phase: 'Phase 2 pilot: one corporate buyer, one warehouse, one cohort.',
    figure: { v: '4%', k: 'of EU turnover — the fine ceiling under EUDR' },
  },
  {
    key: 'bank',
    tag: 'PRB / NZBA BANK',
    color: C.egHi,
    colorLt: C.eg,
    title: 'The signatory bank with ag exposure',
    pain: 'UNEP FI’s Principles for Responsible Banking (350+ signatories) and the Net-Zero Banking Alliance commit banks to measure and reduce the financed emissions and nature impact of their entire ag loan book — through the PCAF methodology. Soya is explicitly on UNEP FI’s Sector Action Guidance priority commodity list. The data to discharge the commitment does not exist for Zambian smallholders.',
    need: 'Verified, plot-level, portfolio-wide provenance and activity data that can feed PCAF financed-emissions reporting and NZBA target-setting without bespoke one-off projects.',
    fit: 'Thiqa’s trust profile is a queryable record of every attested event against a farmer identity. A bank pulls portfolio-level aggregates on its own borrowers, each backed by a verifiable underlying chain. The same data that serves the EU importer on shipment-level also serves the bank on portfolio-level.',
    price: 'Per-query or seasonal subscription, paid by the bank against its reporting obligation. Price scales with portfolio size.',
    phase: 'Phase 4: first paid queries from a regional bank or microfinance parent with stated PRB / PCAF commitments.',
    figure: { v: '$8.7T', k: 'AUM committed to tackling ag-commodity deforestation (UNEP FI coalition)' },
  },
  {
    key: 'mfi',
    tag: 'ZAMBIAN MFI',
    color: C.cuHi,
    colorLt: C.cu,
    title: 'The domestic lender without a credit file',
    pain: 'Zambian MFIs and input-credit suppliers want to lend to smallholders but have no credit-file substitute. Default assumptions force interest rates prohibitively high. Every new borrower is a cold start.',
    need: 'A standing, portable, verifiable trust profile per farmer — evidence, not a rating — built from real attested trade activity over multiple seasons.',
    fit: 'Thiqa’s trust profile is exactly that. 23 verified deliveries, 3 counterparties, 8-month history, 0 unresolved disputes — shareable at the farmer’s consent, readable by any lender via a time-limited signed URL.',
    price: 'Per-query fee, paid by the lender at the moment of loan origination. Price scales with loan value.',
    phase: 'Phase 4: credit-file substitute becomes credible once a season of data exists.',
    figure: { v: '85%', k: 'of Zambian employment is informal — the addressable population' },
  },
];

export default function BusinessModel() {
  const [selected, setSelected] = useState('importer');
  const sel = CUSTOMERS.find(c => c.key === selected);

  return (
    <section id="business" className="sec-alt">
      <div className="inner">
        <div className="eye">BUSINESS MODEL</div>
        <h2 className="h2">Three customers, one data product</h2>
        <p className="p">
          The question is not whether the mechanism is useful. The question is who has a pain big enough to pay for it, and whether that pain is funded. Three customers, three independent funding sources, all buying against the same underlying trust profile.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginTop: 34, flexWrap: 'wrap' }}>
          {CUSTOMERS.map((c) => {
            const isActive = selected === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelected(c.key)}
                style={{
                  fontFamily: FONT.mono, fontSize: 12, fontWeight: 600, letterSpacing: '.12em',
                  padding: '10px 18px',
                  border: `1px solid ${isActive ? c.color : C.s3}`,
                  background: isActive ? c.colorLt : C.s2,
                  color: isActive ? c.color : C.t3,
                  borderRadius: 4, cursor: 'pointer', transition: 'all .2s',
                }}
              >
                {c.tag}
              </button>
            );
          })}
        </div>

        {/* Selected customer card */}
        <div style={{
          marginTop: 16, padding: 34, background: C.s2,
          border: `1px solid ${C.s3}`, borderLeft: `4px solid ${sel.color}`,
          borderRadius: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
            <div style={{ flex: '1 1 320px' }}>
              <div style={{ fontFamily: FONT.mono, fontSize: 12, letterSpacing: '.12em', color: sel.color, marginBottom: 8 }}>
                {sel.tag}
              </div>
              <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 700, color: C.t1, lineHeight: 1.25 }}>
                {sel.title}
              </div>
            </div>
            <div style={{
              padding: '14px 20px', background: sel.colorLt,
              border: `1px solid ${sel.color}`, borderRadius: 6,
              minWidth: 200,
            }}>
              <div style={{ fontFamily: FONT.display, fontSize: 26, fontWeight: 800, color: sel.color, lineHeight: 1.1 }}>
                {sel.figure.v}
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.t2, marginTop: 4, lineHeight: 1.45 }}>
                {sel.figure.k}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            <div>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t3, letterSpacing: '.1em', marginBottom: 6 }}>THE PAIN</div>
              <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t1, lineHeight: 1.7, margin: 0 }}>{sel.pain}</p>
            </div>
            <div>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t3, letterSpacing: '.1em', marginBottom: 6 }}>WHAT THEY NEED</div>
              <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t1, lineHeight: 1.7, margin: 0 }}>{sel.need}</p>
            </div>
            <div>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t3, letterSpacing: '.1em', marginBottom: 6 }}>HOW THIQA FITS</div>
              <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t1, lineHeight: 1.7, margin: 0 }}>{sel.fit}</p>
            </div>
            <div>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t3, letterSpacing: '.1em', marginBottom: 6 }}>WHO PAYS, HOW</div>
              <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t1, lineHeight: 1.7, margin: 0 }}>{sel.price}</p>
            </div>
          </div>

          <div style={{
            marginTop: 26, padding: '12px 18px', background: C.s1,
            borderLeft: `3px solid ${sel.color}`, borderRadius: 4,
            fontFamily: FONT.mono, fontSize: 13, color: sel.color,
          }}>
            → {sel.phase}
          </div>
        </div>

        {/* Shared data product callout */}
        <div style={{
          marginTop: 28, padding: '22px 28px',
          background: C.eg, border: `1px solid ${C.egBr}`,
          borderLeft: `4px solid ${C.egHi}`,
          borderRadius: 8,
        }}>
          <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.egHi, marginBottom: 6 }}>
            One data product, three independent balance sheets
          </div>
          <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t1, lineHeight: 1.75, margin: 0 }}>
            The same attested farmer profile serves a shipment-level EUDR obligation, a portfolio-level PRB / NZBA commitment, and a loan-level credit decision. Every one of those pains is funded — by regulation, by voluntary-but-binding commitment, or by the basic economics of lending without a credit file. That is the difference between a useful mechanism and a defensible business.
          </p>
        </div>

        <div className="pull" style={{ marginTop: 44 }}>
          "The tools generate the data. The data has buyers on three different balance sheets. Every one of those buyers is paying for a pain they <em>already have</em>."
        </div>
      </div>
    </section>
  );
}
