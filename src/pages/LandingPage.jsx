import { Link } from 'react-router-dom';
import { C, FONT } from '../theme';
import avocado from '../data/avocado.json';

export default function LandingPage() {
  return (
    <div>
      {/* Scope banner */}
      <div style={{
        padding: '10px 16px',
        background: C.amberLt,
        border: `1px solid ${C.cuMid}`,
        borderLeft: `3px solid ${C.cuHi}`,
        borderRadius: 4,
        fontFamily: FONT.mono, fontSize: 11, color: C.cuHi,
        marginBottom: 38,
      }}>
        REFERENCE PROTOTYPE · Frontend only · All data illustrative · No backend, no live attestations
      </div>

      {/* Claim */}
      <div style={{ marginBottom: 60 }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 12, color: C.egHi,
          letterSpacing: '.18em', marginBottom: 14,
        }}>
          TTL-REF-PROTO/001 · APRIL 2026
        </div>
        <h1 style={{
          fontFamily: FONT.display, fontSize: 46, fontWeight: 800,
          color: C.t1, lineHeight: 1.12, marginBottom: 20,
          maxWidth: 860, letterSpacing: '-0.01em',
        }}>
          The evidence layer behind corporate due-diligence files for African agricultural exports.
        </h1>
        <p style={{
          fontFamily: FONT.body, fontSize: 17, color: C.t2,
          lineHeight: 1.75, maxWidth: 720, marginBottom: 14,
        }}>
          This prototype works one case end to end: a Zambian Hass avocado batch moving from an Eastern Province orchard, through a cooperative and a pack-house, past a residue lab and a cold chain, onto a vessel, to an EU buyer. The buyer is a corporation with <strong style={{ color: C.t1 }}>EUDR and CSDDD liability</strong>. Their compliance file has to reconcile down to the orchard, per batch, or they pay the fine. That reconciliation is the product.
        </p>
        <p style={{
          fontFamily: FONT.body, fontSize: 15, color: C.t3,
          lineHeight: 1.75, maxWidth: 720,
        }}>
          One case, worked in detail. Three batches, one of them on hold. The exception is the most important screen in the prototype. Every batch can be read in <strong style={{ color: C.t1 }}>application view</strong> (what a compliance officer sees) or <strong style={{ color: C.t1 }}>architecture view</strong> (the generic primitives underneath). Toggle in the header on any case screen.
        </p>

        {/* Market signal callout */}
        <div style={{
          marginTop: 24, padding: '16px 22px',
          background: C.eg, border: `1px solid ${C.egBr}`,
          borderLeft: `3px solid ${C.egHi}`,
          borderRadius: 4, maxWidth: 720,
        }}>
          <div style={{
            fontFamily: FONT.mono, fontSize: 10, color: C.egHi,
            letterSpacing: '.12em', marginBottom: 6,
          }}>
            WHERE THE MONEY IS
          </div>
          <p style={{
            fontFamily: FONT.body, fontSize: 14, color: C.t1,
            lineHeight: 1.7, margin: 0,
          }}>
            Signal from current work with <strong>UNEP Finance Initiative</strong> and ongoing market scoping across ag solutions (ERP-integrated supplier/distributor platforms, aggregator upgrades, UN compliance tooling): the budgets sit with <strong>corporations facing regulatory due-diligence pressure</strong> — EUDR, CSDDD, scope-3 disclosure, TNFD. Not with donor pilots. The avocado case is priced and framed against that target, not against NGO line items.
          </p>
        </div>
      </div>

      {/* Featured case */}
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.t4,
        letterSpacing: '.1em', marginBottom: 14,
      }}>
        THE CASE
      </div>
      <Link to="/case/avocado" style={{
        display: 'block', textDecoration: 'none',
        background: C.s2,
        border: `1px solid ${C.s3}`,
        borderLeft: `4px solid ${C.egHi}`,
        borderRadius: 8,
        padding: 38,
        marginBottom: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
              letterSpacing: '.08em', marginBottom: 6,
            }}>
              HASS AVOCADO · EASTERN PROVINCE → ROTTERDAM
            </div>
            <h2 style={{
              fontFamily: FONT.display, fontSize: 28, fontWeight: 800,
              color: C.t1, marginBottom: 10, lineHeight: 1.2,
              letterSpacing: '-0.005em',
            }}>
              {avocado.case_name}
            </h2>
            <p style={{
              fontFamily: FONT.body, fontSize: 15, color: C.t2,
              lineHeight: 1.7, margin: 0, maxWidth: 620,
            }}>
              {avocado.case_tagline} Three batches, one of them on hold because a contributing orchard's geolocation is missing and the EUDR origin attestation cannot close. The exception is the most important screen in the prototype.
            </p>

            <div style={{ display: 'flex', gap: 24, marginTop: 22, flexWrap: 'wrap' }}>
              <Stat label="Parties"       value={avocado.parties.length} />
              <Stat label="Batches"       value={avocado.batches.length} />
              <Stat label="Events"        value={avocado.batches.reduce((s, b) => s + b.events.length, 0)} />
              <Stat label="Attestations" value={avocado.batches.reduce((s, b) => s + b.attestations.length, 0)} />
              <Stat label="Handshakes"    value={avocado.batches.reduce((s, b) => s + b.handshakes.length, 0)} />
            </div>
          </div>

          <div style={{
            fontFamily: FONT.mono, fontSize: 13, color: C.egHi,
            alignSelf: 'center',
          }}>
            Open case →
          </div>
        </div>
      </Link>

      {/* Market position — connects prototype to adjacent work */}
      <div style={{
        marginTop: 10,
        fontFamily: FONT.mono, fontSize: 11, color: C.t4,
        letterSpacing: '.1em', marginBottom: 14,
      }}>
        MARKET POSITION · HOW THIS PROTOTYPE SITS NEXT TO ADJACENT WORK
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
        marginBottom: 50,
      }}>
        <PositionCard
          tag="ERP · AGGREGATOR UPGRADE"
          title="Supplier / distributor platforms"
          body="Upgraded Aggregator serving ag suppliers and distributors. The trust layer is the evidence substrate it writes into — the thing that makes reconciliation across two independent ERPs actually trustworthy."
        />
        <PositionCard
          tag="UNEP FI · COMPLIANCE TOOLING"
          title="Corporate sustainable finance"
          body="Compliance tools under development with UN partners, targeting banks and corporate buyers with EUDR / CSDDD / SFDR / TNFD exposure. The trust layer is the data source their portfolio-level tools currently do not have."
        />
        <PositionCard
          tag="THIS PROTOTYPE"
          title="The evidence layer itself"
          body="The shared primitive underneath both. Demonstrated here on a Zambian Hass avocado batch because that is the cleanest case to make the architecture legible to a technical reader in one sitting."
          primary
        />
      </div>

      <div style={{ padding: 24, background: C.s1, border: `1px solid ${C.s3}`, borderRadius: 6 }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.t4,
          letterSpacing: '.08em', marginBottom: 8,
        }}>
          WHAT THIS PROTOTYPE DOES NOT CLAIM
        </div>
        <p style={{
          fontFamily: FONT.body, fontSize: 14, color: C.t3,
          lineHeight: 1.7, margin: 0,
        }}>
          No backend, no Supabase, no real attestations, no live users, no commercial traction. This is an architectural demonstration. The closest operational reference implementation is the CCSMP school feeding pilot running on real commodity flows in Choma District. Production evidence lives there, not here.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 800, color: C.t1 }}>
        {value}
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.t4, letterSpacing: '.08em' }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
}

function PositionCard({ tag, title, body, primary = false }) {
  const accent = primary ? C.egHi : C.cuHi;
  return (
    <div style={{
      padding: 20,
      background: primary ? C.eg : C.s2,
      border: `1px solid ${primary ? C.egBr : C.s3}`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 6,
    }}>
      <div style={{
        fontFamily: FONT.mono, fontSize: 10, color: accent,
        letterSpacing: '.08em', marginBottom: 6,
      }}>
        {tag}
      </div>
      <div style={{
        fontFamily: FONT.display, fontSize: 16, fontWeight: 700,
        color: C.t1, marginBottom: 8, lineHeight: 1.3,
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: FONT.body, fontSize: 13, color: C.t3,
        lineHeight: 1.6,
      }}>
        {body}
      </div>
    </div>
  );
}
