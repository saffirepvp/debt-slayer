import React, { useState, useEffect, useRef } from "react";

// ============================================================
// DEBT SLAYER — Dark Fantasy Debt-Tracking RPG
// Each debt is a boss. Each payment deals damage.
// AI advisor characters give personalized guidance.
// ============================================================

const GOLD = "#d4af37";
const BLOOD = "#8b1a1a";
const EMBER = "#ff6b35";

// --- Boss archetypes mapped to debt types ---
const BOSS_TYPES = {
  credit: { name: "The Usurer", sigil: "🩸", title: "Lord of Compounding Rot", color: "#a01818" },
  student: { name: "The Scholar Wraith", sigil: "📜", title: "Keeper of Endless Lessons", color: "#3a5a8c" },
  car: { name: "The Iron Steed", sigil: "⚙️", title: "Beast of Depreciation", color: "#5a5a6e" },
  mortgage: { name: "The Stone Colossus", sigil: "🏰", title: "Final Boss of the Realm", color: "#6b4423" },
  medical: { name: "The Plague Doctor", sigil: "☠️", title: "Harbinger of Bills", color: "#2e6b4f" },
  personal: { name: "The Whispering Debt", sigil: "🌑", title: "Shade of Borrowed Time", color: "#4a3a6b" },
};

// --- AI advisor characters ---
const ADVISORS = [
  { id: "sage", name: "Mordrin the Sage", sigil: "🧙", style: "wise & strategic", blurb: "Master of the Avalanche & Snowball arts" },
  { id: "bard", name: "Lyra the Bard", sigil: "🎻", style: "motivating & warm", blurb: "Sings of victories yet to come" },
  { id: "knight", name: "Ser Castellan", sigil: "⚔️", style: "disciplined & blunt", blurb: "Tolerates no wasted gold" },
];

const STARTER_BOSSES = [
  { id: 1, type: "credit", name: "Visa Wyrm", total: 4200, remaining: 2850, apr: 22.9, minPayment: 95 },
  { id: 2, type: "student", name: "The Sallie Specter", total: 18000, remaining: 14200, apr: 6.8, minPayment: 210 },
  { id: 3, type: "car", name: "Civic Revenant", total: 12000, remaining: 5400, apr: 4.5, minPayment: 290 },
];

// --- Achievements: unlocked by gameplay milestones ---
const ACHIEVEMENTS = [
  { id: "first_blood", name: "First Blood", sigil: "🩸", desc: "Land your first strike", check: (s) => s.totalStrikes >= 1 },
  { id: "warband", name: "Warband Leader", sigil: "🛡", desc: "Strike 10 times", check: (s) => s.totalStrikes >= 10 },
  { id: "giant_slayer", name: "Giant Slayer", sigil: "🗡", desc: "Slay a boss worth $10k+", check: (s) => s.biggestSlain >= 10000 },
  { id: "first_kill", name: "Boss Vanquisher", sigil: "💀", desc: "Slay your first boss", check: (s) => s.bossesSlain >= 1 },
  { id: "interest_breaker", name: "Interest Breaker", sigil: "⚖", desc: "Deal $5,000 in total damage", check: (s) => s.totalDamage >= 5000 },
  { id: "champion", name: "Realm Champion", sigil: "👑", desc: "Reach Level 5", check: (s) => s.level >= 5 },
  { id: "season_victor", name: "Season Victor", sigil: "🏆", desc: "Complete a monthly season", check: (s) => s.seasonsWon >= 1 },
  { id: "warlord", name: "Warlord", sigil: "🔥", desc: "Hold a 3-month streak", check: (s) => s.streak >= 3 },
];

// --- Monthly seasons: themed, rotating, with a damage goal ---
const SEASONS = [
  { key: "frostfall", name: "Frostfall Reckoning", sigil: "❄", goal: 1500, color: "#5a8caf", lore: "The frozen ledger cracks. Strike while the ice is thin." },
  { key: "ember", name: "Ember Harvest", sigil: "🔥", goal: 1500, color: "#ff6b35", lore: "Burn away what you owe in the season of flame." },
  { key: "shadow", name: "The Long Shadow", sigil: "🌑", goal: 1500, color: "#6b5a8c", lore: "In darkness, every coin of debt is a chain. Break them." },
  { key: "storm", name: "Stormbreak Trials", sigil: "⚡", goal: 1500, color: "#d4af37", lore: "Thunder favors the bold. Slay without mercy." },
];
function currentSeason() {
  return SEASONS[new Date().getMonth() % SEASONS.length];
}
const STREAK_RANKS = ["Squire", "Knight", "Champion", "Warlord", "Legend"];
function daysLeftInMonth() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
}

export default function DebtSlayer() {
  const [view, setView] = useState("arena"); // arena | boss | advisor | planner | paywall
  const [strategy, setStrategy] = useState("avalanche"); // avalanche | snowball
  const [extraBudget, setExtraBudget] = useState(200);
  const [bosses, setBosses] = useState(STARTER_BOSSES);
  const [activeBoss, setActiveBoss] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [hitFlash, setHitFlash] = useState(false);
  const [floatingDmg, setFloatingDmg] = useState([]);
  const [advisor, setAdvisor] = useState(ADVISORS[0]);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [xp, setXp] = useState(340);
  const chatEndRef = useRef(null);

  // --- combat polish state ---
  const [combo, setCombo] = useState(0);
  const [shakeStage, setShakeStage] = useState(false);
  const [critText, setCritText] = useState(null);
  const [victoryBoss, setVictoryBoss] = useState(null);
  const [embers, setEmbers] = useState([]);
  const comboTimer = useRef(null);

  // --- progression tracking ---
  const [stats, setStats] = useState({
    totalStrikes: 0,
    totalDamage: 0,
    bossesSlain: 0,
    biggestSlain: 0,
    seasonsWon: 0,
    streak: 2, // demo: pretend they have a 2-month streak going
  });
  const [unlocked, setUnlocked] = useState([]);
  const [seasonDamage, setSeasonDamage] = useState(450); // demo: some progress this season
  const [toast, setToast] = useState(null);
  const season = currentSeason();

  const totalDebt = bosses.reduce((s, b) => s + b.remaining, 0);
  const totalOriginal = bosses.reduce((s, b) => s + b.total, 0);
  const slainCount = bosses.filter((b) => b.remaining <= 0).length;
  const level = Math.floor(xp / 100) + 1;

  // --- Battle planner: simulate month-by-month payoff for a given strategy ---
  function simulate(strat) {
    let active = bosses.filter((b) => b.remaining > 0).map((b) => ({ ...b }));
    if (active.length === 0) return { months: 0, totalInterest: 0, order: [], freeDate: null };
    const minTotal = active.reduce((s, b) => s + b.minPayment, 0);
    const monthlyPool = minTotal + Number(extraBudget || 0);
    let months = 0;
    let totalInterest = 0;
    const slainOrder = [];
    const guard = 600; // cap at 50 years

    while (active.some((b) => b.remaining > 0) && months < guard) {
      months++;
      // accrue interest
      active.forEach((b) => {
        if (b.remaining > 0) {
          const interest = (b.remaining * (b.apr / 100)) / 12;
          b.remaining += interest;
          totalInterest += interest;
        }
      });
      // pick target by strategy
      const living = active.filter((b) => b.remaining > 0);
      living.sort((a, b) =>
        strat === "avalanche" ? b.apr - a.apr : a.remaining - b.remaining
      );
      const target = living[0];
      let pool = monthlyPool;
      // pay minimums on non-targets first
      living.forEach((b) => {
        if (b.id !== target.id) {
          const pay = Math.min(b.minPayment, b.remaining);
          b.remaining -= pay;
          pool -= pay;
        }
      });
      // dump the rest on the target
      const pay = Math.min(pool, target.remaining);
      target.remaining -= pay;
      // record any newly slain
      active.forEach((b) => {
        if (b.remaining <= 0.01 && !slainOrder.find((s) => s.id === b.id)) {
          b.remaining = 0;
          slainOrder.push({ id: b.id, name: b.name, month: months });
        }
      });
    }
    const freeDate = new Date();
    freeDate.setMonth(freeDate.getMonth() + months);
    return { months, totalInterest: Math.round(totalInterest), order: slainOrder, freeDate };
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, thinking]);

  // --- check for newly unlocked achievements whenever stats/level change ---
  useEffect(() => {
    const ctx = { ...stats, level };
    ACHIEVEMENTS.forEach((a) => {
      if (!unlocked.includes(a.id) && a.check(ctx)) {
        setUnlocked((u) => [...u, a.id]);
        setToast({ sigil: a.sigil, name: a.name, desc: a.desc });
        playSound("achievement");
        setTimeout(() => setToast(null), 4000);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats, level]);

  // --- lightweight WebAudio SFX (no assets needed) ---
  function playSound(kind) {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ac = new Ctx();
      const now = ac.currentTime;
      const make = (freq, start, dur, type = "square", vol = 0.12) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, now + start);
        g.gain.setValueAtTime(0, now + start);
        g.gain.linearRampToValueAtTime(vol, now + start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + start + dur);
        o.connect(g);
        g.connect(ac.destination);
        o.start(now + start);
        o.stop(now + start + dur);
      };
      if (kind === "hit") { make(180, 0, 0.12, "sawtooth", 0.15); make(90, 0, 0.18, "square", 0.1); }
      if (kind === "crit") { make(220, 0, 0.1, "sawtooth", 0.18); make(330, 0.05, 0.15, "square", 0.14); make(140, 0, 0.25, "triangle", 0.12); }
      if (kind === "victory") { [523, 659, 784, 1047].forEach((f, i) => make(f, i * 0.12, 0.3, "triangle", 0.14)); }
      if (kind === "achievement") { [659, 880].forEach((f, i) => make(f, i * 0.1, 0.25, "triangle", 0.13)); }
    } catch (e) { /* audio not critical */ }
  }

  function spawnEmbers() {
    const burst = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() * 60 - 30),
      angle: Math.random() * 360,
      dist: 40 + Math.random() * 80,
    }));
    setEmbers((e) => [...e, ...burst]);
    setTimeout(() => setEmbers((e) => e.filter((x) => !burst.find((b) => b.id === x.id))), 900);
  }

  function dealDamage(boss, amount, isCrit) {
    const dmg = Math.min(amount, boss.remaining);
    const wasAlive = boss.remaining > 0;
    const nowDead = wasAlive && boss.remaining - dmg <= 0;

    setBosses((prev) =>
      prev.map((b) => (b.id === boss.id ? { ...b, remaining: Math.max(0, b.remaining - dmg) } : b))
    );
    setXp((x) => x + Math.floor(dmg / 10) * (isCrit ? 2 : 1));

    // track stats
    setStats((s) => ({
      ...s,
      totalStrikes: s.totalStrikes + 1,
      totalDamage: s.totalDamage + dmg,
      bossesSlain: s.bossesSlain + (nowDead ? 1 : 0),
      biggestSlain: nowDead ? Math.max(s.biggestSlain, boss.total) : s.biggestSlain,
    }));
    setSeasonDamage((d) => d + dmg);

    // screen feedback
    setHitFlash(true);
    setShakeStage(true);
    setTimeout(() => setHitFlash(false), 350);
    setTimeout(() => setShakeStage(false), isCrit ? 500 : 350);
    spawnEmbers();
    playSound(nowDead ? "victory" : isCrit ? "crit" : "hit");

    const id = Date.now();
    setFloatingDmg((f) => [...f, { id, amount: dmg, crit: isCrit }]);
    setTimeout(() => setFloatingDmg((f) => f.filter((x) => x.id !== id)), 1300);

    if (isCrit) {
      setCritText("CRITICAL STRIKE!");
      setTimeout(() => setCritText(null), 1000);
    }

    if (nowDead) {
      setTimeout(() => {
        setVictoryBoss(boss);
        setStats((s) => ({ ...s, seasonsWon: s.seasonsWon })); // no-op, keeps closure fresh
      }, 600);
    }
  }

  function handleStrike() {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0 || !activeBoss) return;

    // combo: rapid consecutive strikes build toward crits
    const newCombo = combo + 1;
    setCombo(newCombo);
    clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 4000);
    // bigger payments & higher combos raise crit chance
    const isCrit = newCombo >= 3 || amt >= activeBoss.minPayment * 3 || Math.random() < 0.18;

    dealDamage(activeBoss, amt, isCrit);
    setActiveBoss((b) => ({ ...b, remaining: Math.max(0, b.remaining - Math.min(amt, b.remaining)) }));
    setPayAmount("");
  }

  // --- AI advisor chat (OpenAI-style; wired to Anthropic API for the demo) ---
  async function sendToAdvisor(userMsg) {
    const next = [...chat, { role: "user", content: userMsg }];
    setChat(next);
    setChatInput("");
    setThinking(true);

    const debtContext = bosses
      .map((b) => `${b.name} (${b.type}): $${b.remaining} left of $${b.total}, ${b.apr}% APR, min $${b.minPayment}/mo`)
      .join("; ");

    const systemPrompt = `You are ${advisor.name}, a ${advisor.style} debt-advisor character in a dark fantasy RPG called Debt Slayer. Stay in character with light medieval-fantasy flavor, but give GENUINELY useful, accurate personal-finance advice (avalanche vs snowball, interest math, prioritization). Keep replies under 120 words. The player's current debts ("bosses"): ${debtContext}. Total debt: $${totalDebt}.`;

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, systemPrompt })
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setChat((c) => [...c, { role: 'assistant', content: data.text }]);
    } catch (e) {
      setChat((c) => [...c, { role: 'assistant', content: `⚠️ The mystic link falters: ${e.message}` }]);
    } finally {
      setThinking(false);
    }
  }

  const freeAdvisorUses = chat.filter((m) => m.role === "user").length;
  const advisorLocked = !isPremium && freeAdvisorUses >= 3;

  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.brandMark}>⚔</span>
          <div>
            <h1 style={styles.brandTitle}>DEBT SLAYER</h1>
            <p style={styles.brandSub}>Slay your debts. Reclaim your gold.</p>
          </div>
        </div>
        <div style={styles.statbar}>
          <Stat label="LVL" value={level} />
          <Stat label="XP" value={xp} />
          <Stat label="SLAIN" value={`${slainCount}/${bosses.length}`} />
          {!isPremium ? (
            <button style={styles.crownBtn} onClick={() => setView("paywall")}>
              👑 GO PREMIUM
            </button>
          ) : (
            <span style={styles.premiumBadge}>👑 SLAYER'S GUILD</span>
          )}
        </div>
      </header>

      {/* NAV */}
      <nav style={styles.nav}>
        {[
          ["arena", "🗡 The Arena"],
          ["planner", "🗺 Battle Planner"],
          ["advisor", "🔮 War Council"],
          ["seasons", "🏆 Seasons"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setView(k)}
            style={{ ...styles.navBtn, ...(view === k ? styles.navBtnActive : {}) }}
          >
            {label}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {/* ===================== ARENA ===================== */}
        {view === "arena" && (
          <div className="fade-in">
            <div style={styles.realmBanner}>
              <div>
                <p style={styles.realmLabel}>TOTAL CURSE UPON THE REALM</p>
                <p style={styles.realmTotal}>${totalDebt.toLocaleString()}</p>
                <div style={styles.realmBarOuter}>
                  <div
                    style={{
                      ...styles.realmBarInner,
                      width: `${((totalOriginal - totalDebt) / totalOriginal) * 100}%`,
                    }}
                  />
                </div>
                <p style={styles.realmFreed}>
                  {Math.round(((totalOriginal - totalDebt) / totalOriginal) * 100)}% of the realm freed
                </p>
              </div>
            </div>

            <h2 style={styles.sectionTitle}>⚔ Bosses of the Realm</h2>
            <div style={styles.bossGrid}>
              {bosses.map((b, idx) => {
                const meta = BOSS_TYPES[b.type];
                const hp = (b.remaining / b.total) * 100;
                const dead = b.remaining <= 0;
                const bossLocked = !isPremium && idx > 0;
                return (
                  <div
                    key={b.id}
                    className="boss-card"
                    style={{ ...styles.bossCard, borderColor: dead ? GOLD : meta.color, opacity: dead ? 0.65 : 1 }}
                    onClick={() => {
                      if (bossLocked) return setView("paywall");
                      setActiveBoss(b);
                      setView("boss");
                    }}
                  >
                    {bossLocked && (
                      <div style={styles.bossLockOverlay}>
                        <span style={{ fontSize: 30 }}>🔒</span>
                        <span style={styles.bossLockText}>Slayer's Guild</span>
                      </div>
                    )}
                    <div style={{ ...styles.bossSigil, background: `radial-gradient(circle, ${meta.color}55, transparent)`, filter: bossLocked ? "blur(3px)" : "none" }}>
                      <span style={{ fontSize: 40, filter: dead ? "grayscale(1)" : "none" }}>{meta.sigil}</span>
                    </div>
                    <div style={{ ...styles.bossName, filter: bossLocked ? "blur(4px)" : "none" }}>{b.name}</div>
                    <div style={styles.bossTitle}>{dead ? "💀 SLAIN" : meta.title}</div>
                    <div style={styles.hpOuter}>
                      <div style={{ ...styles.hpInner, width: `${hp}%`, background: dead ? GOLD : `linear-gradient(90deg, ${BLOOD}, ${EMBER})` }} />
                    </div>
                    <div style={styles.hpText}>
                      {dead ? "Vanquished" : `$${b.remaining.toLocaleString()} HP`} · {b.apr}% APR
                    </div>
                  </div>
                );
              })}
            </div>
            {!isPremium && (
              <p style={styles.freeTierNote}>
                Free Slayers track 1 boss. <button style={styles.inlineLink} onClick={() => setView("paywall")}>Join the Guild</button> to battle them all.
              </p>
            )}
          </div>
        )}

        {/* ===================== BOSS BATTLE ===================== */}
        {view === "boss" && activeBoss && (() => {
          const meta = BOSS_TYPES[activeBoss.type];
          const hp = (activeBoss.remaining / activeBoss.total) * 100;
          const dead = activeBoss.remaining <= 0;
          return (
            <div className="fade-in">
              <button style={styles.backBtn} onClick={() => setView("arena")}>← Retreat to Arena</button>
              <div className={shakeStage ? "stage-shake" : ""} style={{ ...styles.battleStage, boxShadow: hitFlash ? `inset 0 0 140px ${BLOOD}` : "inset 0 0 80px #000" }}>
                {combo >= 2 && !dead && (
                  <div style={styles.comboMeter}>
                    <span style={styles.comboNum}>{combo}×</span>
                    <span style={styles.comboLabel}>COMBO</span>
                  </div>
                )}
                {critText && <div className="crit-pop" style={styles.critText}>{critText}</div>}
                <div className={hitFlash ? "shake" : ""} style={styles.battleSigil}>
                  <span style={{ fontSize: 110, filter: dead ? "grayscale(1) blur(1px)" : "none", display: "inline-block" }}>{meta.sigil}</span>
                  {embers.map((e) => (
                    <span
                      key={e.id}
                      className="ember"
                      style={{
                        left: `${e.x}%`,
                        "--angle": `${e.angle}deg`,
                        "--dist": `${e.dist}px`,
                      }}
                    >✦</span>
                  ))}
                  {floatingDmg.map((f) => (
                    <span
                      key={f.id}
                      className="float-dmg"
                      style={{ ...styles.floatDmg, fontSize: f.crit ? 42 : 28, color: f.crit ? GOLD : EMBER }}
                    >
                      -${f.amount.toLocaleString()}{f.crit ? "!" : ""}
                    </span>
                  ))}
                </div>
                <h2 style={styles.battleName}>{activeBoss.name}</h2>
                <p style={styles.battleTitle}>{meta.title}</p>

                <div style={styles.battleHpOuter}>
                  <div style={{ ...styles.battleHpInner, width: `${hp}%` }} />
                  <span style={styles.battleHpLabel}>${activeBoss.remaining.toLocaleString()} / ${activeBoss.total.toLocaleString()}</span>
                </div>

                {dead ? (
                  <div style={styles.victory}>
                    <p style={styles.victoryText}>⚜ BOSS SLAIN ⚜</p>
                    <p style={styles.victorySub}>The realm grows brighter. Choose your next foe.</p>
                  </div>
                ) : (
                  <div style={styles.attackPanel}>
                    <p style={styles.attackHint}>Deal damage by logging a payment</p>
                    <div style={styles.attackRow}>
                      <span style={styles.dollarSign}>$</span>
                      <input
                        type="number"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        placeholder={activeBoss.minPayment}
                        style={styles.attackInput}
                      />
                      <button style={styles.strikeBtn} onClick={handleStrike}>⚔ STRIKE</button>
                    </div>
                    <div style={styles.quickRow}>
                      {[activeBoss.minPayment, activeBoss.minPayment * 2, 500].map((q) => (
                        <button key={q} style={styles.quickBtn} onClick={() => setPayAmount(String(q))}>
                          ${q}
                        </button>
                      ))}
                    </div>
                    <p style={styles.aprWarn}>
                      ⚠ This beast regenerates ~${Math.round((activeBoss.remaining * activeBoss.apr) / 100 / 12)}/mo from {activeBoss.apr}% APR
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ===================== AI WAR COUNCIL ===================== */}
        {view === "advisor" && (
          <div className="fade-in">
            <h2 style={styles.sectionTitle}>🔮 The War Council</h2>
            <p style={styles.councilSub}>Consult an advisor. They know your bosses and will counsel your strategy.</p>

            <div style={styles.advisorRow}>
              {ADVISORS.map((a) => {
                const locked = !isPremium && a.id !== "sage";
                return (
                  <div
                    key={a.id}
                    onClick={() => {
                      if (locked) return setView("paywall");
                      setAdvisor(a);
                      setChat([]);
                    }}
                    style={{
                      ...styles.advisorCard,
                      borderColor: advisor.id === a.id ? GOLD : "#3a3a44",
                      opacity: locked ? 0.55 : 1,
                    }}
                  >
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
              <div style={styles.chatHeader}>
                <span style={{ fontSize: 22 }}>{advisor.sigil}</span> Speaking with <b style={{ color: GOLD }}>{advisor.name}</b>
              </div>
              <div style={styles.chatScroll}>
                {chat.length === 0 && (
                  <p style={styles.chatEmpty}>
                    {advisor.sigil} "{advisor.name} awaits your question, Slayer. Ask which boss to strike first, or how to break the curse of interest..."
                  </p>
                )}
                {chat.map((m, i) => (
                  <div key={i} style={m.role === "user" ? styles.userMsg : styles.aiMsg}>
                    {m.content}
                  </div>
                ))}
                {thinking && <div style={styles.aiMsg}><span className="dots">consulting the runes</span></div>}
                <div ref={chatEndRef} />
              </div>

              {advisorLocked ? (
                <div style={styles.lockedChat}>
                  <p style={{ margin: 0, color: GOLD }}>👑 You've used your 3 free counsels.</p>
                  <button style={styles.crownBtn} onClick={() => setView("paywall")}>Unlock Unlimited Counsel</button>
                </div>
              ) : (
                <div style={styles.chatInputRow}>
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && chatInput.trim() && sendToAdvisor(chatInput.trim())}
                    placeholder="Ask your advisor..."
                    style={styles.chatInput}
                    disabled={thinking}
                  />
                  <button
                    style={styles.sendBtn}
                    onClick={() => chatInput.trim() && sendToAdvisor(chatInput.trim())}
                    disabled={thinking}
                  >
                    Send
                  </button>
                </div>
              )}
              {!isPremium && !advisorLocked && (
                <p style={styles.freeCounsel}>{3 - freeAdvisorUses} free counsels remaining</p>
              )}
            </div>
          </div>
        )}

        {/* ===================== BATTLE PLANNER ===================== */}
        {view === "planner" && (() => {
          if (!isPremium) {
            return (
              <div className="fade-in" style={styles.plannerLock}>
                <div style={{ fontSize: 50, filter: `drop-shadow(0 0 16px ${GOLD})` }}>🗺</div>
                <h2 style={styles.sectionTitle}>The Battle Planner is sealed</h2>
                <p style={styles.councilSub}>
                  Mordrin's war map reveals the exact order to slay your bosses — and how much gold each
                  strategy saves. Unlock it with the Slayer's Guild.
                </p>
                <button style={styles.crownBtn} onClick={() => setView("paywall")}>👑 Unlock the War Map</button>
              </div>
            );
          }
          const avalanche = simulate("avalanche");
          const snowball = simulate("snowball");
          const chosen = strategy === "avalanche" ? avalanche : snowball;
          const other = strategy === "avalanche" ? snowball : avalanche;
          const interestSaved = Math.max(0, other.totalInterest - chosen.totalInterest);
          const fmtDate = (d) => d?.toLocaleDateString(undefined, { month: "short", year: "numeric" });
          return (
            <div className="fade-in">
              <h2 style={styles.sectionTitle}>🗺 Battle Planner</h2>
              <p style={styles.councilSub}>Choose your campaign strategy and see the path to a debt-free realm.</p>

              <div style={styles.stratToggle}>
                <button
                  onClick={() => setStrategy("avalanche")}
                  style={{ ...styles.stratBtn, ...(strategy === "avalanche" ? styles.stratActive : {}) }}
                >
                  🏔 Avalanche
                  <span style={styles.stratHint}>Highest APR first · saves most gold</span>
                </button>
                <button
                  onClick={() => setStrategy("snowball")}
                  style={{ ...styles.stratBtn, ...(strategy === "snowball" ? styles.stratActive : {}) }}
                >
                  ❄ Snowball
                  <span style={styles.stratHint}>Smallest debt first · fastest wins</span>
                </button>
              </div>

              <div style={styles.budgetBox}>
                <label style={styles.budgetLabel}>Extra gold per month (beyond minimums)</label>
                <div style={styles.budgetRow}>
                  <span style={styles.dollarSign}>$</span>
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="25"
                    value={extraBudget}
                    onChange={(e) => setExtraBudget(e.target.value)}
                    style={{ flex: 1, accentColor: GOLD }}
                  />
                  <span style={styles.budgetVal}>${Number(extraBudget).toLocaleString()}</span>
                </div>
              </div>

              <div style={styles.planStats}>
                <PlanStat label="Realm freed by" value={fmtDate(chosen.freeDate)} big />
                <PlanStat label="Time to victory" value={`${Math.floor(chosen.months / 12)}y ${chosen.months % 12}m`} />
                <PlanStat label="Total interest paid" value={`$${chosen.totalInterest.toLocaleString()}`} />
                {interestSaved > 0 && (
                  <PlanStat label={`Saved vs ${strategy === "avalanche" ? "Snowball" : "Avalanche"}`} value={`$${interestSaved.toLocaleString()}`} gold />
                )}
              </div>

              <h3 style={styles.orderTitle}>⚔ Order of Slaying</h3>
              <div style={styles.orderList}>
                {chosen.order.length === 0 && <p style={styles.councilSub}>All bosses already slain. The realm is free!</p>}
                {chosen.order.map((o, i) => {
                  const boss = bosses.find((b) => b.id === o.id);
                  const meta = BOSS_TYPES[boss.type];
                  const d = new Date();
                  d.setMonth(d.getMonth() + o.month);
                  return (
                    <div key={o.id} style={styles.orderRow}>
                      <span style={styles.orderNum}>{i + 1}</span>
                      <span style={{ fontSize: 26 }}>{meta.sigil}</span>
                      <div style={{ flex: 1 }}>
                        <div style={styles.orderName}>{o.name}</div>
                        <div style={styles.orderMeta}>{boss.apr}% APR · ${boss.remaining.toLocaleString()} HP</div>
                      </div>
                      <span style={styles.orderDate}>{fmtDate(d)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ===================== SEASONS & ACHIEVEMENTS ===================== */}
        {view === "seasons" && (() => {
          const seasonPct = Math.min(100, (seasonDamage / season.goal) * 100);
          const seasonDone = seasonDamage >= season.goal;
          const rankIdx = Math.min(STREAK_RANKS.length - 1, stats.streak);
          return (
            <div className="fade-in">
              {/* Active season banner */}
              <div style={{ ...styles.seasonBanner, borderColor: season.color }}>
                <div style={styles.seasonGlow(season.color)} />
                <div style={styles.seasonInner}>
                  <div style={styles.seasonHead}>
                    <span style={{ fontSize: 40 }}>{season.sigil}</span>
                    <div>
                      <p style={styles.seasonTag}>SEASON · THIS MONTH</p>
                      <h2 style={{ ...styles.seasonName, color: season.color }}>{season.name}</h2>
                    </div>
                  </div>
                  <p style={styles.seasonLore}>"{season.lore}"</p>
                  <div style={styles.seasonBarOuter}>
                    <div style={{ ...styles.seasonBarInner, width: `${seasonPct}%`, background: `linear-gradient(90deg, ${season.color}, ${GOLD})` }} />
                    <span style={styles.seasonBarLabel}>
                      ${seasonDamage.toLocaleString()} / ${season.goal.toLocaleString()} slain
                    </span>
                  </div>
                  {seasonDone ? (
                    <p style={styles.seasonReward}>🏆 Season conquered! Badge & skin unlocked.</p>
                  ) : (
                    <p style={styles.seasonRewardPending}>
                      Reach the goal to earn the <b style={{ color: season.color }}>{season.name}</b> badge + exclusive boss skin. Resets in {daysLeftInMonth()} days.
                    </p>
                  )}
                  {!isPremium && (
                    <p style={styles.seasonFree}>
                      Free Slayers see the season. <button style={styles.inlineLink} onClick={() => setView("paywall")}>Join the Guild</button> to earn badges & skins.
                    </p>
                  )}
                </div>
              </div>

              {/* Streak */}
              <div style={styles.streakBox}>
                <div>
                  <p style={styles.streakLabel}>PAYMENT STREAK</p>
                  <p style={styles.streakValue}>🔥 {stats.streak} months</p>
                </div>
                <div style={styles.streakRank}>
                  <span style={styles.streakRankLabel}>RANK</span>
                  <span style={styles.streakRankValue}>{STREAK_RANKS[rankIdx]}</span>
                </div>
                <div style={styles.streakPips}>
                  {STREAK_RANKS.map((r, i) => (
                    <div key={r} style={{ ...styles.streakPip, background: i <= rankIdx ? GOLD : "#2a2228" }} title={r} />
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <h3 style={styles.orderTitle}>🎖 Achievements <span style={styles.achCount}>{unlocked.length}/{ACHIEVEMENTS.length}</span></h3>
              <div style={styles.achGrid}>
                {ACHIEVEMENTS.map((a) => {
                  const got = unlocked.includes(a.id);
                  return (
                    <div key={a.id} style={{ ...styles.achCard, opacity: got ? 1 : 0.45, borderColor: got ? GOLD : "#2a2228" }}>
                      <span style={{ fontSize: 30, filter: got ? "none" : "grayscale(1)" }}>{a.sigil}</span>
                      <div style={styles.achName}>{a.name}</div>
                      <div style={styles.achDesc}>{a.desc}</div>
                      {got && <div style={styles.achUnlocked}>✓ UNLOCKED</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ===================== PAYWALL ===================== */}
        {view === "paywall" && (
          <div className="fade-in" style={styles.paywall}>
            <div style={styles.paywallCrown}>👑</div>
            <h2 style={styles.paywallTitle}>JOIN THE SLAYER'S GUILD</h2>
            <p style={styles.paywallSub}>Unlock the full arsenal for your campaign against debt.</p>
            <div style={styles.priceTag}>
              <span style={styles.price}>$4.99</span>
              <span style={styles.priceUnit}>/month</span>
            </div>
            <div style={styles.featureList}>
              {[
                "🗺 The Battle Planner — exact slaying order + interest saved",
                "🔮 Unlimited AI War Council across all 3 advisors",
                "⚔ Unlimited bosses (free tier tracks 1)",
                "🏆 Seasonal slaying events & achievement badges",
                "🎨 Legendary boss skins & dark realm themes",
                "🔔 Payment reminders so no boss regenerates interest",
              ].map((f) => (
                <div key={f} style={styles.featureItem}>{f}</div>
              ))}
            </div>
            <button
              style={styles.subscribeBtn}
              onClick={() => {
                setIsPremium(true);
                setView("advisor");
              }}
            >
              ⚔ ENLIST NOW (Demo: instant unlock)
            </button>
            <button style={styles.maybeLater} onClick={() => setView("arena")}>Maybe later</button>
          </div>
        )}
      </main>

      {/* ===================== VICTORY OVERLAY ===================== */}
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
              <div style={styles.victoryRewards}>
                <span>+{Math.floor(victoryBoss.total / 10)} XP</span>
                <span>·</span>
                <span>+1 Boss Slain</span>
              </div>
              <button style={styles.victoryBtn} onClick={() => { setVictoryBoss(null); setView("arena"); }}>
                Claim Victory
              </button>
            </div>
          </div>
        );
      })()}

      {/* ===================== ACHIEVEMENT TOAST ===================== */}
      {toast && (
        <div className="toast-in" style={styles.toast}>
          <span style={{ fontSize: 32 }}>{toast.sigil}</span>
          <div>
            <p style={styles.toastTitle}>🎖 Achievement Unlocked</p>
            <p style={styles.toastName}>{toast.name}</p>
            <p style={styles.toastDesc}>{toast.desc}</p>
          </div>
        </div>
      )}

      <footer style={styles.footer}>Debt Slayer · a dark fantasy money RPG · prototype</footer>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.stat}>
      <span style={styles.statValue}>{value}</span>
      <span style={styles.statLabel}>{label}</span>
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

// ===================== STYLES =====================
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=EB+Garamond:ital@0;1&display=swap');
* { box-sizing: border-box; }
.fade-in { animation: fadeIn .5s ease both; }
@keyframes fadeIn { from { opacity:0; transform: translateY(12px);} to {opacity:1; transform:none;} }
.boss-card { transition: transform .2s, box-shadow .2s; cursor: pointer; }
.boss-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 12px 40px rgba(0,0,0,.6); }
.shake { animation: shake .35s; }
@keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-10px) rotate(-2deg);} 40%{transform:translateX(10px) rotate(2deg);} 60%{transform:translateX(-6px);} 80%{transform:translateX(6px);} }
.float-dmg { position:absolute; top:0; left:50%; animation: floatUp 1.2s ease-out forwards; }
@keyframes floatUp { from{opacity:1; transform:translate(-50%,0) scale(1);} to{opacity:0; transform:translate(-50%,-90px) scale(1.4);} }
.dots::after { content:''; animation: dots 1.4s steps(4,end) infinite; }
@keyframes dots { 0%{content:'';}25%{content:'.';}50%{content:'..';}75%{content:'...';} }
input:focus { outline: 1px solid ${GOLD}; }
.stage-shake { animation: stageShake .4s; }
@keyframes stageShake { 0%,100%{transform:translate(0,0);} 15%{transform:translate(-8px,4px);} 30%{transform:translate(8px,-4px);} 45%{transform:translate(-6px,-3px);} 60%{transform:translate(6px,3px);} 75%{transform:translate(-3px,2px);} }
.ember { position:absolute; top:40%; font-size:14px; color:${EMBER}; pointer-events:none; animation: emberFly .9s ease-out forwards; text-shadow:0 0 8px ${EMBER}; }
@keyframes emberFly { from{opacity:1; transform:rotate(var(--angle)) translateY(0) scale(1);} to{opacity:0; transform:rotate(var(--angle)) translateY(calc(var(--dist)*-1)) scale(.2);} }
.crit-pop { animation: critPop .9s ease-out forwards; }
@keyframes critPop { 0%{opacity:0; transform:translateX(-50%) scale(.4) rotate(-8deg);} 25%{opacity:1; transform:translateX(-50%) scale(1.15) rotate(3deg);} 70%{opacity:1; transform:translateX(-50%) scale(1);} 100%{opacity:0; transform:translateX(-50%) scale(1.1);} }
.victory-burst { animation: victoryBurst .6s cubic-bezier(.2,1.3,.4,1) both; }
@keyframes victoryBurst { from{opacity:0; transform:scale(.6);} to{opacity:1; transform:scale(1);} }
.victory-rays { animation: spin 14s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.victory-sigil { animation: floatBob 2.4s ease-in-out infinite; }
@keyframes floatBob { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
.toast-in { animation: toastIn .4s cubic-bezier(.2,1.3,.4,1) both; }
@keyframes toastIn { from{opacity:0; transform:translateX(120%);} to{opacity:1; transform:none;} }
`;

const styles = {
  root: { fontFamily: "'EB Garamond', serif", background: "radial-gradient(ellipse at top, #1a1218 0%, #0a0608 60%, #050304 100%)", minHeight: "100vh", color: "#e8e0d4" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", borderBottom: `1px solid ${GOLD}33`, flexWrap: "wrap", gap: 16 },
  brand: { display: "flex", alignItems: "center", gap: 14 },
  brandMark: { fontSize: 38, color: GOLD, textShadow: `0 0 20px ${EMBER}` },
  brandTitle: { fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 26, margin: 0, letterSpacing: 3, color: GOLD },
  brandSub: { margin: 0, fontSize: 13, fontStyle: "italic", color: "#9a8f80" },
  statbar: { display: "flex", alignItems: "center", gap: 18 },
  stat: { textAlign: "center" },
  statValue: { display: "block", fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 18, color: "#e8e0d4" },
  statLabel: { fontSize: 10, letterSpacing: 2, color: "#7a7060" },
  crownBtn: { fontFamily: "'Cinzel', serif", background: `linear-gradient(135deg, ${GOLD}, #9a7d1e)`, color: "#1a1208", border: "none", padding: "10px 16px", borderRadius: 4, fontWeight: 700, cursor: "pointer", letterSpacing: 1, fontSize: 12 },
  premiumBadge: { fontFamily: "'Cinzel', serif", color: GOLD, border: `1px solid ${GOLD}`, padding: "8px 14px", borderRadius: 4, fontSize: 12, letterSpacing: 1 },
  nav: { display: "flex", gap: 8, padding: "14px 28px", borderBottom: "1px solid #2a2228" },
  navBtn: { fontFamily: "'Cinzel', serif", background: "transparent", color: "#9a8f80", border: "1px solid #3a3038", padding: "8px 18px", borderRadius: 4, cursor: "pointer", letterSpacing: 1, fontSize: 13 },
  navBtnActive: { color: GOLD, borderColor: GOLD, background: `${GOLD}11` },
  main: { padding: "28px", maxWidth: 1000, margin: "0 auto" },
  realmBanner: { background: "linear-gradient(135deg, #1c1016, #120a0e)", border: `1px solid ${BLOOD}55`, borderRadius: 8, padding: "24px 28px", marginBottom: 28, boxShadow: "0 8px 30px rgba(0,0,0,.5)" },
  realmLabel: { margin: 0, fontSize: 12, letterSpacing: 3, color: "#9a8f80" },
  realmTotal: { fontFamily: "'Cinzel', serif", fontSize: 44, fontWeight: 900, margin: "6px 0", color: EMBER, textShadow: `0 0 30px ${BLOOD}` },
  realmBarOuter: { height: 10, background: "#000", borderRadius: 5, overflow: "hidden", border: "1px solid #2a2228" },
  realmBarInner: { height: "100%", background: `linear-gradient(90deg, ${GOLD}, ${EMBER})`, transition: "width .8s ease" },
  realmFreed: { margin: "8px 0 0", fontSize: 13, color: GOLD, fontStyle: "italic" },
  sectionTitle: { fontFamily: "'Cinzel', serif", fontSize: 22, color: "#e8e0d4", letterSpacing: 1, marginBottom: 18 },
  bossGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18 },
  bossCard: { position: "relative", background: "linear-gradient(160deg, #1a141a, #0e0a0e)", border: "2px solid", borderRadius: 10, padding: 20, textAlign: "center" },
  bossSigil: { width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" },
  bossName: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 17 },
  bossTitle: { fontSize: 12, fontStyle: "italic", color: "#9a8f80", marginBottom: 14, minHeight: 30 },
  hpOuter: { height: 8, background: "#000", borderRadius: 4, overflow: "hidden", marginBottom: 8 },
  hpInner: { height: "100%", transition: "width .6s ease" },
  hpText: { fontSize: 12, color: "#c8bca8" },
  backBtn: { fontFamily: "'Cinzel', serif", background: "transparent", color: "#9a8f80", border: "none", cursor: "pointer", fontSize: 14, marginBottom: 16 },
  battleStage: { background: "radial-gradient(ellipse at center, #1c1016, #080406)", border: `1px solid ${BLOOD}55`, borderRadius: 12, padding: "40px 28px", textAlign: "center", transition: "box-shadow .2s" },
  battleSigil: { position: "relative", display: "inline-block", marginBottom: 10 },
  floatDmg: { fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 28, color: EMBER, textShadow: "0 0 12px #000" },
  battleName: { fontFamily: "'Cinzel', serif", fontSize: 30, margin: "4px 0", color: "#e8e0d4" },
  battleTitle: { fontStyle: "italic", color: "#9a8f80", marginTop: 0 },
  battleHpOuter: { position: "relative", height: 26, background: "#000", borderRadius: 13, overflow: "hidden", maxWidth: 480, margin: "20px auto", border: "1px solid #2a2228" },
  battleHpInner: { height: "100%", background: `linear-gradient(90deg, ${BLOOD}, ${EMBER})`, transition: "width .6s ease" },
  battleHpLabel: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", textShadow: "0 0 4px #000" },
  attackPanel: { maxWidth: 440, margin: "0 auto" },
  attackHint: { fontSize: 14, color: "#9a8f80" },
  attackRow: { display: "flex", alignItems: "center", gap: 8, background: "#0a0608", border: `1px solid ${GOLD}55`, borderRadius: 6, padding: "6px 12px" },
  dollarSign: { fontSize: 22, color: GOLD },
  attackInput: { flex: 1, background: "transparent", border: "none", color: "#e8e0d4", fontSize: 22, fontFamily: "'Cinzel', serif", padding: "8px" },
  strikeBtn: { fontFamily: "'Cinzel', serif", background: `linear-gradient(135deg, ${BLOOD}, ${EMBER})`, color: "#fff", border: "none", padding: "12px 20px", borderRadius: 4, fontWeight: 700, cursor: "pointer", letterSpacing: 1 },
  quickRow: { display: "flex", gap: 8, justifyContent: "center", marginTop: 12 },
  quickBtn: { background: "transparent", border: "1px solid #3a3038", color: "#c8bca8", padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontFamily: "'Cinzel', serif" },
  aprWarn: { marginTop: 16, fontSize: 13, color: "#c87a5a", fontStyle: "italic" },
  victory: { marginTop: 20 },
  victoryText: { fontFamily: "'Cinzel', serif", fontSize: 30, color: GOLD, textShadow: `0 0 24px ${EMBER}`, margin: 0 },
  victorySub: { color: "#9a8f80", fontStyle: "italic" },
  councilSub: { color: "#9a8f80", fontStyle: "italic", marginTop: -8, marginBottom: 20 },
  advisorRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14, marginBottom: 24 },
  advisorCard: { position: "relative", background: "linear-gradient(160deg, #1a141a, #0e0a0e)", border: "2px solid", borderRadius: 10, padding: 18, textAlign: "center", cursor: "pointer" },
  advisorName: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 15, marginTop: 8 },
  advisorStyle: { fontSize: 12, color: GOLD, fontStyle: "italic" },
  advisorBlurb: { fontSize: 12, color: "#9a8f80", marginTop: 6 },
  lockTag: { position: "absolute", top: 8, right: 8, fontSize: 10, color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 3, padding: "2px 6px" },
  chatWindow: { background: "linear-gradient(160deg, #140e12, #0a0608)", border: `1px solid ${GOLD}33`, borderRadius: 10, overflow: "hidden" },
  chatHeader: { padding: "14px 18px", borderBottom: "1px solid #2a2228", fontSize: 14, display: "flex", alignItems: "center", gap: 8 },
  chatScroll: { height: 320, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 },
  chatEmpty: { fontStyle: "italic", color: "#7a7060", textAlign: "center", marginTop: 40, lineHeight: 1.6 },
  userMsg: { alignSelf: "flex-end", background: `${BLOOD}44`, border: `1px solid ${BLOOD}`, padding: "10px 14px", borderRadius: "12px 12px 2px 12px", maxWidth: "78%", fontSize: 15, lineHeight: 1.5 },
  aiMsg: { alignSelf: "flex-start", background: "#1a1620", border: `1px solid ${GOLD}33`, padding: "10px 14px", borderRadius: "12px 12px 12px 2px", maxWidth: "82%", fontSize: 15, lineHeight: 1.55 },
  chatInputRow: { display: "flex", gap: 8, padding: 14, borderTop: "1px solid #2a2228" },
  chatInput: { flex: 1, background: "#0a0608", border: "1px solid #3a3038", color: "#e8e0d4", padding: "12px 14px", borderRadius: 6, fontSize: 15, fontFamily: "'EB Garamond', serif" },
  sendBtn: { fontFamily: "'Cinzel', serif", background: GOLD, color: "#1a1208", border: "none", padding: "0 22px", borderRadius: 6, fontWeight: 700, cursor: "pointer" },
  freeCounsel: { textAlign: "center", fontSize: 12, color: "#7a7060", padding: "0 0 12px" },
  lockedChat: { padding: 24, textAlign: "center", borderTop: "1px solid #2a2228", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" },
  paywall: { maxWidth: 520, margin: "0 auto", textAlign: "center", background: "linear-gradient(160deg, #1c1016, #0a0608)", border: `1px solid ${GOLD}55`, borderRadius: 12, padding: "40px 32px" },
  paywallCrown: { fontSize: 56, filter: `drop-shadow(0 0 20px ${GOLD})` },
  paywallTitle: { fontFamily: "'Cinzel', serif", fontSize: 28, color: GOLD, letterSpacing: 2, margin: "12px 0 4px" },
  paywallSub: { color: "#9a8f80", fontStyle: "italic", marginTop: 0 },
  priceTag: { margin: "20px 0" },
  price: { fontFamily: "'Cinzel', serif", fontSize: 48, fontWeight: 900, color: "#e8e0d4" },
  priceUnit: { fontSize: 18, color: "#9a8f80" },
  featureList: { textAlign: "left", display: "flex", flexDirection: "column", gap: 12, margin: "24px 0" },
  featureItem: { fontSize: 15, color: "#d8cdba", paddingLeft: 4 },
  subscribeBtn: { width: "100%", fontFamily: "'Cinzel', serif", background: `linear-gradient(135deg, ${GOLD}, #9a7d1e)`, color: "#1a1208", border: "none", padding: "16px", borderRadius: 6, fontWeight: 700, fontSize: 16, cursor: "pointer", letterSpacing: 1 },
  maybeLater: { background: "transparent", border: "none", color: "#7a7060", marginTop: 14, cursor: "pointer", fontSize: 14 },
  footer: { textAlign: "center", padding: "30px", color: "#5a5048", fontSize: 12, fontStyle: "italic" },
  // planner
  plannerLock: { textAlign: "center", maxWidth: 480, margin: "40px auto", background: "linear-gradient(160deg, #1c1016, #0a0608)", border: `1px solid ${GOLD}44`, borderRadius: 12, padding: "40px 32px" },
  stratToggle: { display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" },
  stratBtn: { flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 4, fontFamily: "'Cinzel', serif", background: "linear-gradient(160deg, #1a141a, #0e0a0e)", color: "#c8bca8", border: "2px solid #3a3038", padding: "16px", borderRadius: 8, cursor: "pointer", fontSize: 16 },
  stratActive: { borderColor: GOLD, color: GOLD, background: `${GOLD}11` },
  stratHint: { fontFamily: "'EB Garamond', serif", fontSize: 12, color: "#9a8f80", fontStyle: "italic" },
  budgetBox: { background: "linear-gradient(160deg, #140e12, #0a0608)", border: "1px solid #2a2228", borderRadius: 8, padding: "18px 20px", marginBottom: 20 },
  budgetLabel: { fontSize: 13, color: "#9a8f80", letterSpacing: 1 },
  budgetRow: { display: "flex", alignItems: "center", gap: 12, marginTop: 12 },
  budgetVal: { fontFamily: "'Cinzel', serif", fontSize: 20, color: GOLD, minWidth: 80, textAlign: "right" },
  planStats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12, marginBottom: 28 },
  planStat: { background: "linear-gradient(160deg, #1a141a, #0e0a0e)", border: "1px solid #2a2228", borderRadius: 8, padding: "16px", textAlign: "center" },
  planStatValue: { display: "block", fontFamily: "'Cinzel', serif", fontWeight: 700 },
  planStatLabel: { fontSize: 11, letterSpacing: 1, color: "#7a7060", marginTop: 4, display: "block" },
  orderTitle: { fontFamily: "'Cinzel', serif", fontSize: 18, color: "#e8e0d4", marginBottom: 14 },
  orderList: { display: "flex", flexDirection: "column", gap: 10 },
  orderRow: { display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(160deg, #1a141a, #0e0a0e)", border: "1px solid #2a2228", borderRadius: 8, padding: "12px 16px" },
  orderNum: { fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 18, color: GOLD, width: 24 },
  orderName: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 15 },
  orderMeta: { fontSize: 12, color: "#9a8f80" },
  orderDate: { fontFamily: "'Cinzel', serif", fontSize: 13, color: EMBER },
  // free tier / locks
  freeTierNote: { textAlign: "center", marginTop: 20, color: "#9a8f80", fontStyle: "italic", fontSize: 14 },
  inlineLink: { background: "none", border: "none", color: GOLD, cursor: "pointer", fontSize: 14, textDecoration: "underline", fontFamily: "'EB Garamond', serif", fontStyle: "italic" },
  bossLockOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(8,4,6,.55)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, zIndex: 2 },
  bossLockText: { fontFamily: "'Cinzel', serif", fontSize: 12, color: GOLD, letterSpacing: 1 },
  // combat polish
  comboMeter: { position: "absolute", top: 16, right: 20, textAlign: "right", zIndex: 3 },
  comboNum: { display: "block", fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 34, color: GOLD, textShadow: `0 0 16px ${EMBER}`, lineHeight: 1 },
  comboLabel: { fontSize: 11, letterSpacing: 3, color: "#9a8f80" },
  critText: { position: "absolute", top: "32%", left: "50%", fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: 30, color: GOLD, textShadow: `0 0 20px ${EMBER}, 0 2px 4px #000`, letterSpacing: 2, zIndex: 4, pointerEvents: "none" },
  // seasons
  seasonBanner: { position: "relative", overflow: "hidden", border: "2px solid", borderRadius: 12, marginBottom: 24, background: "linear-gradient(160deg, #16101a, #0a0608)" },
  seasonGlow: (c) => ({ position: "absolute", top: -80, right: -80, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${c}44, transparent 70%)`, pointerEvents: "none" }),
  seasonInner: { position: "relative", padding: "24px 28px", zIndex: 1 },
  seasonHead: { display: "flex", alignItems: "center", gap: 16 },
  seasonTag: { margin: 0, fontSize: 11, letterSpacing: 3, color: "#9a8f80" },
  seasonName: { fontFamily: "'Cinzel', serif", fontSize: 28, margin: "2px 0", fontWeight: 900 },
  seasonLore: { fontStyle: "italic", color: "#c8bca8", margin: "12px 0 18px" },
  seasonBarOuter: { position: "relative", height: 28, background: "#000", borderRadius: 14, overflow: "hidden", border: "1px solid #2a2228" },
  seasonBarInner: { height: "100%", transition: "width .8s ease" },
  seasonBarLabel: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", textShadow: "0 0 4px #000", fontFamily: "'Cinzel', serif" },
  seasonReward: { color: GOLD, fontFamily: "'Cinzel', serif", marginTop: 14 },
  seasonRewardPending: { color: "#9a8f80", marginTop: 14, fontSize: 14 },
  seasonFree: { marginTop: 10, fontSize: 13, color: "#7a7060", fontStyle: "italic" },
  // streak
  streakBox: { display: "flex", alignItems: "center", gap: 24, background: "linear-gradient(160deg, #1a141a, #0e0a0e)", border: "1px solid #2a2228", borderRadius: 10, padding: "18px 24px", marginBottom: 28, flexWrap: "wrap" },
  streakLabel: { margin: 0, fontSize: 11, letterSpacing: 2, color: "#7a7060" },
  streakValue: { margin: "4px 0 0", fontFamily: "'Cinzel', serif", fontSize: 24, color: EMBER },
  streakRank: { textAlign: "center" },
  streakRankLabel: { display: "block", fontSize: 11, letterSpacing: 2, color: "#7a7060" },
  streakRankValue: { fontFamily: "'Cinzel', serif", fontSize: 20, color: GOLD },
  streakPips: { display: "flex", gap: 8, marginLeft: "auto" },
  streakPip: { width: 22, height: 8, borderRadius: 4 },
  // achievements
  achCount: { fontSize: 14, color: GOLD, fontFamily: "'EB Garamond', serif" },
  achGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 14 },
  achCard: { position: "relative", background: "linear-gradient(160deg, #1a141a, #0e0a0e)", border: "2px solid", borderRadius: 10, padding: "18px 14px", textAlign: "center" },
  achName: { fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 14, marginTop: 8 },
  achDesc: { fontSize: 12, color: "#9a8f80", marginTop: 4 },
  achUnlocked: { fontSize: 10, color: GOLD, letterSpacing: 1, marginTop: 8 },
  // victory overlay
  victoryOverlay: { position: "fixed", inset: 0, background: "rgba(4,2,6,.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, cursor: "pointer", backdropFilter: "blur(4px)" },
  victoryCard: { position: "relative", textAlign: "center", padding: "40px", maxWidth: 420 },
  victoryRays: { position: "absolute", top: "50%", left: "50%", width: 500, height: 500, marginLeft: -250, marginTop: -250, background: `conic-gradient(from 0deg, transparent, ${GOLD}22, transparent, ${GOLD}22, transparent, ${GOLD}22, transparent)`, zIndex: -1 },
  victoryBanner: { fontFamily: "'Cinzel', serif", fontSize: 26, color: GOLD, letterSpacing: 4, textShadow: `0 0 24px ${EMBER}`, margin: "10px 0 0" },
  victoryBossName: { fontFamily: "'Cinzel', serif", fontSize: 30, color: "#e8e0d4", margin: "6px 0" },
  victoryFlavor: { fontStyle: "italic", color: "#9a8f80", margin: "0 0 16px" },
  victoryRewards: { display: "flex", gap: 10, justifyContent: "center", color: GOLD, fontFamily: "'Cinzel', serif", fontSize: 15, marginBottom: 22 },
  victoryBtn: { fontFamily: "'Cinzel', serif", background: `linear-gradient(135deg, ${GOLD}, #9a7d1e)`, color: "#1a1208", border: "none", padding: "14px 32px", borderRadius: 6, fontWeight: 700, fontSize: 15, cursor: "pointer", letterSpacing: 1 },
  // achievement toast
  toast: { position: "fixed", top: 24, right: 24, display: "flex", gap: 14, alignItems: "center", background: "linear-gradient(135deg, #1c1016, #0e0a0e)", border: `2px solid ${GOLD}`, borderRadius: 10, padding: "16px 20px", zIndex: 120, boxShadow: `0 8px 30px rgba(0,0,0,.6), 0 0 30px ${GOLD}33`, maxWidth: 320 },
  toastTitle: { margin: 0, fontSize: 11, letterSpacing: 2, color: GOLD },
  toastName: { margin: "2px 0", fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: 16, color: "#e8e0d4" },
  toastDesc: { margin: 0, fontSize: 13, color: "#9a8f80" },
};
