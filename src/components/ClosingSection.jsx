export default function ClosingSection() {
  return (
    <>
      {/* Closing */}
      <div className="sec-eg">
        <div className="inner">
          <div className="eye" style={{ color: 'var(--cu-hi)' }}>The Question</div>
          <h2 className="h2" style={{ maxWidth: 700 }}>Can a farmer's harvest attract global capital — without a single bank loan?</h2>
          <div className="pull" style={{ borderColor: 'var(--cu-lt)', color: 'rgba(242,237,230,.75)', marginTop: 34 }}>
            This is not a business plan. It's a question — asked openly because the answer can't be found alone. Zambia's CATSP programme may be the moment when all the pieces finally line up. <em>If not now, when?</em>
          </div>
          <p className="p" style={{ color: 'rgba(242,237,230,.5)', marginTop: 34 }}>
            <strong style={{ color: 'rgba(242,237,230,.7)' }}>hello@zamai.pro</strong>
          </p>
        </div>
      </div>

      <div className="divider"></div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-inner">
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 20, fontWeight: 800, color: 'var(--t1)', letterSpacing: '.02em' }}>ZAMAI</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 16, fontStyle: 'italic', fontWeight: 300, color: 'var(--cu-lt)' }}>Technology at the service of people. Always.</div>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(242,237,230,.35)', textAlign: 'right' }}>
            <div>Exploration Document &middot; v0.1 &middot; March 2026</div>
            <div style={{ marginTop: 5 }}>zamai.pro &middot; Lusaka, Zambia</div>
            <div style={{ marginTop: 5, fontSize: 11, color: 'rgba(242,237,230,.25)' }}>Confidential. Do not forward without written consent.</div>
          </div>
        </div>
      </div>
    </>
  )
}
