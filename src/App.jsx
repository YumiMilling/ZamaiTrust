import './styles.css';
import Nav from './components/Nav';
import Hero from './components/Hero';
import EntityMap from './components/EntityMap';
import AttestationFlow from './components/AttestationFlow';
import TrustScore from './components/TrustScore';
import FraudDetection from './components/FraudDetection';
import PortArchitecture from './components/PortArchitecture';
import { C, FONT } from './theme';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <div className="divider" />
      <EntityMap />
      <div className="divider" />
      <AttestationFlow />
      <div className="divider" />
      <TrustScore />
      <div className="divider" />
      <FraudDetection />
      <div className="divider" />
      <PortArchitecture />
      <div className="divider" />

      {/* Footer */}
      <footer style={{ padding: '55px 34px', textAlign: 'center', background: C.base }}>
        <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 800, color: C.t1, marginBottom: 8 }}>
          Thiqa
        </div>
        <p style={{ fontFamily: FONT.body, fontSize: 13, color: C.t4, lineHeight: 1.75, maxWidth: 500, margin: '0 auto' }}>
          Trust infrastructure for the informal economy. Designed in Lusaka, built by ZamAi Solutions.
          <br/>Spec: AGPL (code) · CC BY-SA (design)
        </p>
        <p style={{ fontFamily: FONT.mono, fontSize: 11, color: C.s4, marginTop: 21 }}>
          v0.3 — Architecture Visualizer
        </p>
      </footer>
    </>
  );
}
