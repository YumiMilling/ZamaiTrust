# Stress Test: Are Six Primitives Sufficient?

> ZamaiTrust — March 2026
> Internal analysis document

## Context

The system proposes six atomic primitives as the foundation for everything. If a new feature cannot be expressed as a composition of these six, either the feature is wrong or a primitive is missing.

| # | Primitive | Definition |
|---|-----------|-----------|
| 01 | **Handshake** | Two parties verify the same event. If they agree, confirmed. If not, both claims preserved. |
| 02 | **Attestation** | A claim about something real, backed by evidence and optional corroboration. |
| 03 | **Function** | An atomic unit of capability. What you can do — not who you are. |
| 04 | **Organisation** | An entity in the system — from a 20-farmer cluster to a national ministry. |
| 05 | **Forward Contract** | A commitment to exchange goods at a set price, quantity, grade, and time. |
| 06 | **Payment Waterfall** | Deterministic settlement. A trigger is met, money splits. Nobody decides. |

**The question:** can every operation in the system be expressed as a composition of these six? What breaks?

---

## Test Method

Walk through every flow, event, and edge case in the system. For each, show which primitives compose it — or flag it as a gap.

---

## TEST 1: The Happy Path (one season)

| Step | What happens | Primitives used |
|------|-------------|----------------|
| Processor posts a buy order | Forward Contract (quantity, grade, price, window) | **Forward Contract** |
| Input supplier advances seed to farmer group | Attestation (input-advanced) + Handshake (supplier + cluster sign) | **Attestation + Handshake** |
| Insurer underwrites the commitment | Attestation (insurance-bound) | **Attestation** |
| Farmer delivers grain to depot | Handshake (farmer + depot verify quantity/grade) → creates Attestation (delivery-verified) | **Handshake + Attestation** |
| Independent quality check | Attestation (quality-attested, single signer) | **Attestation** |
| Payment splits automatically | Payment Waterfall (triggered by delivery Handshake linked to Forward Contract) | **Payment Waterfall** |
| Export clearance | Attestation (export-cleared, signed by regulatory authority) | **Attestation** |

**Verdict: PASS.** The happy path composes cleanly from 5 of the 6 primitives. Organisation and Function are implicit (they define *who* can do *what*).

---

## TEST 2: Dispute / Disagreement

**Scenario:** Farmer says "I delivered 2,000 kg grade A." Depot says "I received 1,800 kg grade B."

| What happens | Primitives |
|---|---|
| Both claims recorded | **Handshake** (disagreement path — both claims preserved) |
| Flagged for arbitration | ??? |

**GAP FOUND:** The Handshake covers recording the disagreement. But what happens next? Who arbitrates? How is the dispute resolved? The six primitives describe **what gets recorded** but not **what happens when records conflict.**

**Options:**
- (a) Arbitration is a **Function** assigned to an **Organisation** (e.g., cluster leader, or platform operator). The arbitration outcome is itself an **Attestation**. → This works if you consider dispute resolution as just another Attestation created by a party with the "arbitrate" Function. **No new primitive needed.**
- (b) Or you add a 7th primitive: **Resolution** — a decision that overrides a disputed Handshake.

**Recommendation:** (a) is sufficient. Dispute → Arbitrator (Organisation with Function) → Resolution Attestation that links to the disputed Handshake. The six hold.

---

## TEST 3: Insurance — Bad Season (Crop Failure)

**Scenario:** Drought hits. Only 60 of 200 committed tonnes delivered. Insurance triggers.

| What happens | Primitives |
|---|---|
| Partial delivery recorded | **Handshake + Attestation** (60t delivered) |
| Forward Contract shows 200t committed, 60t fulfilled | **Forward Contract** (state: partially fulfilled) |
| Weather/satellite data triggers payout | **Attestation** (external data source confirms drought) |
| Insurance pays out to supplier, processor, farmer | **Payment Waterfall** (different split than happy path) |

**QUESTION:** Does the Payment Waterfall primitive handle *multiple waterfall configurations*? The happy path waterfall (delivery-triggered) and the insurance waterfall (failure-triggered) have different splits and different payers.

**Analysis:** The Payment Waterfall as originally described is "deterministic settlement — grain arrives, money splits." But in the insurance case, grain *didn't* arrive (or partially arrived). The trigger is different (weather index, not delivery). The payer is different (insurer, not processor). The split percentages are different.

**This means the Payment Waterfall primitive needs to be more general than "grain arrives, money splits."** It's really: "a trigger condition is met, money splits according to pre-agreed rules." The trigger could be delivery, could be crop failure, could be contract expiry.

**Recommendation:** Broaden the definition. The primitive is really **Deterministic Settlement** — any pre-agreed trigger causes pre-agreed splits. No new primitive needed, but the definition needs to accommodate multiple trigger types, not just delivery.

---

## TEST 4: Cross-Border / Multi-Currency

**Scenario:** Zambian mealie meal sold to DRC buyer. Forward contract in CDF (Congolese francs). Settlement crosses jurisdictions.

| What happens | Primitives |
|---|---|
| Forward Contract denominated in CDF | **Forward Contract** (currency field) |
| Export clearance (Zambian side) | **Attestation** (export-cleared) |
| Import clearance (DRC side) | **Attestation** (import-cleared — new type?) |
| FX conversion ZMW ↔ CDF | ??? |
| Payment routed through authorised dealer bank | **Payment Waterfall** (but across jurisdictions) |

**GAP FOUND:** FX conversion is not clearly covered. It's not a Handshake (no dispute possible — it's a market rate). It's not an Attestation (it's a transformation, not a claim). It's not a Forward Contract (it's spot, not forward).

**Options:**
- (a) FX conversion is an **Attestation** of the rate used, created by the authorised dealer bank (an Organisation with the "fx-convert" Function). The conversion itself happens off-system on existing banking rails. The system just records what rate was used.
- (b) FX is a new primitive.

**Recommendation:** (a). The system doesn't *do* FX conversion — it records that it happened. An Attestation with benefit_class "fx-executed" captures: rate, amount_in, currency_in, amount_out, currency_out, dealer_id. **No new primitive needed.**

---

## TEST 5: Tokenisation / International Investment (Phase 3)

**Scenario:** Global investor buys a token representing a share of a Forward Contract.

| What happens | Primitives |
|---|---|
| Forward Contract created | **Forward Contract** |
| Token minted representing fractional ownership | ??? |
| Investor purchases token with USDC | ??? |
| 6 months later, grain delivered, waterfall executes | **Payment Waterfall** |
| Investor receives return | **Payment Waterfall** (portion routed to token holder) |

**GAP FOUND:** Tokenisation introduces *fractional ownership* and *transferability*. A Forward Contract between two known parties becomes a tradeable instrument owned by unknown third parties. The six primitives assume bilateral relationships. Tokens are multilateral.

**Analysis:** This is a Phase 3 feature — explicitly flagged as "blocked pending regulatory framework." The primitives need to support Phases 1-2 today. Phase 3 may genuinely require a new primitive (e.g., **Token** or **Instrument**) — but that's a bridge to cross later, and it's honest to say so.

**Recommendation:** Acknowledge this openly. The six primitives are sufficient for Phases 1-2. Phase 3 (tokenisation) may require a 7th primitive. This is by design — the system is built to be extended, not to solve every future problem upfront.

---

## TEST 6: Government Dashboard / Visibility

**Scenario:** Ministry of Agriculture wants real-time view of all committed, delivered, and stored grain nationally.

| What happens | Primitives |
|---|---|
| Government is an Organisation | **Organisation** |
| Government has "dashboard-view" capability | **Function** |
| Dashboard reads all Attestations, Forward Contracts, Waterfall settlements | Read-only queries across existing primitives |

**Verdict: PASS.** The government dashboard is a *view* over existing data, not a new operation. Organisation + Function define access. No new primitive needed.

---

## TEST 7: Identity / Registration

**Scenario:** A new farmer joins a 3A cluster and needs to be registered in the system.

| What happens | Primitives |
|---|---|
| Farmer is an Organisation (individual) | **Organisation** |
| Farmer is assigned Functions (deliver, confirm, dispute) | **Function** |
| Cluster leader attests that farmer is a member | **Attestation** (membership) |
| Registration is a Handshake? | Potentially — cluster leader + farmer both confirm |

**Verdict: PASS.** Registration = creating an Organisation, assigning Functions, and recording membership via Attestation. Could involve a Handshake if both parties confirm.

---

## TEST 8: Reputation / Trust Scores

**Scenario:** After 3 seasons, a farmer has a track record. The system should reflect reliability.

| What happens | Primitives |
|---|---|
| Track record = count of successful Handshakes and honoured Forward Contracts | Computed from existing Attestations |
| Trust score = derived metric | ??? |

**Analysis:** Reputation is a *computed view* over existing primitives, not a primitive itself. Like the government dashboard, it reads the record — it doesn't create new types of data. A farmer who has 15 successful delivery-verified Handshakes and 0 disputes has a visible track record.

**Verdict: PASS.** Reputation is emergent from the data. No new primitive needed.

---

## TEST 9: Merkle Tree / Tamper Evidence

**Scenario:** All records are hashed into a daily Merkle root.

| What happens | Primitives |
|---|---|
| Each Attestation and Handshake is hashed | Infrastructure layer, not a primitive |
| Pairs combined upward to root | Infrastructure |
| Root published daily | Could be an Attestation (platform attests to the day's root hash) |

**Verdict: PASS.** Tamper evidence is an infrastructure concern, not a business primitive. The daily root publication could itself be an Attestation. No new primitive needed.

---

## TEST 10: Progressive Governance

**Scenario:** After Phase 2, participants vote to change waterfall percentages or add a new Function.

| What happens | Primitives |
|---|---|
| Governance proposal | **Attestation** (proposal by an Organisation with governance Function) |
| Vote | **Handshake** (each voter agrees or disagrees) |
| Outcome applied | Configuration change to Forward Contract templates or Payment Waterfall rules |

**Analysis:** Governance is composable from Attestation + Handshake + Function. Proposals are attestations. Votes are handshakes. Authority to propose/vote is a Function assigned to Organisations.

**Verdict: PASS.**

---

## Summary

| Test | Scenario | Result | Notes |
|------|----------|--------|-------|
| 1 | Happy path | PASS | Clean composition of 5 primitives |
| 2 | Dispute | PASS | Arbitration = Organisation + Function + Attestation |
| 3 | Insurance / crop failure | PASS* | Payment Waterfall definition needs broadening |
| 4 | Cross-border / FX | PASS | FX conversion recorded as Attestation |
| 5 | Tokenisation (Phase 3) | PARTIAL | May need 7th primitive — Phase 3 is deferred |
| 6 | Government dashboard | PASS | Read-only view, not a new primitive |
| 7 | Identity / registration | PASS | Organisation + Function + Attestation |
| 8 | Reputation | PASS | Computed from existing data |
| 9 | Merkle / tamper evidence | PASS | Infrastructure, not a business primitive |
| 10 | Progressive governance | PASS | Attestation + Handshake + Function |

---

## Verdict

**The six primitives are sufficient for Phases 1-2, with one refinement.**

### Refinement needed

**Payment Waterfall** is defined too narrowly as "grain arrives, money splits." It should be **Deterministic Settlement** — "a pre-agreed trigger condition is met, money splits according to pre-agreed rules." This covers the delivery waterfall, the insurance payout, and any future settlement type.

### Honest gap

**Phase 3 tokenisation** (fractional ownership of contracts by anonymous third parties) may require a 7th primitive. This is fine — the system is designed to grow. Admitting this upfront is stronger than pretending six covers everything forever.

### Nothing is redundant

Each primitive does something the others cannot:

| Primitive | Why it can't be removed |
|-----------|------------------------|
| **Handshake** | Bilateral verification — can't be replaced by single-party Attestation |
| **Attestation** | Single-party claim with evidence — can't require Handshake for everything (quality assessor works alone) |
| **Function** | Capability assignment — without this, you can't restrict who does what |
| **Organisation** | Identity — without this, signatures mean nothing |
| **Forward Contract** | Future commitment — distinct from Attestation because it creates *obligation*, not just record |
| **Payment Waterfall** | Deterministic settlement — no human discretion. This is the anti-corruption core. |

**The count is right. The definitions need minor tightening. The system is honest about what it doesn't yet cover.**
