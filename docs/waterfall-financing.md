# Waterfall Financing: Where Does the Processor's Money Come From?

> ZamaiTrust — March 2026
> Design note — fundamental open question

## The Problem

The payment waterfall assumes: "Processor pays forward contract price into the system." But a Zambian miller doesn't have K1.64 million (200t × K8,200/t) sitting in cash at harvest time. They're a processor, not a bank.

The money to pay farmers has to come from somewhere. The waterfall describes how money is **split** — it doesn't explain how money **enters** the system.

## Where processor revenue actually comes from

Money flows backward from demand:

```
End consumer (DRC market woman buying mealie meal)
  → pays Regional buyer / distributor
    → pays Processor (mills the grain)
      → pays into the waterfall
```

But there's a **timing gap**:
- Farmer delivers grain: **July**
- Processor mills, packages, transports: **July-August**
- Processor sells to buyer: **August-September**
- Buyer pays processor: **September-October** (possibly later)

The processor needs K1.64M in July. Their revenue arrives in September. That's a 2-3 month financing gap.

## Options for bridging the gap

| # | Option | Who bears the cost | Problem |
|---|--------|-------------------|---------|
| 1 | Processor self-finances | Processor | Most Zambian SME millers are capital-constrained — they can't |
| 2 | Bank lends to processor | Bank → Processor | Defeats the "no bank" promise. Interest 25-30%. Excludes smaller processors. |
| 3 | Buyer pre-pays | DRC/Angola buyer | Why would they? They have leverage. Only works with very strong relationships. |
| 4 | Investor capital funds the float | Investor (Phase 3) | Not available in Phases 1-2. This is the tokenisation use case. |
| 5 | Warehouse receipt financing | Bank/financier lends against stored grain | Grain in certified warehouse IS collateral. Agricultural Credits Act 2010 explicitly supports this. Works today. |
| 6 | Staged waterfall — farmer gets partial on delivery, rest on sale | Farmer absorbs the float | Farmer waits longer for full payment. Honest but less attractive. |
| 7 | Processor posts bond / escrow at contract time | Processor | Requires processor to have capital upfront — same problem as #1 |

## The most realistic answer for Phase 1

**Warehouse receipt financing** — the grain sitting in the certified warehouse IS the collateral.

How it works:
1. Farmer delivers 200t to warehouse → dual-signed, graded, stored
2. Warehouse receipt issued (digital, under Agricultural Credits Act)
3. A financier (bank, development finance institution, or private lender) lends against the warehouse receipt — say 70-80% of estimated value
4. That cash enters the waterfall immediately → farmer gets partial payment
5. Processor draws down grain as they mill and sell
6. Revenue from sales repays the financier
7. Remainder flows to farmer as final settlement

This means:
- **A bank IS involved** — but not in the farmer-facing loop. The bank lends to the warehouse receipt, not to the farmer.
- **The farmer doesn't need a bank account or credit history** — the grain is the collateral, not the farmer.
- **The "no bank loan to a farmer" promise holds** — the bank's relationship is with the warehouse and the grain, not with the person who grew it.

## What this means for the waterfall

The waterfall isn't instant. It's **staged**:

```
STAGE 1: On delivery (July)
  ├─ Warehouse fee paid (from grain value)
  ├─ Farmer gets advance (60-70% of estimated net income)
  └─ Grain becomes collateral for warehouse receipt financing

STAGE 2: On sale (August-October, rolling)
  ├─ Processor sells product → revenue enters system
  ├─ Financier repaid (principal + interest)
  ├─ Input supplier repaid in full
  ├─ Insurance premium covered
  ├─ Platform fee taken
  └─ Farmer gets remainder (final settlement)
```

The farmer gets most of their money at delivery, but the **final settlement** comes when the grain is actually sold. This is honest. The alternative — promising instant full payment — requires someone to finance the gap, and in Phase 1 that someone doesn't exist yet.

## What this means for the primitives

The Payment Waterfall primitive needs to support **staged execution**:
- Stage 1 triggered by: delivery-verified Handshake
- Stage 2 triggered by: sale-completed Attestation (new type — processor attests that product was sold to buyer)
- Final settlement: when all stages complete, farmer gets remaining balance

This is still deterministic (no human discretion in the splits), but it's **not instant**. The primitive definition from the stress test — "a pre-agreed trigger condition is met, money splits according to pre-agreed rules" — still holds. There are just multiple triggers in sequence.

## The "no bank" claim — honest version

The original pitch says: "No banks in the farmer-facing loop."

With warehouse receipt financing, this is **technically true but needs honest framing**:
- The farmer never interacts with a bank
- The farmer never takes a loan
- The farmer never needs a credit score
- A financier does participate — but their relationship is with the **grain** (via the warehouse receipt), not with the farmer
- The farmer's experience is: "I delivered grain, I got paid" — the financing plumbing is invisible to them

The honest version: "The farmer never needs a bank. The grain is its own guarantee."

## Impact on financial model

The current model assumes instant settlement. With staged waterfall:
- Farmer net income needs a **timing dimension** (advance vs final)
- A **financing cost** needs to be added (warehouse receipt financing isn't free — maybe 8-15% annualised for 2-3 months = 1.5-3.5% of grain value)
- This cost comes out of the waterfall before the farmer gets paid
- The financial model needs a "financing cost %" slider

## Open questions

1. Who are the likely warehouse receipt financiers in Zambia? (Development Finance Institutions? Commercial banks with ag mandates? CATSP's ZIFSAT facility?)
2. What interest rate is realistic for 60-90 day warehouse receipt financing in Zambia?
3. Does the farmer need to know about the staged nature, or just see "K5,000 now, K3,450 in 8 weeks"?
4. Can the system aggregate warehouse receipts across clusters to get better financing terms? (Pool risk = lower rate)
5. Is this what CATSP's ZIFSAT (financial services facility) is designed to provide?

## Status

**Fundamental open question.** This affects the core promise of the system. Needs resolution before the waterfall design is final.

### Cross-references
- `docs/forward-contract-pricing.md` — pricing mechanism affects financing exposure
- `docs/post-warehouse-routing.md` — destination affects timing (domestic spot = faster payment, export = longer)
- `docs/stress-test-six-primitives.md` — Payment Waterfall definition needs staging support
