export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-inner">
        <div className="hero-kicker fade d1">
          <div className="hero-kicker-line"></div>
          <div className="hero-kicker-text">CATSP OS &middot; Specification v0.5 &middot; March 2026</div>
        </div>
        <img src="/ZAMAI.png" alt="ZamAi" className="fade d1" style={{ height: 40, marginBottom: 34, filter: 'brightness(0) invert(1)' }} />
        <h1 className="hero-title fade d2">
          The Operating System for<br />
          <em>Zambia's Agricultural</em><br />
          Transformation
        </h1>
        <p className="hero-sub fade d3">
          Every CATSP transaction &mdash; input advance, forward contract, grain delivery, quality test, loan disbursement, insurance event, payment settlement &mdash; through one system where each participant sees exactly what they need.
        </p>
        <div className="hero-meta fade d4">
          <div className="hero-meta-item">
            <div className="hero-meta-dot" style={{ background: 'var(--cu-lt)' }}></div>
            ZamAi Solutions &middot; zamai.pro
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-dot" style={{ background: 'var(--eg-vi)' }}></div>
            $5.7 billion programme &middot; 7 sub-programmes &middot; 1 operating system
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-dot" style={{ background: 'var(--t3)' }}></div>
            Confidential &middot; Shared Under NDA
          </div>
        </div>
      </div>
    </div>
  )
}
