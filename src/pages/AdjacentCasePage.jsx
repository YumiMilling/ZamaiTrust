import { useOutletContext } from 'react-router-dom';
import { C, FONT } from '../theme';
import plumber from '../data/plumber.json';
import translator from '../data/translator.json';
import savings from '../data/savings_group.json';
import PartyBadge from '../components/PartyBadge';
import EvidenceChain from '../components/EvidenceChain';

const CASES = {
  plumber: {
    data: plumber,
    groupKey: 'jobs',
    groupLabel: 'Jobs',
    groupFn: (j) => `${j.date} · ${j.summary} · ZMW ${j.amount_zmw.toLocaleString()}`,
  },
  translator: {
    data: translator,
    groupKey: 'jobs',
    groupLabel: 'Deliveries',
    groupFn: (j) => `${j.date} · ${j.summary} · USD ${j.amount_usd.toLocaleString()}`,
  },
  savings: {
    data: savings,
    groupKey: 'ledger',
    groupLabel: 'Ledger cycles',
    groupFn: (l) => `${l.period} · contrib ZMW ${l.contributions_zmw.toLocaleString()} · loans ZMW ${l.loans_zmw.toLocaleString()} · repay ZMW ${l.repayments_zmw.toLocaleString()}`,
  },
};

export default function AdjacentCasePage({ caseKey }) {
  const { view } = useOutletContext();
  const cfg = CASES[caseKey];
  const d = cfg.data;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 34 }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.cuHi,
          letterSpacing: '.12em', marginBottom: 8,
        }}>
          ADJACENT CASE · {view === 'architecture' ? 'ARCHITECTURE VIEW' : 'APPLICATION VIEW'}
        </div>
        <h1 style={{
          fontFamily: FONT.display, fontSize: 32, fontWeight: 800,
          color: C.t1, lineHeight: 1.15, marginBottom: 12,
        }}>
          {d.case_name}
        </h1>
        <p style={{
          fontFamily: FONT.body, fontSize: 16, color: C.t3,
          lineHeight: 1.65, maxWidth: 720, marginBottom: 8,
        }}>
          {d.case_tagline}
        </p>
        <p style={{
          fontFamily: FONT.body, fontSize: 12, color: C.t4,
          fontStyle: 'italic', lineHeight: 1.5, maxWidth: 720,
        }}>
          {d.scope_note}
        </p>
      </div>

      {/* Parties */}
      <Section title={view === 'architecture' ? 'PARTIES · entity:Party' : 'Parties'}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {d.parties.map((p) => (
            <PartyBadge key={p.id} party={p} view={view} />
          ))}
        </div>
      </Section>

      {/* Group summary (jobs / deliveries / ledger cycles) */}
      <Section title={view === 'architecture' ? 'GROUPS · domain view over events' : cfg.groupLabel}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {d[cfg.groupKey].map((g) => (
            <div key={g.id} style={{
              padding: '12px 16px',
              background: C.s2,
              border: `1px solid ${C.s3}`,
              borderLeft: `3px solid ${C.cuHi}`,
              borderRadius: 4,
              fontFamily: FONT.body, fontSize: 14, color: C.t1,
            }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4, marginRight: 10 }}>
                {g.id}
              </span>
              {cfg.groupFn(g)}
            </div>
          ))}
        </div>
      </Section>

      {/* Credential */}
      {d.credentials && d.credentials.length > 0 && (
        <Section title={view === 'architecture' ? 'CREDENTIALS · computed view' : 'Shareable credential'}>
          {d.credentials.map((c) => (
            <div key={c.id} style={{
              padding: '14px 18px',
              background: C.eg,
              border: `1px solid ${C.egBr}`,
              borderLeft: `3px solid ${C.egHi}`,
              borderRadius: 4,
              marginBottom: 8,
            }}>
              <div style={{ fontFamily: FONT.body, fontSize: 15, color: C.t1, fontWeight: 600 }}>
                {c.name}
              </div>
              <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4, marginTop: 4 }}>
                {view === 'architecture'
                  ? `id:${c.id} · composed_from:[${c.composed_from.join(', ')}] · hash:${c.hash}`
                  : `hash: ${c.hash}`}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Evidence chain */}
      <Section title={view === 'architecture' ? 'EVIDENCE CHAIN' : 'Evidence chain'}>
        <EvidenceChain
          events={d.events}
          attestations={d.attestations}
          handshakes={d.handshakes}
          parties={d.parties}
          view={view}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.t4,
        letterSpacing: '.1em', marginBottom: 12,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}
