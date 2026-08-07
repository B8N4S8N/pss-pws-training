# Auth, payments & BNPL

## Clerk authentication

Cascade Peer Academy uses **Clerk** (`@clerk/nextjs`) as the primary auth provider.

- `ClerkProvider` in `src/app/layout.tsx` (shadcn theme via `@clerk/ui`)
- `src/proxy.ts` protects dashboards, learning, AI APIs, and checkout routes
- `/sign-in` and `/sign-up` Clerk-hosted components
- Prisma `User` rows sync from Clerk on first authenticated request (`clerkId`)
- Staff roles via `ADMIN_EMAILS` / `INSTRUCTOR_EMAILS` env or Clerk `publicMetadata.role`

Legacy `/login` and `/register` redirect into Clerk.

## Stripe Checkout

One-time tuition payments use **Stripe Checkout Sessions** (hosted).

- Server action: `startCheckoutAction` in `src/lib/actions.ts`
- Success fulfillment: `fulfillCheckoutSession` + webhook `POST /api/stripe/webhook`
- Creates/updates `Payment` + `Enrollment` when paid
- **Never** passes `payment_method_types` — uses [dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods)

### Enable Klarna & Cash App Afterpay (financing)

1. Stripe Dashboard → **Settings → Payment methods**
2. Enable **Klarna** and **Cash App Afterpay** (Afterpay)
3. Ensure business location / MCC eligibility (education/training typically OK; Afterpay has restricted MCC list)
4. No code change required — Checkout shows BNPL when the customer/amount/currency are eligible

Amount notes (approx., subject to provider rules):

| Program | Price | Afterpay Pay-in-4 (USD) | Klarna |
|---------|-------|-------------------------|--------|
| PSS | $895 | Within ~$2,000 cap | Eligible options vary |
| PWS | $1,495 | Within ~$2,000 Pay-in-4; monthly installments may apply | Financing available up to higher USD caps |

Sources: [Klarna on Stripe](https://docs.stripe.com/payments/klarna), [Afterpay on Stripe](https://docs.stripe.com/payments/afterpay-clearpay)

### Local webhook testing

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
# copy whsec_… into STRIPE_WEBHOOK_SECRET
```

### Env vars

See `.env.example` for `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, and Clerk keys.
