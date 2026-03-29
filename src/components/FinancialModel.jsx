import { useState, useMemo } from 'react'

const C = {
  base: '#0C0B0A', s1: '#161412', s2: '#1F1D1B', s3: '#282523', s4: '#333030',
  eg: '#073233', egMid: '#0A4A4B', egBr: '#0F7274', egVi: '#14A0A3', egHi: '#19C8CC',
  cu: '#A86B2A', cuMid: '#C47E3A', cuLt: '#D99550', cuHi: '#E8AE68',
  t1: '#F2EDE6', t2: '#C5BFB8', t3: '#8A8480', t4: '#5A5652',
  red: '#EF5350', green: '#4CAF50',
}

function fmt(n) { return Math.round(n).toLocaleString() }
function fK(n) { return 'K' + fmt(n) }
function fU(n) { return '$' + fmt(n) }

function Slider({ label, value, onChange, min, max, step = 1, unit = '', desc }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: C.t1 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: C.egHi }}>{fmt(value)}{unit}</span>
      </div>
      {desc && <div style={{ fontSize: 10, color: C.t4, marginBottom: 5, lineHeight: '1.4' }}>{desc}</div>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={ev => onChange(Number(ev.target.value))}
        style={{ width: '100%', accentColor: C.egVi }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: C.t4, marginTop: 1 }}>
        <span>{fmt(min)}{unit}</span>
        <span>{fmt(max)}{unit}</span>
      </div>
    </div>
  )
}

function Row({ label, value, color = C.t2, bold = false, indent = false, border = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: border ? '1px solid ' + C.s3 : 'none', paddingLeft: indent ? 14 : 0 }}>
      <span style={{ fontSize: 12, color: indent ? C.t3 : C.t2, fontWeight: bold ? 500 : 300 }}>{label}</span>
      <span style={{ fontSize: 12, color, fontWeight: bold ? 500 : 300 }}>{value}</span>
    </div>
  )
}

function ModelSection({ title, accent = C.egMid, children }) {
  return (
    <div style={{ background: C.s2, padding: '16px 20px', marginBottom: 3, borderTop: '2px solid ' + accent }}>
      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: C.cuLt, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

const defaults = { cl: 50, fpc: 25, hpf: 2, yph: 2.5, ic: 4500, dp: 6400, xp: 10500, pm: 2200, ip: 3, wp: 2, tw: 350, tx: 1200, er: 19, ds: 40, xs: 50, fp: 5800, fc: 2.5, cf: 10 }

const scenarios = [
  { label: 'Baseline', desc: 'Default assumptions', values: {} },
  { label: 'Drought', desc: 'Crop failure → 30%', values: { cf: 30 } },
  { label: 'Price crash', desc: 'Domestic → K4,500', values: { dp: 4500 } },
  { label: 'Kwacha shock', desc: 'FX → 28 ZMW/USD', values: { er: 28 } },
  { label: 'Export ban', desc: '100% domestic', values: { ds: 90, xs: 0 } },
  { label: 'Perfect season', desc: 'High yield, good prices', values: { yph: 4, cf: 0, dp: 8000, xp: 13000 } },
  { label: 'Worst case', desc: 'Drought + price crash + FX', values: { cf: 30, dp: 4500, er: 28 } },
  { label: 'Phase 1 pilot', desc: '10 clusters, domestic only', values: { cl: 10, ds: 90, xs: 0, cf: 5 } },
]

export default function FinancialModel() {
  const [cl, sCl] = useState(defaults.cl)
  const [fpc, sFpc] = useState(defaults.fpc)
  const [hpf, sHpf] = useState(defaults.hpf)
  const [yph, sYph] = useState(defaults.yph)
  const [ic, sIc] = useState(defaults.ic)
  const [dp, sDp] = useState(defaults.dp)
  const [xp, sXp] = useState(defaults.xp)
  const [pm, sPm] = useState(defaults.pm)
  const [ip, sIp] = useState(defaults.ip)
  const [wp, sWp] = useState(defaults.wp)
  const [tw, sTw] = useState(defaults.tw)
  const [tx, sTx] = useState(defaults.tx)
  const [er, sEr] = useState(defaults.er)
  const [ds, sDs] = useState(defaults.ds)
  const [xs, sXs] = useState(defaults.xs)
  const [fp, sFp] = useState(defaults.fp)
  const [fc, sFc] = useState(defaults.fc)
  const [cf, sCf] = useState(defaults.cf)
  const [active, setActive] = useState(new Set())

  function applyValues(v) {
    sCl(v.cl); sFpc(v.fpc); sHpf(v.hpf); sYph(v.yph); sIc(v.ic)
    sDp(v.dp); sXp(v.xp); sPm(v.pm); sIp(v.ip); sWp(v.wp)
    sTw(v.tw); sTx(v.tx); sEr(v.er); sDs(v.ds); sXs(v.xs)
    sFp(v.fp); sFc(v.fc); sCf(v.cf)
  }

  function toggleScenario(s) {
    if (s.label === 'Baseline') {
      setActive(new Set())
      applyValues(defaults)
      return
    }
    const next = new Set(active)
    if (next.has(s.label)) {
      next.delete(s.label)
    } else {
      next.add(s.label)
    }
    setActive(next)
    // Merge: start from defaults, layer each active scenario on top
    let merged = { ...defaults }
    scenarios.forEach(sc => {
      if (next.has(sc.label)) merged = { ...merged, ...sc.values }
    })
    applyValues(merged)
  }

  // Normalise splits: domestic + export + FRA = 100%
  const fraShare = Math.max(0, 100 - ds - xs)
  const m = useMemo(() => {
    const fra = Math.max(0, 100 - ds - xs)
    const tf = cl * fpc, th = tf * hpf, ey = th * yph, ay = ey * (1 - cf / 100), fy = ey - ay
    const dt = ay * (ds / 100), xt = ay * (xs / 100), ft_fra = ay * (fra / 100)
    const tic = th * ic
    // Revenue per channel
    const dr = dt * dp, xr = xt * (xp + pm), fr = ft_fra * fp, tr = dr + xr + fr
    const ipo = fy * dp * 0.7
    // Costs
    const ins = tr * (ip / 100), wc = ay * dp * (wp / 100), ttw = ay * tw, ttx = xt * tx
    const finCost = tr * (fc / 100)
    const tc = tic + ins + wc + ttw + ttx + finCost
    const gm = tr + ipo - tc
    const bp = ay > 0 ? tr / ay : 0
    // Per farmer
    const fg = tf > 0 ? (ay / tf) * ((dp * ds / 100) + ((xp + pm) * xs / 100) + (fp * fra / 100)) : 0
    const fic = hpf * ic, ftr = tf > 0 ? (ay / tf) * tw : 0, fi = fg * (ip / 100), fw = fg * (wp / 100), ffc = fg * (fc / 100)
    const fn = fg - fic - ftr - fi - fw - ffc
    const ivc = tic, ivU = tic / er, ivR = gm * 0.15, ivRU = ivR / er, ivY = tic > 0 ? (ivR / tic) * 100 : 0
    return { tf, th, ey, ay, fy, dt, xt, ft_fra, tic, ins, wc, ttw, ttx, finCost, tc, dr, xr, fr, tr, ipo, gm, bp, fg, fic, ftr, fi, fw, ffc, fn, ivc, ivU, ivR, ivRU, ivY }
  }, [cl, fpc, hpf, yph, ic, dp, xp, pm, ip, wp, tw, tx, er, ds, xs, fp, fc, cf])

  const pos = m.gm > 0

  return (
    <div style={{ padding: '34px 0', background: 'var(--base)' }}>
      <div id="financial-model">
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {/* LEFT: Inputs */}
            <div>
              <ModelSection title="Scale">
                <Slider label="3A Clusters" value={cl} onChange={sCl} min={5} max={200} />
                <Slider label="Farmers / cluster" value={fpc} onChange={sFpc} min={10} max={50} />
                <Slider label="Hectares / farmer" value={hpf} onChange={sHpf} min={0.5} max={5} step={0.5} unit=" ha" />
                <Slider label="Yield / hectare" value={yph} onChange={sYph} min={1} max={5} step={0.5} unit=" t/ha" desc="Zambia avg: 2-3 t/ha" />
              </ModelSection>
              <ModelSection title="Prices" accent={C.cu}>
                <Slider label="Domestic price" value={dp} onChange={sDp} min={4000} max={12000} step={100} unit=" K/t" desc="Lusaka spot: ~K6,400" />
                <Slider label="DRC export price" value={xp} onChange={sXp} min={6000} max={16000} step={100} unit=" K/t" desc="Katanga: ~K10,500-13,000" />
                <Slider label="Processing margin" value={pm} onChange={sPm} min={500} max={4000} step={100} unit=" K/t" />
                <Slider label="FRA gazetted price" value={fp} onChange={sFp} min={4000} max={9000} step={100} unit=" K/t" desc="Govt. strategic reserve price" />
              </ModelSection>
              <ModelSection title="Channel Split" accent={C.cuMid}>
                <Slider label="Domestic" value={ds} onChange={v => { sDs(v); if (v + xs > 100) sXs(100 - v) }} min={0} max={100} step={5} unit="%" />
                <Slider label="Export (processed)" value={xs} onChange={v => { sXs(v); if (ds + v > 100) sDs(100 - v) }} min={0} max={100} step={5} unit="%" />
                <div style={{ fontSize: 11, color: fraShare > 0 ? C.cuHi : C.t4, marginTop: 4 }}>
                  FRA reserve: {fraShare}% {fraShare > 0 ? `(${fmt(Math.round(m.ft_fra))} t at ${fK(fp)}/t)` : ''}
                </div>
              </ModelSection>
              <ModelSection title="Costs" accent={C.s4}>
                <Slider label="Input cost / ha" value={ic} onChange={sIc} min={2000} max={8000} step={100} unit=" K" />
                <Slider label="Insurance" value={ip} onChange={sIp} min={1} max={8} step={0.5} unit="%" />
                <Slider label="Warehouse" value={wp} onChange={sWp} min={1} max={5} step={0.5} unit="%" />
                <Slider label="Transport → warehouse" value={tw} onChange={sTw} min={100} max={800} step={50} unit=" K/t" />
                <Slider label="Cross-border transport" value={tx} onChange={sTx} min={500} max={3000} step={100} unit=" K/t" />
                <Slider label="Financing cost" value={fc} onChange={sFc} min={0} max={6} step={0.5} unit="%" desc="Warehouse receipt financing (~2-3% for 60-90 days)" />
              </ModelSection>
              <ModelSection title="Risk & FX" accent={C.red}>
                <Slider label="Crop failure" value={cf} onChange={sCf} min={0} max={40} step={5} unit="%" />
                <Slider label="ZMW/USD" value={er} onChange={sEr} min={15} max={30} step={0.5} />
              </ModelSection>
            </div>

            {/* RIGHT: Outputs */}
            <div>
              <ModelSection title="Scale" accent={C.egVi}>
                <Row label="Total farmers" value={fmt(m.tf)} border />
                <Row label="Total hectares" value={fmt(m.th) + ' ha'} border />
                <Row label="Actual yield" value={fmt(m.ay) + ' t'} bold color={C.t1} border />
                <Row label="Crop failure loss" value={fmt(m.fy) + ' t'} color={C.red} border />
                <Row label="→ Domestic" value={fmt(m.dt) + ' t'} indent border />
                <Row label="→ Export (processed)" value={fmt(m.xt) + ' t'} indent border />
                <Row label="→ FRA reserve" value={fmt(m.ft_fra) + ' t'} indent />
              </ModelSection>
              <ModelSection title="Revenue" accent={C.egHi}>
                <Row label="Domestic" value={fK(m.dr)} border />
                <Row label="Export (processed)" value={fK(m.xr)} border />
                <Row label="FRA reserve" value={fK(m.fr)} border />
                <Row label="Insurance payouts" value={fK(m.ipo)} color={C.cuHi} border />
                <Row label="Total" value={fK(m.tr + m.ipo)} bold color={C.egHi} border />
                <Row label="Blended price / tonne" value={fK(m.bp) + '/t'} color={C.t3} />
              </ModelSection>
              <ModelSection title="Costs" accent={C.cu}>
                <Row label="Inputs" value={fK(m.tic)} border />
                <Row label="Insurance" value={fK(m.ins)} border />
                <Row label="Warehouse" value={fK(m.wc)} border />
                <Row label="Transport (warehouse)" value={fK(m.ttw)} border />
                <Row label="Transport (cross-border)" value={fK(m.ttx)} border />
                <Row label="Financing" value={fK(m.finCost)} border />
                <Row label="Total" value={fK(m.tc)} bold color={C.cuHi} />
              </ModelSection>
              <ModelSection title="System Gross Margin" accent={pos ? C.egVi : C.red}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: pos ? C.egHi : C.red, lineHeight: 1, marginBottom: 6 }}>{fK(m.gm)}</div>
                <div style={{ fontSize: 12, color: C.t3 }}>{fU(m.gm / er)} at {er} ZMW/USD</div>
              </ModelSection>
              <ModelSection title="Per Farmer" accent={C.cuMid}>
                <Row label="Gross" value={fK(m.fg)} border />
                <Row label="Inputs" value={'−' + fK(m.fic)} indent border />
                <Row label="Transport" value={'−' + fK(m.ftr)} indent border />
                <Row label="Insurance" value={'−' + fK(m.fi)} indent border />
                <Row label="Warehouse" value={'−' + fK(m.fw)} indent border />
                <Row label="Financing" value={'−' + fK(m.ffc)} indent border />
                <Row label="Net income" value={fK(m.fn)} bold color={m.fn > 0 ? C.egHi : C.red} border />
                <Row label="USD equiv" value={fU(m.fn / er)} color={C.t3} />
              </ModelSection>
              <ModelSection title="Investor (Phase 3)" accent={C.egBr}>
                <Row label="Capital needed" value={fK(m.ivc)} border />
                <Row label="In USD" value={fU(m.ivU)} border />
                <Row label="Return (15% of margin)" value={fK(m.ivR)} border />
                <Row label="Yield on capital" value={m.ivY.toFixed(1) + '%'} bold color={m.ivY > 0 ? C.egHi : C.red} />
                <div style={{ fontSize: 10, color: C.t4, marginTop: 6, lineHeight: '1.5' }}>
                  Annualised: {(m.ivY * 2).toFixed(1)}% (6mo cycle &times;2)
                </div>
              </ModelSection>
            </div>
          </div>

          <div style={{ background: C.s2, borderLeft: '2px solid ' + C.cu, padding: '16px 20px', marginTop: 3 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: C.cuHi, marginBottom: 10 }}>Scenarios — combine them</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {scenarios.map(s => {
                const isActive = s.label === 'Baseline' ? active.size === 0 : active.has(s.label)
                return (
                  <button
                    key={s.label}
                    onClick={() => toggleScenario(s)}
                    title={s.desc}
                    style={{
                      background: isActive ? C.eg : C.s3,
                      border: '1px solid ' + (isActive ? C.egVi : C.s4),
                      borderRadius: 3, padding: '6px 12px', cursor: 'pointer',
                      transition: 'all .15s',
                      color: isActive ? C.egHi : C.t2,
                      fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
            <div style={{ fontSize: 10, color: C.t4, marginTop: 8, lineHeight: '1.5' }}>
              Click to toggle on/off. Stack multiple scenarios — e.g. Drought + Kwacha shock. Baseline resets all.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
