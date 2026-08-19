# LINE OA AI Customer Service Bot — Implementation Plan (v1, discovery draft)

Source: discovery-interview session, 2026-08-15. Owner reviews this before any
architecture/coding work starts.

## 1. Vision

**Target customers:** Thai SME service/retail businesses — restaurants,
clinics, salons/spas, general online shops.

**Problem solved:**
- Missed/slow replies lose customers.
- Missed late-night orders when no admin is online.
- Reduces need to hire more admin staff.
- Must give real, product-specific answers — not generic templated replies.

**Existing validation:** ร้าน KMO is already piloting this module against a
real booking/order database (not yet opened to other shops). Ground truth
for MVP scope comes from this pilot.

## 2. MVP scope

Both flows ship together, not phased:
- **ORDERING** and **BOOKING**, using the state machine already implemented
  in `modules/line-oa-ai-module` (`IDLE → ORDERING/BOOKING → CONFIRMING →
  COMPLETED`).

**Core design principle — data-source agnostic:** a shop's product/service
knowledge can come from a file upload, an admin form, a Google Sheet, a
Supabase table, or anything else readable — the AI must be able to read
whichever source a shop already has. This is the product's main value prop,
not a secondary feature.

## 3. Business Onboarding Schema (the contract — lock this before writing code)

Per the owner's decision: the module never hardcodes any specific shop. It
only knows this central schema. A shop is "onboarded" by populating this
schema — done by us (the platform team), not by the shop owner directly.

| # | Section | Required/Optional | Contents |
|---|---|---|---|
| 1 | Business Profile | Required | Shop name, description, address/service area, contact channels, opening hours, holidays |
| 2 | Catalog / Services | Required | Item name, description, price/price range, duration, conditions (deposit, appointment, delivery) |
| 3 | Knowledge / FAQ | Required | Common question → standard answer pairs (stock, delivery time, warranty, how to book, etc.) |
| 4 | AI Rules | Required | Tone of voice, how to address the customer, forbidden topics, fallback for unknown questions, when to escalate to a human admin |
| 5 | Customer Fields | **Configurable, not hardcoded** | Varies per shop — name, phone, vehicle model, product of interest, desired date, etc. |
| 6 | Flow / Actions | Required | e.g. ask about product → get price → collect customer info → book / escalate to human |
| 7 | Integrations | Required | LINE OA credentials; optional external systems (booking, CRM, stock, order API) |

**Explicit non-goal:** don't add fields beyond this core set. Every field
added outside this contract turns the next shop into a custom project
instead of a repeatable onboarding.

**Open item:** exact storage location for this schema not yet confirmed.
Working assumption (needs sign-off): a dedicated `line_oa` Postgres schema
in Project B, per `docs/platform/SHARED_SAAS_RUNTIME_PROJECT_B_PLAN.md`'s
"one product = one schema" rule — populated per shop as rows, not as loose
files per shop.

## 4. Pricing (Setup fee + monthly, never "unlimited")

| Plan | Setup | Monthly | Fit |
|---|---|---|---|
| Starter | ฿4,900 | ฿990/mo | FAQ / product / price / hours only |
| **Business** (flagship, main sell) | ฿9,900 | ฿1,990/mo | + lead capture + flow + escalate to admin |
| Automation | ฿19,900+ | ฿3,900+/mo | + booking/CRM/API/workflow integration |

- AI usage beyond quota is billed separately, outside the subscription — no
  unlimited tier, so AI cost stays bounded.
- Plan selection/checkout is expected to live on the Hub website
  (`apps/hub-web`), not inside the LINE chat itself. Exact checkout flow is
  **TBD** — not designed yet.
- Business tier is the one to actively sell; Starter is the entry point,
  Automation catches shops that need real integration work.

## 5. Competitor pricing (reference only — not yet acted on)

Checked 2026-08-15, one data point confirmed via web search:

- **Sellsuki** sells an "OA Chat Package" AI chatbot add-on at **฿555/mo**
  (ex. VAT) — 24/7 auto-reply against the shop's own knowledge base. No
  mention of a booking/order flow; consistent with (not proof of) it being
  FAQ-only. Source: sellsuki.co.th blog.
  - Caveat: Sellsuki is a LINE OA management agency first — this ฿555 is
    likely an add-on subsidized by a larger existing service contract, not
    a standalone product price. Not a clean apples-to-apples comparison
    against our Starter tier.
- **Botnoi** — pricing page renders via client-side JS, no numbers indexed.
  Free trial credits mentioned (7,500 points/mo ≈ 1,500 free chatbot
  messages) but no confirmed paid-tier price found.
- **ACRM** — not yet looked up.

**Decision:** don't cut Starter price to undercut Sellsuki yet. We don't
know our own AI-usage cost per shop, so we don't know if ฿990/mo (or lower)
is even above cost. Getting that cost number is a prerequisite to any
Starter price change — see next step.

## 6. Risks / open items

- Module has only passed unit tests (`tsc` + `vitest`, 20/20) — never
  exercised against a real LINE OA sandbox end-to-end.
- Pricing numbers are a first draft, not validated against measured
  per-shop AI usage cost.
- Onboarding schema storage location (assumption in §3) needs sign-off.
- Hub website checkout/plan-selection flow not designed yet.

## 7. Next step

1. Lock the Business Onboarding Schema in §3 — confirm exact field names,
   types, and required/optional/configurable status per field — before
   writing any schema migration or onboarding code.
2. Before touching the Starter price: measure real AI-usage cost per shop
   (tokens/month at expected message volume) so any price change is
   checked against a cost floor, not just matched against a competitor.
