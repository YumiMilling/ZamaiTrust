import { C, FONT } from '../theme';
import Profitability from '../components/Profitability';

export default function EconomicsPage() {
  return (
    <div>
      <div style={{
        fontFamily: FONT.mono, fontSize: 11, color: C.egHi,
        letterSpacing: '.12em', marginBottom: 10,
      }}>
        ECONOMICS · UNIT ECONOMICS · PATH TO BREAKEVEN
      </div>
      <h1 style={{
        fontFamily: FONT.display, fontSize: 34, fontWeight: 800,
        color: C.t1, lineHeight: 1.15, marginBottom: 14,
      }}>
        Profitability is the prerequisite for sustainability
      </h1>
      <p style={{
        fontFamily: FONT.body, fontSize: 16, color: C.t3,
        lineHeight: 1.7, maxWidth: 760, marginBottom: 10,
      }}>
        A trust layer for the real economy has to pay for itself, or the real economy will stop using it the moment donor money dries up. The numbers below are illustrative, but they are sized against real cost lines and real counterparties. They are here so the model can be argued with, not admired.
      </p>

      {/* Override the Profitability section wrapper styling by placing it in a plain container */}
      <div style={{ marginTop: 20 }}>
        <Profitability embedded />
      </div>
    </div>
  );
}
