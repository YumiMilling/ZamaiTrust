# Post-Warehouse Grain Routing: The Flow is a Fork, Not a Line

> ZamaiTrust — March 2026
> Design note — to be implemented

## The Problem

The current flow diagram and financial model treat the grain chain as linear:

```
Input Supplier → Farmer Group → Warehouse → Processor → Regional Buyer
```

In reality, the warehouse is a **fork point**. Once grain is weighed, graded, and stored, it can go to four different destinations — each with different economics, pricing, regulations, and Forward Contract terms.

## The four paths after warehouse

```
                    ┌─→ Domestic market (raw) — sold at Lusaka spot
                    │
Warehouse ──────────┼─→ Processor → Domestic sale (mealie meal)
  (graded,          │
   stored,          ├─→ Processor → Export (processed) — DRC, Angola, Malawi
   insured)         │
                    └─→ FRA Strategic Reserve — government buys at gazetted price
```

| Path | Buyer | Price mechanism | Currency | Export permit? | Value added? |
|------|-------|----------------|----------|---------------|-------------|
| Domestic raw | Local trader/miller | Lusaka spot | ZMW | No | No |
| Domestic processed | Domestic retailer | Spot + processing margin | ZMW | No | Yes |
| Export processed | DRC/Angola buyer | Index + premium + FX | ZMW → CDF/USD | Yes | Yes (CATSP preferred) |
| FRA reserve | Government | Gazetted price (political) | ZMW | No | No |

## FRA's role under CATSP reforms

CATSP is pushing FRA back to its core mission: **strategic grain reserve only**.

- FRA buys a **fixed annual volume** (Strategic Grain Reserve target), not unlimited
- FRA price is **gazetted** — politically set, not market-driven
- FRA should be a **backstop buyer of last resort**, not the dominant buyer
- Private sector handles all commercial trade (domestic + export)
- The system should make FRA's purchases **transparent and limited** — visible on the government dashboard, capped at the reserve target

Under the old model, FRA distorted markets by buying unlimited quantities at above-market prices, crowding out private traders, and creating uncertainty about when they'd enter or exit. Under CATSP, FRA's role is predictable: buy X tonnes for the reserve at Y price, and stay out of commercial trade.

## What this means for the system

### Forward Contract primitive

A Forward Contract needs a **destination/channel** — not just "who buys" but "where does the grain go":
- `channel: "domestic-raw"` — spot sale, no processing
- `channel: "domestic-processed"` — sold as mealie meal domestically
- `channel: "export-processed"` — processed product crosses border
- `channel: "fra-reserve"` — government strategic reserve purchase

This affects pricing mechanism, waterfall configuration, and regulatory requirements.

### Payment Waterfall

Different paths trigger different waterfalls:
- **Domestic raw:** Simple — spot price × quantity, standard deductions, farmer gets remainder
- **Domestic processed:** Processor margin added, processing costs deducted, farmer net higher
- **Export processed:** Highest margin (DRC spread ~K4,000-6,000/t above domestic), but needs export permit, FX conversion, cross-border transport costs
- **FRA:** Gazetted price, government pays directly, may be slower (FRA payment delays are historically a major problem)

### Financial Model

Current model has a single "Domestic/export split" slider (0-100%). This needs to become:
- Domestic (raw + processed) %
- Export (processed) %
- FRA %
- These three should sum to 100%
- FRA should have a volume cap (e.g., max tonnes at national level → proportional per cluster)
- Processing margin only applies to processed paths
- FRA gazetted price as a separate input (currently not in the model)

### Flow diagram

The linear 5-node chain needs to become a fork after the Warehouse node. The Warehouse is the decision point — grain is allocated based on:
1. Pre-committed Forward Contracts (processor buys ahead)
2. FRA reserve allocation (if applicable, capped)
3. Uncommitted surplus → domestic spot market

### Uncommitted surplus

Not all grain will have a Forward Contract pre-committed. Uncommitted surplus is what's left after:
- Forward Contract commitments are fulfilled
- FRA reserve allocation is filled
- Remainder goes to domestic spot (trader/miller buys at market price)

This is actually the **safety valve** — if a farmer grows more than committed, the surplus has a home.

## Impact on the six primitives

The primitives still hold:
- Routing is expressed as Forward Contracts with a destination field — **no new primitive needed**
- Payment Waterfall triggers differently per path but the primitive definition (deterministic settlement) covers all cases
- Warehouse dual-signature Handshake is unchanged regardless of destination
- FRA purchase is just another Forward Contract (with the government as buyer Organisation)

## Open questions

1. Should FRA purchases go through the same Forward Contract mechanism, or is FRA a special case? (Gazetted price is non-negotiable — does that count as a "forward"?)
2. Can a farmer split a single delivery across multiple destinations? (e.g., 1,500kg to processor, 500kg to FRA?)
3. How does the system handle FRA payment delays? (FRA historically takes months to pay — this breaks the "instant waterfall" promise)
4. Is "domestic raw" (selling unprocessed grain on spot market) something the system should encourage, discourage, or be neutral about?
5. What happens when FRA's gazetted price is above the forward contract price? (Farmer incentive to sell to FRA instead of honoring the forward — the cold start problem gets worse)

## Status

**Not yet implemented.** Saved for implementation after review.

### Files to change when implementing

| File | Change |
|------|--------|
| `src/components/IdeaSection.jsx` | Update flow description to show the fork |
| `src/components/FinancialModel.jsx` | 3-way split, FRA price slider, FRA volume cap |
| `src/components/TrustDiagrams.jsx` | Update `CoreLoop` SVG to show forking paths |
| `src/components/PrinciplesSection.jsx` | Note on FRA backstop role |
| `docs/forward-contract-pricing.md` | Cross-reference destination-based pricing |
