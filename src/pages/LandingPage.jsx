import { Link } from 'react-router-dom';
import { C, FONT } from '../theme';
import avocado from '../data/avocado.json';
import plumber from '../data/plumber.json';
import translator from '../data/translator.json';
import savings from '../data/savings_group.json';

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
          color: C.t1, lineHeight: 1.1, marginBottom: 20,
          maxWidth: 860,
        }}>
          One architecture, demonstrated through one fully-worked case and three adjacent ones.
        </h1>
        <p style={{
          fontFamily: FONT.body, fontSize: 18, color: C.t2,
          lineHeight: 1.7, maxWidth: 760, marginBottom: 14,
        }}>
          The featured case is a Zambian Hass avocado batch moving from an Eastern Province orchard, through a cooperative and a pack-house, past a residue lab and a cold chain, onto a vessel, to an EU buyer who needs an auditable evidence chain to clear their own due-diligence file.
        </p>
        <p style={{
          fontFamily: FONT.body, fontSize: 16, color: C.t3,
          lineHeight: 1.75, maxWidth: 760,
        }}>
          The three adjacent cases — an informal plumber, a freelance translator, a village savings group — exist to prove that the same five entities, the same attestation weighting, and the same handshake structure apply across domains with no modification to the core. Toggle between the <strong style={{ color: C.t1 }}>application view</strong> (what a user sees) and the <strong style={{ color: C.t1 }}>architecture view</strong> (the generic primitives) on any case.
        </p>
      </div>

      {/* Featured case */}
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.t4,
        letterSpacing: '.1em', marginBottom: 14,
      }}>
        FEATURED CASE
      </div>
      <Link to="/case/avocado" style={{
        display: 'block', textDecoration: 'none',
        background: C.s2,
        border: `1px solid ${C.s3}`,
        borderLeft: `4px solid ${C.egHi}`,
        borderRadius: 8,
        padding: 38,
        marginBottom: 50,
        transition: 'transform .15s, box-shadow .15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
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
            }}>
              {avocado.case_name}
            </h2>
            <p style={{
              fontFamily: FONT.body, fontSize: 15, color: C.t2,
              lineHeight: 1.65, margin: 0, maxWidth: 620,
            }}>
              {avocado.case_tagline} Three batches, one of them on hold because a contributing orchard's geolocation is missing and the EUDR origin attestation can't close. The exception is the most important screen in the prototype.
            </p>

            <div style={{ display: 'flex', gap: 20, marginTop: 22, flexWrap: 'wrap' }}>
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

      {/* Adjacent cases */}
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.t4,
        letterSpacing: '.1em', marginBottom: 14,
      }}>
        ADJACENT CASES · SAME ARCHITECTURE, DIFFERENT DOMAINS
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <AdjacentCard slug="plumber"       data={plumber}    />
        <AdjacentCard slug="translator"    data={translator} />
        <AdjacentCard slug="savings-group" data={savings}    />
      </div>

      <div style={{ marginTop: 50, padding: 24, background: C.s1, border: `1px solid ${C.s3}`, borderRadius: 6 }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.t4,
          letterSpacing: '.08em', marginBottom: 8,
        }}>
          WHAT THIS PROTOTYPE DOES NOT CLAIM
        </div>
        <p style={{
          fontFamily: FONT.body, fontSize: 13, color: C.t3,
          lineHeight: 1.65, margin: 0,
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
      <div style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 800, color: C.t1 }}>
        {value}
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.t4, letterSpacing: '.08em' }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
}

function AdjacentCard({ slug, data }) {
  return (
    <Link to={`/case/${slug}`} style={{
      display: 'block', textDecoration: 'none',
      background: C.s2,
      border: `1px solid ${C.s3}`,
      borderTop: `3px solid ${C.cuHi}`,
      borderRadius: 6,
      padding: 22,
      transition: 'transform .15s, box-shadow .15s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <div style={{
        fontFamily: FONT.mono, fontSize: 10, color: C.cuHi,
        letterSpacing: '.08em', marginBottom: 6,
      }}>
        ADJACENT
      </div>
      <div style={{
        fontFamily: FONT.display, fontSize: 17, fontWeight: 700, color: C.t1,
        marginBottom: 8, lineHeight: 1.3,
      }}>
        {data.case_name}
      </div>
      <p style={{
        fontFamily: FONT.body, fontSize: 13, color: C.t3,
        lineHeight: 1.6, margin: 0,
      }}>
        {data.case_tagline}
      </p>
    </Link>
  );
}
