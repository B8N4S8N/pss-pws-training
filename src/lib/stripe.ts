import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function stripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (use a restricted key rk_ when possible)."
    );
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2026-07-29.dahlia",
      typescript: true,
    });
  }
  return stripeClient;
}

export function appUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

/**
 * BNPL note (Klarna / Cash App Afterpay):
 * Do NOT pass payment_method_types — Stripe dynamic payment methods will show
 * Klarna and Afterpay when enabled in Dashboard → Settings → Payment methods
 * and the customer/amount/currency are eligible.
 *
 * @see https://docs.stripe.com/payments/klarna
 * @see https://docs.stripe.com/payments/afterpay-clearpay
 * @see https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods
 */
export const CHECKOUT_INTEGRATION_ID = "cascade-peer-checkout-xqkrmvab";
