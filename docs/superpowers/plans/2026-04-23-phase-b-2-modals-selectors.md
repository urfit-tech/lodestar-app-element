# Phase B-2 — Modals & Selectors

> **Reference patterns:** B-0 ActivityCollection (`3a15b69`, `954c641`), B-1 Member/Program* collections (`9da87ed`..`a56ed88`). These modals/selectors differ from collections in two ways:
> 1. **Not Craftize'd** — they render inside other components, not as Craft.js draggable nodes. No `apps/element-demo/src/craft/` wrapper needed; their consumers do the `useX` + feed-props wiring directly.
> 2. **Callers live in `@lodestar/ui`** (e.g. `Button.tsx`, `CheckoutProductModal.tsx`). During Phase B transition `@lodestar/ui` is allowed to depend on `@lodestar/data-hasura` (the explicit temporary allowance from Phase A); the goal is that the ui *components themselves* stop calling `useQuery`, not that ui stops importing data hooks. Phase C strips the remaining data-hasura dep once every component is converted.

> **Scope:** 4 files executed as 2 sub-tasks:
> - **B-2a** — `OrderDetailDrawer` (315 lines, 3 useQuery; no internal caller — independent, goes first)
> - **B-2b** — coupled cluster: `CreditCardSelector` (89 lines, 2 useQuery) + `PaymentSelector` (144 lines, 2 useQuery) + `CheckoutProductModal` (854 lines, 5 useQuery) + their callers `Button.tsx` + `CheckoutPage.tsx`. Must ship together because the inner two selectors are only used by the modal, and the modal is the only non-page caller of the selectors.

---

## Shared conventions (all B-2 sub-tasks)

### 1. Types
- Collection-item view types: `packages/types/src/<x>.ts` if a new one is needed for the UI to consume hook output. Reuse existing `@lodestar/types/*` shapes where they already fit (don't synthesize types the current UI doesn't emit).

### 2. Data hook
- Create `packages/data-hasura/src/hooks/<x>.ts` — one named hook per `useQuery` in the source file, named by what the query represents (e.g. `useOrderCollection`, `useMemberCreditCards`, `usePaymentMethods`, `useSimpleProduct`, `useCheckoutMemberValidation`). Don't collapse unrelated queries into one hook.
- Each hook returns `{ data, loading, error? }` (or more specific fields when the UI needs them, e.g. `isFetching`, `refetch`).
- Hoist parsed queries to module scope (`const FOO_QUERY = gql\`...\``).
- Add `export * from './hooks/<x>'` to `packages/data-hasura/src/index.ts` alphabetically.

### 3. Pure UI refactor
- Props-only: move every piece of data / `loading` / `error` / `refetch` that used to come from `useQuery` into component props.
- Keep UI-only concerns: `useState`, form handlers, `useIntl`, `useHistory`, router push, `useToastMessage`, styling, event handlers.
- Preserve the old public prop names — e.g. if a caller passes `onClose`, keep `onClose`. New props are *additions* (data / loading state).
- Remove `@apollo/client`, `@lodestar/graphql`, `gql`, `useQuery`, `useMutation` imports. Verify via grep at the end of each sub-task.

### 4. Mutations
- If the source uses `useMutation`, turn it into a hook in `@lodestar/data-hasura` whose return includes both the trigger callback and the mutation state (`[mutate, { loading, error, data }]` Apollo style), or a tidier variant (`{ submit, submitting, error }`). UI accepts the handler as a prop or invokes the returned callback directly. Pick whichever keeps the UI code smallest — document the choice in the commit body.

### 5. Caller updates
- For each caller of a refactored UI file, either:
  - (a) caller calls the new data hook(s) and passes props to the pure UI (most common), or
  - (b) caller stays agnostic and the data-fetching gets pushed one layer up (only if the caller is also getting refactored in the same sub-task).
- For `apps/element-demo/src/pages/CheckoutPage.tsx` etc., this is an app-level responsibility — adjust as needed.

### 6. Verification (per sub-task)
```bash
pnpm --filter @lodestar/ui exec tsc --noEmit
pnpm --filter @lodestar/element-demo exec tsc --noEmit
find packages apps -name "*.tsbuildinfo" -delete
pnpm -r exec tsc --noEmit
```
All clean.

Grep:
```bash
grep -rn "@apollo/client\|@lodestar/graphql\|\bgql\b\|\buseQuery\b\|\buseMutation\b" \
  packages/ui/src/components/modals/<X>.tsx \
  packages/ui/src/components/selectors/<Y>.tsx
```
Empty for each refactored UI file.

### 7. Commit structure
Two commits per sub-task (mirror B-1):
1. `feat(data-hasura): add <specific hooks> for <purpose>` — types + hooks + barrel. Typechecks standalone.
2. `refactor(ui): make <X> props-only; wire up via <callers>` — UI rewrite + caller updates. Typechecks standalone.

Plus a third commit for the manual-verification log append.

Use `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer on every commit.

---

## B-2a — OrderDetailDrawer

### Files

- Source: `packages/ui/src/components/modals/OrderDetailDrawer.tsx`
- Active non-barrel caller: **none** currently. Still barrel-exported from `packages/ui/src/index.ts`.
- No element-demo page uses it.

### Queries / mutations to extract

Read the source to enumerate. From the survey header it has 3 `useQuery`s — likely `GET_ORDER_PRODUCT`, `GET_SHIPPING_METHODS`, and one more. Inspect in the implementer phase.

### Hook placement

`packages/data-hasura/src/hooks/orderDetailDrawer.ts` — group the 3 queries. Name each hook by its query's purpose, not by where it's used.

### Pure UI props shape

Add `order?: OrderDetailItem` (or whatever shape emerges from the current `composeX` inside the file), `isFetching?: boolean`, `fetchError?: Error`. Preserve existing UI-only props (`isOpen`, `onClose`, `orderId`).

### Caller updates

None active — but the barrel export must keep working. No element-demo or internal caller update needed, but write a minimal example in the commit 2 body of how a future caller would use it: `const { data } = useOrder(orderId); <OrderDetailDrawer order={data} isOpen={...} onClose={...} />`.

### Manual verification items

- **No visible parity check possible** (no active demo page / caller). Mechanical checks only: typecheck + grep.
- **Follow-up note:** flag that `OrderDetailDrawer` has no exercisable route in element-demo; suggest adding an `OrderPage` with a seed `orderId` before B-4 sweep.

---

## B-2b — Checkout cluster (CheckoutProductModal + PaymentSelector + CreditCardSelector + Button + CheckoutPage)

### Why these ship together

- `CheckoutProductModal.tsx:37-41` imports `PaymentSelector` and `CreditCardSelector` internally.
- `packages/ui/src/components/buttons/Button.tsx` renders `<CheckoutProductModal … />` when clicked.
- `apps/element-demo/src/pages/CheckoutPage.tsx` renders the checkout flow.

If any one of `CreditCardSelector`, `PaymentSelector`, or `CheckoutProductModal` flips to props-only alone, the caller holding it inline breaks. So the refactor is one coupled commit set.

### Files modified in this sub-task

- `packages/types/src/checkout.ts` (or new `packages/types/src/checkoutFlow.ts`) — add any view shapes that don't already exist. Many already do (`CouponProps`, `OrderDiscountProps`, `OrderProductProps`); check before adding.
- `packages/data-hasura/src/hooks/checkoutFlow.ts` — several hooks. Likely: `useSimpleProduct(id)`, `useCheckPriceCalculator(...)`, `usePaymentGateway(...)`, `useMemberCreditCards(memberId)` (already exists in `CreditCardSelector.tsx:15-?` — check if it belongs in `hooks/member.ts` or its own file), `useCheckoutProductSubmit()`. Enumerate exactly in the implementer phase based on what the 5 useQuery + any useMutation the modal has.
- `packages/data-hasura/src/index.ts` — barrel update.
- `packages/ui/src/components/selectors/PaymentSelector.tsx` — props-only.
- `packages/ui/src/components/selectors/CreditCardSelector.tsx` — props-only.
- `packages/ui/src/components/modals/CheckoutProductModal.tsx` — props-only (no internal `useQuery`), but it still orchestrates child selectors' props (passes `paymentMethods`, `creditCards`, etc. through from its own props).
- `packages/ui/src/components/buttons/Button.tsx` — caller update. It currently embeds `<CheckoutProductModal …/>`; it needs to either (a) take the data-wiring responsibility upward (easier: keep `Button` as a thin "open-on-click" wrapper that forwards a `productId` — move the modal's data fetching into a separate helper component `ConnectedCheckoutProductModal` in `@lodestar/ui/src/components/modals/ConnectedCheckoutProductModal.tsx` that `Button` renders instead; the Connected version calls the hooks and feeds the pure modal), or (b) `Button` itself calls the hooks (noisy). **Prefer (a)** — keep `Button.tsx` thin.
- `apps/element-demo/src/pages/CheckoutPage.tsx` — update if it imports the pure modal directly; use the `ConnectedCheckoutProductModal` instead. If the page already uses `Button` (which now renders the connected modal internally), no page change needed.
- `apps/element-demo/src/App.tsx` — no change expected (this isn't Craft.js resolver territory).

### Connected modal wrapper location

Unlike collections where Connected wrappers live in `apps/element-demo/src/craft/`, the modal's Connected version belongs in `@lodestar/ui` because it's used by `Button.tsx` (also in ui). That means `@lodestar/ui` imports `@lodestar/data-hasura` hooks in this one file — **temporary** until Phase C resolves.

### Hooks to extract

Enumerate at implementation time by reading the 5 useQuery + any useMutation in `CheckoutProductModal.tsx`, the 2 in `PaymentSelector`, and the 2 in `CreditCardSelector`. Typical candidates:
- `useSimpleProduct(productId)` — product display data
- `useMemberValidation(memberId)` — member check
- `useMember(memberId)` — member data (already in Phase A's `hooks/member.ts`? check before re-creating)
- `useUpdateMemberMetadata(...)` — already in `hooks/member.ts` per Phase A
- `useCheck(...)` — already in `@lodestar/hooks/checkout`
- `useCouponCollection(memberId)` — already in `hooks/coupon.ts` (landed in Phase A closure)
- `usePaymentMethods()` — from PaymentSelector
- `useMemberCreditCards(memberId)` — from CreditCardSelector

The goal is: **every useQuery previously in the 3 UI files now lives in data-hasura**. Don't duplicate hooks that already exist.

### Props shape for CheckoutProductModal (pure)

Tentative — adjust during implementation:

```ts
export type CheckoutProductModalProps = {
  isOpen: boolean
  onClose: () => void
  productTarget: { ... }
  member?: Member
  isMemberLoading?: boolean
  check?: Check
  checkLoading?: boolean
  paymentMethods?: PaymentMethod[]
  creditCards?: CreditCard[]
  coupons?: CouponProps[]
  onCouponInsert?: (code: string) => Promise<void>
  onSubmit?: (payload: CheckoutSubmitPayload) => Promise<void>
  submitting?: boolean
  // ... many more; enumerate during implementation
}
```

The point is: no `useQuery` / `useMutation` inside the modal. All data + callbacks come through props.

### Caller update: `Button.tsx`

Currently:
```tsx
// inside Button
<CheckoutProductModal productId={...} isOpen={visible} onClose={...} />
```

Refactored:
```tsx
// inside Button
<ConnectedCheckoutProductModal productId={...} isOpen={visible} onClose={...} />
```

where `ConnectedCheckoutProductModal` is a new component that:
1. Calls all the data hooks
2. Passes results to the pure `CheckoutProductModal`
3. Lives in `packages/ui/src/components/modals/ConnectedCheckoutProductModal.tsx`

### Commit structure

Three commits total (one doc append):

1. `feat(data-hasura): add checkout-flow hooks (product/payment/creditCards/...)` — new hooks + barrel. Typechecks standalone. Does NOT touch ui or element-demo.
2. `refactor(ui): make CheckoutProductModal + PaymentSelector + CreditCardSelector props-only and add ConnectedCheckoutProductModal wrapper` — UI rewrites + caller (`Button.tsx`) update + any `CheckoutPage.tsx` tweaks. Typechecks standalone.
3. `docs: log B-2b checkout cluster manual verification items`

### Manual verification items

- `/checkout` view mode — Button opens the modal, products/discounts/coupons/shipping/payment all render identical to master.
- Submit flow — select a coupon + a card + payment method, submit, check that the order is created identically (this is a destructive action; only test on a throwaway appId).
- Coupon insertion — type a real coupon code; verify the list updates.
- Credit-card selection.
- Payment-method selection.
- Discount card render.
- Mechanical: tsc PASS + grep empty for all three refactored UI files.

Note any master behaviours the refactor can't preserve (e.g., if a query was deduplicated and that changes ref identity in downstream useEffect deps).

---

## Hard rules (cross-sub-task)

- **No `any` / `as any`.** `as unknown as X` equivalent. Use structural widening (`& { extra?: T }`) when the type system's strictness conflicts with hasura codegen.
- **No `@apollo/client` / `@lodestar/graphql` / `gql` / `useQuery` / `useMutation` remaining in the refactored UI files.** Grep is mandatory.
- **No new demo pages** unless the plan says so.
- **Don't touch** any collection files or `apps/element-demo/src/craft/` entries.
- **Stop + report BLOCKED** rather than patch over a real architectural wrinkle. Modal refactor has many moving parts; flag anything ambiguous.

## Out of scope for B-2

- `@lodestar/ui/package.json` dep cleanup — Phase C.
- Removing the temporary `@lodestar/ui → @lodestar/data-hasura` edge — Phase C.
- CraftElement.tsx final shape — **B-3**.
- Runtime visual parity check — human, logged in `docs/superpowers/plans/2026-04-23-phase-b-manual-verification.md`.
