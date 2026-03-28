// Trust Infrastructure Diagrams — ZamAi Solutions
// Self-contained SVG components for React
// All colors from ZamAi brand system, no external dependencies

const C = {
  base: '#0C0B0A', s1: '#161412', s2: '#1F1D1B', s3: '#282523', s4: '#333030',
  eg: '#073233', egMid: '#0A4A4B', egBr: '#0F7274', egVi: '#14A0A3', egHi: '#19C8CC',
  cu: '#A86B2A', cuMid: '#C47E3A', cuLt: '#D99550', cuHi: '#E8AE68',
  t1: '#F2EDE6', t2: '#C5BFB8', t3: '#8A8480', t4: '#5A5652',
  green: '#1D9E75', greenLt: '#E1F5EE', greenDk: '#085041',
  red: '#A32D2D', redLt: '#FCEBEB', redFill: '#501313',
  purple: '#534AB7', purpleLt: '#EEEDFE',
  pink: '#993556', pinkLt: '#FBEAF0',
  coral: '#D85A30', coralLt: '#FAECE7',
  amber: '#BA7517', amberLt: '#FAEEDA',
  teal: '#0F6E56', tealLt: '#E1F5EE', tealFill: '#5DCAA5',
};

// Shared styles
const font = "'DM Sans', 'Helvetica Neue', sans-serif";
const fontDisplay = "'Syne', 'Helvetica Neue', sans-serif";

const TH = ({ x, y, anchor = 'middle', children }) => (
  <text x={x} y={y} textAnchor={anchor} dominantBaseline="central"
    style={{ fontFamily: fontDisplay, fontSize: 14, fontWeight: 700, fill: C.t1 }}>
    {children}
  </text>
);

const TS = ({ x, y, anchor = 'middle', children, fill }) => (
  <text x={x} y={y} textAnchor={anchor} dominantBaseline="central"
    style={{ fontFamily: font, fontSize: 12, fontWeight: 400, fill: fill || C.t3 }}>
    {children}
  </text>
);

const Arrow = () => (
  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </marker>
);

const Box = ({ x, y, w, h = 56, fill, stroke, rx = 8, children }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth="0.5"/>
    {children}
  </g>
);

// ═══════════════════════════════════════════════
// DIAGRAM 1: Core Value Chain Loop + Payment Waterfall
// ═══════════════════════════════════════════════

export function CoreLoop() {
  return (
    <svg width="100%" viewBox="0 0 680 520" style={{ background: 'transparent' }}>
      <defs><Arrow/></defs>

      <TH x={340} y={30}>The closed loop — grain flows right, money flows left</TH>

      {/* Main participants */}
      <Box x={40} y={60} w={120} fill={C.tealLt} stroke={C.teal}>
        <TH x={100} y={80}>Input supplier</TH>
        <TS x={100} y={98}>Seed, fertiliser</TS>
      </Box>
      <Box x={200} y={60} w={120} fill={C.greenLt} stroke={C.green}>
        <TH x={260} y={80}>3A cluster</TH>
        <TS x={260} y={98}>Farmer group</TS>
      </Box>
      <Box x={360} y={60} w={120} fill={C.amberLt} stroke={C.amber}>
        <TH x={420} y={80}>Warehouse</TH>
        <TS x={420} y={98}>Verify + store</TS>
      </Box>
      <Box x={520} y={60} w={120} fill={C.coralLt} stroke={C.coral}>
        <TH x={580} y={80}>Processor</TH>
        <TS x={580} y={98}>Mill + export</TS>
      </Box>

      {/* Grain arrows (right) */}
      <line x1="162" y1="78" x2="198" y2="78" stroke={C.green} strokeWidth="1.5" markerEnd="url(#arr)"/>
      <line x1="322" y1="78" x2="358" y2="78" stroke={C.green} strokeWidth="1.5" markerEnd="url(#arr)"/>
      <line x1="482" y1="78" x2="518" y2="78" stroke={C.green} strokeWidth="1.5" markerEnd="url(#arr)"/>
      <TS x={180} y={68} fill={C.green}>Inputs</TS>
      <TS x={340} y={68} fill={C.green}>Grain</TS>
      <TS x={500} y={68} fill={C.green}>Grain</TS>

      {/* Money arrows (left) */}
      <line x1="518" y1="100" x2="482" y2="100" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arr)"/>
      <line x1="358" y1="100" x2="322" y2="100" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arr)"/>
      <line x1="198" y1="100" x2="162" y2="100" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arr)"/>

      {/* Divider */}
      <line x1="40" y1="150" x2="640" y2="150" stroke={C.s4} strokeWidth="0.5"/>
      <TS x={340} y={172}>Payment waterfall — triggered on verified delivery</TS>

      {/* Waterfall */}
      <Box x={40} y={190} w={600} h={44} fill={C.s2} stroke={C.s4}>
        <TH x={60} y={212} anchor="start">Processor pays forward contract price into the system</TH>
      </Box>
      <line x1="340" y1="236" x2="340" y2="256" stroke={C.t3} strokeWidth="1" markerEnd="url(#arr)"/>

      <Box x={40} y={258} w={290} h={40} fill={C.amberLt} stroke={C.amber}>
        <TH x={55} y={278} anchor="start">1. Warehouse fee</TH>
        <TS x={195} y={278}>~2% custody</TS>
      </Box>
      <Box x={350} y={258} w={290} h={40} fill={C.amberLt} stroke={C.amber}>
        <TH x={365} y={278} anchor="start">2. Input repayment</TH>
        <TS x={520} y={278}>Full advance</TS>
      </Box>

      <line x1="340" y1="300" x2="340" y2="316" stroke={C.t3} strokeWidth="1" markerEnd="url(#arr)"/>

      <Box x={40} y={318} w={290} h={40} fill={C.amberLt} stroke={C.amber}>
        <TH x={55} y={338} anchor="start">3. Insurance premium</TH>
        <TS x={215} y={338}>Farmer share</TS>
      </Box>
      <Box x={350} y={318} w={290} h={40} fill={C.amberLt} stroke={C.amber}>
        <TH x={365} y={338} anchor="start">4. Platform fee</TH>
        <TS x={502} y={338}>~1.5%</TS>
      </Box>

      <line x1="340" y1="360" x2="340" y2="376" stroke={C.t3} strokeWidth="1" markerEnd="url(#arr)"/>

      <Box x={120} y={378} w={440} h={48} fill={C.greenLt} stroke={C.green}>
        <TH x={340} y={402}>5. Farmer net income → mobile money</TH>
      </Box>

      {/* Insurance wrapper */}
      <line x1="40" y1="450" x2="640" y2="450" stroke={C.s4} strokeWidth="0.5"/>
      <TS x={340} y={472}>Insurance wraps the entire loop — pays out on crop failure</TS>
      <Box x={160} y={484} w={360} h={36} fill={C.pinkLt} stroke={C.pink}>
        <TH x={340} y={502}>Insurer underwrites forward commitments</TH>
      </Box>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// DIAGRAM 2: Forward Contract Lifecycle
// ═══════════════════════════════════════════════

export function ForwardLifecycle() {
  return (
    <svg width="100%" viewBox="0 0 680 380" style={{ background: 'transparent' }}>
      <defs><Arrow/></defs>

      <TH x={340} y={28}>Forward contract lifecycle — one season, five attestations</TH>

      {/* Step 1 */}
      <Box x={40} y={60} w={112} h={72} fill={C.tealLt} stroke={C.teal}>
        <TH x={96} y={82}>March</TH>
        <TS x={96} y={100}>Processor posts</TS>
        <TS x={96} y={114}>forward contract</TS>
      </Box>
      <line x1="154" y1="96" x2="176" y2="96" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>

      {/* Step 2 */}
      <Box x={178} y={60} w={112} h={72} fill={C.greenLt} stroke={C.green}>
        <TH x={234} y={82}>March</TH>
        <TS x={234} y={100}>Inputs advanced</TS>
        <TS x={234} y={114}>to 3A clusters</TS>
      </Box>
      <line x1="292" y1="96" x2="314" y2="96" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>

      {/* Step 3 */}
      <Box x={316} y={60} w={112} h={72} fill={C.pinkLt} stroke={C.pink}>
        <TH x={372} y={82}>April</TH>
        <TS x={372} y={100}>Insurance binds</TS>
        <TS x={372} y={114}>commitment</TS>
      </Box>
      <line x1="430" y1="96" x2="452" y2="96" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>

      {/* Step 4 */}
      <Box x={454} y={60} w={112} h={72} fill={C.coralLt} stroke={C.coral}>
        <TH x={510} y={82}>July</TH>
        <TS x={510} y={100}>Grain delivered</TS>
        <TS x={510} y={114}>dual-signed</TS>
      </Box>
      <line x1="510" y1="134" x2="510" y2="156" stroke={C.amber} strokeWidth="1" markerEnd="url(#arr)"/>

      {/* Step 5 */}
      <Box x={454} y={158} w={112} fill={C.purpleLt} stroke={C.purple}>
        <TH x={510} y={178}>August</TH>
        <TS x={510} y={196}>Waterfall settles</TS>
      </Box>

      {/* Divider */}
      <line x1="40" y1="240" x2="640" y2="240" stroke={C.s4} strokeWidth="0.5"/>
      <TS x={340} y={262}>Each step generates a signed, hashed attestation</TS>

      {/* Attestation labels */}
      <Box x={40} y={276} w={112} h={32} fill={C.s2} stroke={C.s4} rx={4}>
        <TS x={96} y={292}>forward-committed</TS>
      </Box>
      <Box x={164} y={276} w={100} h={32} fill={C.s2} stroke={C.s4} rx={4}>
        <TS x={214} y={292}>input-advanced</TS>
      </Box>
      <Box x={276} y={276} w={108} h={32} fill={C.s2} stroke={C.s4} rx={4}>
        <TS x={330} y={292}>insurance-bound</TS>
      </Box>
      <Box x={396} y={276} w={112} h={32} fill={C.s2} stroke={C.s4} rx={4}>
        <TS x={452} y={292}>delivery-verified</TS>
      </Box>
      <Box x={520} y={276} w={112} h={32} fill={C.s2} stroke={C.s4} rx={4}>
        <TS x={576} y={292}>payment-settled</TS>
      </Box>

      {/* Leader lines */}
      <line x1="96" y1="134" x2="96" y2="274" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>
      <line x1="234" y1="134" x2="214" y2="274" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>
      <line x1="372" y1="134" x2="330" y2="274" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>
      <line x1="510" y1="134" x2="452" y2="274" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>
      <line x1="510" y1="216" x2="576" y2="274" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>

      {/* Root */}
      <TS x={340} y={332}>All five hashed into Merkle tree → one root published daily</TS>
      <Box x={240} y={346} w={200} h={28} fill={C.tealLt} stroke={C.teal} rx={6}>
        <TH x={340} y={360}>Root: 7a3f...c912</TH>
      </Box>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// DIAGRAM 3: Dual Signature Verification
// ═══════════════════════════════════════════════

export function DualSignature() {
  return (
    <svg width="100%" viewBox="0 0 680 460" style={{ background: 'transparent' }}>
      <defs><Arrow/></defs>

      <TH x={340} y={28}>Dual-signature verification — anti-corruption by design</TH>
      <TS x={340} y={48}>Neither party can create or alter a record alone</TS>

      {/* Farmer */}
      <Box x={60} y={72} w={160} fill={C.greenLt} stroke={C.green}>
        <TH x={140} y={92}>Farmer</TH>
        <TS x={140} y={110}>Signs: "I delivered 2,000 kg"</TS>
      </Box>

      {/* Depot */}
      <Box x={460} y={72} w={160} fill={C.amberLt} stroke={C.amber}>
        <TH x={540} y={92}>Depot operator</TH>
        <TS x={540} y={110}>Signs: "I received 2,000 kg"</TS>
      </Box>

      {/* Converge arrows */}
      <line x1="222" y1="100" x2="278" y2="155" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)" fill="none"/>
      <line x1="458" y1="100" x2="402" y2="155" stroke={C.amber} strokeWidth="1" markerEnd="url(#arr)" fill="none"/>

      {/* Central attestation */}
      <Box x={220} y={155} w={240} fill={C.tealLt} stroke={C.teal}>
        <TH x={340} y={175}>Attestation created</TH>
        <TS x={340} y={195}>2,000 kg · grade A · 11.8% moisture</TS>
      </Box>

      <TS x={340} y={234}>Do both signatures agree on quantity and grade?</TS>

      {/* Split */}
      <line x1="220" y1="240" x2="140" y2="270" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)" fill="none"/>
      <line x1="460" y1="240" x2="540" y2="270" stroke={C.red} strokeWidth="1" markerEnd="url(#arr)" fill="none"/>

      {/* LEFT: Agreement */}
      <Box x={40} y={272} w={200} h={40} fill={C.greenLt} stroke={C.green}>
        <TH x={140} y={292}>Yes — both agree</TH>
      </Box>
      <line x1="140" y1="314" x2="140" y2="336" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={40} y={338} w={200} h={48} fill={C.tealLt} stroke={C.teal}>
        <TH x={140} y={354}>Attestation confirmed</TH>
        <TS x={140} y={372}>Hashed into Merkle tree</TS>
      </Box>
      <line x1="140" y1="388" x2="140" y2="410" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={40} y={412} w={200} h={36} fill={C.s2} stroke={C.s4}>
        <TH x={140} y={430}>Payment waterfall triggers</TH>
      </Box>

      {/* RIGHT: Disagreement */}
      <Box x={440} y={272} w={200} h={40} fill={C.redLt} stroke={C.red}>
        <TH x={540} y={292}>No — they disagree</TH>
      </Box>
      <line x1="540" y1="314" x2="540" y2="336" stroke={C.red} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={440} y={338} w={200} h={48} fill={C.coralLt} stroke={C.coral}>
        <TH x={540} y={354}>Both claims recorded</TH>
        <TS x={540} y={372}>Farmer says X, depot says Y</TS>
      </Box>
      <line x1="540" y1="388" x2="540" y2="410" stroke={C.red} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={440} y={412} w={200} h={36} fill={C.s2} stroke={C.s4}>
        <TH x={540} y={430}>Flagged for arbitration</TH>
      </Box>

      {/* Center note */}
      <rect x="258" y="324" width="164" height="48" rx="6" fill="none" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>
      <TS x={340} y={344}>No record can be</TS>
      <TS x={340} y={360}>altered after signing</TS>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// DIAGRAM 4: Insurance Flow
// ═══════════════════════════════════════════════

export function InsuranceFlow() {
  return (
    <svg width="100%" viewBox="0 0 680 440" style={{ background: 'transparent' }}>
      <defs><Arrow/></defs>

      <TH x={340} y={28}>Insurance flow — good season vs bad season</TH>

      {/* Starting point */}
      <Box x={240} y={52} w={200} h={48} fill={C.tealLt} stroke={C.teal}>
        <TH x={340} y={70}>Forward committed</TH>
        <TS x={340} y={86}>200t, grade A, K8,200/t, insured</TS>
      </Box>

      {/* Split */}
      <line x1="260" y1="102" x2="140" y2="140" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)" fill="none"/>
      <line x1="420" y1="102" x2="540" y2="140" stroke={C.red} strokeWidth="1" markerEnd="url(#arr)" fill="none"/>

      <Box x={60} y={142} w={160} h={40} fill={C.greenLt} stroke={C.green}>
        <TH x={140} y={162}>Good season</TH>
      </Box>
      <Box x={460} y={142} w={160} h={40} fill={C.redLt} stroke={C.red}>
        <TH x={540} y={162}>Drought / failure</TH>
      </Box>

      {/* Good path */}
      <line x1="140" y1="184" x2="140" y2="210" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={52} y={212} w={176} h={48} fill={C.greenLt} stroke={C.green}>
        <TH x={140} y={228}>200t delivered</TH>
        <TS x={140} y={246}>Dual-signed at depot</TS>
      </Box>
      <line x1="140" y1="262" x2="140" y2="286" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={40} y={288} w={200} h={48} fill={C.tealLt} stroke={C.teal}>
        <TH x={140} y={304}>Waterfall executes</TH>
        <TS x={140} y={322}>Warehouse → supplier → farmer</TS>
      </Box>
      <line x1="140" y1="338" x2="140" y2="362" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={40} y={364} w={200} fill={C.s2} stroke={C.s4}>
        <TH x={140} y={384}>Everyone whole</TH>
        <TS x={140} y={402}>Input supplier repaid</TS>
      </Box>

      {/* Bad path */}
      <line x1="540" y1="184" x2="540" y2="210" stroke={C.red} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={452} y={212} w={176} h={48} fill={C.redLt} stroke={C.red}>
        <TH x={540} y={228}>Only 60t delivered</TH>
        <TS x={540} y={246}>70% shortfall verified</TS>
      </Box>
      <line x1="540" y1="262" x2="540" y2="286" stroke={C.red} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={440} y={288} w={200} h={48} fill={C.pinkLt} stroke={C.pink}>
        <TH x={540} y={304}>Insurance triggers</TH>
        <TS x={540} y={322}>Weather index / satellite</TS>
      </Box>
      <line x1="540" y1="338" x2="540" y2="362" stroke={C.red} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={440} y={364} w={200} fill={C.s2} stroke={C.s4}>
        <TH x={540} y={384}>Payout routed</TH>
        <TS x={540} y={402}>60% supplier · 30% proc · 10% farmer</TS>
      </Box>

      {/* Center note */}
      <rect x="258" y="240" width="164" height="56" rx="6" fill="none" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>
      <TS x={340} y={262}>Same attestation</TS>
      <TS x={340} y={278}>system in both paths</TS>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// DIAGRAM 5: International Capital Flow (Phase 3)
// ═══════════════════════════════════════════════

export function InternationalCapital() {
  return (
    <svg width="100%" viewBox="0 0 680 500" style={{ background: 'transparent' }}>
      <defs><Arrow/></defs>

      <TH x={340} y={28}>Phase 3 — international capital finances planting season</TH>
      <TS x={340} y={48}>Requires regulatory framework from BoZ / SEC — not legal today</TS>

      {/* Left: International */}
      <rect x="40" y="70" width="240" height="380" rx="12" fill="none" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>
      <TS x={160} y={90}>International layer</TS>

      {/* Right: Zambia */}
      <rect x="320" y="70" width="320" height="380" rx="12" fill="none" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>
      <TS x={480} y={90}>Zambia (domestic, Kwacha)</TS>

      {/* Step 1 */}
      <Box x={60} y={110} w={200} h={48} fill={C.purpleLt} stroke={C.purple}>
        <TH x={160} y={128}>Investor buys token</TH>
        <TS x={160} y={146}>$10,000 USDC on Ethereum</TS>
      </Box>

      <line x1="262" y1="134" x2="338" y2="134" stroke={C.purple} strokeWidth="1.5" markerEnd="url(#arr)"/>
      <TS x={300} y={124}>FX</TS>

      {/* Step 2 */}
      <Box x={340} y={110} w={280} h={48} fill={C.tealLt} stroke={C.teal}>
        <TH x={480} y={128}>K190,000 enters system</TH>
        <TS x={480} y={146}>Via licensed forex channel</TS>
      </Box>

      {/* Step 3 */}
      <line x1="480" y1="160" x2="480" y2="186" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={340} y={188} w={280} h={48} fill={C.greenLt} stroke={C.green}>
        <TH x={480} y={206}>Inputs flow to 3A clusters</TH>
        <TS x={480} y={224}>Seed + fertiliser for planting</TS>
      </Box>

      {/* Step 4 */}
      <line x1="480" y1="238" x2="480" y2="264" stroke={C.green} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={340} y={266} w={280} h={48} fill={C.amberLt} stroke={C.amber}>
        <TH x={480} y={284}>6 months: grain delivered</TH>
        <TS x={480} y={302}>Verified, graded, stored, insured</TS>
      </Box>

      {/* Step 5 */}
      <line x1="480" y1="316" x2="480" y2="342" stroke={C.amber} strokeWidth="1" markerEnd="url(#arr)"/>
      <Box x={340} y={344} w={280} h={48} fill={C.coralLt} stroke={C.coral}>
        <TH x={480} y={362}>Processed + sold</TH>
        <TS x={480} y={380}>Domestic + DRC/Angola export</TS>
      </Box>

      {/* Return arrow */}
      <line x1="338" y1="368" x2="262" y2="368" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arr)"/>
      <TS x={300} y={358}>FX</TS>

      {/* Step 6 */}
      <Box x={60} y={344} w={200} h={48} fill={C.purpleLt} stroke={C.purple}>
        <TH x={160} y={362}>$12,500 returned</TH>
        <TS x={160} y={380}>25% yield, 6-month cycle</TS>
      </Box>

      {/* Waiting line */}
      <line x1="160" y1="160" x2="160" y2="342" stroke={C.t4} strokeWidth="0.5" strokeDasharray="4 4"/>
      <TS x={160} y={230}>Investor waits</TS>
      <TS x={160} y={248}>6 months</TS>

      {/* Footer */}
      <line x1="40" y1="460" x2="640" y2="460" stroke={C.s4} strokeWidth="0.5"/>
      <TS x={340} y={486}>The grain never leaves Zambia. The money circles. The food stays.</TS>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// DIAGRAM 6: Three-Layer Architecture
// ═══════════════════════════════════════════════

export function ThreeLayerArchitecture() {
  return (
    <svg width="100%" viewBox="0 0 680 480" style={{ background: 'transparent' }}>
      <defs><Arrow/></defs>

      <TH x={340} y={28}>Three-layer architecture</TH>
      <TS x={340} y={48}>Truth doesn't care about currency. Local rules don't care about other jurisdictions.</TS>

      {/* Layer 2: Edge */}
      <rect x="40" y="72" width="600" height="120" rx="12" fill={C.s2} stroke={C.s4} strokeWidth="0.5"/>
      <TH x={60} y={96} anchor="start">Layer 2 — the edge (devices)</TH>

      <Box x={60} y={110} w={110} h={64} fill={C.greenLt} stroke={C.green} rx={6}>
        <TH x={115} y={130}>Farmer</TH>
        <TS x={115} y={148}>USSD / SMS</TS>
        <TS x={115} y={162}>No smartphone</TS>
      </Box>
      <Box x={186} y={110} w={110} h={64} fill={C.tealLt} stroke={C.teal} rx={6}>
        <TH x={241} y={130}>Cluster</TH>
        <TS x={241} y={148}>SMS + Web</TS>
        <TS x={241} y={162}>Aggregator</TS>
      </Box>
      <Box x={312} y={110} w={110} h={64} fill={C.amberLt} stroke={C.amber} rx={6}>
        <TH x={367} y={130}>Depot</TH>
        <TS x={367} y={148}>Android app</TS>
        <TS x={367} y={162}>GPS + camera</TS>
      </Box>
      <Box x={438} y={110} w={110} h={64} fill={C.coralLt} stroke={C.coral} rx={6}>
        <TH x={493} y={130}>Processor</TH>
        <TS x={493} y={148}>Web dashboard</TS>
        <TS x={493} y={162}>Forwards + pay</TS>
      </Box>
      <Box x={564} y={110} w={60} h={64} fill={C.pinkLt} stroke={C.pink} rx={6}>
        <TH x={594} y={138}>Gov</TH>
        <TS x={594} y={158}>Dashboard</TS>
      </Box>

      {/* Arrow L2 → L1 */}
      <line x1="340" y1="194" x2="340" y2="218" stroke={C.t3} strokeWidth="1" markerEnd="url(#arr)"/>

      {/* Layer 1: Local rules */}
      <rect x="40" y="220" width="600" height="100" rx="12" fill={C.amberLt} stroke={C.amber} strokeWidth="0.5"/>
      <TH x={60} y={244} anchor="start">Layer 1 — local rules (jurisdiction)</TH>

      <Box x={60} y={258} w={170} h={48} fill={C.tealLt} stroke={C.teal} rx={6}>
        <TH x={145} y={274}>Zambia</TH>
        <TS x={145} y={292}>ZMW · BoZ rules · MoA permits</TS>
      </Box>
      <Box x={246} y={258} w={170} h={48} fill={C.coralLt} stroke={C.coral} rx={6}>
        <TH x={331} y={274}>DRC</TH>
        <TS x={331} y={292}>CDF · Katanga trade rules</TS>
      </Box>
      <Box x={432} y={258} w={190} h={48} fill={C.purpleLt} stroke={C.purple} rx={6}>
        <TH x={527} y={274}>Angola</TH>
        <TS x={527} y={292}>AOA · Lobito Corridor</TS>
      </Box>

      {/* Arrow L1 → L0 */}
      <line x1="340" y1="322" x2="340" y2="348" stroke={C.t3} strokeWidth="1" markerEnd="url(#arr)"/>

      {/* Layer 0: Truth */}
      <rect x="40" y="350" width="600" height="110" rx="12" fill={C.tealLt} stroke={C.teal} strokeWidth="0.5"/>
      <TH x={60} y={374} anchor="start">Layer 0 — the truth (shared ledger)</TH>

      <Box x={60} y={390} w={150} h={48} fill={C.s2} stroke={C.s4} rx={6}>
        <TH x={135} y={406}>All attestations</TH>
        <TS x={135} y={424}>Signed, immutable</TS>
      </Box>
      <Box x={226} y={390} w={150} h={48} fill={C.s2} stroke={C.s4} rx={6}>
        <TH x={301} y={406}>Merkle roots</TH>
        <TS x={301} y={424}>Published daily</TS>
      </Box>
      <Box x={392} y={390} w={230} h={48} fill={C.s2} stroke={C.s4} rx={6}>
        <TH x={507} y={406}>Not a blockchain</TH>
        <TS x={507} y={424}>Replicated DB + crypto proofs</TS>
      </Box>
    </svg>
  );
}
