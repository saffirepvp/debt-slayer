// Opens Stripe's billing portal so subscribers can cancel/update payment themselves
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { userId } = req.body;
    const { data: p } = await supabase.from("profiles").select("stripe_customer_id").eq("id", userId).single();
    if (!p?.stripe_customer_id) return res.status(400).json({ error: "No subscription found for this account" });
    const session = await stripe.billingPortal.sessions.create({
      customer: p.stripe_customer_id,
      return_url: "https://bossmydebt.com/",
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
