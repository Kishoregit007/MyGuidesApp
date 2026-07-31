import { useState } from "react";

const PLANETARY_POWERS = {
  venus: { name: "Venus (Shukra)", color: "#EC4899", emoji: "💗", role: "Lagna & Rashi Lord — your master planet" },
  moon: { name: "Moon (Chandra)", color: "#94A3B8", emoji: "🌙", role: "Nakshatra Lord (Rohini) — emotional core" },
  mars: { name: "Mars (Mangal)", color: "#EF4444", emoji: "🔥", role: "Exalted in 9th — hidden superpower" },
  mercury: { name: "Mercury (Budha)", color: "#10B981", emoji: "⚡", role: "Current Mahadasha Lord — active energy" },
  jupiter: { name: "Jupiter (Guru)", color: "#F97316", emoji: "🙏", role: "2nd & 11th lord — wealth & wisdom" },
};

const SECTIONS = [
  {
    id: "morning",
    title: "🌅 Morning Ritual",
    subtitle: "5:00 AM – 7:00 AM • The Brahma Muhurta Window",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.3)",
    intro: "You were born at 5:15 AM — Brahma Muhurta. This is your natural power hour. Your Rohini Moon and Taurus Lagna both respond to early morning energy with exceptional force.",
    practices: [
      {
        title: "Wake by 5:30 AM",
        planet: "moon",
        duration: "— daily",
        why: "Born in Brahma Muhurta, your mind is sharpest and most receptive at this hour. Rohini Nakshatra natives who honour this window access their full intuitive and creative power.",
        how: "Set alarm for 5:15–5:30 AM. First act: sit upright, 3 deep breaths. Don't reach for the phone."
      },
      {
        title: "Surya Namaskar (Sun Salutation)",
        planet: "mars",
        duration: "12 rounds • 15 min",
        why: "Your exalted Mars in 9th needs a physical ignition every morning. Without it, that Mars energy turns inward as restlessness or frustration. Surya Namaskar activates both Mars (strength) and Sun (1st house lord energy).",
        how: "12 slow rounds facing East. Focus on breath, not speed. Build to 21 rounds over 3 months."
      },
      {
        title: "Chandra Namaskar or Moon Meditation",
        planet: "moon",
        duration: "10 min",
        why: "Moon is your Nakshatra lord AND sits in your 1st house. A daily Moon acknowledgment practice amplifies Rohini's core gifts: magnetism, creativity, nourishment, and emotional clarity.",
        how: "Sit quietly. Visualize soft white/silver light filling your chest. Repeat: 'ॐ सों सोमाय नमः' (Om Som Somaya Namah) 27 times."
      },
      {
        title: "Cold Water Face Wash + Oil Pulling",
        planet: "venus",
        duration: "5 min",
        why: "Venus rules your Lagna and Rashi — your physical appearance, energy field, and first impression are all Venusian. A clean, fresh morning start literally charges your Venus. Taurus natives who maintain physical self-care radiate natural authority.",
        how: "Splash cold water on face 7 times. Swish 1 tbsp coconut or sesame oil for 5 min. Spit, rinse."
      },
      {
        title: "Journaling — 1 Page Free Write",
        planet: "mercury",
        duration: "10 min",
        why: "Mercury is your current Mahadasha lord and sits in your 1st house. Writing activates Mercury's gifts: clarity, communication power, and cognitive sharpness. This one practice compounds enormously over months.",
        how: "Write whatever comes — no structure. 1 A4 page minimum. Can include dreams, intentions, feelings, plans."
      },
    ]
  },
  {
    id: "spiritual",
    title: "🕉️ Spiritual Practices",
    subtitle: "Daily • Weekly • Lunar Cycle",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.3)",
    intro: "With Ketu in 4th, Venus in 12th, and Rohini Nakshatra — your chart has a strong spiritual current running beneath everyday life. These practices connect you to that deeper stream.",
    practices: [
      {
        title: "Shukra Mantra (Venus — Your Master Planet)",
        planet: "venus",
        duration: "108 times • daily",
        why: "Venus is your Lagna lord AND Rashi lord — the single most important planet for your wellbeing, relationships, finances, and vitality. Strengthening Venus strengthens everything.",
        how: "'ॐ शुं शुक्राय नमः' (Om Shum Shukraya Namah). Best time: Friday mornings, after bath. Use a crystal or pearl mala. Can do during commute or walks too."
      },
      {
        title: "Rohini Nakshatra Puja (Monthly)",
        planet: "moon",
        duration: "Monthly on Rohini Nakshatra day",
        why: "Rohini is the Moon's own Nakshatra — Brahma's beloved. Honouring it once a month on the day Moon transits Rohini creates a powerful amplification of your birth energies.",
        how: "Offer white flowers, milk, and rice to Chandra (Moon). Light a silver/white candle. Recite Chandra Ashtakam or simply sit in moonlight in gratitude."
      },
      {
        title: "Hanuman Chalisa (Mars Strengthener)",
        planet: "mars",
        duration: "11 min • Tuesday & Saturday",
        why: "Your exalted Mars in 9th is your resilience engine — but Mars energy needs a devotional channel or it can manifest as aggression or accidents. Hanuman (Mangal's deity) keeps this energy pure, courageous, and dharmic.",
        how: "Read or listen to Hanuman Chalisa every Tuesday and Saturday morning. Offer red flowers or sindoor to Hanuman idol/image."
      },
      {
        title: "Evening Stillness — 10 Min Silence",
        planet: "moon",
        duration: "10 min • daily before 9 PM",
        why: "Moon in 1st house makes you emotionally absorptive — you carry others' energies without realising it. Daily decompression prevents emotional buildup and protects your mental clarity.",
        how: "Sit in silence — no phone, no music. Just observe your breath. This is not meditation per se — just conscious unwinding. Optional: light a ghee lamp or incense."
      },
      {
        title: "Gratitude Practice",
        planet: "jupiter",
        duration: "3 min • nightly",
        why: "Jupiter governs your 2nd house (wealth, family) and 11th (gains, desires). Gratitude is the fastest activator of Jupiterian abundance energy. Taurus + Jupiter natives who practice gratitude see material life improve noticeably within 90 days.",
        how: "Before sleeping: write or mentally state 3 specific things you're grateful for. Be specific — not 'family' but 'my child smiled at me today.'"
      },
    ]
  },
  {
    id: "body",
    title: "💪 Body & Vitality",
    subtitle: "Physical practices calibrated to your chart",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.3)",
    intro: "Exalted Mars in your 9th + Taurus Lagna = your body is a primary instrument of power. You have exceptional latent physical strength. A sedentary lifestyle (6th house Libra warning) is your greatest vulnerability — movement is medicine.",
    practices: [
      {
        title: "Zone 2 Cardio — Brisk Walk",
        planet: "mars",
        duration: "30–45 min • 5x per week",
        why: "Mars in 9th needs aerobic activation to translate its power into career and life success. Zone 2 cardio (conversational pace) also directly counters the metabolic effects of desk work — your specific lifestyle risk.",
        how: "Walk briskly in morning or evening. Heart rate: 120–140 BPM. You can listen to podcasts or mantras. Minimum: 30 min. Ideal: 45 min outdoors."
      },
      {
        title: "Strength Training",
        planet: "mars",
        duration: "3x per week • 40 min",
        why: "Exalted Mars literally calls for physical strength. Strength training is one of the most direct ways to honour and activate Mars energy in your chart. It also builds the physical confidence that Taurus Lagna needs to fully express itself.",
        how: "Compound movements: squats, deadlifts, push-ups, rows. No need for gym — bodyweight works. Progressive overload is key — slightly harder each week."
      },
      {
        title: "Abhyanga (Self Oil Massage)",
        planet: "venus",
        duration: "15 min • 2–3x per week",
        why: "Venus rules your body (Lagna) and Taurus is the sign of physical embodiment and sensory pleasure. Abhyanga is the single most Venus-activating body practice in Ayurveda. It builds ojas (vital essence), improves skin, and grounds anxiety.",
        how: "Warm sesame or coconut oil. Massage from feet upward toward heart. Leave on for 15 min, then shower. Best day: Friday (Venus day)."
      },
      {
        title: "Sleep by 10 PM",
        planet: "moon",
        duration: "7–8 hrs • non-negotiable",
        why: "Moon in 1st house means your entire system — emotional, physical, mental — is governed by lunar rhythms. Poor sleep degrades Moon's gifts: magnetism, intuition, and emotional resilience. This is not optional for you.",
        how: "No screens after 9:30 PM. Dim lights at 9 PM. Drink warm milk with nutmeg or ashwagandha. Aim for 10 PM sleep to maximize deep sleep cycles before 2 AM."
      },
      {
        title: "Taurus Diet — Nourishing & Grounding",
        planet: "venus",
        duration: "Daily — lifestyle",
        why: "Taurus rules the throat and digestive system. Your vitality is deeply tied to what you eat. Venus-ruled foods amplify your natural magnetism. Avoid Rajasic (overstimulating) foods that destabilise Moon in 1st.",
        how: "Favour: dairy, fruits, root vegetables, rice, ghee, nuts, seeds. Reduce: excess spice, processed food, late meals. Eat with awareness — Taurus natives who eat mindfully have exceptional gut health."
      },
    ]
  },
  {
    id: "mind",
    title: "🧠 Mind & Intellect",
    subtitle: "Mercury Mahadasha — your peak learning era",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.3)",
    intro: "You are in Mercury Mahadasha until 2026 — the absolute peak window for intellectual development, skill-building, and communication mastery. Mercury sits in your 1st house. Whatever you learn now compounds for decades.",
    practices: [
      {
        title: "Daily Deep Learning (1 Focused Skill)",
        planet: "mercury",
        duration: "45–60 min • daily",
        why: "Mercury Mahadasha in 1st house is a once-in-a-lifetime window for cognitive sharpening. Skills acquired now become permanent assets. Your current DSA study is perfectly timed — keep going and expand.",
        how: "Pick ONE primary skill domain (DSA, finance, communication, etc.). Study it deeply daily. Use spaced repetition. Avoid shallow multi-topic browsing — depth over breadth."
      },
      {
        title: "Read 20 Pages Daily",
        planet: "mercury",
        duration: "20–30 min",
        why: "Jupiter in your 2nd house + Mercury in 1st = reading is literally wealth-building for you. Every book is a financial and intellectual investment. Jupiter-Mercury connection makes you capable of synthesizing and communicating complex ideas powerfully.",
        how: "Non-fiction priority: finance, leadership, psychology, philosophy. Keep a book on your desk, not just on your phone. 20 pages/day = 12+ books per year."
      },
      {
        title: "Teach or Share One Thing Weekly",
        planet: "mercury",
        duration: "Weekly",
        why: "The best way to amplify Mercury's gifts is to teach. Whether it's explaining something to your child, writing a LinkedIn post, or explaining a concept to a colleague — articulation is Mercury's superpower.",
        how: "Write a short post, explain something to someone, make a voice note, or teach your child a concept. Weekly minimum."
      },
      {
        title: "Weekly Review — Sunday Evening",
        planet: "mercury",
        duration: "20 min • every Sunday",
        why: "Mercury + Taurus = methodical, grounded planning. A weekly review consolidates what you've learned and done, preventing the scattered energy that can derail Taurus natives despite their natural discipline.",
        how: "Answer 3 questions: What went well? What didn't? What's the #1 priority next week? Keep it in a notebook or digital note."
      },
    ]
  },
  {
    id: "wealth",
    title: "💰 Wealth & Career",
    subtitle: "Activating Jupiter (2nd) + Rahu (10th) + Mars (9th)",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.3)",
    intro: "Your chart has three major wealth indicators working together: Jupiter in 2nd (steady accumulation), Rahu in 10th (career amplification), and Exalted Mars in 9th (effort rewarded by fortune). These need to be consciously activated.",
    practices: [
      {
        title: "Thursday Jupiter Practice",
        planet: "jupiter",
        duration: "Every Thursday",
        why: "Thursday is Guru's day. Jupiter governs your 2nd house (wealth) and 11th house (gains). A weekly Jupiter acknowledgment practice keeps the flow of abundance energy clear and active.",
        how: "Wear yellow/gold. Eat yellow foods (dal, banana, turmeric). Donate something small — food, money, time. Light a yellow/gold candle. Recite: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' 27 times."
      },
      {
        title: "Monthly Financial Review",
        planet: "jupiter",
        duration: "1st Sunday of every month",
        why: "Taurus + Jupiter 2nd = wealth grows through consistent monitoring and deliberate action. Your five-phase financial roadmap needs a monthly checkpoint to stay on track across SIPs, emergency fund, insurance, and investments.",
        how: "Review: SIP performance, emergency fund level, net worth change, next month's big expenses. 30 minutes max. Adjust, don't obsess."
      },
      {
        title: "Career Skill Visibility",
        planet: "mercury",
        duration: "Weekly — 1 action",
        why: "Rahu in 10th career house rewards visibility and unconventional presence. Staying invisible kills Rahu's potential. One small career-visibility action weekly compounds into major professional recognition over 2–3 years.",
        how: "Options: LinkedIn post, contribute to a team discussion, share a solution, mentor someone, present an idea. One deliberate act of visibility per week."
      },
      {
        title: "Exalted Mars Activation — Discipline Ritual",
        planet: "mars",
        duration: "Daily — 5 min",
        why: "Mars in 9th is your fortune engine — but only when channelled through disciplined, consistent action. Laziness literally suppresses your luck. The more structured your day, the more Mars rewards you.",
        how: "Each morning after journaling, write your top 3 priorities for the day. Complete them before anything reactive (meetings, messages). This single habit is worth more than any career strategy."
      },
    ]
  },
  {
    id: "relationships",
    title: "❤️ Relationships & Presence",
    subtitle: "Venus-Moon harmony • Scorpio 7th activation",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.3)",
    intro: "Rohini Nakshatra natives are deeply nourishing to others — you give warmth, stability, and beauty to relationships. But Moon in 1st means you absorb others' energies intensely. Boundaries and presence practices are essential.",
    practices: [
      {
        title: "Undivided Time with Family",
        planet: "moon",
        duration: "30–60 min • daily, phone-free",
        why: "Moon in 1st + Taurus Lagna = your emotional core is deeply family-oriented. But demanding work life can silently erode this. Daily phone-free family time recharges your Moon energy more than any meditation.",
        how: "After work, keep phone in another room for 1 hour. Play with your child, talk with your partner. Full presence. This is non-negotiable on days you feel drained."
      },
      {
        title: "Weekly Date / Intentional Partner Time",
        planet: "venus",
        duration: "1–2 hrs • weekly",
        why: "Venus as Lagna lord makes relationships a direct channel to your vitality — not a side activity. A thriving partnership literally improves your health, career, and mental clarity. Scorpio 7th house needs depth, not surface connection.",
        how: "One deliberate quality conversation or shared activity weekly with your partner. No business talk, no child logistics only — connect as people."
      },
      {
        title: "Energy Cleansing After Social Exposure",
        planet: "moon",
        duration: "5 min • after draining interactions",
        why: "Rohini Moon in 1st house makes you a natural empath — you pick up others' emotional residue without realising it. Without cleansing, this accumulates as unexplained fatigue, irritability, or anxiety.",
        how: "After draining meetings or social events: wash hands up to elbow with cold water, take 5 slow breaths, and consciously 'release' the interaction. Simple but powerful."
      },
    ]
  },
  {
    id: "weekly",
    title: "📅 Weekly Planetary Schedule",
    subtitle: "One focused planetary activation per day",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.3)",
    intro: "Each day of the week is governed by a planet. Aligning your actions to the day's planetary energy creates a subtle but powerful rhythm that builds over months.",
    practices: [
      {
        title: "Sunday — Sun (Surya)",
        planet: "mars",
        duration: "Rest + Reflection",
        why: "Sun governs your 4th house (home and inner peace). Sundays are for rest, family, and home. Don't hustle on Sundays — it depletes your 4th house energy.",
        how: "Spend time at home. Do your weekly review. Spend time with child. Eat well. Light a ghee lamp in the evening."
      },
      {
        title: "Monday — Moon (Chandra)",
        planet: "moon",
        duration: "Emotional + Creative work",
        why: "Moon rules your Nakshatra. Mondays are your highest creative and intuitive days. Schedule creative tasks, brainstorming, or emotionally important conversations on Mondays.",
        how: "Wear white or light colours. Eat light, sattvic food. Meditate in the evening. Chant: 'ॐ सों सोमाय नमः' 27 times."
      },
      {
        title: "Tuesday — Mars (Mangal)",
        planet: "mars",
        duration: "Action + Physical power",
        why: "Mars is your exalted planet in 9th. Tuesdays amplify Mars energy. Best day for hard workouts, difficult conversations, bold career moves, or any task requiring courage.",
        how: "Wear red or orange. Do your hardest workout. Tackle your most avoided task. Eat lentils. Visit Hanuman temple if possible."
      },
      {
        title: "Wednesday — Mercury (Budha)",
        planet: "mercury",
        duration: "Learning + Communication",
        why: "Mercury is your Mahadasha lord and 1st house planet. Wednesday is your power day for communication, learning, writing, negotiation, and networking.",
        how: "Wear green. Schedule important meetings, presentations, or learning sessions. Write something — article, report, or long message. Best day to start new skill courses."
      },
      {
        title: "Thursday — Jupiter (Guru)",
        planet: "jupiter",
        duration: "Wealth + Wisdom + Giving",
        why: "Jupiter governs your 2nd and 11th houses — wealth and gains. Thursdays are for financial actions: SIP reviews, investments, salary discussions, or any money decision.",
        how: "Wear yellow/gold. Do your financial action for the week. Donate something small. Eat yellow dal. Teach something to someone."
      },
      {
        title: "Friday — Venus (Shukra)",
        planet: "venus",
        duration: "Beauty + Relationships + Creativity",
        why: "Venus is your master planet (Lagna + Rashi lord). Fridays are when Venus energy peaks. Best day for Abhyanga, date nights, creative projects, and anything aesthetic.",
        how: "Wear pink or white. Do self-care (Abhyanga, grooming, nice meal). Buy flowers for home. Spend quality time with partner. Chant Venus mantra 108 times."
      },
      {
        title: "Saturday — Saturn (Shani)",
        planet: "mars",
        duration: "Discipline + Service + Simplicity",
        why: "Saturn co-rules your 9th house (with Mars). Saturdays are for serious, disciplined work — deep focus, decluttering, long-term planning, and acts of service.",
        how: "Wear black or dark blue. Do deep work without distractions. Donate to the needy or help someone with no expectation. Simplify — clean your workspace or home."
      },
    ]
  }
];

const PLANET_COLORS = {
  venus: "#EC4899",
  moon: "#94A3B8",
  mars: "#EF4444",
  mercury: "#10B981",
  jupiter: "#F97316",
};

export default function DailyPowerGuide() {
  const [activeSection, setActiveSection] = useState("morning");
  const [expandedPractice, setExpandedPractice] = useState(null);
  const [checked, setChecked] = useState({});

  const toggleCheck = (key) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentSection = SECTIONS.find(s => s.id === activeSection);

  const totalChecked = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0d0d1a 0%, #1a0d2e 50%, #0d1a1a 100%)",
      fontFamily: "'Georgia', serif",
      color: "#e8d5b7",
      padding: "16px",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "28px", marginBottom: "4px" }}>🌺</div>
        <h1 style={{
          fontSize: "20px", fontWeight: "bold", margin: "0 0 4px",
          background: "linear-gradient(90deg, #EC4899, #f6d365, #10B981)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>Daily Power Practices</h1>
        <p style={{ fontSize: "11px", color: "#a89070", margin: "0 0 8px" }}>
          Calibrated for Taurus Lagna • Rohini Nakshatra • KP's Chart
        </p>

        {/* Planet badges */}
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
          {Object.entries(PLANETARY_POWERS).map(([key, p]) => (
            <div key={key} style={{
              fontSize: "9px", padding: "3px 8px", borderRadius: "12px",
              background: `${p.color}18`, border: `1px solid ${p.color}40`,
              color: p.color,
            }}>
              {p.emoji} {p.name.split(" ")[0]}
            </div>
          ))}
        </div>

        {totalChecked > 0 && (
          <div style={{
            marginTop: "10px", fontSize: "11px", color: "#10B981",
            background: "rgba(16,185,129,0.1)", borderRadius: "12px",
            padding: "4px 12px", display: "inline-block"
          }}>
            ✓ {totalChecked} practice{totalChecked > 1 ? "s" : ""} completed today
          </div>
        )}
      </div>

      {/* Section Nav */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px" }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => { setActiveSection(s.id); setExpandedPractice(null); }}
            style={{
              padding: "7px 12px", borderRadius: "20px", border: "none",
              cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap",
              background: activeSection === s.id ? s.color : "rgba(255,255,255,0.07)",
              color: activeSection === s.id ? "#0d0d1a" : "#c4a882",
              fontWeight: activeSection === s.id ? "bold" : "normal",
              transition: "all 0.2s",
            }}>{s.title.split(" ")[0]} {s.title.split(" ").slice(1).join(" ")}</button>
        ))}
      </div>

      {/* Section Content */}
      {currentSection && (
        <div>
          {/* Section Header */}
          <div style={{
            background: currentSection.bg, border: `1px solid ${currentSection.border}`,
            borderRadius: "14px", padding: "14px", marginBottom: "14px",
            borderLeft: `4px solid ${currentSection.color}`,
          }}>
            <div style={{ color: currentSection.color, fontWeight: "bold", fontSize: "15px", marginBottom: "2px" }}>
              {currentSection.title}
            </div>
            <div style={{ fontSize: "10px", color: "#a89070", marginBottom: "8px" }}>{currentSection.subtitle}</div>
            <p style={{ fontSize: "12px", color: "#c4a882", lineHeight: "1.6", margin: 0 }}>{currentSection.intro}</p>
          </div>

          {/* Practices */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {currentSection.practices.map((p, i) => {
              const key = `${activeSection}-${i}`;
              const isExpanded = expandedPractice === key;
              const isChecked = checked[key];
              const pColor = PLANET_COLORS[p.planet];

              return (
                <div key={key} style={{
                  background: isChecked ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isChecked ? "#10B98140" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "12px", overflow: "hidden",
                  transition: "all 0.2s",
                }}>
                  {/* Practice Header */}
                  <div style={{ display: "flex", alignItems: "center", padding: "12px", gap: "10px" }}>
                    {/* Checkbox */}
                    <div onClick={() => toggleCheck(key)} style={{
                      width: "22px", height: "22px", borderRadius: "50%",
                      border: `2px solid ${isChecked ? "#10B981" : pColor}`,
                      background: isChecked ? "#10B981" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", flexShrink: 0, transition: "all 0.2s",
                    }}>
                      {isChecked && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
                    </div>

                    {/* Title */}
                    <div style={{ flex: 1 }} onClick={() => setExpandedPractice(isExpanded ? null : key)}>
                      <div style={{
                        fontSize: "13px", fontWeight: "bold",
                        color: isChecked ? "#10B981" : "#e8d5b7",
                        textDecoration: isChecked ? "line-through" : "none",
                      }}>{p.title}</div>
                      <div style={{ display: "flex", gap: "6px", marginTop: "3px", alignItems: "center" }}>
                        <span style={{
                          fontSize: "9px", padding: "1px 6px", borderRadius: "8px",
                          background: `${pColor}22`, color: pColor,
                        }}>
                          {PLANETARY_POWERS[p.planet]?.emoji} {p.planet.charAt(0).toUpperCase() + p.planet.slice(1)}
                        </span>
                        <span style={{ fontSize: "10px", color: "#6b5a45" }}>⏱ {p.duration}</span>
                      </div>
                    </div>

                    <div onClick={() => setExpandedPractice(isExpanded ? null : key)}
                      style={{ color: "#6b5a45", cursor: "pointer", fontSize: "14px" }}>
                      {isExpanded ? "▲" : "▼"}
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div style={{ padding: "0 12px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ paddingTop: "12px" }}>
                        <div style={{ fontSize: "10px", color: pColor, fontWeight: "bold", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Why this works for your chart
                        </div>
                        <p style={{ fontSize: "12px", color: "#c4a882", lineHeight: "1.6", margin: "0 0 12px" }}>{p.why}</p>
                        <div style={{ fontSize: "10px", color: "#10B981", fontWeight: "bold", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          How to do it
                        </div>
                        <p style={{ fontSize: "12px", color: "#e8d5b7", lineHeight: "1.6", margin: 0 }}>{p.how}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: "24px", textAlign: "center",
        padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)",
        fontSize: "11px", color: "#4a3a2a", lineHeight: "1.8"
      }}>
        🌺 Practices calibrated for Taurus Lagna • Rohini Nakshatra<br />
        Mercury Mahadasha (until 2026) • Exalted Mars in 9th<br />
        <span style={{ color: "#6b5a45" }}>Tap any practice to expand • Circle to mark complete</span>
      </div>
    </div>
  );
}
