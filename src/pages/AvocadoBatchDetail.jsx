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

      {/* Buyer-view panel — what the corporate compliance officer sees */}
      <BuyerViewPanel batch={batch} buyer={buyer} view={view} />

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

function BuyerViewPanel({ batch, buyer, view }) {
  // What a corporate compliance officer sees: regulatory coverage,
  // their own due-diligence file state, and the next required action.
  const eudr = batch.eudr_compliant;
  const mrl  = batch.mrl_compliant;
  const coverage = [
    { framework: 'EUDR',           label: 'Deforestation + origin', covered: eudr,  note: eudr ? 'All contributing orchards geo-verified.' : 'One contributing orchard geolocation missing. File cannot close.' },
    { framework: 'CSDDD',          label: 'Human rights + environment due diligence', covered: eudr, note: eudr ? 'Chain of custody auditable to source.' : 'Chain of custody breaks at unverified orchard. Required evidence absent.' },
    { framework: 'EU MRL',         label: 'Pesticide residue thresholds', covered: mrl, note: 'Lab result attested by ISO/IEC 17025 accredited party.' },
    { framework: 'Cold chain',     label: 'Product integrity', covered: batch.cold_chain_intact, note: batch.cold_chain_intact === null ? 'Batch not yet in cold chain.' : batch.cold_chain_intact ? 'Continuous sensor trace.' : 'Break in sensor trace.' },
  ];
  const canClose = coverage.every((c) => c.covered === true);
  const buyerStatusColor = canClose ? C.green : C.cuHi;

  return (
    <div style={{
      marginBottom: 28,
      padding: 24,
      background: C.s2,
      border: `1px solid ${C.s3}`,
      borderTop: `3px solid ${buyerStatusColor}`,
      borderRadius: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 10 }}>
        <div style={{
          fontFamily: FONT.mono, fontSize: 11, color: buyerStatusColor,
          letterSpacing: '.12em', fontWeight: 700,
        }}>
          BUYER VIEW · CORPORATE DUE-DILIGENCE FILE
        </div>
        <div style={{ fontFamily: FONT.mono, fontSize: 11, color: C.t4 }}>
          {view === 'architecture' ? `party:${buyer.id}` : buyer.name}
        </div>
      </div>
      <h2 style={{
        fontFamily: FONT.display, fontSize: 20, fontWeight: 800,
        color: C.t1, lineHeight: 1.3, marginBottom: 6,
      }}>
        {canClose
          ? 'Due-diligence file is complete for this batch.'
          : 'Due-diligence file is incomplete. Purchasing this batch exposes the buyer to regulatory liability.'}
      </h2>
      <p style={{
        fontFamily: FONT.body, fontSize: 13, color: C.t3,
        lineHeight: 1.6, margin: 0, marginBottom: 14, maxWidth: 720,
      }}>
        The corporate buyer is liable under EUDR and CSDDD for any claim they cannot substantiate with a reconcilable evidence chain. This panel is what their compliance officer sees when deciding whether to accept the batch into their supply chain.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 8, marginBottom: 12,
      }}>
        {coverage.map((c) => {
          const color = c.covered === true ? C.green : c.covered === false ? C.red : C.t4;
          const mark  = c.covered === true ? '✓' : c.covered === false ? '✕' : '—';
          return (
            <div key={c.framework} style={{
              padding: '10px 14px',
              background: C.base,
              border: `1px solid ${C.s3}`,
              borderLeft: `3px solid ${color}`,
              borderRadius: 4,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                <div style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 700, color: C.t1 }}>
                  {c.framework}
                </div>
                <div style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, color }}>
                  {mark}
                </div>
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.t3, lineHeight: 1.5 }}>
                {c.label}
              </div>
              <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.t4, marginTop: 3, lineHeight: 1.5 }}>
                {c.note}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '10px 14px',
        background: canClose ? C.eg : C.amberLt,
        border: `1px solid ${canClose ? C.egBr : C.cuMid}`,
        borderRadius: 4,
        fontFamily: FONT.body, fontSize: 13, color: C.t1,
        lineHeight: 1.55,
      }}>
        <strong>Recommended action:</strong>{' '}
        {canClose
          ? 'Accept batch. Evidence chain supports your due-diligence file end-to-end. Dossier hash is linked below as the audit artefact.'
          : 'Do not finalise purchase until the missing attestation is collected and the handshake closes. Alternatively, request the exporter escalate to the operator to close the gap.'}
      </div>
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
