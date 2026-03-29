export default function GovernancePage() {
  return (
    <>
      <div className="section-header" id="governance">
        <div className="inner">
          <div className="section-header-num">05</div>
          <div className="section-header-title">Cluster Governance</div>
          <div className="section-header-sub">Democratic. Transparent. With a right to leave.</div>
        </div>
      </div>

      {/* Intro */}
      <section className="sec">
        <div className="eye">The Principle</div>
        <h2 className="h2">Every 3A cluster governs itself.</h2>
        <p className="p" style={{ marginTop: 21 }}>
          The platform provides the tools — transparent treasury, proposal-and-vote, written rules — but the decisions belong to the members. One member, one vote. Always.
        </p>
        <div className="pull">
          Zambians have good reasons to distrust cooperatives. Rent-seeking, opportunism, chairmen who allocate inputs to their relatives — it's learned behaviour from decades of evidence. <em>The only remedy is radical transparency.</em>
        </div>
        <p className="p">
          Rules alone don't create trust. A determined chairman can manipulate a vote. A treasurer can delay reporting. What changes the game is when <strong>every member sees every transaction, in real time, on their phone.</strong> Not quarterly reports. Not meetings where the chairman controls the agenda. Immediate, automatic, unavoidable visibility.
        </p>
      </section>
      <div className="divider" />

      {/* Three pillars */}
      <div className="sec-alt">
        <div className="inner">
          <div className="eye">Three Pillars</div>
          <h2 className="h2">Treasury. Proposals. Constitution.</h2>
          <div className="card-grid-3">
            <div className="card">
              <div className="card-num">01</div>
              <div className="eye">Treasury</div>
              <h3 className="h3">Multi-sig spending</h3>
              <p className="p">Below K2,000: leader alone. K2,000–K10,000: leader + treasurer. Above K10,000: two of three (leader, treasurer, depot witness). Every transaction visible to all members via SMS.</p>
            </div>
            <div className="card">
              <div className="card-num">02</div>
              <div className="eye">Proposals &amp; Votes</div>
              <h3 className="h3">Democratic decisions</h3>
              <p className="p">Any member can propose. Voting via SMS, USSD, or web app. Vote delegation is supported. Governance changes require supermajority + time lock with challenge window.</p>
            </div>
            <div className="card">
              <div className="card-num">03</div>
              <div className="eye">Constitution</div>
              <h3 className="h3">Written rules, versioned</h3>
              <p className="p">Each cluster has a constitution defining distribution rules, leadership requirements, and membership terms. Every change creates a new version — the history is permanent.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="divider" />

      {/* Decision thresholds */}
      <section className="sec">
        <div className="eye">Decision Thresholds</div>
        <h2 className="h2">Different decisions need different levels of agreement.</h2>
        <p className="p">Not every decision is equal. Accepting a contract is routine. Changing the rules that govern the cluster is serious. The thresholds reflect that.</p>
        <table className="btable" style={{ marginTop: 21 }}>
          <thead>
            <tr><th>Decision</th><th>Quorum</th><th>Threshold</th><th>Window</th><th>Extension</th></tr>
          </thead>
          <tbody>
            <tr><td>Contract acceptance</td><td>60%</td><td>Simple majority</td><td>72 hours</td><td>+48h if quorum not reached</td></tr>
            <tr><td>Financial rule change</td><td>60%</td><td>Simple majority</td><td>72 hours</td><td>+48h</td></tr>
            <tr><td>Governance change</td><td>75%</td><td>Two-thirds majority</td><td>7 days</td><td>25% can challenge during time lock</td></tr>
            <tr><td>Membership change</td><td>60%</td><td>Simple majority</td><td>72 hours</td><td>+48h</td></tr>
            <tr><td>Emergency</td><td>50%</td><td>Two-thirds majority</td><td>24 hours</td><td>None</td></tr>
          </tbody>
        </table>
      </section>
      <div className="divider" />

      {/* Anti-capture */}
      <div className="sec-eg">
        <div className="inner">
          <div className="eye" style={{ color: 'var(--cu-hi)' }}>The Anti-Capture Layer</div>
          <h2 className="h2">Designed for a world where people expect to be cheated.</h2>
          <p className="p" style={{ color: 'rgba(242,237,230,.8)', marginTop: 21 }}>
            The governance model is the constitution. These features are the enforcement mechanism. In countries with strong institutions, you rely on courts and regulators. Here, the system itself has to make cheating <strong>immediately, automatically, unavoidably visible</strong> to everyone affected.
          </p>
          <div className="card-grid" style={{ marginTop: 34 }}>
            <div className="card" style={{ borderColor: 'var(--eg-vi)' }}>
              <h3 className="h3">Real-time SMS broadcasts</h3>
              <p className="p">Every transaction sent to every member as it happens. "K4,500 spent by Chairman Banda. Reason: Transport. Co-signed by: Treasurer Mwale." If you didn't get the SMS, it didn't happen.</p>
            </div>
            <div className="card" style={{ borderColor: 'var(--cu)' }}>
              <h3 className="h3">Cross-cluster benchmarks</h3>
              <p className="p">"Your cluster spent K12,000 on transport. The average across 50 clusters is K7,200." The system generates the pressure. No individual has to be the whistleblower.</p>
            </div>
            <div className="card" style={{ borderColor: 'var(--eg-vi)' }}>
              <h3 className="h3">Symmetric information</h3>
              <p className="p">The chairman sees every member's delivery. But every member also sees every spend, every input allocation, every contract the chairman agreed to. No information asymmetry.</p>
            </div>
            <div className="card" style={{ borderColor: 'var(--cu)' }}>
              <h3 className="h3">Clean exit</h3>
              <p className="p">One SMS: "LEAVE." The system calculates what you owe, what you're owed, settled within days. No negotiation. No chairman's discretion. No "come to the next meeting."</p>
            </div>
            <div className="card" style={{ borderColor: 'var(--eg-vi)' }}>
              <h3 className="h3">Portable reputation</h3>
              <p className="p">Leave one cluster, join another — your full track record comes with you. Deliveries, payments, disputes, seasons. A corrupt leader can't bury your past. A good farmer can't be punished for leaving.</p>
            </div>
            <div className="card" style={{ borderColor: 'var(--cu)' }}>
              <h3 className="h3">External witness</h3>
              <p className="p">The depot operator co-signs large transactions. They don't belong to the cluster's internal politics. If they co-sign fraud, their own reputation — and warehouse fees — are at risk.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="divider" />

      {/* The deeper point */}
      <section className="sec">
        <div className="note">
          <div className="note-title">The Deeper Point</div>
          <div className="note-body">
            The system doesn't prevent corruption through punishment. It prevents corruption through <strong>sunlight</strong>. Make it so that cheating is immediately, automatically visible to every person affected by it. The social cost of being caught — in a community where everyone sees the same dashboard — becomes the deterrent. Not courts. Not regulators. Just visibility.
          </div>
        </div>
      </section>
    </>
  )
}
