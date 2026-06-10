// Sends "strike day" push reminders. Runs daily via Vercel Cron.
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // Only allow Vercel Cron (or you, with the secret) to trigger this
  const auth = req.headers.authorization || "";
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  webpush.setVapidDetails(
    "mailto:support@debtslayer.example", // change to your real support email
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const today = new Date().getDate();
  const { data: profiles, error } = await supabase
    .from("profiles").select("id").eq("reminder_day", today);
  if (error) return res.status(500).json({ error: error.message });
  if (!profiles?.length) return res.json({ sent: 0 });

  const { data: subs } = await supabase
    .from("push_subscriptions").select("*")
    .in("user_id", profiles.map((p) => p.id));

  let sent = 0;
  for (const s of subs || []) {
    try {
      await webpush.sendNotification(
        s.subscription,
        JSON.stringify({
          title: "⚔ Strike day, Slayer",
          body: "Your bosses are regenerating. Log a payment and deal your damage.",
        })
      );
      sent++;
    } catch (e) {
      // Subscription expired/revoked — clean it up
      if (e.statusCode === 410 || e.statusCode === 404) {
        await supabase.from("push_subscriptions").delete().eq("user_id", s.user_id);
      }
    }
  }
  return res.json({ sent });
}
