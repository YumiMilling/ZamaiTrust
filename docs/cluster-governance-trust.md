# Cluster Governance: Designing for a Low-Trust Environment

> ZamaiTrust — March 2026
> Design note — governance model + anti-capture layer

## The Governance Model

Every 3A cluster governs itself. The platform provides tools — the decisions belong to the members. One member, one vote. Always.

### Treasury — Multi-sig spending

| Amount | Approval required |
|--------|------------------|
| Below K2,000 | Leader alone |
| K2,000 – K10,000 | Leader + Treasurer |
| Above K10,000 | Two of three: Leader, Treasurer, Depot witness |

Every transaction visible to all members.

### Proposals & Votes — Democratic decisions

- Any member can propose
- Voting via SMS, USSD, or PWA
- Vote delegation is supported
- Governance changes require supermajority + time lock with challenge window

### Constitution — Written rules

Each cluster has a versioned constitution defining:
- Distribution rules
- Leadership requirements
- Membership terms
- Changes require governance-level vote

### Decision thresholds

| Decision type | Quorum | Threshold | Window | Extension / Lock |
|---------------|--------|-----------|--------|-----------------|
| Contract acceptance | 60% | Simple majority | 72 hours | +48 hours if quorum not reached |
| Financial rule change | 60% | Simple majority | 72 hours | +48 hours |
| Governance change | 75% | Two-thirds majority | 7 days | 25% can challenge during time lock |
| Membership change | 60% | Simple majority | 72 hours | +48 hours |
| Emergency | 50% | Two-thirds majority | 24 hours | None |

---

## The Problem: Zambia's Trust Deficit

Zambians are historically — and rationally — reluctant to trust cooperative-type organisations. Rent-seeking and opportunistic behaviour are common. This is not a cultural flaw. It is learned behaviour from decades of evidence:

- Cooperative chairmen who allocate inputs to relatives
- Treasurers who take the money and disappear
- FRA depot managers who fiddle the weights
- Development programmes that enrich the connected and exclude the rest
- Committees that exist on paper and serve the person who formed them

### The self-fulfilling prophecy

1. Everyone expects others to cheat
2. Honest people don't join (why risk it?)
3. The people who do join are disproportionately those who plan to extract
4. They extract. The thing collapses.
5. This confirms the original suspicion
6. Repeat

Governance rules alone (quorums, supermajorities, time locks) don't break this cycle. A determined chairman can manipulate a vote via SMS. A treasurer can delay reporting. Rules only work when people believe they'll be enforced — and enforcement history in Zambia is poor.

---

## The Only Remedy: Radical Transparency

Not "everything is visible" in the abstract. Specific, practical, unavoidable transparency:

### 1. Real-time, not periodic

- Not quarterly reports. That's too late — the money is already gone.
- Every single transaction visible to every member **as it happens**
- SMS notification to all: "K4,500 spent by Chairman Banda. Reason: Transport to Chongwe depot. Co-signed by: Treasurer Mwale."
- If you didn't get the SMS, it didn't happen legitimately

### 2. Comparative, not absolute

- "Your cluster spent K12,000 on transport this month" means nothing alone
- "Your cluster spent K12,000 on transport. The average across 50 clusters is K7,200" — now you have a question to ask
- Cross-cluster benchmarking makes anomalies visible without anyone having to accuse anyone
- The system generates the pressure. No individual has to be the whistleblower.

### 3. Symmetric — leaders see what members see

- The chairman can see every member's delivery. Fine.
- But every member can also see every spend, every input allocation, every forward contract the chairman agreed to
- No information asymmetry between leaders and members
- What the chairman knows, everyone knows

### 4. Exit is real, not theoretical

- "Right to leave" means nothing if leaving costs you your input advance, your forward commitment, and your social standing
- Exit needs to be **financially clean**: the system calculates your exact position automatically — what you owe, what you're owed, settled within X days
- No negotiation. No chairman's discretion. No "you need to come to the next meeting to discuss."
- One SMS: "LEAVE" → system calculates → settlement offer → done

### 5. History is permanent and portable

- A farmer who leaves one cluster and joins another brings their **full track record** — deliveries, payments, disputes, quality grades, seasons participated
- A corrupt leader can't bury the past
- A good farmer can't be punished for leaving
- Reputation is owned by the individual, not granted by the cluster

---

## The Anti-Capture Layer

Underneath the governance model, the system needs features specifically designed to prevent a cluster from being captured by a small group:

| Feature | What it prevents |
|---------|-----------------|
| Every transaction broadcast to all members via SMS | Treasurer hiding expenditure |
| Cross-cluster spend benchmarks (auto-generated) | Leader inflating costs to extract margin |
| Input allocation visible to all (who got what, when) | Chairman distributing to relatives first |
| Automatic exit calculation | Trapping members who want to leave |
| Portable reputation (individual, not cluster-owned) | Punishing people for switching clusters |
| Time-locked proposals with challenge window | Rushing decisions through when people aren't watching |
| Multi-sig with external witness (depot operator) | Leader + treasurer collusion |
| Constitutional changes require supermajority + cooling | Capturing governance itself |
| Vote receipts sent to each voter | Vote manipulation by whoever counts |
| Proposal text must be read aloud + SMS summary | Exploiting low literacy to sneak through changes |

### Why the depot witness matters

The depot operator is the external check. They don't belong to the cluster's internal politics. They have their own reputation in the system. If they co-sign a fraudulent transaction, their track record shows it — and they risk losing their role (which has economic value to them via warehouse fees).

This is anti-corruption through **incentive alignment**, not just rules.

---

## How This Maps to the Six Primitives

| Governance feature | Primitives used |
|-------------------|----------------|
| Treasury transaction | **Attestation** (spend record) + **Handshake** (multi-sig approval) |
| Proposal | **Attestation** (proposal text + evidence) |
| Vote | **Handshake** (member agrees or disagrees with proposal) |
| Constitution | **Attestation** (versioned document, change creates new version) |
| Leadership election | **Handshake** (members vote) + **Function** (winner gets leader capabilities) |
| Exit | **Attestation** (exit request) + **Payment Waterfall** (settlement calculation) |
| Membership | **Attestation** (join request) + **Handshake** (cluster confirms) + **Organisation** (membership recorded) |
| Multi-sig | **Handshake** (N-of-M approval, same as dual-signature pattern) |

All composable from the six primitives. No new primitive needed.

---

## Open Questions

1. **Literacy**: How do you ensure low-literacy members understand what they're voting on? SMS summaries help but complex financial rule changes need more — perhaps voice messages or in-person reading requirements?

2. **Vote buying**: One member, one vote via SMS is good — but what stops a leader from collecting phones during a meeting and voting on behalf of everyone? (Time-locked voting windows help, but the social pressure is real.)

3. **Delegation abuse**: Vote delegation is powerful but can be exploited. If 60% of members delegate to the chairman "because he knows best," you've recreated the problem. Should there be a delegation cap?

4. **First cluster problem**: The governance model assumes existing trust. But for the very first cluster (Phase 0), who sets the initial constitution? Who is the first leader? The platform has to bootstrap this — which means ZamAi is temporarily the governance authority. How does that transition work?

5. **Conflict with traditional authority**: In rural Zambia, the headman/chief has authority over land and community matters. A democratic cluster governance model may conflict with traditional power structures. How does the system navigate this?

6. **Scale of transparency**: Real-time SMS to all 25 members for every transaction works at small scale. At 200 clusters × 25 farmers = 5,000 farmers, that's significant SMS volume. Cost? Airtel/MTN bulk SMS pricing?

7. **What happens when transparency reveals corruption?** The system can make it visible. But who enforces consequences? If the chairman is clearly extracting and 15 of 25 members can see it, but no one acts because of social dynamics — what then? Is automatic suspension of Functions (spend authority) triggered by anomaly detection?

---

## The Deeper Point

The governance model is the **constitution**. The transparency features are the **enforcement mechanism**. In countries with strong institutions, you can rely on courts, regulators, and social norms to enforce the constitution. In Zambia, you can't — not reliably, not at village level.

So the system itself has to be the enforcement mechanism. Not through punishment, but through **visibility**. Make it so that cheating is immediately, automatically, unavoidably visible to everyone who is affected by it. The social cost of being caught — in a community where everyone sees the same dashboard — becomes the deterrent.

This is Minister Mutati's "cyber happiness" concept applied at ground level: public trust in digital systems is essential. The system has to earn it by being more transparent than any institution these farmers have ever dealt with.

## Status

**Design note — not yet implemented.** Needs to be integrated into:
- The "How It Works" page (new section on cluster governance)
- The financial model (governance costs — SMS volume, platform overhead)
- The agent architecture (governance functions for Farmer and Cluster agents)
- The six primitives documentation (governance as composition example)
