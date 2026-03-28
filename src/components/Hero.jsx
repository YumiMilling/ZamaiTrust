export default function Hero() {
  return (
    <div className="hero" id="vision">
      <div className="hero-inner">
        <div className="hero-kicker fade d1">
          <div className="hero-kicker-line"></div>
          <div className="hero-kicker-text">Exploration &middot; v0.1 &middot; March 2026</div>
        </div>
        <h1 className="hero-title fade d2">
          An Exploration into<br />
          <em>Trust Infrastructure</em><br />
          for African Agriculture
        </h1>
        <p className="hero-sub fade d3">
          What if the grain itself were the financial instrument — and the system that verified it were the only bank a farmer ever needed?
        </p>
        <div className="hero-meta fade d4">
          <div className="hero-meta-item">
            <div className="hero-meta-dot" style={{ background: 'var(--cu-lt)' }}></div>
            ZamAi Solutions &middot; zamai.pro
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-dot" style={{ background: 'var(--eg-vi)' }}></div>
            Confidential &middot; Shared Under NDA
          </div>
        </div>
      </div>
    </div>
  )
}
