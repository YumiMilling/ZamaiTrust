import { C, FONT } from '../theme';
import Profitability from '../components/Profitability';

const TARGETS = [
  {
    name: 'EU corporate importers and retailers',
    driver: 'EUDR (in force Dec 2025) + CSDDD (phased 2027–29)',
    budget: 'Per-batch + annual compliance contracts',
    willingness: 'High',
    note: 'A single EUDR violation can exceed 4% of EU-wide turnover. A USD 180k/yr contract against that exposure is immaterial on the P&L.',
    color: C.egHi,
    tier: 'Primary',
  },
  {
    name: 'Sustainable-finance banks and asset managers',
    driver: 'SFDR, TNFD, portfolio scope-3 disclosure, UNEP FI PRB commitments',
    budget: 'Annual data and verification contracts',
    willingness: 'High',
    note: 'Banks with PRB commitments need reconcilable evidence on portfolio companies\' supply chains, not glossy ESG reports. The trust layer is the data source they currently do not have.',
    color: C.egHi,
    tier: 'Primary',
  },
  {
    name: 'Commodity traders and aggregators',
    driver: 'Downstream buyer requirements cascade upstream',
    budget: 'Rolled into origination cost; passed on to buyer',
    willingness: 'Medium · reluctant, then mandatory',
    note: 'Will not pay voluntarily, but will pay when their corporate buyer makes the evidence chain a condition of purchase. This is the leverage that turns into recurring revenue.',
    color: C.cuHi,
    tier: 'Secondary',
  },
  {
    name: 'Insurers and trade-finance providers',
    driver: 'Supply-chain risk exposure, cargo insurance, receivables finance',
    budget: 'Per-query + annual data licences',
    willingness: 'Medium',
    note: 'A verified evidence chain lowers their risk premium on the underlying transaction. Priced as a credit-bureau / risk-data substitute, not as a product.',
    color: C.cuHi,
    tier: 'Secondary',
  },
  {
    name: 'Programme / donor lines (CCSMP, CATSP)',
    driver: 'Operational reconciliation requirements',
    budget: 'Line items in programme budgets',
    willingness: 'Medium · contingent on programme launch',
    note: 'Not the thesis. Substrate for proving the architecture works on real commodity flows, which makes the corporate sale credible.',
    color: C.t3,
    tier: 'Substrate',
  },
];

export default function EconomicsPage() {
  return (
    <div>
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
        letterSpacing: '.12em', marginBottom: 10,
      }}>
        ECONOMICS · UNIT ECONOMICS · PATH TO BREAKEVEN
      </div>
      <h1 style={{
        fontFamily: FONT.display, fontSize: 34, fontWeight: 800,
        color: C.t1, lineHeight: 1.15, marginBottom: 14,
      }}>
        Profitability is the prerequisite for sustainability
      </h1>
      <p style={{
        fontFamily: FONT.body, fontSize: 16, color: C.t3,
        lineHeight: 1.7, maxWidth: 760, marginBottom: 10,
      }}>
        A trust layer for the real economy has to pay for itself, or the real economy will stop using it the moment donor money dries up. The numbers below are illustrative, but they are sized against real cost lines and real counterparties. They are here so the model can be argued with, not admired.
      </p>

      {/* Where the money is — this is the primary framing block */}
      <div style={{
        marginTop: 28,
        padding: 28,
        background: C.s2,
        border: `1px solid ${C.s3}`,
        borderTop: `4px solid ${C.egHi}`,
        borderRadius: 8,
      }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
          letterSpacing: '.12em', marginBottom: 10,
        }}>
          WHERE THE MONEY IS · MARKET TARGETS
        </div>
        <h2 style={{
          fontFamily: FONT.display, fontSize: 22, fontWeight: 800,
          color: C.t1, lineHeight: 1.25, marginBottom: 10,
        }}>
          Corporate regulatory compliance, not donor budgets
        </h2>
        <p style={{
          fontFamily: FONT.body, fontSize: 14, color: C.t2,
          lineHeight: 1.7, marginBottom: 20, maxWidth: 720,
        }}>
          Ongoing market scoping across ag solutions (ERP-integrated supplier/distributor platforms, aggregator upgrades) and compliance tooling with <strong>UNEP Finance Initiative</strong> has returned a consistent signal: the budgets for reconcilable supply-chain evidence sit with <strong>corporations facing EUDR, CSDDD, SFDR, and TNFD pressure</strong>, not with pilots. The avocado case is priced and framed against that target.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TARGETS.map((t) => (
            <div key={t.name} style={{
              padding: '14px 18px',
              background: C.base,
              border: `1px solid ${C.s3}`,
              borderLeft: `3px solid ${t.color}`,
              borderRadius: 4,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: 4, flexWrap: 'wrap', gap: 10,
              }}>
                <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1 }}>
                  {t.name}
                </div>
                <div style={{
                  fontFamily: FONT.mono, fontSize: 10, fontWeight: 700,
                  color: t.color, letterSpacing: '.08em',
                  padding: '2px 8px', background: `${t.color}14`, borderRadius: 3,
                }}>
                  {t.tier.toUpperCase()}
                </div>
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
                marginBottom: 8,
              }}>
                <SubField label="Regulatory driver"   value={t.driver}      />
                <SubField label="Budget form"         value={t.budget}      />
                <SubField label="Willingness to pay"  value={t.willingness} />
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, lineHeight: 1.6 }}>
                {t.note}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16, padding: 14,
          background: C.eg, borderRadius: 4,
          fontFamily: FONT.body, fontSize: 13, color: C.t1,
          lineHeight: 1.65,
        }}>
          <strong>One enterprise corporate contract (USD ~80k/yr) clears the entire cost baseline below.</strong> The prototype is here to demonstrate the mechanism. The contract is the business.
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <Profitability embedded />
      </div>
    </div>
  );
}

function SubField({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: FONT.mono, fontSize: 9, color: C.t4, letterSpacing: '.08em', marginBottom: 2 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.t2, lineHeight: 1.4 }}>
        {value}
      </div>
    </div>
  );
}
