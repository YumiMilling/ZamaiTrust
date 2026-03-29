# Forward Contract Pricing: Why Fixed Prices Don't Work

> ZamaiTrust — March 2026
> Design note — open question, not resolved

## The Problem

The original Forward Contract primitive assumes a fixed price locked at contract time:

> "200t, grade A, K8,200/t, insured"

This creates asymmetric risk. If the market moves significantly, one party gets crushed and has every incentive to walk away.

### Scenarios that break a fixed price

| Scenario | What happens | Who loses |
|----------|-------------|-----------|
| Lusaka spot rises to K10,000/t | Farmer locked in below market | Farmer resents the deal |
| Spot drops to K5,000/t | Processor overpays by 64% | Processor may default |
| Kwacha appreciates 15% | Export revenue in ZMW drops | Processor margin evaporates |
| Kwacha depreciates 15% | Farmer's real income drops | Farmer, despite nominal price holding |
| FRA announces purchase price above forward | Farmer wants to sell to FRA instead | System loses volume |
| Government bans exports | Processor can't fulfil cross-border forward | Both sides stuck |

### Why this is especially dangerous in Zambia

- Government can change export policy overnight
- FRA can announce a purchase price that distorts the market
- The Kwacha moved from ~27 to ~19 per USD in roughly a year
- 2026 is an election year — maize prices are politically charged
- Lusaka spot market is thin and easily distorted by a single large buyer

A fixed price pretends the future is known. It isn't.

---

## Possible Pricing Mechanisms

### 1. Index-linked + spread

**Price = reference index + agreed premium/discount**

The reference could be:
- **SAFEX white maize** — regional benchmark, USD-denominated, liquid
- **FRA gazetted price** — politically set but reflects government floor
- **Lusaka spot average** — local but thin market
- **A composite** — weighted blend of the above

The premium/discount captures quality, location, and processing value-add. The index captures market reality.

**Pros:** Both parties tied to the same reality. Neither can get destroyed by market moves.
**Cons:** Requires a reliable, timely index feed. SAFEX is in USD (adds FX layer). Lusaka spot is illiquid.

### 2. Floor + upside sharing

**Farmer gets a guaranteed minimum. If market is higher, they share the upside.**

Example:
- Floor: K6,000/t (covers input costs + basic margin)
- If market at delivery is K8,500/t, farmer gets K6,000 + 50% of K2,500 = K7,250/t
- Processor keeps K1,250/t upside

**Pros:** Farmer always covers costs. Processor has downside protection. Both benefit from good markets.
**Cons:** More complex to explain. "What's my price?" doesn't have a simple answer until delivery.

### 3. Collar (floor + cap)

**Price floats between a floor and a ceiling. Outside those bounds, the contract absorbs the risk.**

Example:
- Floor: K6,000/t (farmer protected from crash)
- Cap: K9,500/t (processor protected from spike)
- Between floor and cap: settle at market price on delivery date

**Pros:** Clear boundaries. Both sides know their worst case.
**Cons:** If market goes to K12,000/t, farmer misses out on K2,500/t. If market goes to K4,000/t, processor still pays K6,000/t.

### 4. Spot at delivery with commitment

**No price lock at all. Just a commitment to buy/sell a set quantity and grade at whatever the market price is on delivery day.**

**Pros:** No price risk for either party. Simple.
**Cons:** Doesn't actually solve the farmer's problem — they still don't know what they'll earn when they plant. Can't back input credit without a price indication.

---

## FX Risk (Cross-Border Forwards)

For contracts where the buyer is in DRC (CDF) or Angola (AOA):

| Approach | How it works |
|----------|-------------|
| **USD-equivalent** | Contract denominated in USD, converted at delivery-date ZMW rate |
| **FX adjustment band** | If ZMW moves >10% from contract date, price adjusts proportionally |
| **Dual-currency settlement** | Buyer pays in CDF, system records ZMW equivalent at settlement rate |
| **FX as Attestation** | The system doesn't do FX conversion — it records the rate used by the authorised dealer bank |

---

## What This Means for the Primitive

The Forward Contract definition changes from:

> *A commitment to exchange goods at a set price, quantity, grade, and time.*

To:

> *A commitment to exchange goods at an agreed quantity, grade, time, and pricing rule — where the pricing rule can reference an index, set a floor, cap the upside, or combine these. The final settlement price is determined at delivery, not at commitment.*

**The commitment is firm (quantity, grade, timing). The price is a formula, not a number.**

This also creates a valuable side effect: the spread between contract-date indicative price and delivery-date settlement price becomes the system's own **price discovery data** over time. After a few seasons, the system generates the index it needs.

---

## Open Questions

1. Which index is most appropriate for Phase 1 (domestic only, Kwacha)?
2. Is there a minimum floor that makes input credit viable? (Input cost per hectare is ~K4,500 at ~2.5t/ha yield, so break-even is ~K1,800/t before other costs)
3. How do you explain a pricing formula to a farmer via USSD/SMS? ("Your grain will sell for at least K6,000 per tonne, possibly more depending on the market")
4. Does the insurer need to know the pricing mechanism to underwrite? (Yes — their exposure depends on it)
5. Should the system support multiple pricing mechanisms simultaneously, or pick one and standardise?

---

## Status

**Unresolved.** This is a design question that needs input from:
- Someone who understands Zambian commodity markets (FRA dynamics, spot market liquidity)
- An insurer (how pricing mechanism affects underwriting)
- Farmers (what they can understand and trust)
- A processor (what pricing risk they can absorb)

Saved for later work.
