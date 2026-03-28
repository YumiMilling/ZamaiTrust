export default function SectionHeader({ id, num, title, sub }) {
  return (
    <div className="section-header" id={id}>
      <div className="inner">
        <div className="section-header-num">{num}</div>
        <div className="section-header-title">{title}</div>
        <div className="section-header-sub">{sub}</div>
      </div>
    </div>
  )
}
