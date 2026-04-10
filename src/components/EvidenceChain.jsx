import { C, FONT } from '../theme';
import PartyBadge from './PartyBadge';

// Renders the evidence chain for a batch (or any case sub-unit) with
// events, attestations, and handshakes. Switches between application
// and architecture views without navigating away.

const STATUS_COLOR = {
  closed:  C.green,
  open:    C.cuHi,
  missing: C.red,
};

export default function EvidenceChain({ events, attestations, handshakes, parties, view = 'application' }) {
  const partyById = Object.fromEntries(parties.map((p) => [p.id, p]));
  const attById = Object.fromEntries(attestations.map((a) => [a.id, a]));
  const attsByEvent = attestations.reduce((acc, a) => {
    (acc[a.event_id] ||= []).push(a);
    return acc;
  }, {});

  return (
    <div>
      {/* Events timeline */}
      <SectionLabel view={view}>
        {view === 'architecture' ? 'EVENTS · entity:Event' : 'Timeline'}
      </SectionLabel>
      <div style={{
        borderLeft: `2px solid ${C.s3}`,
        paddingLeft: 20,
        marginBottom: 32,
      }}>
        {events.map((ev) => {
          const party = partyById[ev.party_id];
          const atts = attsByEvent[ev.id] || [];
          return (
            <div key={ev.id} style={{ position: 'relative', marginBottom: 20 }}>
              <div style={{
                position: 'absolute', left: -27, top: 4,
                width: 10, height: 10, borderRadius: '50%',
                background: C.egHi,
                border: `2px solid ${C.base}`,
              }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4 }}>
                  {formatTs(ev.ts)}
                </span>
                {view === 'architecture' && (
                  <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.purple }}>
                    {ev.id}
                  </span>
                )}
              </div>
              {view === 'application' ? (
                <div style={{ fontFamily: FONT.body, fontSize: 15, color: C.t1, fontWeight: 600 }}>
                  {ev.summary}
                </div>
              ) : (
                <div style={{ fontFamily: FONT.mono, fontSize: 12, color: C.t2, lineHeight: 1.6 }}>
                  <span style={{ color: C.t4 }}>kind:</span> {ev.kind}{' '}
                  <span style={{ color: C.t4 }}>tags:</span>{' '}
                  <span style={{ color: C.cuHi }}>[{ev.tags.join(', ')}]</span>
                </div>
              )}
              <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4 }}>by</span>
                <PartyBadge party={party} view={view} />
                {atts.length > 0 && (
                  <span style={{
                    fontFamily: FONT.mono, fontSize: 10, color: C.egHi,
                    padding: '2px 6px', background: C.eg, borderRadius: 2,
                  }}>
                    {atts.length} attestation{atts.length === 1 ? '' : 's'}
                  </span>
                )}
              </div>
              {view === 'architecture' && atts.map((a) => (
                <div key={a.id} style={{
                  marginTop: 6, marginLeft: 16,
                  fontFamily: FONT.mono, fontSize: 11, color: C.t3,
                  padding: '4px 10px',
                  background: C.s1,
                  borderLeft: `2px solid ${C.cuHi}`,
                  borderRadius: 2,
                }}>
                  <span style={{ color: C.t4 }}>attestation:</span> {a.id}{' '}
                  <span style={{ color: C.t4 }}>·</span>{' '}
                  <span style={{ color: C.t4 }}>attester:</span> {a.attester_id}{' '}
                  <span style={{ color: C.t4 }}>·</span>{' '}
                  <span style={{ color: C.cuHi }}>[{a.tags.join(', ')}]</span>
                  {a.payload && (
                    <div style={{ color: C.t3, marginTop: 2, fontSize: 10 }}>
                      payload: {JSON.stringify(a.payload)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Handshakes */}
      <SectionLabel view={view}>
        {view === 'architecture' ? 'HANDSHAKES · pair<Attestation>' : 'Verification handshakes'}
      </SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {handshakes.map((h) => {
          const color = STATUS_COLOR[h.status] || C.t3;
          return (
            <div key={h.id} style={{
              padding: '14px 18px',
              background: C.s2,
              border: `1px solid ${C.s3}`,
              borderLeft: `3px solid ${color}`,
              borderRadius: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1 }}>
                    {h.label}
                  </span>
                  {view === 'architecture' && (
                    <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.purple }}>
                      {h.id} · type:{h.type}
                    </span>
                  )}
                </div>
                <span style={{
                  fontFamily: FONT.mono, fontSize: 10, fontWeight: 700,
                  color, letterSpacing: '.08em',
                  padding: '3px 8px', background: `${color}12`, borderRadius: 3,
                }}>
                  {h.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t3, lineHeight: 1.55 }}>
                {h.tolerance_note}
              </div>
              {view === 'architecture' && h.attestation_ids.length > 0 && (
                <div style={{
                  marginTop: 6,
                  fontFamily: FONT.mono, fontSize: 11, color: C.t4,
                }}>
                  attestations: [{h.attestation_ids.join(', ')}]
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionLabel({ view, children }) {
  return (
    <div style={{
      fontFamily: FONT.mono, fontSize: 11,
      color: view === 'architecture' ? C.purple : C.t4,
      letterSpacing: '.1em',
      marginBottom: 12,
      marginTop: 8,
    }}>
      {children}
    </div>
  );
}

function formatTs(ts) {
  const d = new Date(ts);
  return d.toISOString().slice(0, 16).replace('T', ' ') + 'Z';
}
