// Stripe calls this when payments/subscriptions change.
// This is the ONLY thing allowed to grant or revoke premium.
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await rawBody(req),
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    return res.status(400).send(`Webhook signature failed: ${e.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      await supabase.from("profiles").update({
        is_premium: true,
        stripe_customer_id: s.customer,
        stripe_subscription_id: s.subscription,
      }).eq("id", s.client_reference_id);
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      const active = sub.status === "active" || sub.status === "trialing";
      await supabase.from("profiles")
        .update({ is_premium: active })
        .eq("stripe_customer_id", sub.customer);
    }

    res.json({ received: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
