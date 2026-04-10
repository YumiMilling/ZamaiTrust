import { Link, useOutletContext } from 'react-router-dom';
import { C, FONT } from '../theme';
import avocado from '../data/avocado.json';
import PartyBadge from '../components/PartyBadge';

const STATUS_COLOR = {
  green: C.green,
  amber: C.cuHi,
  red:   C.red,
};

export default function AvocadoCase() {
  const { view } = useOutletContext();
  const partyById = Object.fromEntries(avocado.parties.map((p) => [p.id, p]));

  return (
    <div>
      <CaseHeader view={view} />

      {/* Parties — condensed in application view, expanded in architecture view */}
      <Section title={view === 'architecture' ? 'PARTIES · entity:Party' : 'Actors in this supply chain'}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {avocado.parties.map((p) => (
            <div key={p.id} style={{
              padding: '12px 14px',
              background: C.s2,
              border: `1px solid ${C.s3}`,
              borderRadius: 4,
            }}>
              <div style={{
                display: 'flex', alignItems: 'baseline',
                justifyContent: 'space-between', marginBottom: 4,
              }}>
                <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1 }}>
                  {view === 'architecture' ? p.id : p.name}
                </div>
                <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.t4 }}>
                  w {p.trust_weight.toFixed(2)}
                </div>
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t3 }}>
                {p.kind}{p.probation ? ' · probation' : ''}
              </div>
              {view === 'application' && (
                <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.t4, marginTop: 2 }}>
                  {p.location}
                </div>
              )}
              {view === 'architecture' && (
                <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.t4, marginTop: 2 }}>
                  events:{p.events_count}{p.geo_verified === false ? ' · geo_verified:false' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Batches */}
      <Section title={view === 'architecture' ? 'BATCHES · aggregate<Event, Attestation, Handshake>' : 'Batches'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {avocado.batches.map((b) => {
            const sc = STATUS_COLOR[b.status_color];
            const buyer = partyById[b.buyer_id];
            return (
              <Link key={b.id} to={`/case/avocado/batch/${b.id}${view === 'architecture' ? '?view=architecture' : ''}`}
                style={{
                  display: 'block', textDecoration: 'none',
                  padding: '20px 24px',
                  background: C.s2,
                  border: `1px solid ${C.s3}`,
                  borderLeft: `4px solid ${sc}`,
                  borderRadius: 6,
                  transition: 'background .15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.s1; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.s2; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: FONT.mono, fontSize: 13, fontWeight: 700, color: C.t1 }}>
                        {b.id}
                      </span>
                      <span style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3 }}>
                        {b.cultivar} · {b.weight_kg.toLocaleString()} kg
                      </span>
                    </div>
                    <div style={{ fontFamily: FONT.body, fontSize: 14, color: C.t1, fontWeight: 500, marginBottom: 10 }}>
                      {b.status_label}
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <Pill label="EUDR"        value={b.eudr_compliant}    />
                      <Pill label="MRL"         value={b.mrl_compliant}     />
                      <Pill label="Cold chain"  value={b.cold_chain_intact} />
                    </div>

                    {view === 'architecture' && (
                      <div style={{
                        marginTop: 10,
                        fontFamily: FONT.mono, fontSize: 11, color: C.t4,
                      }}>
                        events:{b.events.length} · attestations:{b.attestations.length} · handshakes:{b.handshakes.length}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: FONT.mono, fontSize: 10, color: C.t4,
                      letterSpacing: '.08em', marginBottom: 4,
                    }}>
                      BUYER
                    </div>
                    <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t2 }}>
                      {view === 'architecture' ? buyer.id : buyer.name}
                    </div>
                    <div style={{
                      fontFamily: FONT.mono, fontSize: 13, color: sc,
                      marginTop: 14, fontWeight: 600,
                    }}>
                      Open →
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function CaseHeader({ view }) {
  return (
    <div style={{ marginBottom: 38 }}>
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
        letterSpacing: '.12em', marginBottom: 10,
      }}>
        FEATURED CASE · {view === 'architecture' ? 'ARCHITECTURE VIEW' : 'APPLICATION VIEW'}
      </div>
      <h1 style={{
        fontFamily: FONT.display, fontSize: 34, fontWeight: 800,
        color: C.t1, lineHeight: 1.15, marginBottom: 12,
      }}>
        {avocado.case_name}
      </h1>
      <p style={{
        fontFamily: FONT.body, fontSize: 16, color: C.t3,
        lineHeight: 1.65, maxWidth: 760, marginBottom: 0,
      }}>
        {avocado.case_tagline}
      </p>
      <p style={{
        fontFamily: FONT.body, fontSize: 12, color: C.t4,
        fontStyle: 'italic', lineHeight: 1.55, maxWidth: 760, marginTop: 8,
      }}>
        {avocado.scope_note}
      </p>
    </div>
  );
}

function Section({ title, children }) {
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

function Pill({ label, value }) {
  const color = value === true ? C.green : value === false ? C.red : C.t4;
  const mark = value === true ? '✓' : value === false ? '✕' : '·';
  return (
    <span style={{
      fontFamily: FONT.mono, fontSize: 11,
      padding: '3px 10px',
      background: `${color}12`,
      color,
      border: `1px solid ${color}40`,
      borderRadius: 3,
    }}>
      {mark} {label}
    </span>
  );
}
