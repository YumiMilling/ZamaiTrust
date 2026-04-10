import { Link, useOutletContext, useParams } from 'react-router-dom';
import { C, FONT } from '../theme';
import avocado from '../data/avocado.json';
import EvidenceChain from '../components/EvidenceChain';

export default function AvocadoBatchDetail() {
  const { id } = useParams();
  const { view } = useOutletContext();
  const batch = avocado.batches.find((b) => b.id === id);

  if (!batch) {
    return (
      <div>
        <p style={{ fontFamily: FONT.body, color: C.t3 }}>Batch {id} not found.</p>
        <Link to="/case/avocado" style={{ color: C.egHi }}>← Back to batches</Link>
      </div>
    );
  }

  const qs = view === 'architecture' ? '?view=architecture' : '';
  const buyer = avocado.parties.find((p) => p.id === batch.buyer_id);
  const credential = avocado.credentials.find((c) => c.batch_id === batch.id);

  return (
    <div>
      {/* Back link */}
      <Link to={`/case/avocado${qs}`} style={{
        fontFamily: FONT.mono, fontSize: 12, color: C.t3,
        textDecoration: 'none', display: 'inline-block', marginBottom: 20,
      }}>
        ← Back to batches
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
          letterSpacing: '.12em', marginBottom: 8,
        }}>
          BATCH · {view === 'architecture' ? 'ARCHITECTURE VIEW' : 'APPLICATION VIEW'}
        </div>
        <h1 style={{
          fontFamily: FONT.display, fontSize: 32, fontWeight: 800,
          color: C.t1, lineHeight: 1.15, marginBottom: 10,
        }}>
          {batch.id}
        </h1>
        <div style={{ fontFamily: FONT.body, fontSize: 16, color: C.t2, marginBottom: 18 }}>
          {batch.status_label}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <Stat label="Cultivar"   value={batch.cultivar} />
          <Stat label="Weight"     value={`${batch.weight_kg.toLocaleString()} kg`} />
          <Stat label="Packed"     value={batch.packed_on || '—'} />
          <Stat label="Buyer"      value={view === 'architecture' ? buyer.id : buyer.name} />
        </div>
      </div>

      {/* Exception panel — only on the amber batch */}
      {batch.exception && (
        <ExceptionPanel exception={batch.exception} batch={batch} view={view} />
      )}

      {/* Compliance summary */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.t4,
          letterSpacing: '.1em', marginBottom: 12,
        }}>
          {view === 'architecture' ? 'CREDENTIALS · computed view' : 'Compliance status'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <ComplianceCard label="EUDR origin"  value={batch.eudr_compliant}
            note={batch.eudr_compliant ? 'All orchards geo-verified' : 'Missing orchard geolocation'} />
          <ComplianceCard label="MRL residue"   value={batch.mrl_compliant}
            note={batch.mrl_compliant ? 'Max residue below EU threshold' : 'Residue above threshold'} />
          <ComplianceCard label="Cold chain"    value={batch.cold_chain_intact}
            note={batch.cold_chain_intact === null ? 'Not yet loaded' : batch.cold_chain_intact ? 'Continuous' : 'Break detected'} />
        </div>

        {credential && (
          <div style={{
            marginTop: 14,
            padding: '12px 18px',
            background: C.eg,
            border: `1px solid ${C.egBr}`,
            borderLeft: `3px solid ${C.egHi}`,
            borderRadius: 4,
            fontFamily: FONT.body, fontSize: 13, color: C.t1,
          }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.egHi, letterSpacing: '.08em', marginRight: 8 }}>
              CREDENTIAL
            </span>
            {credential.name}
            <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4, marginLeft: 10 }}>
              hash: {credential.hash}
            </span>
          </div>
        )}
      </div>

      {/* Evidence chain */}
      <EvidenceChain
        events={batch.events}
        attestations={batch.attestations}
        handshakes={batch.handshakes}
        parties={avocado.parties}
        view={view}
      />
    </div>
  );
}

function ExceptionPanel({ exception, batch, view }) {
  return (
    <div style={{
      marginBottom: 34,
      padding: 24,
      background: C.amberLt,
      border: `1px solid ${C.cuMid}`,
      borderLeft: `4px solid ${C.cuHi}`,
      borderRadius: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: C.cuHi,
          letterSpacing: '.1em', fontWeight: 700,
        }}>
          EXCEPTION · {exception.severity.toUpperCase()}
        </div>
        {view === 'architecture' && (
          <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4 }}>
            trigger:{exception.trigger} · affected:{exception.affected_party_id}
          </div>
        )}
      </div>

      <h2 style={{
        fontFamily: FONT.display, fontSize: 20, fontWeight: 800,
        color: C.t1, lineHeight: 1.3, marginBottom: 8,
      }}>
        {exception.title}
      </h2>
      <p style={{
        fontFamily: FONT.body, fontSize: 14, color: C.t2,
        lineHeight: 1.65, margin: 0, marginBottom: 14,
      }}>
        {exception.summary}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.t4, letterSpacing: '.08em', marginBottom: 4 }}>
            REQUIRED ACTION
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t1, lineHeight: 1.55 }}>
            {exception.required_action}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.t4, letterSpacing: '.08em', marginBottom: 4 }}>
            BUYER-SIDE IMPACT
          </div>
          <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.t1, lineHeight: 1.55 }}>
            {exception.buyer_impact}
          </div>
        </div>
      </div>

      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.t4,
        paddingTop: 10, borderTop: `1px dashed ${C.cuMid}`,
      }}>
        When the missing attestation is collected, status transitions to <span style={{ color: C.green, fontWeight: 700 }}>{exception.unblocked_status}</span> and the batch is released for dispatch.
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{
      padding: 14,
      background: C.s2,
      border: `1px solid ${C.s3}`,
      borderRadius: 4,
    }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.t4, letterSpacing: '.08em', marginBottom: 4 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 700, color: C.t1 }}>
        {value}
      </div>
    </div>
  );
}

function ComplianceCard({ label, value, note }) {
  const color = value === true ? C.green : value === false ? C.red : C.t4;
  const mark = value === true ? '✓' : value === false ? '✕' : '—';
  return (
    <div style={{
      padding: '14px 18px',
      background: C.s2,
      border: `1px solid ${C.s3}`,
      borderTop: `3px solid ${color}`,
      borderRadius: 4,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.t1 }}>
          {label}
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 16, color, fontWeight: 700 }}>
          {mark}
        </div>
      </div>
      <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.t3, lineHeight: 1.55 }}>
        {note}
      </div>
    </div>
  );
}
