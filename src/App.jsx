import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ============================================================
// DEBT SLAYER — Dark Fantasy Debt-Tracking RPG
// ============================================================

const GOLD = "#d4af37";
const BLOOD = "#8b1a1a";
const EMBER = "#ff6b35";

const BOSS_TYPES = {
  credit:   { name: "The Usurer",        sigil: "🩸", title: "Lord of Compounding Rot",    color: "#a01818" },
  student:  { name: "The Scholar Wraith",sigil: "📜", title: "Keeper of Endless Lessons",  color: "#3a5a8c" },
  car:      { name: "The Iron Steed",    sigil: "⚙️", title: "Beast of Depreciation",      color: "#5a5a6e" },
  mortgage: { name: "The Stone Colossus",sigil: "🏰", title: "Final Boss of the Realm",    color: "#6b4423" },
  medical:  { name: "The Plague Doctor", sigil: "☠️", title: "Harbinger of Bills",         color: "#2e6b4f" },
  personal: { name: "The Whispering Debt",sigil:"🌑", title: "Shade of Borrowed Time",     color: "#4a3a6b" },
};

const ADVISORS = [
  { id: "sage",   name: "Mordrin the Sage",  sigil: "🧙", style: "wise & strategic",    blurb: "Master of the Avalanche & Snowball arts" },
  { id: "bard",   name: "Lyra the Bard",     sigil: "🎻", style: "motivating & warm",   blurb: "Sings of victories yet to come" },
  { id: "knight", name: "Ser Castellan",     sigil: "⚔️", style: "disciplined & blunt", blurb: "Tolerates no wasted gold" },
];

// Fantasy name suggestions per debt type — used by the Summon flow
const BOSS_NAME_POOLS = {
  credit:   ["The Crimson Usurer", "Plastic Devourer", "The Revolving Wyrm", "Mastercard Manticore", "The Minimum Fiend"],
  student:  ["The Sallie Specter", "Loanlich the Learned", "The Tuition Titan", "Scholar's Bane", "The Diploma Drake"],
  car:      ["The Iron Revenant", "Wheelbound Wraith", "The Odometer Ogre", "Chrome Chimera", "The Lease Leviathan"],
  mortgage: ["The Stone Colossus", "Castle Keeper's Curse", "The Thirty-Year Tyrant", "Foundation Fiend", "The Escrow Wyrm"],
  medical:  ["The Plague Doctor", "Bonesetter's Bill", "The Copay Wraith", "Deductible Demon", "The ER Phantom"],
  personal: ["The Whispering Debt", "Shade of Borrowed Gold", "The IOU Imp", "Favor's Phantom", "The Handshake Haunt"],
};
function randomBossName(type) {
  const pool = BOSS_NAME_POOLS[type] || BOSS_NAME_POOLS.personal;
  return pool[Math.floor(Math.random() * pool.length)];
}

const ACHIEVEMENTS = [
  { id: "first_blood",     name: "First Blood",      sigil: "🩸", desc: "Land your first strike",          check: (s) => s.totalStrikes >= 1     },
  { id: "warband",         name: "Warband Leader",   sigil: "🛡", desc: "Strike 10 times",                 check: (s) => s.totalStrikes >= 10    },
  { id: "giant_slayer",    name: "Giant Slayer",     sigil: "🗡", desc: "Slay a boss worth $10k+",         check: (s) => s.biggestSlain >= 10000 },
  { id: "first_kill",      name: "Boss Vanquisher",  sigil: "💀", desc: "Slay your first boss",            check: (s) => s.bossesSlain >= 1      },
  { id: "interest_breaker",name: "Interest Breaker", sigil: "⚖", desc: "Deal $5,000 in total damage",     check: (s) => s.totalDamage >= 5000   },
  { id: "champion",        name: "Realm Champion",   sigil: "👑", desc: "Reach Level 5",                  check: (s) => s.level >= 5            },
  { id: "season_victor",   name: "Season Victor",    sigil: "🏆", desc: "Complete a monthly season",      check: (s) => s.seasonsWon >= 1       },
  { id: "warlord",         name: "Warlord",          sigil: "🔥", desc: "Hold a 3-month streak",          check: (s) => s.streak >= 3           },
];

const SEASONS = [
  { key: "frostfall", name: "Frostfall Reckoning", sigil: "❄", goal: 1500, color: "#5a8caf", lore: "The frozen ledger cracks. Strike while the ice is thin." },
  { key: "ember",     name: "Ember Harvest",        sigil: "🔥",goal: 1500, color: "#ff6b35", lore: "Burn away what you owe in the season of flame." },
  { key: "shadow",    name: "The Long Shadow",      sigil: "🌑",goal: 1500, color: "#6b5a8c", lore: "In darkness, every coin of debt is a chain. Break them." },
  { key: "storm",     name: "Stormbreak Trials",    sigil: "⚡",goal: 1500, color: "#d4af37", lore: "Thunder favors the bold. Slay without mercy." },
];

function currentSeason() { return SEASONS[new Date().getMonth() % SEASONS.length]; }
const SEASON_KEY = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
const FREE_BOSS_LIMIT = 2;
const FREE_COUNSEL_LIMIT = 5;
const STREAK_RANKS = ["Squire", "Knight", "Champion", "Warlord", "Legend"];
function daysLeftInMonth() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
}

// ============================================================
// POLICY PAGES — terms, privacy, refunds
// ============================================================
const POLICY_CONTENT = {
  terms: {
    title: "Terms of Service",
    updated: "Last updated: this is a starter template — have a professional review before launch.",
    sections: [
      ["Acceptance", "By creating an account or using Debt Slayer, you agree to these terms. If you don't agree, please don't use the service."],
      ["What Debt Slayer is", "Debt Slayer is a gamified debt-tracking tool. You manually enter your debts and log payments. We display balances, projections, and educational strategy content in a role-playing-game format. It is a tracking and motivation tool, not a bank, lender, or licensed financial advisor."],
      ["Not financial advice", "All projections, the Battle Planner, and the AI advisor characters provide general educational information only. They are estimates based on the numbers you enter and standard formulas. They are not personalized financial, legal, or tax advice. For decisions that matter, consult a qualified professional."],
      ["Your account", "You're responsible for keeping your login secure and for the accuracy of the debt information you enter. You must be at least 18 years old to subscribe to a paid plan."],
      ["Subscriptions", "The Slayer's Guild is a recurring monthly subscription billed through our payment processor. It renews automatically until cancelled. See the Cancellation & Refunds policy for details."],
      ["Acceptable use", "Don't abuse, reverse-engineer, or attempt to disrupt the service. We may suspend accounts that do."],
      ["Changes", "We may update these terms as the product grows. We'll note the date of the latest revision here."],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: this is a starter template — have a professional review before launch.",
    sections: [
      ["What we collect", "Your email address (for login), the debt information you choose to enter (names, balances, APRs, payments), and your in-app progress (XP, streaks, achievements). We do NOT collect or store bank credentials or account numbers."],
      ["How we use it", "To run the service: to show your bosses, save your progress, calculate projections, and power the AI advisor responses. We don't sell your personal data."],
      ["Third parties", "We use trusted providers to operate: a hosting provider, a database/authentication provider, a payment processor for subscriptions, and an AI provider that powers the advisor characters. Your debt context may be sent to the AI provider to generate advice. Each provider handles data under their own privacy terms."],
      ["Data security", "We use industry-standard authentication and database security. No system is perfectly secure, but we never handle your banking logins, which keeps the most sensitive data out of scope entirely."],
      ["Your control", "You can edit or banish (delete) any boss at any time, and you can request deletion of your account and associated data by contacting us."],
      ["Cookies", "We use essential cookies to keep you logged in. We don't run advertising trackers."],
    ],
  },
  refunds: {
    title: "Cancellation & Refunds",
    updated: "Last updated: this is a starter template — have a professional review before launch.",
    sections: [
      ["Cancel anytime", "You can cancel the Slayer's Guild subscription at any time from your Settings page or through the payment processor's portal. There are no cancellation fees."],
      ["What happens when you cancel", "You keep premium access until the end of the billing period you've already paid for. After that, your account returns to the free tier. Your data — bosses, progress, history — is preserved."],
      ["Refunds", "Because this is a low-cost monthly subscription, we generally don't offer partial refunds for time already elapsed in a billing period. If you were charged in error or have a billing problem, contact us and we'll make it right."],
      ["Free trial / free tier", "The free tier lets you try the core experience (2 bosses, 5 AI counsels) at no cost and with no card required, so you can decide before paying."],
      ["Contact", "For any billing question, reach out at the support email listed in the app. (Add your real support email before launch.)"],
    ],
  },
};

function PolicyPage({ which, onBack }) {
  const p = POLICY_CONTENT[which];
  return (
    <div style={policyStyles.page}>
      <style>{css}</style>
      <div style={policyStyles.inner} className="fade-in">
        <button style={policyStyles.back} onClick={onBack}>← back</button>
        <h1 style={policyStyles.title}>{p.title}</h1>
        <p style={policyStyles.updated}>{p.updated}</p>
        {p.sections.map(([h, body]) => (
          <div key={h} style={policyStyles.section}>
            <h2 style={policyStyles.h2}>{h}</h2>
            <p style={policyStyles.body}>{body}</p>
          </div>
        ))}
        <p style={policyStyles.disclaimer}>
          ⚠ These policies are starter templates to get you launched, not legal advice. Before taking real payments, have a lawyer (or a reputable policy generator) tailor them to your business and jurisdiction.
        </p>
      </div>
    </div>
  );
}

const policyStyles = {
  page: { fontFamily: "'EB Garamond',serif", background: "radial-gradient(ellipse at top,#1a1218 0%,#050304 100%)", minHeight: "100vh", color: "#e8e0d4", padding: "40px 20px" },
  inner: { maxWidth: 720, margin: "0 auto" },
  back: { background: "none", border: "none", color: "#9a8f80", cursor: "pointer", fontSize: 14, fontStyle: "italic", marginBottom: 20 },
  title: { fontFamily: "'Cinzel',serif", fontSize: 32, color: GOLD, letterSpacing: 1, margin: "0 0 6px" },
  updated: { color: "#7a7060", fontStyle: "italic", fontSize: 13, marginBottom: 30 },
  section: { marginBottom: 24 },
  h2: { fontFamily: "'Cinzel',serif", fontSize: 18, color: "#e8e0d4", margin: "0 0 8px" },
  body: { color: "#b8ac98", fontSize: 15, lineHeight: 1.7, margin: 0 },
  disclaimer: { marginTop: 36, padding: "16px 20px", background: "#1c1016", border: `1px solid ${BLOOD}55`, borderRadius: 8, color: "#c8a89a", fontSize: 13.5, lineHeight: 1.65, fontStyle: "italic" },
};

// ============================================================
// LANDING PAGE — what strangers see before signing up
// ============================================================
function LandingPage({ onEnter, onShowPolicy }) {
  return (
    <div style={landing.page}>
      <style>{css}</style>

      {/* HERO */}
      <div style={landing.hero} className="fade-in">
        <div style={landing.heroMark}>⚔</div>
        <h1 style={landing.heroTitle}>DEBT SLAYER</h1>
        <p style={landing.heroTag}>Your debt is a monster.<br />Slay it.</p>
        <p style={landing.heroSub}>
          Turn every credit card, student loan, and car note into an RPG boss with an HP bar.
          Every real payment you make is a strike. Watch your debts die, one by one.
        </p>
        <button style={landing.cta} onClick={onEnter}>🔥 BEGIN THE HUNT — FREE</button>
        <p style={landing.ctaHint}>No card required · summon your first boss in 60 seconds</p>
      </div>

      {/* FEATURES */}
      <div style={landing.featureGrid}>
        <div style={landing.featureCard} className="boss-card">
          <span style={{ fontSize: 44 }}>🩸</span>
          <h3 style={landing.featureTitle}>Boss Battles</h3>
          <p style={landing.featureText}>Your $4,200 credit card becomes "The Crimson Usurer" — a boss with HP, regeneration (its APR), and a death coming. Log payments to deal damage, land critical strikes, and earn the kill screen.</p>
        </div>
        <div style={landing.featureCard} className="boss-card">
          <span style={{ fontSize: 44 }}>🗺</span>
          <h3 style={landing.featureTitle}>The Battle Planner</h3>
          <p style={landing.featureText}>Avalanche or Snowball? See your exact payoff order, your debt-free date, and precisely how much interest each strategy saves — calculated from your real balances and APRs.</p>
        </div>
        <div style={landing.featureCard} className="boss-card">
          <span style={{ fontSize: 44 }}>🔮</span>
          <h3 style={landing.featureTitle}>The AI War Council</h3>
          <p style={landing.featureText}>Three advisors — a sage, a bard, and a knight — who know your actual debts and give real strategy in character. Ask which boss to strike first. They'll tell you why.</p>
        </div>
        <div style={landing.featureCard} className="boss-card">
          <span style={{ fontSize: 44 }}>🏆</span>
          <h3 style={landing.featureTitle}>Seasons & Streaks</h3>
          <p style={landing.featureText}>Monthly themed seasons with damage goals, permanent badges, payment streaks with ranks from Squire to Legend, and achievements that actually mean something — you paid that off.</p>
        </div>
      </div>

      {/* FAQ */}
      <div style={landing.faqWrap} className="fade-in">
        <h2 style={landing.faqTitle}>Questions, answered</h2>
        {[
          ["Is this a real debt tracker or just a game?", "Both. Every boss is one of your real debts with its real balance and APR. When you log a payment, the balance updates and saves. Interest accrues over time based on the APR, so the numbers track your actual payoff. The RPG layer just makes it something you'll actually want to open."],
          ["Do you connect to my bank account?", "No. Debt Slayer never asks for bank logins or account numbers. You enter your balances yourself and log payments manually after you make them. That keeps things simple and keeps your sensitive financial credentials entirely out of our hands."],
          ["What do I get for free?", "Plenty: track up to 2 debts as bosses, full battle mechanics, 5 AI advisor counsels, seasons, streaks, and achievements. The $4.99/mo Slayer's Guild adds unlimited bosses, the Battle Planner (avalanche/snowball payoff strategy), and unlimited AI counsel."],
          ["Is the financial advice trustworthy?", "The Battle Planner uses standard, well-established payoff math (the avalanche and snowball methods). The AI advisors give general guidance for motivation and strategy. None of it is personalized professional financial advice — projections are estimates, and for big decisions you should consult a qualified advisor."],
          ["Can I cancel anytime?", "Yes. You can cancel your subscription whenever you like and you'll keep premium access until the end of your current billing period. No cancellation fees, no hoops."],
          ["What happens to my data if I cancel?", "Nothing disappears. Your bosses, progress, and history stay in your account. You simply return to the free tier limits until you resubscribe."],
        ].map(([q, a]) => (
          <details key={q} style={landing.faqItem}>
            <summary style={landing.faqQ}>{q}</summary>
            <p style={landing.faqA}>{a}</p>
          </details>
        ))}
      </div>

      {/* PRICING */}
      <div style={landing.pricing} className="fade-in">
        <h2 style={landing.pricingTitle}>Free to start. $4.99/mo for the full arsenal.</h2>
        <p style={landing.pricingText}>
          Free Slayers track 2 bosses and get 5 AI counsels.
          The Slayer's Guild unlocks unlimited bosses, the Battle Planner, and unlimited counsel from all three advisors.
        </p>
        <button style={landing.cta} onClick={onEnter}>⚔ SUMMON YOUR FIRST BOSS</button>
      </div>

      <footer style={landing.footer}>
        <div style={{ marginBottom: 10 }}>
          <button style={landing.footerLink} onClick={() => onShowPolicy("terms")}>Terms</button>
          <span style={landing.footerDot}>·</span>
          <button style={landing.footerLink} onClick={() => onShowPolicy("privacy")}>Privacy</button>
          <span style={landing.footerDot}>·</span>
          <button style={landing.footerLink} onClick={() => onShowPolicy("refunds")}>Cancellation & Refunds</button>
        </div>
        Debt Slayer · a dark fantasy money RPG
        <br />Payoff projections are estimates only — not financial advice.
      </footer>
    </div>
  );
}

const landing = {
  page: { fontFamily: "'EB Garamond',serif", background: "radial-gradient(ellipse at top,#1a1218 0%,#0a0608 55%,#050304 100%)", minHeight: "100vh", color: "#e8e0d4", overflowX: "hidden" },
  hero: { textAlign: "center", padding: "80px 24px 50px", maxWidth: 700, margin: "0 auto" },
  heroMark: { fontSize: 64, color: GOLD, textShadow: `0 0 32px ${EMBER}` },
  heroTitle: { fontFamily: "'Cinzel',serif", fontWeight: 900, fontSize: 46, letterSpacing: 6, color: GOLD, margin: "10px 0 4px", lineHeight: 1.15, padding: "4px 0" },
  heroTag: { fontFamily: "'Cinzel',serif", fontSize: 26, color: "#e8e0d4", lineHeight: 1.3, margin: "18px 0 14px" },
  heroSub: { color: "#b8ac98", fontSize: 17, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 30px" },
  cta: { fontFamily: "'Cinzel',serif", background: `linear-gradient(135deg,${BLOOD},${EMBER})`, color: "#fff", border: "none", padding: "18px 36px", borderRadius: 6, fontWeight: 700, fontSize: 16, cursor: "pointer", letterSpacing: 2, boxShadow: `0 6px 32px ${BLOOD}aa` },
  ctaHint: { color: "#7a7060", fontStyle: "italic", fontSize: 13, marginTop: 14 },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 18, maxWidth: 1000, margin: "30px auto", padding: "0 24px" },
  featureCard: { background: "linear-gradient(160deg,#1a141a,#0e0a0e)", border: `1px solid ${GOLD}33`, borderRadius: 12, padding: "28px 22px", textAlign: "center" },
  featureTitle: { fontFamily: "'Cinzel',serif", fontSize: 18, color: GOLD, margin: "12px 0 8px" },
  featureText: { color: "#b8ac98", fontSize: 14.5, lineHeight: 1.65, margin: 0 },
  pricing: { textAlign: "center", maxWidth: 620, margin: "50px auto", padding: "40px 28px", background: "linear-gradient(160deg,#1c1016,#0a0608)", border: `1px solid ${GOLD}44`, borderRadius: 14 },
  pricingTitle: { fontFamily: "'Cinzel',serif", fontSize: 22, color: "#e8e0d4", margin: "0 0 12px" },
  pricingText: { color: "#9a8f80", fontSize: 15, lineHeight: 1.7, margin: "0 0 24px" },
  footer: { textAlign: "center", padding: "40px 20px 30px", color: "#5a5048", fontSize: 12, fontStyle: "italic", lineHeight: 1.8 },
  footerLink: { background: "none", border: "none", color: "#9a8f80", cursor: "pointer", fontSize: 12, textDecoration: "underline", fontFamily: "'EB Garamond',serif" },
  footerDot: { color: "#5a5048", margin: "0 8px" },
  faqWrap: { maxWidth: 720, margin: "50px auto", padding: "0 24px" },
  faqTitle: { fontFamily: "'Cinzel',serif", fontSize: 26, color: "#e8e0d4", textAlign: "center", margin: "0 0 24px" },
  faqItem: { background: "linear-gradient(160deg,#1a141a,#0e0a0e)", border: "1px solid #2a2228", borderRadius: 8, padding: "16px 20px", marginBottom: 12 },
  faqQ: { fontFamily: "'Cinzel',serif", fontSize: 16, color: GOLD, cursor: "pointer", listStyle: "none" },
  faqA: { color: "#b8ac98", fontSize: 14.5, lineHeight: 1.7, margin: "12px 0 0" },
};

// ============================================================
// AUTH SCREEN
// ============================================================
function AuthScreen({ onAuth, onBack }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleEmail() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email to confirm your account, then log in!");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  }

  return (
    <div style={authStyles.overlay}>
      <style>{css}</style>
      <div style={authStyles.card} className="fade-in">
        {onBack && <button style={authStyles.backLink} onClick={onBack}>← back</button>}
        <div style={authStyles.logo}>⚔</div>
        <h1 style={authStyles.title}>DEBT SLAYER</h1>
        <p style={authStyles.sub}>Slay your debts. Reclaim your gold.</p>

        <button style={authStyles.googleBtn} onClick={handleGoogle}>
          <span style={{ fontSize: 18 }}>G</span> Continue with Google
        </button>

        <div style={authStyles.divider}><span>or</span></div>

        <input
          style={authStyles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={authStyles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEmail()}
        />

        {error && <p style={authStyles.error}>{error}</p>}
        {message && <p style={authStyles.success}>{message}</p>}

        <button style={authStyles.submitBtn} onClick={handleEmail} disabled={loading}>
          {loading ? "..." : isLogin ? "⚔ Enter the Realm" : "⚔ Create Account"}
        </button>

        <button style={authStyles.switchBtn} onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}>
          {isLogin ? "New here? Create an account" : "Already a Slayer? Log in"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function DebtSlayer() {
  const [user, setUser]       = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const [showAuth, setShowAuth] = useState(false);
  const [policy, setPolicy] = useState(null);

  if (authLoading) return <div style={{ background: "#050304", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontFamily: "serif", fontSize: 22 }}>⚔ Loading the Realm...</div>;
  if (policy) return <PolicyPage which={policy} onBack={() => setPolicy(null)} />;
  if (!user) return showAuth
    ? <AuthScreen onAuth={setUser} onBack={() => setShowAuth(false)} />
    : <LandingPage onEnter={() => setShowAuth(true)} onShowPolicy={setPolicy} />;
  return <GameApp user={user} onShowPolicy={setPolicy} />;
}

// ============================================================
// GAME (shown when logged in)
// ============================================================
function GameApp({ user, onShowPolicy }) {
  const [view, setView]               = useState("arena");
  const [strategy, setStrategy]       = useState("avalanche");
  const [extraBudget, setExtraBudget] = useState(200);
  const [bosses, setBosses]           = useState([]);
  const [bossesLoading, setBossesLoading] = useState(true);
  const [showSummon, setShowSummon]   = useState(false);
  const [editBoss, setEditBoss]       = useState(null);
  const [battleLog, setBattleLog]     = useState([]);
  const [activeBoss, setActiveBoss]   = useState(null);
  const [payAmount, setPayAmount]     = useState("");
  const [hitFlash, setHitFlash]       = useState(false);
  const [floatingDmg, setFloatingDmg] = useState([]);
  const [advisor, setAdvisor]         = useState(ADVISORS[0]);
  const [chat, setChat]               = useState([]);
  const [chatInput, setChatInput]     = useState("");
  const [thinking, setThinking]       = useState(false);
  const [isPremium, setIsPremium]     = useState(false);
  const [xp, setXp]                   = useState(0);
  const chatEndRef = useRef(null);

  const [combo, setCombo]             = useState(0);
  const [shakeStage, setShakeStage]   = useState(false);
  const [critText, setCritText]       = useState(null);
  const [victoryBoss, setVictoryBoss] = useState(null);
  const [embers, setEmbers]           = useState([]);
  const comboTimer = useRef(null);

  const [stats, setStats] = useState({ totalStrikes: 0, totalDamage: 0, bossesSlain: 0, biggestSlain: 0, seasonsWon: 0, streak: 0 });
  const [unlocked, setUnlocked]       = useState([]);
  const [seasonDamage, setSeasonDamage] = useState(0);
  const [counselsUsed, setCounselsUsed] = useState(0);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const goalCounted = useRef(false);
  const [toast, setToast]             = useState(null);
  const season = currentSeason();

  const totalDebt    = bosses.reduce((s, b) => s + b.remaining, 0);
  const totalOriginal= bosses.reduce((s, b) => s + b.total, 0);
  const slainCount   = bosses.filter((b) => b.remaining <= 0).length;
  const level        = Math.floor(xp / 100) + 1;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat, thinking]);

  // --- Load bosses from Supabase, applying real interest for time elapsed ---
  useEffect(() => {
    async function loadBosses() {
      const { data, error } = await supabase
        .from("bosses")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) {
        const now = new Date();
        let totalAccrued = 0;
        const loaded = data.map((b) => {
          let remaining = Number(b.remaining);
          const apr = Number(b.apr);
          const last = b.last_interest_at ? new Date(b.last_interest_at) : null;
          if (apr > 0 && remaining > 0 && last) {
            const days = Math.floor((now - last) / 86400000);
            if (days >= 1) {
              const interest = Math.round(remaining * (apr / 100 / 365) * days * 100) / 100;
              if (interest > 0) {
                remaining = Math.round((remaining + interest) * 100) / 100;
                totalAccrued += interest;
                supabase.from("bosses")
                  .update({ remaining, last_interest_at: now.toISOString() })
                  .eq("id", b.id)
                  .then(({ error: e }) => { if (e) console.error(e.message); });
              }
            }
          }
          return {
            id: b.id, type: b.type, name: b.name,
            total: Number(b.total), remaining,
            apr, minPayment: Number(b.min_payment),
          };
        });
        setBosses(loaded);
        if (totalAccrued >= 0.5) {
          setToast({ sigil: "🩸", name: "The bosses have fed", desc: `Interest grew your debts by $${totalAccrued.toFixed(2)} while you were away` });
          setTimeout(() => setToast(null), 5500);
        }
      }
      setBossesLoading(false);
    }
    loadBosses();
  }, [user.id]);

  // --- Load (or create) this user's profile: xp, streak, season, counsels ---
  useEffect(() => {
    async function loadProfile() {
      let { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (!p) {
        const { data: created } = await supabase.from("profiles").insert({ id: user.id }).select().single();
        p = created;
      }
      const { data: ach } = await supabase.from("achievements").select("achievement_id");
      if (p) {
        let sd = Number(p.season_damage) || 0;
        let streak = p.streak || 0;
        let seasonsWon = p.seasons_won || 0;
        // Month changed since last visit? Settle last season.
        if (p.season_key && p.season_key !== SEASON_KEY) {
          if (sd < season.goal) streak = 0; // goal missed: streak breaks (wins were already counted live)
          sd = 0;
        }
        goalCounted.current = sd >= season.goal;
        setXp(p.xp || 0);
        setStats({
          totalStrikes: p.total_strikes || 0,
          totalDamage: Number(p.total_damage) || 0,
          bossesSlain: p.bosses_slain || 0,
          biggestSlain: Number(p.biggest_slain) || 0,
          seasonsWon, streak,
        });
        setSeasonDamage(sd);
        setCounselsUsed(p.counsels_used || 0);
        setIsPremium(!!p.is_premium);
      }
      if (ach) setUnlocked(ach.map((a) => a.achievement_id));
      setProfileLoaded(true);
    }
    loadProfile();
  }, [user.id]);

  // --- Auto-save profile whenever progress changes (debounced) ---
  useEffect(() => {
    if (!profileLoaded) return;
    const t = setTimeout(() => {
      supabase.from("profiles").upsert({
        id: user.id,
        xp,
        streak: stats.streak,
        seasons_won: stats.seasonsWon,
        season_key: SEASON_KEY,
        season_damage: seasonDamage,
        total_strikes: stats.totalStrikes,
        total_damage: stats.totalDamage,
        bosses_slain: stats.bossesSlain,
        biggest_slain: stats.biggestSlain,
        counsels_used: counselsUsed,
        is_premium: isPremium,
        updated_at: new Date().toISOString(),
      }).then(({ error }) => { if (error) console.error("Profile save failed:", error.message); });
    }, 800);
    return () => clearTimeout(t);
  }, [xp, stats, seasonDamage, counselsUsed, isPremium, profileLoaded]);

  // --- Award the season badge the moment the goal is crossed ---
  useEffect(() => {
    if (!profileLoaded) return;
    if (seasonDamage >= season.goal && !goalCounted.current) {
      goalCounted.current = true;
      setStats((s) => ({ ...s, seasonsWon: s.seasonsWon + 1, streak: s.streak + 1 }));
      setToast({ sigil: season.sigil, name: `${season.name} Conquered!`, desc: "Season badge earned \u00b7 streak extended" });
      playSound("victory");
      setTimeout(() => setToast(null), 4500);
    }
  }, [seasonDamage, profileLoaded]);

  // --- Summon (create) a new boss and save to Supabase ---
  async function summonBoss({ name, type, total, apr, minPayment }) {
    const { data, error } = await supabase
      .from("bosses")
      .insert({ user_id: user.id, name, type, total, remaining: total, apr, min_payment: minPayment })
      .select()
      .single();
    if (error) { alert("The summoning failed: " + error.message); return; }
    setBosses((prev) => [...prev, {
      id: data.id, type: data.type, name: data.name,
      total: Number(data.total), remaining: Number(data.remaining),
      apr: Number(data.apr), minPayment: Number(data.min_payment),
    }]);
    setShowSummon(false);
    playSound("achievement");
  }

  // --- Open a boss battle and load its battle log ---
  async function openBoss(b) {
    setActiveBoss(b);
    setView("boss");
    setBattleLog([]);
    const { data } = await supabase.from("payments").select("*")
      .eq("boss_id", b.id).order("created_at", { ascending: false }).limit(25);
    if (data) setBattleLog(data);
  }

  // --- Edit a boss's details ---
  async function updateBoss(updated) {
    const { error } = await supabase.from("bosses").update({
      name: updated.name, remaining: updated.remaining,
      apr: updated.apr, min_payment: updated.minPayment,
    }).eq("id", updated.id);
    if (error) { alert("Update failed: " + error.message); return; }
    setBosses((prev) => prev.map((b) => b.id === updated.id ? { ...b, ...updated } : b));
    setActiveBoss((a) => a && a.id === updated.id ? { ...a, ...updated } : a);
    setEditBoss(null);
  }

  // --- Banish (delete) a boss entirely ---
  async function banishBoss(boss) {
    if (!window.confirm(`Banish ${boss.name} from the realm? This erases the boss and its battle log forever.`)) return;
    const { error } = await supabase.from("bosses").delete().eq("id", boss.id);
    if (error) { alert("The banishment failed: " + error.message); return; }
    setBosses((prev) => prev.filter((b) => b.id !== boss.id));
    setActiveBoss(null);
    setView("arena");
  }

  // --- Generate a shareable victory card image ---
  function shareVictory(boss) {
    const meta = BOSS_TYPES[boss.type];
    const c = document.createElement("canvas");
    c.width = 1080; c.height = 1080;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(540, 420, 120, 540, 540, 820);
    g.addColorStop(0, "#221420"); g.addColorStop(1, "#050304");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1080);
    ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 8; ctx.strokeRect(36, 36, 1008, 1008);
    ctx.strokeStyle = "#d4af3744"; ctx.lineWidth = 2; ctx.strokeRect(56, 56, 968, 968);
    ctx.textAlign = "center";
    ctx.font = "190px serif";
    ctx.fillText(meta.sigil, 540, 360);
    ctx.fillStyle = "#d4af37"; ctx.font = "bold 58px Georgia, serif";
    ctx.fillText("⚜  BOSS SLAIN  ⚜", 540, 500);
    ctx.fillStyle = "#e8e0d4"; ctx.font = "bold 70px Georgia, serif";
    ctx.fillText(boss.name, 540, 610);
    ctx.fillStyle = "#ff6b35"; ctx.font = "bold 88px Georgia, serif";
    ctx.fillText("$" + boss.total.toLocaleString() + " DEFEATED", 540, 750);
    ctx.fillStyle = "#9a8f80"; ctx.font = "italic 38px Georgia, serif";
    ctx.fillText("Slay your debts. Reclaim your gold.", 540, 870);
    ctx.fillStyle = "#d4af37"; ctx.font = "42px Georgia, serif";
    ctx.fillText(window.location.host, 540, 950);
    c.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "debt-slayer-victory.png", { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Boss Slain!", text: `I just slew ${boss.name} — $${boss.total.toLocaleString()} of debt defeated! ⚔` });
          return;
        } catch (e) { /* user cancelled — fall through to download */ }
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "debt-slayer-victory.png";
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  }

  // --- Persist damage to Supabase (fire and forget) ---
  function saveBossRemaining(bossId, newRemaining) {
    supabase.from("bosses").update({ remaining: newRemaining }).eq("id", bossId)
      .then(({ error }) => { if (error) console.error("Save failed:", error.message); });
  }

  useEffect(() => {
    const ctx = { ...stats, level };
    ACHIEVEMENTS.forEach((a) => {
      if (!unlocked.includes(a.id) && a.check(ctx)) {
        setUnlocked((u) => [...u, a.id]);
        setToast({ sigil: a.sigil, name: a.name, desc: a.desc });
        playSound("achievement");
        setTimeout(() => setToast(null), 4000);
        supabase.from("achievements").insert({ user_id: user.id, achievement_id: a.id })
          .then(({ error }) => { if (error && !error.message.includes("duplicate")) console.error(error.message); });
      }
    });
  }, [stats, level]);

  function simulate(strat) {
    let active = bosses.filter((b) => b.remaining > 0).map((b) => ({ ...b }));
    if (active.length === 0) return { months: 0, totalInterest: 0, order: [], freeDate: null };
    const minTotal = active.reduce((s, b) => s + b.minPayment, 0);
    const monthlyPool = minTotal + Number(extraBudget || 0);
    let months = 0, totalInterest = 0;
    const slainOrder = [];
    while (active.some((b) => b.remaining > 0) && months < 600) {
      months++;
      active.forEach((b) => { if (b.remaining > 0) { const i = (b.remaining * (b.apr / 100)) / 12; b.remaining += i; totalInterest += i; } });
      const living = active.filter((b) => b.remaining > 0);
      living.sort((a, b) => strat === "avalanche" ? b.apr - a.apr : a.remaining - b.remaining);
      const target = living[0];
      let pool = monthlyPool;
      living.forEach((b) => { if (b.id !== target.id) { const pay = Math.min(b.minPayment, b.remaining); b.remaining -= pay; pool -= pay; } });
      target.remaining -= Math.min(pool, target.remaining);
      active.forEach((b) => { if (b.remaining <= 0.01 && !slainOrder.find((s) => s.id === b.id)) { b.remaining = 0; slainOrder.push({ id: b.id, name: b.name, month: months }); } });
    }
    const freeDate = new Date(); freeDate.setMonth(freeDate.getMonth() + months);
    return { months, totalInterest: Math.round(totalInterest), order: slainOrder, freeDate };
  }

  function playSound(kind) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
      const ac = new Ctx(), now = ac.currentTime;
      const make = (freq, start, dur, type = "square", vol = 0.12) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = type; o.frequency.setValueAtTime(freq, now + start);
        g.gain.setValueAtTime(0, now + start);
        g.gain.linearRampToValueAtTime(vol, now + start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        o.connect(g); g.connect(ac.destination); o.start(now + start); o.stop(now + start + dur);
      };
      if (kind === "hit")         { make(180, 0, 0.12, "sawtooth", 0.15); make(90, 0, 0.18, "square", 0.1); }
      if (kind === "crit")        { make(220, 0, 0.1, "sawtooth", 0.18); make(330, 0.05, 0.15, "square", 0.14); make(140, 0, 0.25, "triangle", 0.12); }
      if (kind === "victory")     { [523, 659, 784, 1047].forEach((f, i) => make(f, i * 0.12, 0.3, "triangle", 0.14)); }
      if (kind === "achievement") { [659, 880].forEach((f, i) => make(f, i * 0.1, 0.25, "triangle", 0.13)); }
    } catch (e) {}
  }

  function spawnEmbers() {
    const burst = Array.from({ length: 12 }, (_, i) => ({ id: Date.now() + i, x: 50 + (Math.random() * 60 - 30), angle: Math.random() * 360, dist: 40 + Math.random() * 80 }));
    setEmbers((e) => [...e, ...burst]);
    setTimeout(() => setEmbers((e) => e.filter((x) => !burst.find((b) => b.id === x.id))), 900);
  }

  function dealDamage(boss, amount, isCrit) {
    const dmg = Math.min(amount, boss.remaining);
    const newRemaining = Math.max(0, boss.remaining - dmg);
    const nowDead = boss.remaining > 0 && newRemaining <= 0;
    setBosses((prev) => prev.map((b) => b.id === boss.id ? { ...b, remaining: newRemaining } : b));
    saveBossRemaining(boss.id, newRemaining);
    supabase.from("payments").insert({ user_id: user.id, boss_id: boss.id, amount: dmg, was_crit: !!isCrit })
      .then(({ error }) => { if (error) console.error("Payment log failed:", error.message); });
    setBattleLog((l) => [{ id: "local-" + Date.now(), amount: dmg, was_crit: !!isCrit, created_at: new Date().toISOString() }, ...l]);
    setXp((x) => x + Math.floor(dmg / 10) * (isCrit ? 2 : 1));
    setStats((s) => ({ ...s, totalStrikes: s.totalStrikes + 1, totalDamage: s.totalDamage + dmg, bossesSlain: s.bossesSlain + (nowDead ? 1 : 0), biggestSlain: nowDead ? Math.max(s.biggestSlain, boss.total) : s.biggestSlain }));
    setSeasonDamage((d) => d + dmg);
    setHitFlash(true); setShakeStage(true);
    setTimeout(() => setHitFlash(false), 350);
    setTimeout(() => setShakeStage(false), isCrit ? 500 : 350);
    spawnEmbers();
    playSound(nowDead ? "victory" : isCrit ? "crit" : "hit");
    const id = Date.now();
    setFloatingDmg((f) => [...f, { id, amount: dmg, crit: isCrit }]);
    setTimeout(() => setFloatingDmg((f) => f.filter((x) => x.id !== id)), 1300);
    if (isCrit) { setCritText("CRITICAL STRIKE!"); setTimeout(() => setCritText(null), 1000); }
    if (nowDead) setTimeout(() => setVictoryBoss(boss), 600);
  }

  function handleStrike() {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0 || !activeBoss) return;
    const newCombo = combo + 1; setCombo(newCombo);
    clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 4000);
    const isCrit = newCombo >= 3 || amt >= activeBoss.minPayment * 3 || Math.random() < 0.18;
    dealDamage(activeBoss, amt, isCrit);
    setActiveBoss((b) => ({ ...b, remaining: Math.max(0, b.remaining - Math.min(amt, b.remaining)) }));
    setPayAmount("");
  }

  async function sendToAdvisor(userMsg) {
    const next = [...chat, { role: "user", content: userMsg }];
    setChat(next); setChatInput(""); setThinking(true);
    if (!isPremium) setCounselsUsed((c) => c + 1);
    const debtContext = bosses.map((b) => `${b.name} (${b.type}): $${b.remaining} left of $${b.total}, ${b.apr}% APR, min $${b.minPayment}/mo`).join("; ");
    const systemPrompt = `You are ${advisor.name}, a ${advisor.style} debt-advisor character in a dark fantasy RPG called Debt Slayer. Stay in character with light medieval-fantasy flavor, but give GENUINELY useful, accurate personal-finance advice (avalanche vs snowball, interest math, prioritization). Keep replies under 120 words. The player's current debts: ${debtContext}. Total debt: $${totalDebt}.`;
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, systemPrompt }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setChat((c) => [...c, { role: "assistant", content: data.text }]);
    } catch (e) {
      setChat((c) => [...c, { role: "assistant", content: `⚠️ The mystic link falters: ${e.message}` }]);
    } finally { setThinking(false); }
  }

  const advisorLocked = !isPremium && counselsUsed >= FREE_COUNSEL_LIMIT;

  async function handleSignOut() { await supabase.auth.signOut(); }

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* HEADER */}
      <header className="ds-header" style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.brandMark}>⚔</span>
          <div>
            <h1 className="ds-brand-title" style={styles.brandTitle}>DEBT SLAYER</h1>
            <p style={styles.brandSub}>Slay your debts. Reclaim your gold.</p>
          </div>
        </div>
        <div style={styles.statbar}>
          <Stat label="LVL" value={level} />
          <Stat label="XP" value={xp} />
          <Stat label="SLAIN" value={`${slainCount}/${bosses.length}`} />
          {!isPremium
            ? <button style={styles.crownBtn} onClick={() => setView("paywall")}>👑 GO PREMIUM</button>
            : <span style={styles.premiumBadge}>👑 SLAYER'S GUILD</span>
          }
          <button style={styles.signOutBtn} onClick={() => setView("settings")} title="Settings">⚙</button>
        </div>
      </header>

      {/* NAV */}
      <nav className="ds-nav" style={styles.nav}>
        {[["arena","🗡 The Arena"],["planner","🗺 Battle Planner"],["advisor","🔮 War Council"],["seasons","🏆 Seasons"]].map(([k, label]) => (
          <button key={k} onClick={() => setView(k)} style={{ ...styles.navBtn, ...(view === k ? styles.navBtnActive : {}) }}>{label}</button>
        ))}
      </nav>

      <main className="ds-main" style={styles.main}>

        {/* ARENA */}
        {view === "arena" && (
          <div className="fade-in">
            {bossesLoading ? (
              <p style={{ textAlign: "center", color: "#9a8f80", fontStyle: "italic", marginTop: 60 }}>⚔ Scouting the realm...</p>
            ) : bosses.length === 0 ? (
              <div style={styles.emptyRealm}>
                <div style={styles.emptySigil}>🏰</div>
                <h2 style={styles.emptyTitle}>The Realm Awaits Its Slayer</h2>
                <p style={styles.emptyText}>
                  Every debt you owe is a monster with a name, a hoard, and a weakness.
                  Summon your first boss — give your real debt a face — and begin the hunt.
                </p>
                <button style={styles.summonBtn} onClick={() => setShowSummon(true)}>
                  🔥 SUMMON YOUR FIRST BOSS
                </button>
                <p style={styles.emptyHint}>A credit card, a student loan, a car note... name your foe.</p>
              </div>
            ) : (
              <>
                <div style={styles.realmBanner}>
                  <p style={styles.realmLabel}>TOTAL CURSE UPON THE REALM</p>
                  <p className="ds-realm-total" style={styles.realmTotal}>${totalDebt.toLocaleString()}</p>
                  <div style={styles.realmBarOuter}><div style={{ ...styles.realmBarInner, width: `${totalOriginal > 0 ? ((totalOriginal - totalDebt) / totalOriginal) * 100 : 0}%` }} /></div>
                  <p style={styles.realmFreed}>{totalOriginal > 0 ? Math.round(((totalOriginal - totalDebt) / totalOriginal) * 100) : 0}% of the realm freed</p>
                </div>
                <div style={styles.arenaTopRow}>
                  <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>⚔ Bosses of the Realm</h2>
                  <button
                    style={styles.summonSmallBtn}
                    onClick={() => {
                      if (!isPremium && bosses.length >= FREE_BOSS_LIMIT) return setView("paywall");
                      setShowSummon(true);
                    }}
                  >
                    + Summon Boss
                  </button>
                </div>
                <div style={styles.bossGrid}>
                  {bosses.map((b) => {
                    const meta = BOSS_TYPES[b.type];
                    const hp = Math.min(100, (b.remaining / b.total) * 100);
                    const dead = b.remaining <= 0;
                    return (
                      <div key={b.id} className="boss-card" style={{ ...styles.bossCard, borderColor: dead ? GOLD : meta.color, opacity: dead ? 0.65 : 1 }}
                        onClick={() => openBoss(b)}>
                        <div style={{ ...styles.bossSigil, background: `radial-gradient(circle, ${meta.color}55, transparent)` }}>
                          <span style={{ fontSize: 40, filter: dead ? "grayscale(1)" : "none" }}>{meta.sigil}</span>
                        </div>
                        <div style={styles.bossName}>{b.name}</div>
                        <div style={styles.bossTitle}>{dead ? "💀 SLAIN" : meta.title}</div>
                        <div style={styles.hpOuter}><div style={{ ...styles.hpInner, width: `${hp}%`, background: dead ? GOLD : `linear-gradient(90deg, ${BLOOD}, ${EMBER})` }} /></div>
                        <div style={styles.hpText}>{dead ? "Vanquished" : `$${b.remaining.toLocaleString()} HP`} · {b.apr}% APR</div>
                      </div>
                    );
                  })}
                </div>
                {!isPremium && bosses.length >= FREE_BOSS_LIMIT && <p style={styles.freeTierNote}>Free Slayers track {FREE_BOSS_LIMIT} bosses. <button style={styles.inlineLink} onClick={() => setView("paywall")}>Join the Guild</button> to summon them all.</p>}
              </>
            )}
          </div>
        )}

        {/* BOSS BATTLE */}
        {view === "boss" && activeBoss && (() => {
          const meta = BOSS_TYPES[activeBoss.type];
          const hp = Math.min(100, (activeBoss.remaining / activeBoss.total) * 100);
          const dead = activeBoss.remaining <= 0;
          return (
            <div className="fade-in">
              <div style={styles.battleToolbar}>
                <button style={styles.backBtn} onClick={() => setView("arena")}>← Retreat to Arena</button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={styles.toolBtn} onClick={() => setEditBoss(activeBoss)}>⚙ Edit</button>
                  <button style={{ ...styles.toolBtn, color: "#c87a5a", borderColor: "#5a3028" }} onClick={() => banishBoss(activeBoss)}>☠ Banish</button>
                </div>
              </div>
              <div className={shakeStage ? "stage-shake" : ""} style={{ ...styles.battleStage, boxShadow: hitFlash ? `inset 0 0 140px ${BLOOD}` : "inset 0 0 80px #000" }}>
                {combo >= 2 && !dead && <div style={styles.comboMeter}><span style={styles.comboNum}>{combo}×</span><span style={styles.comboLabel}>COMBO</span></div>}
                {critText && <div className="crit-pop" style={styles.critText}>{critText}</div>}
                <div className={hitFlash ? "shake" : ""} style={styles.battleSigil}>
                  <span className="ds-battle-emoji" style={{ fontSize: 110, filter: dead ? "grayscale(1) blur(1px)" : "none", display: "inline-block" }}>{meta.sigil}</span>
                  {embers.map((e) => <span key={e.id} className="ember" style={{ left: `${e.x}%`, "--angle": `${e.angle}deg`, "--dist": `${e.dist}px` }}>✦</span>)}
                  {floatingDmg.map((f) => <span key={f.id} className="float-dmg" style={{ ...styles.floatDmg, fontSize: f.crit ? 42 : 28, color: f.crit ? GOLD : EMBER }}>-${f.amount.toLocaleString()}{f.crit ? "!" : ""}</span>)}
                </div>
                <h2 style={styles.battleName}>{activeBoss.name}</h2>
                <p style={styles.battleTitle}>{meta.title}</p>
                <div style={styles.battleHpOuter}>
                  <div style={{ ...styles.battleHpInner, width: `${hp}%` }} />
                  <span style={styles.battleHpLabel}>${activeBoss.remaining.toLocaleString()} / ${activeBoss.total.toLocaleString()}</span>
                </div>
                {dead ? (
                  <div style={styles.victory}><p style={styles.victoryText}>⚜ BOSS SLAIN ⚜</p><p style={styles.victorySub}>The realm grows brighter. Choose your next foe.</p></div>
                ) : (
                  <div style={styles.attackPanel}>
                    <p style={styles.attackHint}>Deal damage by logging a payment</p>
                    <div className="ds-attack-row" style={styles.attackRow}>
                      <span style={styles.dollarSign}>$</span>
                      <input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder={activeBoss.minPayment} style={styles.attackInput} />
                      <button className="ds-strike-btn" style={styles.strikeBtn} onClick={handleStrike}>⚔ STRIKE</button>
                    </div>
                    <div className="ds-quick-row" style={styles.quickRow}>
                      {[...new Set([activeBoss.minPayment, activeBoss.minPayment * 2, 500].filter((q) => q > 0))].map((q) => <button key={q} style={styles.quickBtn} onClick={() => setPayAmount(String(q))}>$ {q}</button>)}
                    </div>
                    <p style={styles.aprWarn}>⚠ This beast regenerates ~${Math.round((activeBoss.remaining * activeBoss.apr) / 100 / 12)}/mo from {activeBoss.apr}% APR</p>
                  </div>
                )}
              </div>
              {battleLog.length > 0 && (
                <div style={styles.logBox}>
                  <div style={styles.logHeader}>
                    <span style={styles.logTitle}>📜 Battle Log</span>
                    <span style={styles.logTotal}>Total dealt: ${battleLog.reduce((s, p) => s + Number(p.amount), 0).toLocaleString()}</span>
                  </div>
                  {battleLog.slice(0, 10).map((p) => (
                    <div key={p.id} style={styles.logRow}>
                      <span>{p.was_crit ? "💥 Critical strike" : "🗡 Strike"} · <b style={{ color: EMBER }}>${Number(p.amount).toLocaleString()}</b></span>
                      <span style={styles.logDate}>{new Date(p.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* WAR COUNCIL */}
        {view === "advisor" && (
          <div className="fade-in">
            <h2 style={styles.sectionTitle}>🔮 The War Council</h2>
            <p style={styles.councilSub}>Consult an advisor. They know your bosses and will counsel your strategy.</p>
            <div style={styles.advisorRow}>
              {ADVISORS.map((a) => {
                const locked = !isPremium && a.id !== "sage";
                return (
                  <div key={a.id} onClick={() => { if (locked) return setView("paywall"); setAdvisor(a); setChat([]); }}
                    style={{ ...styles.advisorCard, borderColor: advisor.id === a.id ? GOLD : "#3a3a44", opacity: locked ? 0.55 : 1 }}>
                    <span style={{ fontSize: 34 }}>{a.sigil}</span>
                    <div style={styles.advisorName}>{a.name}</div>
                    <div style={styles.advisorStyle}>{a.style}</div>
                    <div style={styles.advisorBlurb}>{a.blurb}</div>
                    {locked && <div style={styles.lockTag}>👑 Premium</div>}
                  </div>
                );
              })}
            </div>
            <div style={styles.chatWindow}>
              <div style={styles.chatHeader}><span style={{ fontSize: 22 }}>{advisor.sigil}</span> Speaking with <b style={{ color: GOLD }}>{advisor.name}</b></div>
              <div style={styles.chatScroll}>
                {chat.length === 0 && <p style={styles.chatEmpty}>{advisor.sigil} "{advisor.name} awaits your question, Slayer. Ask which boss to strike first, or how to break the curse of interest..."</p>}
                {chat.map((m, i) => <div key={i} style={m.role === "user" ? styles.userMsg : styles.aiMsg}>{m.content}</div>)}
                {thinking && <div style={styles.aiMsg}><span className="dots">consulting the runes</span></div>}
                <div ref={chatEndRef} />
              </div>
              {advisorLocked ? (
                <div style={styles.lockedChat}><p style={{ margin: 0, color: GOLD }}>👑 You've used your {FREE_COUNSEL_LIMIT} free counsels.</p><button style={styles.crownBtn} onClick={() => setView("paywall")}>Unlock Unlimited Counsel</button></div>
              ) : (
                <div className="ds-chat-input-row" style={styles.chatInputRow}>
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && chatInput.trim() && sendToAdvisor(chatInput.trim())} placeholder="Ask your advisor..." style={styles.chatInput} disabled={thinking} />
                  <button style={styles.sendBtn} onClick={() => chatInput.trim() && sendToAdvisor(chatInput.trim())} disabled={thinking}>Send</button>
                </div>
              )}
              {!isPremium && !advisorLocked && <p style={styles.freeCounsel}>{Math.max(0, FREE_COUNSEL_LIMIT - counselsUsed)} free counsels remaining</p>}
            </div>
          </div>
        )}

        {/* BATTLE PLANNER */}
        {view === "planner" && (() => {
          if (!isPremium) return (
            <div className="fade-in" style={styles.plannerLock}>
              <div style={{ fontSize: 50, filter: `drop-shadow(0 0 16px ${GOLD})` }}>🗺</div>
              <h2 style={styles.sectionTitle}>The Battle Planner is sealed</h2>
              <p style={styles.councilSub}>Mordrin's war map reveals the exact order to slay your bosses — and how much gold each strategy saves.</p>
              <button style={styles.crownBtn} onClick={() => setView("paywall")}>👑 Unlock the War Map</button>
            </div>
          );
          const avalanche = simulate("avalanche"), snowball = simulate("snowball");
          const chosen = strategy === "avalanche" ? avalanche : snowball;
          const other  = strategy === "avalanche" ? snowball : avalanche;
          const interestSaved = Math.max(0, other.totalInterest - chosen.totalInterest);
          const fmtDate = (d) => d?.toLocaleDateString(undefined, { month: "short", year: "numeric" });
          return (
            <div className="fade-in">
              <h2 style={styles.sectionTitle}>🗺 Battle Planner</h2>
              <p style={styles.councilSub}>Choose your campaign strategy and see the path to a debt-free realm.</p>
              <div style={styles.stratToggle}>
                <button onClick={() => setStrategy("avalanche")} style={{ ...styles.stratBtn, ...(strategy === "avalanche" ? styles.stratActive : {}) }}>🏔 Avalanche<span style={styles.stratHint}>Highest APR first · saves most gold</span></button>
                <button onClick={() => setStrategy("snowball")}  style={{ ...styles.stratBtn, ...(strategy === "snowball"  ? styles.stratActive : {}) }}>❄ Snowball<span style={styles.stratHint}>Smallest debt first · fastest wins</span></button>
              </div>
              <div style={styles.budgetBox}>
                <label style={styles.budgetLabel}>Extra gold per month (beyond minimums)</label>
                <div style={styles.budgetRow}>
                  <span style={styles.dollarSign}>$</span>
                  <input type="range" min="0" max="1500" step="25" value={extraBudget} onChange={(e) => setExtraBudget(e.target.value)} style={{ flex: 1, accentColor: GOLD }} />
                  <span style={styles.budgetVal}>${Number(extraBudget).toLocaleString()}</span>
                </div>
              </div>
              <div style={styles.planStats}>
                <PlanStat label="Realm freed by" value={fmtDate(chosen.freeDate)} big />
                <PlanStat label="Time to victory" value={`${Math.floor(chosen.months / 12)}y ${chosen.months % 12}m`} />
                <PlanStat label="Total interest paid" value={`$${chosen.totalInterest.toLocaleString()}`} />
                {interestSaved > 0 && <PlanStat label={`Saved vs ${strategy === "avalanche" ? "Snowball" : "Avalanche"}`} value={`$${interestSaved.toLocaleString()}`} gold />}
              </div>
              <h3 style={styles.orderTitle}>⚔ Order of Slaying</h3>
              <div style={styles.orderList}>
                {chosen.order.map((o, i) => {
                  const boss = bosses.find((b) => b.id === o.id);
                  const meta = BOSS_TYPES[boss.type];
                  const d = new Date(); d.setMonth(d.getMonth() + o.month);
                  return (
                    <div key={o.id} style={styles.orderRow}>
                      <span style={styles.orderNum}>{i + 1}</span>
                      <span style={{ fontSize: 26 }}>{meta.sigil}</span>
                      <div style={{ flex: 1 }}><div style={styles.orderName}>{o.name}</div><div style={styles.orderMeta}>{boss.apr}% APR · ${boss.remaining.toLocaleString()} HP</div></div>
                      <span style={styles.orderDate}>{fmtDate(d)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* SEASONS */}
        {view === "seasons" && (() => {
          const seasonPct = Math.min(100, (seasonDamage / season.goal) * 100);
          const seasonDone = seasonDamage >= season.goal;
          const rankIdx = Math.min(STREAK_RANKS.length - 1, stats.streak);
          return (
            <div className="fade-in">
              <div style={{ ...styles.seasonBanner, borderColor: season.color }}>
                <div style={styles.seasonGlow(season.color)} />
                <div style={styles.seasonInner}>
                  <div style={styles.seasonHead}><span style={{ fontSize: 40 }}>{season.sigil}</span><div><p style={styles.seasonTag}>SEASON · THIS MONTH</p><h2 style={{ ...styles.seasonName, color: season.color }}>{season.name}</h2></div></div>
                  <p style={styles.seasonLore}>"{season.lore}"</p>
                  <div style={styles.seasonBarOuter}>
                    <div style={{ ...styles.seasonBarInner, width: `${seasonPct}%`, background: `linear-gradient(90deg, ${season.color}, ${GOLD})` }} />
                    <span style={styles.seasonBarLabel}>${seasonDamage.toLocaleString()} / ${season.goal.toLocaleString()} slain</span>
                  </div>
                  {seasonDone ? <p style={styles.seasonReward}>🏆 Season conquered! Badge & skin unlocked.</p> : <p style={styles.seasonRewardPending}>Reach the goal to earn the <b style={{ color: season.color }}>{season.name}</b> badge. Resets in {daysLeftInMonth()} days.</p>}
                  
                </div>
              </div>
              <div style={styles.streakBox}>
                <div><p style={styles.streakLabel}>PAYMENT STREAK</p><p style={styles.streakValue}>🔥 {stats.streak} months</p></div>
                <div style={styles.streakRank}><span style={styles.streakRankLabel}>RANK</span><span style={styles.streakRankValue}>{STREAK_RANKS[rankIdx]}</span></div>
                <div style={styles.streakPips}>{STREAK_RANKS.map((r, i) => <div key={r} style={{ ...styles.streakPip, background: i <= rankIdx ? GOLD : "#2a2228" }} title={r} />)}</div>
              </div>
              <h3 style={styles.orderTitle}>🎖 Achievements <span style={styles.achCount}>{unlocked.length}/{ACHIEVEMENTS.length}</span></h3>
              <div style={styles.achGrid}>
                {ACHIEVEMENTS.map((a) => {
                  const got = unlocked.includes(a.id);
                  return <div key={a.id} style={{ ...styles.achCard, opacity: got ? 1 : 0.45, borderColor: got ? GOLD : "#2a2228" }}><span style={{ fontSize: 30, filter: got ? "none" : "grayscale(1)" }}>{a.sigil}</span><div style={styles.achName}>{a.name}</div><div style={styles.achDesc}>{a.desc}</div>{got && <div style={styles.achUnlocked}>✓ UNLOCKED</div>}</div>;
                })}
              </div>
            </div>
          );
        })()}

        {/* SETTINGS */}
        {view === "settings" && (
          <div className="fade-in" style={{ maxWidth: 620, margin: "0 auto" }}>
            <h2 style={styles.sectionTitle}>⚙ Settings</h2>

            <div style={styles.setCard}>
              <p style={styles.setLabel}>ACCOUNT</p>
              <div style={styles.setRow}><span>Signed in as</span><b>{user.email || "Slayer"}</b></div>
              <div style={styles.setRow}><span>Membership</span><b style={{ color: isPremium ? GOLD : "#9a8f80" }}>{isPremium ? "👑 Slayer's Guild" : "Free Slayer"}</b></div>
            </div>

            <div style={styles.setCard}>
              <p style={styles.setLabel}>MEMBERSHIP</p>
              {isPremium ? (
                <>
                  <p style={styles.setText}>You're a member of the Slayer's Guild — unlimited bosses, the Battle Planner, and unlimited AI counsel are yours.</p>
                  <button style={styles.setDangerBtn} onClick={() => alert("Once Stripe is connected, this opens the billing portal where you can cancel or update payment. You'll keep premium until the end of your billing period.")}>Manage / Cancel Subscription</button>
                  <p style={styles.setHint}>Cancel anytime. You keep access until your billing period ends.</p>
                </>
              ) : (
                <>
                  <p style={styles.setText}>You're on the free tier: 2 bosses, 5 AI counsels. Upgrade for the full arsenal.</p>
                  <button style={styles.crownBtn} onClick={() => setView("paywall")}>👑 Upgrade to Slayer's Guild — $4.99/mo</button>
                </>
              )}
            </div>

            <div style={styles.setCard}>
              <p style={styles.setLabel}>LEGAL</p>
              <div style={styles.setLinks}>
                <button style={styles.inlineLink} onClick={() => onShowPolicy("terms")}>Terms of Service</button>
                <button style={styles.inlineLink} onClick={() => onShowPolicy("privacy")}>Privacy Policy</button>
                <button style={styles.inlineLink} onClick={() => onShowPolicy("refunds")}>Cancellation & Refunds</button>
              </div>
            </div>

            <div style={styles.setCard}>
              <p style={styles.setLabel}>SESSION</p>
              <button style={styles.setDangerBtn} onClick={handleSignOut}>↩ Sign Out</button>
            </div>

            <button style={styles.backBtn} onClick={() => setView("arena")}>← Back to the Arena</button>
          </div>
        )}

        {/* PAYWALL */}
        {view === "paywall" && (
          <div className="fade-in" style={styles.paywall}>
            <div style={styles.paywallCrown}>👑</div>
            <h2 style={styles.paywallTitle}>JOIN THE SLAYER'S GUILD</h2>
            <p style={styles.paywallSub}>Unlock the full arsenal for your campaign against debt.</p>
            <div style={styles.priceTag}><span style={styles.price}>$4.99</span><span style={styles.priceUnit}>/month</span></div>
            <div style={styles.featureList}>
              {["🗺 The Battle Planner — exact payoff order, debt-free date & interest saved","🔮 Unlimited AI War Council across all 3 advisors","⚔ Unlimited bosses (free tier tracks 2)","🏆 Permanent season badges, streak ranks & achievements"].map((f) => <div key={f} style={styles.featureItem}>{f}</div>)}
            </div>
            <button style={styles.subscribeBtn} onClick={() => { setIsPremium(true); setView("advisor"); }}>⚔ ENLIST NOW (Demo unlock — Stripe coming next)</button>
            <button style={styles.maybeLater} onClick={() => setView("arena")}>Maybe later</button>
          </div>
        )}
      </main>

      {/* SUMMON BOSS MODAL */}
      {showSummon && <SummonModal onSummon={summonBoss} onClose={() => setShowSummon(false)} />}

      {/* EDIT BOSS MODAL */}
      {editBoss && <EditBossModal boss={editBoss} onSave={updateBoss} onClose={() => setEditBoss(null)} />}

      {/* VICTORY OVERLAY */}
      {victoryBoss && (() => {
        const meta = BOSS_TYPES[victoryBoss.type];
        return (
          <div style={styles.victoryOverlay} onClick={() => { setVictoryBoss(null); setView("arena"); }}>
            <div className="victory-burst" style={styles.victoryCard}>
              <div className="victory-rays" style={styles.victoryRays} />
              <div className="victory-sigil" style={{ fontSize: 90 }}>{meta.sigil}</div>
              <p style={styles.victoryBanner}>⚜ BOSS SLAIN ⚜</p>
              <h2 style={styles.victoryBossName}>{victoryBoss.name}</h2>
              <p style={styles.victoryFlavor}>The {meta.title} falls. The realm grows brighter.</p>
              <div style={styles.victoryRewards}><span>+{Math.floor(victoryBoss.total / 10)} XP</span><span>·</span><span>+1 Boss Slain</span></div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button style={styles.shareBtn} onClick={(e) => { e.stopPropagation(); shareVictory(victoryBoss); }}>📜 Share Victory</button>
                <button style={styles.victoryBtn} onClick={() => { setVictoryBoss(null); setView("arena"); }}>Claim Victory</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ACHIEVEMENT TOAST */}
      {toast && (
        <div className="toast-in" style={styles.toast}>
          <span style={{ fontSize: 32 }}>{toast.sigil}</span>
          <div><p style={styles.toastTitle}>🎖 Achievement Unlocked</p><p style={styles.toastName}>{toast.name}</p><p style={styles.toastDesc}>{toast.desc}</p></div>
        </div>
      )}

      <footer style={styles.footer}>
        Debt Slayer · a dark fantasy money RPG · signed in as {user.email || "Slayer"}
        <br />
        <button style={styles.inlineLink} onClick={() => onShowPolicy("terms")}>Terms</button> ·{" "}
        <button style={styles.inlineLink} onClick={() => onShowPolicy("privacy")}>Privacy</button> ·{" "}
        <button style={styles.inlineLink} onClick={() => onShowPolicy("refunds")}>Cancellation</button>
        <br />Payoff projections are estimates only — not financial advice.
        <button style={{ ...styles.inlineLink, marginLeft: 12 }} onClick={handleSignOut}>sign out</button>
      </footer>
    </div>
  );
}

function Stat({ label, value }) {
  return <div style={styles.stat}><span style={styles.statValue}>{value}</span><span style={styles.statLabel}>{label}</span></div>;
}

// ============================================================
// SUMMON BOSS MODAL — turn a real debt into a monster
// ============================================================
function SummonModal({ onSummon, onClose }) {
  const [step, setStep]       = useState(1);
  const [type, setType]       = useState(null);
  const [name, setName]       = useState("");
  const [total, setTotal]     = useState("");
  const [apr, setApr]         = useState("");
  const [minPayment, setMinPayment] = useState("");
  const [summoning, setSummoning]   = useState(false);

  function pickType(t) {
    setType(t);
    setName(randomBossName(t));
    setStep(2);
  }

  function rerollName() { setName(randomBossName(type)); }

  async function handleSummon() {
    const t = parseFloat(total);
    if (!name.trim() || !t || t <= 0) return;
    setSummoning(true);
    await onSummon({
      name: name.trim(),
      type,
      total: t,
      apr: parseFloat(apr) || 0,
      minPayment: parseFloat(minPayment) || 0,
    });
    setSummoning(false);
  }

  const meta = type ? BOSS_TYPES[type] : null;

  return (
    <div style={styles.summonOverlay} onClick={onClose}>
      <div className="victory-burst" style={styles.summonCard} onClick={(e) => e.stopPropagation()}>
        <button style={styles.summonClose} onClick={onClose}>✕</button>

        {step === 1 && (
          <>
            <h2 style={styles.summonTitle}>🔥 Summon a Boss</h2>
            <p style={styles.summonSub}>What manner of debt haunts you, Slayer?</p>
            <div style={styles.typeGrid}>
              {Object.entries(BOSS_TYPES).map(([key, t]) => (
                <button key={key} style={styles.typeCard} onClick={() => pickType(key)} className="boss-card">
                  <span style={{ fontSize: 36 }}>{t.sigil}</span>
                  <span style={styles.typeName}>{key === "credit" ? "Credit Card" : key === "student" ? "Student Loan" : key === "car" ? "Car Loan" : key === "mortgage" ? "Mortgage" : key === "medical" ? "Medical Debt" : "Personal Loan"}</span>
                  <span style={styles.typeTitle}>{t.title}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && meta && (
          <>
            <button style={styles.summonBack} onClick={() => setStep(1)}>← choose another foe</button>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 64, filter: `drop-shadow(0 0 20px ${meta.color})` }}>{meta.sigil}</span>
            </div>
            <h2 style={{ ...styles.summonTitle, marginTop: 0 }}>Name Your Foe</h2>

            <label style={styles.summonLabel}>BOSS NAME</label>
            <div style={styles.nameRow}>
              <input style={{ ...styles.summonInput, marginBottom: 0, flex: 1 }} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
              <button style={styles.rerollBtn} onClick={rerollName} title="Roll a new name">🎲</button>
            </div>

            <label style={styles.summonLabel}>HOW MUCH DO YOU OWE? (the boss's HP)</label>
            <div style={styles.moneyRow}>
              <span style={styles.dollarSign}>$</span>
              <input style={{ ...styles.summonInput, marginBottom: 0, border: "none", background: "transparent" }} type="number" placeholder="5,000" value={total} onChange={(e) => setTotal(e.target.value)} />
            </div>

            <div style={styles.summonTwoCol}>
              <div style={{ flex: 1 }}>
                <label style={styles.summonLabel}>APR % <span style={styles.optionalTag}>(its regeneration)</span></label>
                <input style={styles.summonInput} type="number" placeholder="22.9" value={apr} onChange={(e) => setApr(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.summonLabel}>MIN PAYMENT <span style={styles.optionalTag}>(optional)</span></label>
                <input style={styles.summonInput} type="number" placeholder="95" value={minPayment} onChange={(e) => setMinPayment(e.target.value)} />
              </div>
            </div>

            <button
              style={{ ...styles.summonBtn, width: "100%", opacity: !name.trim() || !parseFloat(total) ? 0.5 : 1 }}
              onClick={handleSummon}
              disabled={summoning || !name.trim() || !parseFloat(total)}
            >
              {summoning ? "Summoning..." : "⚔ SUMMON & BEGIN THE HUNT"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
function PlanStat({ label, value, big, gold }) {
  return (
    <div style={{ ...styles.planStat, ...(gold ? { borderColor: GOLD, background: `${GOLD}11` } : {}) }}>
      <span style={{ ...styles.planStatValue, fontSize: big ? 26 : 20, color: gold ? GOLD : "#e8e0d4" }}>{value}</span>
      <span style={styles.planStatLabel}>{label}</span>
    </div>
  );
}

// ============================================================
// EDIT BOSS MODAL — fix typos, update balances, refinance
// ============================================================
function EditBossModal({ boss, onSave, onClose }) {
  const [name, setName]             = useState(boss.name);
  const [remaining, setRemaining]   = useState(String(boss.remaining));
  const [apr, setApr]               = useState(String(boss.apr));
  const [minPayment, setMinPayment] = useState(String(boss.minPayment));
  const [saving, setSaving]         = useState(false);
  const meta = BOSS_TYPES[boss.type];

  async function handleSave() {
    const r = parseFloat(remaining);
    if (!name.trim() || isNaN(r) || r < 0) return;
    setSaving(true);
    await onSave({
      ...boss,
      name: name.trim(),
      remaining: r,
      apr: parseFloat(apr) || 0,
      minPayment: parseFloat(minPayment) || 0,
    });
    setSaving(false);
  }

  return (
    <div style={styles.summonOverlay} onClick={onClose}>
      <div className="victory-burst" style={styles.summonCard} onClick={(e) => e.stopPropagation()}>
        <button style={styles.summonClose} onClick={onClose}>✕</button>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 56, filter: `drop-shadow(0 0 20px ${meta.color})` }}>{meta.sigil}</span>
        </div>
        <h2 style={{ ...styles.summonTitle, marginTop: 0 }}>Edit Boss</h2>
        <p style={styles.summonSub}>Balances change. Update the beast to match reality.</p>

        <label style={styles.summonLabel}>BOSS NAME</label>
        <input style={styles.summonInput} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />

        <label style={styles.summonLabel}>CURRENT BALANCE (its HP)</label>
        <div style={styles.moneyRow}>
          <span style={styles.dollarSign}>$</span>
          <input style={{ ...styles.summonInput, marginBottom: 0, border: "none", background: "transparent" }} type="number" value={remaining} onChange={(e) => setRemaining(e.target.value)} />
        </div>

        <div style={styles.summonTwoCol}>
          <div style={{ flex: 1 }}>
            <label style={styles.summonLabel}>APR %</label>
            <input style={styles.summonInput} type="number" value={apr} onChange={(e) => setApr(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.summonLabel}>MIN PAYMENT</label>
            <input style={styles.summonInput} type="number" value={minPayment} onChange={(e) => setMinPayment(e.target.value)} />
          </div>
        </div>

        <button style={{ ...styles.summonBtn, width: "100%", marginTop: 20 }} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "⚔ UPDATE THE BEAST"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CSS
// ============================================================
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=EB+Garamond:ital@0;1&display=swap');
* { box-sizing: border-box; }
.fade-in { animation: fadeIn .5s ease both; }
@keyframes fadeIn { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;} }
.boss-card { transition: transform .2s, box-shadow .2s; cursor: pointer; }
.boss-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 12px 40px rgba(0,0,0,.6); }
.shake { animation: shake .35s; }
@keyframes shake { 0%,100%{transform:translateX(0);}20%{transform:translateX(-10px) rotate(-2deg);}40%{transform:translateX(10px) rotate(2deg);}60%{transform:translateX(-6px);}80%{transform:translateX(6px);} }
.float-dmg { position:absolute;top:0;left:50%;animation:floatUp 1.2s ease-out forwards; }
@keyframes floatUp { from{opacity:1;transform:translate(-50%,0) scale(1);}to{opacity:0;transform:translate(-50%,-90px) scale(1.4);} }
.dots::after { content:'';animation:dots 1.4s steps(4,end) infinite; }
@keyframes dots { 0%{content:'';}25%{content:'.';}50%{content:'..';}75%{content:'...';} }
input:focus { outline: 1px solid #d4af37; }
.stage-shake { animation: stageShake .4s; }
@keyframes stageShake { 0%,100%{transform:translate(0,0);}15%{transform:translate(-8px,4px);}30%{transform:translate(8px,-4px);}45%{transform:translate(-6px,-3px);}60%{transform:translate(6px,3px);}75%{transform:translate(-3px,2px);} }
.ember { position:absolute;top:40%;font-size:14px;color:#ff6b35;pointer-events:none;animation:emberFly .9s ease-out forwards;text-shadow:0 0 8px #ff6b35; }
@keyframes emberFly { from{opacity:1;transform:rotate(var(--angle)) translateY(0) scale(1);}to{opacity:0;transform:rotate(var(--angle)) translateY(calc(var(--dist)*-1)) scale(.2);} }
.crit-pop { animation: critPop .9s ease-out forwards; }
@keyframes critPop { 0%{opacity:0;transform:translateX(-50%) scale(.4) rotate(-8deg);}25%{opacity:1;transform:translateX(-50%) scale(1.15) rotate(3deg);}70%{opacity:1;transform:translateX(-50%) scale(1);}100%{opacity:0;transform:translateX(-50%) scale(1.1);} }
.victory-burst { animation: victoryBurst .6s cubic-bezier(.2,1.3,.4,1) both; }
@keyframes victoryBurst { from{opacity:0;transform:scale(.6);}to{opacity:1;transform:scale(1);} }
.victory-rays { animation: spin 14s linear infinite; }
@keyframes spin { to{transform:rotate(360deg);} }
.victory-sigil { animation: floatBob 2.4s ease-in-out infinite; }
@keyframes floatBob { 0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);} }
.toast-in { animation: toastIn .4s cubic-bezier(.2,1.3,.4,1) both; }
@keyframes toastIn { from{opacity:0;transform:translateX(120%);}to{opacity:1;transform:none;} }
@media (max-width: 640px) {
  .ds-header { padding: 14px 16px !important; }
  .ds-main { padding: 16px !important; }
  .ds-nav { padding: 10px 16px !important; gap: 6px !important; }
  .ds-nav button { padding: 7px 12px !important; font-size: 12px !important; }
  .ds-brand-title { font-size: 20px !important; letter-spacing: 2px !important; }
  .ds-realm-total { font-size: 32px !important; }
  .ds-battle-emoji { font-size: 76px !important; }
  .ds-attack-row { flex-wrap: wrap !important; padding: 10px 14px !important; }
  .ds-attack-row input { min-width: 0 !important; }
  .ds-strike-btn { width: 100% !important; padding: 16px !important; font-size: 16px !important; margin-top: 4px !important; }
  .ds-quick-row button { padding: 12px 18px !important; font-size: 15px !important; }
  .ds-chat-input-row { flex-wrap: wrap !important; }
  .ds-chat-input-row input { width: 100% !important; flex: none !important; }
  .ds-chat-input-row button { width: 100% !important; padding: 14px !important; }
}
`;

// ============================================================
// STYLES
// ============================================================
const styles = {
  root: { fontFamily:"'EB Garamond',serif", background:"radial-gradient(ellipse at top,#1a1218 0%,#0a0608 60%,#050304 100%)", minHeight:"100vh", color:"#e8e0d4", overflowX:"hidden", width:"100%" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 28px", borderBottom:`1px solid ${GOLD}33`, flexWrap:"wrap", gap:16 },
  brand: { display:"flex", alignItems:"center", gap:14 },
  brandMark: { fontSize:38, color:GOLD, textShadow:`0 0 20px ${EMBER}` },
  brandTitle: { fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:26, margin:0, letterSpacing:3, color:GOLD },
  brandSub: { margin:0, fontSize:13, fontStyle:"italic", color:"#9a8f80" },
  statbar: { display:"flex", alignItems:"center", gap:18 },
  stat: { textAlign:"center" },
  statValue: { display:"block", fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:18, color:"#e8e0d4" },
  statLabel: { fontSize:10, letterSpacing:2, color:"#7a7060" },
  crownBtn: { fontFamily:"'Cinzel',serif", background:`linear-gradient(135deg,${GOLD},#9a7d1e)`, color:"#1a1208", border:"none", padding:"10px 16px", borderRadius:4, fontWeight:700, cursor:"pointer", letterSpacing:1, fontSize:12 },
  premiumBadge: { fontFamily:"'Cinzel',serif", color:GOLD, border:`1px solid ${GOLD}`, padding:"8px 14px", borderRadius:4, fontSize:12, letterSpacing:1 },
  signOutBtn: { background:"transparent", border:"1px solid #3a3038", color:"#9a8f80", borderRadius:4, padding:"6px 10px", cursor:"pointer", fontSize:16 },
  nav: { display:"flex", gap:8, padding:"14px 28px", borderBottom:"1px solid #2a2228", flexWrap:"wrap" },
  navBtn: { fontFamily:"'Cinzel',serif", background:"transparent", color:"#9a8f80", border:"1px solid #3a3038", padding:"8px 18px", borderRadius:4, cursor:"pointer", letterSpacing:1, fontSize:13 },
  navBtnActive: { color:GOLD, borderColor:GOLD, background:`${GOLD}11` },
  main: { padding:"28px", maxWidth:1000, margin:"0 auto" },
  realmBanner: { background:"linear-gradient(135deg,#1c1016,#120a0e)", border:`1px solid ${BLOOD}55`, borderRadius:8, padding:"24px 28px", marginBottom:28, boxShadow:"0 8px 30px rgba(0,0,0,.5)" },
  realmLabel: { margin:0, fontSize:12, letterSpacing:3, color:"#9a8f80" },
  realmTotal: { fontFamily:"'Cinzel',serif", fontSize:44, fontWeight:900, margin:"6px 0", color:EMBER, textShadow:`0 0 30px ${BLOOD}` },
  realmBarOuter: { height:10, background:"#000", borderRadius:5, overflow:"hidden", border:"1px solid #2a2228" },
  realmBarInner: { height:"100%", background:`linear-gradient(90deg,${GOLD},${EMBER})`, transition:"width .8s ease" },
  realmFreed: { margin:"8px 0 0", fontSize:13, color:GOLD, fontStyle:"italic" },
  sectionTitle: { fontFamily:"'Cinzel',serif", fontSize:22, color:"#e8e0d4", letterSpacing:1, marginBottom:18 },
  bossGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:18 },
  bossCard: { position:"relative", background:"linear-gradient(160deg,#1a141a,#0e0a0e)", border:"2px solid", borderRadius:10, padding:20, textAlign:"center" },
  bossSigil: { width:80, height:80, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" },
  bossName: { fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:17 },
  bossTitle: { fontSize:12, fontStyle:"italic", color:"#9a8f80", marginBottom:14, minHeight:30 },
  hpOuter: { height:8, background:"#000", borderRadius:4, overflow:"hidden", marginBottom:8 },
  hpInner: { height:"100%", transition:"width .6s ease" },
  hpText: { fontSize:12, color:"#c8bca8" },
  backBtn: { fontFamily:"'Cinzel',serif", background:"transparent", color:"#9a8f80", border:"none", cursor:"pointer", fontSize:14, marginBottom:16 },
  battleStage: { background:"radial-gradient(ellipse at center,#1c1016,#080406)", border:`1px solid ${BLOOD}55`, borderRadius:12, padding:"40px 28px", textAlign:"center", transition:"box-shadow .2s" },
  battleSigil: { position:"relative", display:"inline-block", marginBottom:10 },
  floatDmg: { fontFamily:"'Cinzel',serif", fontWeight:900, color:EMBER, textShadow:"0 0 12px #000" },
  battleName: { fontFamily:"'Cinzel',serif", fontSize:30, margin:"4px 0", color:"#e8e0d4" },
  battleTitle: { fontStyle:"italic", color:"#9a8f80", marginTop:0 },
  battleHpOuter: { position:"relative", height:26, background:"#000", borderRadius:13, overflow:"hidden", maxWidth:480, margin:"20px auto", border:"1px solid #2a2228" },
  battleHpInner: { height:"100%", background:`linear-gradient(90deg,${BLOOD},${EMBER})`, transition:"width .6s ease" },
  battleHpLabel: { position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", textShadow:"0 0 4px #000" },
  attackPanel: { maxWidth:440, margin:"0 auto" },
  attackHint: { fontSize:14, color:"#9a8f80" },
  attackRow: { display:"flex", alignItems:"center", gap:8, background:"#0a0608", border:`1px solid ${GOLD}55`, borderRadius:6, padding:"6px 12px" },
  dollarSign: { fontSize:22, color:GOLD },
  attackInput: { flex:1, background:"transparent", border:"none", color:"#e8e0d4", fontSize:22, fontFamily:"'Cinzel',serif", padding:"8px" },
  strikeBtn: { fontFamily:"'Cinzel',serif", background:`linear-gradient(135deg,${BLOOD},${EMBER})`, color:"#fff", border:"none", padding:"12px 20px", borderRadius:4, fontWeight:700, cursor:"pointer", letterSpacing:1 },
  quickRow: { display:"flex", gap:8, justifyContent:"center", marginTop:12 },
  quickBtn: { background:"transparent", border:"1px solid #3a3038", color:"#c8bca8", padding:"6px 14px", borderRadius:4, cursor:"pointer", fontFamily:"'Cinzel',serif" },
  aprWarn: { marginTop:16, fontSize:13, color:"#c87a5a", fontStyle:"italic" },
  victory: { marginTop:20 },
  victoryText: { fontFamily:"'Cinzel',serif", fontSize:30, color:GOLD, textShadow:`0 0 24px ${EMBER}`, margin:0 },
  victorySub: { color:"#9a8f80", fontStyle:"italic" },
  councilSub: { color:"#9a8f80", fontStyle:"italic", marginTop:-8, marginBottom:20 },
  advisorRow: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:24 },
  advisorCard: { position:"relative", background:"linear-gradient(160deg,#1a141a,#0e0a0e)", border:"2px solid", borderRadius:10, padding:18, textAlign:"center", cursor:"pointer" },
  advisorName: { fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:15, marginTop:8 },
  advisorStyle: { fontSize:12, color:GOLD, fontStyle:"italic" },
  advisorBlurb: { fontSize:12, color:"#9a8f80", marginTop:6 },
  lockTag: { position:"absolute", top:8, right:8, fontSize:10, color:GOLD, border:`1px solid ${GOLD}`, borderRadius:3, padding:"2px 6px" },
  chatWindow: { background:"linear-gradient(160deg,#140e12,#0a0608)", border:`1px solid ${GOLD}33`, borderRadius:10, overflow:"hidden" },
  chatHeader: { padding:"14px 18px", borderBottom:"1px solid #2a2228", fontSize:14, display:"flex", alignItems:"center", gap:8 },
  chatScroll: { height:320, overflowY:"auto", padding:18, display:"flex", flexDirection:"column", gap:12 },
  chatEmpty: { fontStyle:"italic", color:"#7a7060", textAlign:"center", marginTop:40, lineHeight:1.6 },
  userMsg: { alignSelf:"flex-end", background:`${BLOOD}44`, border:`1px solid ${BLOOD}`, padding:"10px 14px", borderRadius:"12px 12px 2px 12px", maxWidth:"78%", fontSize:15, lineHeight:1.5 },
  aiMsg: { alignSelf:"flex-start", background:"#1a1620", border:`1px solid ${GOLD}33`, padding:"10px 14px", borderRadius:"12px 12px 12px 2px", maxWidth:"82%", fontSize:15, lineHeight:1.55 },
  chatInputRow: { display:"flex", gap:8, padding:14, borderTop:"1px solid #2a2228" },
  chatInput: { flex:1, background:"#0a0608", border:"1px solid #3a3038", color:"#e8e0d4", padding:"12px 14px", borderRadius:6, fontSize:15, fontFamily:"'EB Garamond',serif" },
  sendBtn: { fontFamily:"'Cinzel',serif", background:GOLD, color:"#1a1208", border:"none", padding:"0 22px", borderRadius:6, fontWeight:700, cursor:"pointer" },
  freeCounsel: { textAlign:"center", fontSize:12, color:"#7a7060", padding:"0 0 12px" },
  lockedChat: { padding:24, textAlign:"center", borderTop:"1px solid #2a2228", display:"flex", flexDirection:"column", gap:12, alignItems:"center" },
  paywall: { maxWidth:520, margin:"0 auto", textAlign:"center", background:"linear-gradient(160deg,#1c1016,#0a0608)", border:`1px solid ${GOLD}55`, borderRadius:12, padding:"40px 32px" },
  paywallCrown: { fontSize:56, filter:`drop-shadow(0 0 20px ${GOLD})` },
  paywallTitle: { fontFamily:"'Cinzel',serif", fontSize:28, color:GOLD, letterSpacing:2, margin:"12px 0 4px" },
  paywallSub: { color:"#9a8f80", fontStyle:"italic", marginTop:0 },
  priceTag: { margin:"20px 0" },
  price: { fontFamily:"'Cinzel',serif", fontSize:48, fontWeight:900, color:"#e8e0d4" },
  priceUnit: { fontSize:18, color:"#9a8f80" },
  featureList: { textAlign:"left", display:"flex", flexDirection:"column", gap:12, margin:"24px 0" },
  featureItem: { fontSize:15, color:"#d8cdba", paddingLeft:4 },
  subscribeBtn: { width:"100%", fontFamily:"'Cinzel',serif", background:`linear-gradient(135deg,${GOLD},#9a7d1e)`, color:"#1a1208", border:"none", padding:"16px", borderRadius:6, fontWeight:700, fontSize:16, cursor:"pointer", letterSpacing:1 },
  maybeLater: { background:"transparent", border:"none", color:"#7a7060", marginTop:14, cursor:"pointer", fontSize:14 },
  footer: { textAlign:"center", padding:"30px", color:"#5a5048", fontSize:12, fontStyle:"italic" },
  plannerLock: { textAlign:"center", maxWidth:480, margin:"40px auto", background:"linear-gradient(160deg,#1c1016,#0a0608)", border:`1px solid ${GOLD}44`, borderRadius:12, padding:"40px 32px" },
  stratToggle: { display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" },
  stratBtn: { flex:1, minWidth:180, display:"flex", flexDirection:"column", gap:4, fontFamily:"'Cinzel',serif", background:"linear-gradient(160deg,#1a141a,#0e0a0e)", color:"#c8bca8", border:"2px solid #3a3038", padding:"16px", borderRadius:8, cursor:"pointer", fontSize:16 },
  stratActive: { borderColor:GOLD, color:GOLD, background:`${GOLD}11` },
  stratHint: { fontFamily:"'EB Garamond',serif", fontSize:12, color:"#9a8f80", fontStyle:"italic" },
  budgetBox: { background:"linear-gradient(160deg,#140e12,#0a0608)", border:"1px solid #2a2228", borderRadius:8, padding:"18px 20px", marginBottom:20 },
  budgetLabel: { fontSize:13, color:"#9a8f80", letterSpacing:1 },
  budgetRow: { display:"flex", alignItems:"center", gap:12, marginTop:12 },
  budgetVal: { fontFamily:"'Cinzel',serif", fontSize:20, color:GOLD, minWidth:80, textAlign:"right" },
  planStats: { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:28 },
  planStat: { background:"linear-gradient(160deg,#1a141a,#0e0a0e)", border:"1px solid #2a2228", borderRadius:8, padding:"16px", textAlign:"center" },
  planStatValue: { display:"block", fontFamily:"'Cinzel',serif", fontWeight:700 },
  planStatLabel: { fontSize:11, letterSpacing:1, color:"#7a7060", marginTop:4, display:"block" },
  orderTitle: { fontFamily:"'Cinzel',serif", fontSize:18, color:"#e8e0d4", marginBottom:14 },
  orderList: { display:"flex", flexDirection:"column", gap:10 },
  orderRow: { display:"flex", alignItems:"center", gap:14, background:"linear-gradient(160deg,#1a141a,#0e0a0e)", border:"1px solid #2a2228", borderRadius:8, padding:"12px 16px" },
  orderNum: { fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:18, color:GOLD, width:24 },
  orderName: { fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:15 },
  orderMeta: { fontSize:12, color:"#9a8f80" },
  orderDate: { fontFamily:"'Cinzel',serif", fontSize:13, color:EMBER },
  freeTierNote: { textAlign:"center", marginTop:20, color:"#9a8f80", fontStyle:"italic", fontSize:14 },
  inlineLink: { background:"none", border:"none", color:GOLD, cursor:"pointer", fontSize:14, textDecoration:"underline", fontFamily:"'EB Garamond',serif", fontStyle:"italic" },
  bossLockOverlay: { position:"absolute", top:0, left:0, right:0, bottom:0, background:"rgba(8,4,6,.55)", borderRadius:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, zIndex:2 },
  bossLockText: { fontFamily:"'Cinzel',serif", fontSize:12, color:GOLD, letterSpacing:1 },
  comboMeter: { position:"absolute", top:16, right:20, textAlign:"right", zIndex:3 },
  comboNum: { display:"block", fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:34, color:GOLD, textShadow:`0 0 16px ${EMBER}`, lineHeight:1 },
  comboLabel: { fontSize:11, letterSpacing:3, color:"#9a8f80" },
  critText: { position:"absolute", top:"32%", left:"50%", fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:30, color:GOLD, textShadow:`0 0 20px ${EMBER},0 2px 4px #000`, letterSpacing:2, zIndex:4, pointerEvents:"none" },
  seasonBanner: { position:"relative", overflow:"hidden", border:"2px solid", borderRadius:12, marginBottom:24, background:"linear-gradient(160deg,#16101a,#0a0608)" },
  seasonGlow: (c) => ({ position:"absolute", top:-80, right:-80, width:240, height:240, borderRadius:"50%", background:`radial-gradient(circle,${c}44,transparent 70%)`, pointerEvents:"none" }),
  seasonInner: { position:"relative", padding:"24px 28px", zIndex:1 },
  seasonHead: { display:"flex", alignItems:"center", gap:16 },
  seasonTag: { margin:0, fontSize:11, letterSpacing:3, color:"#9a8f80" },
  seasonName: { fontFamily:"'Cinzel',serif", fontSize:28, margin:"2px 0", fontWeight:900 },
  seasonLore: { fontStyle:"italic", color:"#c8bca8", margin:"12px 0 18px" },
  seasonBarOuter: { position:"relative", height:28, background:"#000", borderRadius:14, overflow:"hidden", border:"1px solid #2a2228" },
  seasonBarInner: { height:"100%", transition:"width .8s ease" },
  seasonBarLabel: { position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", textShadow:"0 0 4px #000", fontFamily:"'Cinzel',serif" },
  seasonReward: { color:GOLD, fontFamily:"'Cinzel',serif", marginTop:14 },
  seasonRewardPending: { color:"#9a8f80", marginTop:14, fontSize:14 },
  seasonFree: { marginTop:10, fontSize:13, color:"#7a7060", fontStyle:"italic" },
  streakBox: { display:"flex", alignItems:"center", gap:24, background:"linear-gradient(160deg,#1a141a,#0e0a0e)", border:"1px solid #2a2228", borderRadius:10, padding:"18px 24px", marginBottom:28, flexWrap:"wrap" },
  streakLabel: { margin:0, fontSize:11, letterSpacing:2, color:"#7a7060" },
  streakValue: { margin:"4px 0 0", fontFamily:"'Cinzel',serif", fontSize:24, color:EMBER },
  streakRank: { textAlign:"center" },
  streakRankLabel: { display:"block", fontSize:11, letterSpacing:2, color:"#7a7060" },
  streakRankValue: { fontFamily:"'Cinzel',serif", fontSize:20, color:GOLD },
  streakPips: { display:"flex", gap:8, marginLeft:"auto" },
  streakPip: { width:22, height:8, borderRadius:4 },
  achCount: { fontSize:14, color:GOLD, fontFamily:"'EB Garamond',serif" },
  achGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:14 },
  achCard: { position:"relative", background:"linear-gradient(160deg,#1a141a,#0e0a0e)", border:"2px solid", borderRadius:10, padding:"18px 14px", textAlign:"center" },
  achName: { fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:14, marginTop:8 },
  achDesc: { fontSize:12, color:"#9a8f80", marginTop:4 },
  achUnlocked: { fontSize:10, color:GOLD, letterSpacing:1, marginTop:8 },
  victoryOverlay: { position:"fixed", inset:0, background:"rgba(4,2,6,.88)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, cursor:"pointer", backdropFilter:"blur(4px)" },
  victoryCard: { position:"relative", textAlign:"center", padding:"40px", maxWidth:420 },
  victoryRays: { position:"absolute", top:"50%", left:"50%", width:500, height:500, marginLeft:-250, marginTop:-250, background:`conic-gradient(from 0deg,transparent,${GOLD}22,transparent,${GOLD}22,transparent,${GOLD}22,transparent)`, zIndex:-1 },
  victoryBanner: { fontFamily:"'Cinzel',serif", fontSize:26, color:GOLD, letterSpacing:4, textShadow:`0 0 24px ${EMBER}`, margin:"10px 0 0" },
  victoryBossName: { fontFamily:"'Cinzel',serif", fontSize:30, color:"#e8e0d4", margin:"6px 0" },
  victoryFlavor: { fontStyle:"italic", color:"#9a8f80", margin:"0 0 16px" },
  victoryRewards: { display:"flex", gap:10, justifyContent:"center", color:GOLD, fontFamily:"'Cinzel',serif", fontSize:15, marginBottom:22 },
  victoryBtn: { fontFamily:"'Cinzel',serif", background:`linear-gradient(135deg,${GOLD},#9a7d1e)`, color:"#1a1208", border:"none", padding:"14px 32px", borderRadius:6, fontWeight:700, fontSize:15, cursor:"pointer", letterSpacing:1 },
  toast: { position:"fixed", top:24, right:24, display:"flex", gap:14, alignItems:"center", background:"linear-gradient(135deg,#1c1016,#0e0a0e)", border:`2px solid ${GOLD}`, borderRadius:10, padding:"16px 20px", zIndex:120, boxShadow:`0 8px 30px rgba(0,0,0,.6),0 0 30px ${GOLD}33`, maxWidth:320 },
  toastTitle: { margin:0, fontSize:11, letterSpacing:2, color:GOLD },
  toastName: { margin:"2px 0", fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:16, color:"#e8e0d4" },
  toastDesc: { margin:0, fontSize:13, color:"#9a8f80" },
  // empty realm + summon
  emptyRealm: { textAlign:"center", maxWidth:520, margin:"60px auto", background:"linear-gradient(160deg,#1c1016,#0a0608)", border:`1px solid ${GOLD}33`, borderRadius:14, padding:"50px 36px" },
  emptySigil: { fontSize:64, filter:`drop-shadow(0 0 24px ${EMBER}66)` },
  emptyTitle: { fontFamily:"'Cinzel',serif", fontSize:26, color:GOLD, letterSpacing:1, margin:"16px 0 10px" },
  emptyText: { color:"#c8bca8", lineHeight:1.7, fontSize:16, margin:"0 0 26px" },
  emptyHint: { color:"#7a7060", fontStyle:"italic", fontSize:13, marginTop:16 },
  summonBtn: { fontFamily:"'Cinzel',serif", background:`linear-gradient(135deg,${BLOOD},${EMBER})`, color:"#fff", border:"none", padding:"16px 28px", borderRadius:6, fontWeight:700, fontSize:15, cursor:"pointer", letterSpacing:1, boxShadow:`0 4px 24px ${BLOOD}88` },
  summonSmallBtn: { fontFamily:"'Cinzel',serif", background:"transparent", color:GOLD, border:`1px solid ${GOLD}`, padding:"8px 16px", borderRadius:4, cursor:"pointer", letterSpacing:1, fontSize:13 },
  arenaTopRow: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:12 },
  summonOverlay: { position:"fixed", inset:0, background:"rgba(4,2,6,.88)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:110, backdropFilter:"blur(4px)", padding:16 },
  summonCard: { position:"relative", width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto", background:"linear-gradient(160deg,#1c1016,#0a0608)", border:`1px solid ${GOLD}55`, borderRadius:14, padding:"36px 32px" },
  summonClose: { position:"absolute", top:14, right:16, background:"none", border:"none", color:"#7a7060", fontSize:18, cursor:"pointer" },
  summonTitle: { fontFamily:"'Cinzel',serif", fontSize:24, color:GOLD, letterSpacing:1, textAlign:"center", margin:"0 0 6px" },
  summonSub: { color:"#9a8f80", fontStyle:"italic", textAlign:"center", margin:"0 0 24px" },
  summonBack: { background:"none", border:"none", color:"#9a8f80", cursor:"pointer", fontSize:13, fontStyle:"italic", marginBottom:10, padding:0 },
  typeGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:12 },
  typeCard: { display:"flex", flexDirection:"column", alignItems:"center", gap:6, background:"linear-gradient(160deg,#1a141a,#0e0a0e)", border:"2px solid #3a3038", borderRadius:10, padding:"18px 10px", cursor:"pointer", color:"#e8e0d4" },
  typeName: { fontFamily:"'Cinzel',serif", fontWeight:700, fontSize:13 },
  typeTitle: { fontSize:11, fontStyle:"italic", color:"#9a8f80" },
  summonLabel: { display:"block", fontSize:11, letterSpacing:2, color:"#9a8f80", margin:"18px 0 6px", textAlign:"left" },
  optionalTag: { color:"#5a5048", letterSpacing:0, textTransform:"none" },
  summonInput: { width:"100%", display:"block", background:"#0a0608", border:"1px solid #3a3038", color:"#e8e0d4", padding:"12px 14px", borderRadius:6, fontSize:16, fontFamily:"'Cinzel',serif", marginBottom:4 },
  nameRow: { display:"flex", gap:8, alignItems:"center" },
  rerollBtn: { background:"#0a0608", border:`1px solid ${GOLD}55`, borderRadius:6, fontSize:20, padding:"10px 14px", cursor:"pointer" },
  moneyRow: { display:"flex", alignItems:"center", gap:4, background:"#0a0608", border:`1px solid ${GOLD}55`, borderRadius:6, padding:"2px 12px" },
  summonTwoCol: { display:"flex", gap:14 },
  // battle toolbar + log
  battleToolbar: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 },
  toolBtn: { fontFamily:"'Cinzel',serif", background:"transparent", color:"#9a8f80", border:"1px solid #3a3038", padding:"7px 14px", borderRadius:4, cursor:"pointer", fontSize:12, letterSpacing:1 },
  logBox: { marginTop:20, background:"linear-gradient(160deg,#140e12,#0a0608)", border:"1px solid #2a2228", borderRadius:10, padding:"16px 20px" },
  logHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 },
  logTitle: { fontFamily:"'Cinzel',serif", fontSize:16, color:"#e8e0d4", letterSpacing:1 },
  logTotal: { fontFamily:"'Cinzel',serif", fontSize:13, color:GOLD },
  logRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #1a141a", fontSize:14, color:"#c8bca8", gap:10, flexWrap:"wrap" },
  logDate: { fontSize:12, color:"#7a7060" },
  shareBtn: { fontFamily:"'Cinzel',serif", background:"transparent", color:GOLD, border:`2px solid ${GOLD}`, padding:"12px 24px", borderRadius:6, fontWeight:700, fontSize:14, cursor:"pointer", letterSpacing:1 },
  setCard: { background:"linear-gradient(160deg,#1a141a,#0e0a0e)", border:"1px solid #2a2228", borderRadius:10, padding:"20px 24px", marginBottom:16 },
  setLabel: { fontSize:11, letterSpacing:2, color:"#7a7060", margin:"0 0 14px" },
  setRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #1a141a", fontSize:15, color:"#c8bca8" },
  setText: { color:"#b8ac98", fontSize:14.5, lineHeight:1.6, margin:"0 0 16px" },
  setHint: { color:"#7a7060", fontSize:13, fontStyle:"italic", margin:"10px 0 0" },
  setDangerBtn: { fontFamily:"'Cinzel',serif", background:"transparent", color:"#c87a5a", border:"1px solid #5a3028", padding:"12px 20px", borderRadius:6, cursor:"pointer", fontSize:14, letterSpacing:1 },
  setLinks: { display:"flex", flexDirection:"column", gap:12, alignItems:"flex-start" },
};

const authStyles = {
  overlay: { minHeight:"100vh", background:"radial-gradient(ellipse at top,#1a1218 0%,#050304 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  card: { position:"relative", width:"100%", maxWidth:400, background:"linear-gradient(160deg,#1c1016,#0a0608)", border:`1px solid ${GOLD}44`, borderRadius:14, padding:"40px 32px", textAlign:"center" },
  logo: { fontSize:48, color:GOLD, textShadow:`0 0 24px ${EMBER}` },
  title: { fontFamily:"'Cinzel',serif", fontWeight:900, fontSize:28, color:GOLD, letterSpacing:3, margin:"8px 0 4px" },
  sub: { color:"#9a8f80", fontStyle:"italic", fontSize:14, margin:"0 0 28px" },
  googleBtn: { width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10, background:"#fff", color:"#1a1208", border:"none", borderRadius:6, padding:"12px", fontWeight:700, fontSize:15, cursor:"pointer", marginBottom:16 },
  divider: { display:"flex", alignItems:"center", gap:12, color:"#5a5048", fontSize:13, margin:"4px 0 16px" },
  input: { width:"100%", display:"block", background:"#0a0608", border:"1px solid #3a3038", color:"#e8e0d4", padding:"12px 14px", borderRadius:6, fontSize:15, marginBottom:12, fontFamily:"'EB Garamond',serif" },
  submitBtn: { width:"100%", fontFamily:"'Cinzel',serif", background:`linear-gradient(135deg,${BLOOD},${EMBER})`, color:"#fff", border:"none", padding:"14px", borderRadius:6, fontWeight:700, fontSize:15, cursor:"pointer", letterSpacing:1, marginTop:4 },
  switchBtn: { background:"none", border:"none", color:GOLD, cursor:"pointer", fontSize:13, marginTop:16, textDecoration:"underline", fontFamily:"'EB Garamond',serif" },
  backLink: { position:"absolute", top:14, left:16, background:"none", border:"none", color:"#7a7060", fontSize:13, cursor:"pointer", fontStyle:"italic" },
  error: { color:"#ff6b35", fontSize:13, margin:"4px 0 8px" },
  success: { color:GOLD, fontSize:13, margin:"4px 0 8px" },
};
