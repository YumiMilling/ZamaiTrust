import { C, FONT } from '../theme';

const KIND_COLOR = {
  orchard:        C.green,
  cooperative:    C.egHi,
  packhouse:      C.egVi,
  lab:            C.purple,
  logistics:      C.coral,
  exporter:       C.cuHi,
  buyer:          C.pink,
  worker:         C.egHi,
  customer:       C.cuHi,
  client:         C.cuHi,
  member:         C.egHi,
  member_officer: C.egVi,
  collective:     C.purple,
  lender:         C.cuHi,
};

export default function PartyBadge({ party, view = 'application' }) {
  if (!party) return null;
  const color = KIND_COLOR[party.kind] || C.t3;
  if (view === 'architecture') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: FONT.mono, fontSize: 12,
        padding: '3px 8px',
        background: C.s1,
        border: `1px solid ${C.s3}`,
        borderRadius: 3,
      }}>
        <span style={{ color: C.t4 }}>party:</span>
        <span style={{ color: C.t1 }}>{party.id}</span>
        <span style={{ color: C.t4 }}>·</span>
        <span style={{ color }}>{party.kind}</span>
      </span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: FONT.body, fontSize: 13,
      padding: '3px 10px',
      background: C.s2,
      border: `1px solid ${C.s3}`,
      borderLeft: `2px solid ${color}`,
      borderRadius: 3,
    }}>
      <span style={{ color: C.t1, fontWeight: 600 }}>{party.name}</span>
      <span style={{ color: C.t4, fontSize: 11 }}>{party.kind}</span>
    </span>
  );
}
