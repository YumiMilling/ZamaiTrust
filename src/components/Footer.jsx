export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-inner">
        <div>
          <img src="/ZAMAI.png" alt="ZamAi" style={{ height: 24, filter: 'brightness(0) invert(1)' }} />
          <div style={{ fontFamily: 'var(--serif)', fontSize: 16, fontStyle: 'italic', fontWeight: 300, color: 'var(--cu-lt)' }}>Technology at the service of people. Always.</div>
        </div>
        <div style={{ fontSize: 14, color: 'rgba(242,237,230,.35)', textAlign: 'right' }}>
          <div>CATSP OS Specification &middot; v0.5 &middot; March 2026</div>
          <div style={{ marginTop: 5 }}>zamai.pro &middot; Lusaka, Zambia</div>
          <div style={{ marginTop: 5, fontSize: 11, color: 'rgba(242,237,230,.25)' }}>Confidential. Do not forward without written consent.</div>
        </div>
      </div>
    </div>
  )
}
