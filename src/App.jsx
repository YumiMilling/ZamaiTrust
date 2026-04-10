import './styles.css';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Context from './components/Context';
import TwoRails from './components/TwoRails';
import BusinessModel from './components/BusinessModel';
import BuildSequence from './components/BuildSequence';
import TrustTiers from './components/TrustTiers';
import EntityMap from './components/EntityMap';
import AttestationFlow from './components/AttestationFlow';
import OfflineSync from './components/OfflineSync';
import DisputeResolution from './components/DisputeResolution';
import TrustScore from './components/TrustScore';
import FraudDetection from './components/FraudDetection';
import PortArchitecture from './components/PortArchitecture';
import Sources from './components/Sources';
import { C, FONT } from './theme';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <div className="divider" />
      <Context />
      <div className="divider" />
      <TwoRails />
      <div className="divider" />
      <BusinessModel />
      <div className="divider" />
      <BuildSequence />
      <div className="divider" />
      <TrustTiers />
      <div className="divider" />
      <EntityMap />
      <div className="divider" />
      <AttestationFlow />
      <div className="divider" />
      <OfflineSync />
      <div className="divider" />
      <DisputeResolution />
      <div className="divider" />
      <TrustScore />
      <div className="divider" />
      <FraudDetection />
      <div className="divider" />
      <PortArchitecture />
      <div className="divider" />
      <Sources />
      <div className="divider" />

      {/* Footer */}
      <footer style={{ padding: '55px 34px', textAlign: 'center', background: C.s1, borderTop: `1px solid ${C.s3}` }}>
        <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 800, color: C.egHi, marginBottom: 8 }}>
          Thiqa
        </div>
        <p style={{ fontFamily: FONT.body, fontSize: 15, color: C.t3, lineHeight: 1.75, maxWidth: 560, margin: '0 auto' }}>
          Trust infrastructure for the real economy. Soya is the worked example because soya is EUDR-captured and rotates with maize — the mechanism is domain-agnostic.
          <br/>Designed in Batoka, built by ZamAi Solutions.
        </p>
        <p style={{ fontFamily: FONT.mono, fontSize: 12, color: C.t4, marginTop: 21 }}>
          Concept Note v2.2 — April 2026
        </p>
      </footer>
    </>
  );
}
