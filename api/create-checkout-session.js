// Creates a Stripe Checkout session for the Slayer's Guild subscription
import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { plan, userId, email } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing user" });
    const price = plan === "annual" ? process.env.STRIPE_PRICE_ANNUAL : process.env.STRIPE_PRICE_MONTHLY;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: "https://bossmydebt.com/?upgraded=1",
      cancel_url: "https://bossmydebt.com/",
      client_reference_id: userId,
      customer_email: email || undefined,
      allow_promotion_codes: true,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
