import { useState } from "react";

const styles = {
  root: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    background: "linear-gradient(135deg, #0d1117 0%, #161b27 60%, #0d1117 100%)",
    minHeight: "100vh",
    color: "#e8e0d0",
    padding: "0",
    margin: "0",
  },
  hero: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "3rem 2.5rem 2.5rem",
    position: "relative",
    overflow: "hidden",
    borderBottom: "1px solid rgba(255,160,50,0.15)",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,160,50,0.12)",
    border: "1px solid rgba(255,160,50,0.3)",
    borderRadius: "20px",
    padding: "4px 14px",
    fontSize: "11px",
    color: "#FFA032",
    marginBottom: "1.2rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: "clamp(22px, 4vw, 34px)",
    fontWeight: "400",
    color: "#fff",
    lineHeight: "1.3",
    marginBottom: "0.6rem",
    fontStyle: "italic",
  },
  heroSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "14px",
    maxWidth: "560px",
    lineHeight: "1.6",
  },
  heroFlags: {
    display: "flex",
    gap: "8px",
    marginTop: "1.5rem",
    flexWrap: "wrap",
  },
  flagPill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  navBar: {
    display: "flex",
    gap: "6px",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  navBtn: (active) => ({
    padding: "8px 18px",
    borderRadius: "22px",
    border: active ? "1px solid rgba(255,160,50,0.5)" : "1px solid rgba(255,255,255,0.12)",
    background: active ? "rgba(255,160,50,0.1)" : "rgba(255,255,255,0.04)",
    color: active ? "#FFA032" : "rgba(255,255,255,0.55)",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "inherit",
    fontWeight: active ? "600" : "400",
    transition: "all 0.2s",
    letterSpacing: "0.02em",
  }),
  sectionLabel: {
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,160,50,0.6)",
    marginBottom: "10px",
    marginTop: "2rem",
    fontFamily: "'Georgia', serif",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "1.2rem 1.4rem",
    marginBottom: "10px",
  },
  pillGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "10px",
    marginBottom: "1.2rem",
  },
  pillarCard: (color) => ({
    background: `rgba(${color},0.07)`,
    border: `1px solid rgba(${color},0.2)`,
    borderTop: `2px solid rgba(${color},0.7)`,
    borderRadius: "12px",
    padding: "1rem",
  }),
  pillarIcon: { fontSize: "22px", marginBottom: "8px" },
  pillarTitle: { fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#e8e0d0" },
  pillarDesc: { fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: "1.5" },
  ageTabs: {
    display: "flex",
    gap: "0",
    marginBottom: "1.8rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  ageTab: (active) => ({
    flex: 1,
    padding: "12px 8px",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "13px",
    fontFamily: "inherit",
    background: active ? "rgba(255,160,50,0.12)" : "rgba(255,255,255,0.03)",
    color: active ? "#FFA032" : "rgba(255,255,255,0.5)",
    fontWeight: active ? "600" : "400",
    border: "none",
    transition: "all 0.2s",
  }),
  ageLabel: { fontSize: "11px", opacity: 0.65, display: "block", marginTop: "2px" },
  milestoneGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "10px",
    marginBottom: "1.2rem",
  },
  milestoneCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "0.9rem",
  },
  mHead: {
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textTransform: "uppercase",
  },
  dot: (color) => ({
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: color,
    display: "inline-block",
    flexShrink: 0,
  }),
  miList: { listStyle: "none", padding: 0, margin: 0 },
  miItem: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)",
    padding: "2px 0 2px 12px",
    position: "relative",
    lineHeight: "1.5",
  },
  routineRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  timeBadge: {
    fontSize: "11px",
    padding: "3px 8px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.45)",
    minWidth: "72px",
    textAlign: "center",
    flexShrink: 0,
    lineHeight: "1.5",
  },
  routineText: { fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.55" },
  chips: { display: "flex", flexWrap: "wrap", gap: "7px", marginTop: "8px" },
  chip: {
    fontSize: "12px",
    padding: "5px 12px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.55)",
  },
  warningBox: {
    background: "rgba(186,117,23,0.08)",
    border: "1px solid rgba(186,117,23,0.2)",
    borderRadius: "10px",
    padding: "0.85rem 1rem",
    fontSize: "13px",
    color: "rgba(255,255,255,0.55)",
    marginTop: "1rem",
    lineHeight: "1.6",
  },
  erikBox: {
    background: "rgba(127,119,221,0.08)",
    borderLeft: "2px solid rgba(127,119,221,0.5)",
    borderRadius: "0 10px 10px 0",
    padding: "0.8rem 1rem",
    marginBottom: "1.2rem",
    fontSize: "13px",
    color: "rgba(255,255,255,0.55)",
    lineHeight: "1.6",
  },
  ageHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "1.4rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  ageBadgeBig: (color) => ({
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: `rgba(${color},0.12)`,
    border: `2px solid rgba(${color},0.3)`,
    color: `rgb(${color})`,
  }),
  compareTable: { width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "1.5rem" },
  th: (color) => ({
    background: "rgba(255,255,255,0.05)",
    padding: "10px 12px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "11px",
    color: color || "rgba(255,255,255,0.4)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  }),
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    verticalAlign: "top",
    lineHeight: "1.55",
    color: "rgba(255,255,255,0.55)",
    fontSize: "13px",
  },
  nutCard: (border) => ({
    borderRadius: "10px",
    padding: "0.85rem",
    fontSize: "12px",
    background: `rgba(${border},0.06)`,
    border: `1px solid rgba(${border},0.18)`,
  }),
  resGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "10px",
    marginBottom: "1rem",
  },
  resCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "0.9rem 1rem",
  },
  accordionItem: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    marginBottom: "6px",
    overflow: "hidden",
  },
  accordionHeader: (open) => ({
    width: "100%",
    textAlign: "left",
    padding: "11px 14px",
    background: open ? "rgba(255,160,50,0.06)" : "rgba(255,255,255,0.03)",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "13px",
    fontWeight: "500",
    color: open ? "#FFA032" : "rgba(255,255,255,0.7)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s",
  }),
  accordionBody: {
    padding: "12px 14px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.5)",
    lineHeight: "1.65",
    background: "rgba(255,255,255,0.02)",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  monitorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "8px",
    marginBottom: "1rem",
  },
  monitorCard: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "10px",
    padding: "0.85rem",
    fontSize: "12px",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  footer: {
    textAlign: "center",
    fontSize: "12px",
    color: "rgba(255,255,255,0.25)",
    padding: "2rem 0 1rem",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    marginTop: "2rem",
    lineHeight: "1.7",
  },
};

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={styles.accordionItem}>
      <button style={styles.accordionHeader(open)} onClick={() => setOpen(!open)}>
        {title}
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", fontSize: "16px" }}>▾</span>
      </button>
      {open && <div style={styles.accordionBody}>{children}</div>}
    </div>
  );
};

const SectionLabel = ({ children }) => <div style={styles.sectionLabel}>{children}</div>;

const MilestoneCard = ({ dot, title, items }) => (
  <div style={styles.milestoneCard}>
    <div style={styles.mHead}>
      <span style={styles.dot(dot)} />
      <span style={{ color: "rgba(255,255,255,0.5)" }}>{title}</span>
    </div>
    <ul style={styles.miList}>
      {items.map((item, i) => (
        <li key={i} style={styles.miItem}>
          <span style={{ position: "absolute", left: 0, color: "rgba(255,160,50,0.4)" }}>›</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const RoutineRow = ({ time, text }) => (
  <div style={styles.routineRow}>
    <div style={styles.timeBadge}>{time}</div>
    <div style={styles.routineText}>{text}</div>
  </div>
);

const WarningBox = ({ children }) => (
  <div style={styles.warningBox}>
    <span style={{ color: "#BA7517", marginRight: "5px" }}>⚠</span>
    {children}
  </div>
);

const ErikBox = ({ children }) => <div style={styles.erikBox}>{children}</div>;

// ─── STAGE DATA ────────────────────────────────────────────────────────────────

const stages = [
  {
    id: "s1", label: "🌱 Early", sub: "Ages 2–4", color: "29,158,117",
    title: "Early Toddlerhood — The Foundation Years",
    subtitle: "Secure attachment, sensory exploration, language explosion, and first social bonds",
    erikson: "Autonomy vs Shame (2–3) → Initiative vs Guilt (4). Let him try, fail safely, and try again. Shame and over-correction here can last a lifetime.",
    milestones: [
      { title: "Physical", dot: "#1D9E75", items: ["Runs, jumps, climbs confidently", "Kicks & catches a ball", "Holds crayon, scribbles", "Self-dresses with help", "Toilet trained by age 3"] },
      { title: "Cognitive", dot: "#378ADD", items: ["200–1000+ word vocabulary", "Names colours & shapes", "Symbolic play (pretend)", "Simple puzzles (4–6 pieces)", "Counts to 10 by age 4"] },
      { title: "Emotional", dot: "#D85A30", items: ["Identifies happy/sad/angry", "Seeks comfort from caregivers", "2-min frustration tolerance", "Begins self-soothing"] },
      { title: "Social", dot: "#7F77DD", items: ["Parallel play → cooperative", "Says please/thank you", "Greets elders (namaste)", "Shares with prompting"] },
    ],
    routines: [
      { time: "6:30 am", text: "Wake with sunlight. Morning prayer/gratitude ritual with parent (Indian shloka or mantra; Japanese bow + 'itadakimasu' before eating)" },
      { time: "7:00 am", text: "Nutritious breakfast — dal rice or idli with miso soup fusion. Child helps set the table (Japanese self-sufficiency starts here)" },
      { time: "8:00 am", text: "30 min free outdoor play — sand, mud, water. No screens. Critical for proprioception and gross motor development" },
      { time: "9:30 am", text: "Playgroup or home learning: colouring, block building, storytelling in mother tongue" },
      { time: "11:00 am", text: "Read-aloud time — Indian folktales (Panchatantra) or Japanese picture books. Point at words to build print awareness" },
      { time: "12:30 pm", text: "Lunch + nap. Calm, no screens. Child helps clear the plate" },
      { time: "3:30 pm", text: "Creative play: clay, painting, music instruments, pretend cooking" },
      { time: "5:30 pm", text: "Grandparent/elder bonding time — stories, songs, simple errands together" },
      { time: "7:00 pm", text: "Dinner, tidy-up together. Child puts toys back (shitsuke begins at age 2)" },
      { time: "7:30 pm", text: "Bedtime ritual: warm oil massage (Indian abhyanga), lullaby, one short story" },
    ],
    activities: ["🎨 Finger painting", "🧱 Block stacking", "🌿 Garden watering", "🎵 Rhythm & clapping songs", "🤸 Balance beam play", "📚 Bilingual picture books", "🪆 Sorting & matching toys", "🐛 Nature walks with magnifying glass", "🫙 Sand & water sensory bins"],
    warning: "Screen time under 24 months = none. Ages 2–4 = max 1hr/day of co-viewed, educational content. The developing brain at this stage is wired by physical interaction, not passive viewing.",
  },
  {
    id: "s2", label: "🌿 Preschool", sub: "Ages 5–7", color: "55,138,221",
    title: "Preschool / Early School — The Curious Explorer",
    subtitle: "Reading, arithmetic, peer bonds, rule-following, and growing independence",
    erikson: "Industry vs Inferiority (6+). He needs to feel competent. Celebrate effort, not just outcome. A child praised for trying becomes a child who tries hard things.",
    milestones: [
      { title: "Physical", dot: "#1D9E75", items: ["Skips, hops, rides a bicycle", "Writes letters & numbers", "Uses scissors confidently", "Swims basic strokes", "Team sports coordination"] },
      { title: "Cognitive", dot: "#378ADD", items: ["Reads simple sentences (age 6+)", "Basic addition/subtraction", "Understands cause & effect", "Categorises & classifies", "Bilingual sentence formation"] },
      { title: "Emotional", dot: "#D85A30", items: ["Names complex emotions", "10–15 min frustration tolerance", "Empathy for peers' feelings", "Asks for help appropriately"] },
      { title: "Social", dot: "#7F77DD", items: ["Makes & keeps friends", "Follows classroom rules", "Takes turns and waits", "Household contributions"] },
    ],
    routines: [
      { time: "Mornings", text: "15-min reading before school. Child packs own school bag (Japanese autonomy). Bow or touch feet for elder blessings (Indian respect ritual)" },
      { time: "After school", text: "Snack + 45 min free play (unstructured). Then 20-min homework/reading at a fixed desk. No negotiation — consistency equals security" },
      { time: "Tuesday", text: "Art or music class. Let him choose between classical Indian music (tabla/harmonium) or drawing/origami" },
      { time: "Thursday", text: "Physical skill day: swimming, martial arts (karate/judo), or yoga" },
      { time: "Saturday", text: "Family project: cook a meal together, visit grandparents, clean the home together (Japanese 'o-souji')" },
      { time: "Sunday", text: "Nature outing or community service: plant a tree, feed animals, visit an elderly neighbour" },
    ],
    activities: ["📖 Chapter books (bilingual)", "🥋 Karate / Yoga", "🎼 Tabla or keyboard", "🌍 Map puzzles", "♟️ Chess (beginner)", "🪴 Kitchen garden", "🖊️ Journaling with drawings", "🔭 Basic science experiments", "🧩 Strategy board games", "🎭 Storytelling/drama"],
    warning: "This is when academic pressure from both cultures can peak too early. Resist comparison with classmates. The goal at ages 5–7 is love of learning, not performance rankings.",
  },
  {
    id: "s3", label: "🌳 Late Childhood", sub: "Ages 8–10", color: "127,119,221",
    title: "Late Childhood — The Emerging Individual",
    subtitle: "Identity formation, mastery mindset, social complexity, and real-world contribution",
    erikson: "Industry vs Inferiority intensifies. He is actively comparing himself to peers. His need now is to be good at something real. Give him domains where mastery is visible and celebrated.",
    milestones: [
      { title: "Physical", dot: "#1D9E75", items: ["Team sport competency", "Consistent fitness habit", "Fine motor precision (craft/art)", "Cooks a simple meal", "Cycles long distances"] },
      { title: "Cognitive", dot: "#378ADD", items: ["Reads for pleasure independently", "Multi-step problem solving", "Basic coding or logic", "Research using library/internet", "Writes structured essays"] },
      { title: "Emotional", dot: "#D85A30", items: ["Manages peer conflict verbally", "Rebounds from failure faster", "Understands others' perspectives", "Expresses needs directly"] },
      { title: "Social", dot: "#7F77DD", items: ["Navigates group dynamics", "Takes leadership in projects", "Community volunteering", "Family responsibility roles"] },
    ],
    routines: [
      { time: "Daily", text: "30 min independent reading. 20 min physical activity. He sets his own study schedule with weekly parent review (ganbaru + self-directed learning)" },
      { time: "Monday", text: "Debate or current events discussion at dinner. 'What did you read? What's your opinion?' — builds critical thinking and expressive confidence" },
      { time: "Wednesday", text: "Skill deepening: whichever craft/art/music/sport he has chosen. 45–60 min focused practice. No multitasking" },
      { time: "Friday", text: "Responsibility task: budget the week's grocery list, manage a small plant nursery, or handle a household chore independently" },
      { time: "Weekend", text: "Community service project: teach younger kids, clean a park, help at a food drive. Social contribution is non-negotiable by age 9" },
    ],
    activities: ["💻 Scratch / beginner coding", "📷 Photography or filmmaking", "🏊 Competitive swimming", "🎸 Musical instrument mastery", "📜 Sanskrit / Japanese basics", "♟️ Tournament chess", "🌱 Entrepreneurship project", "🧪 Science fair project", "📰 Personal blog or journal", "🥋 Martial arts (belt progression)"],
    warning: "Ages 8–10 is when screen addiction and peer pressure begin. Establish a family media agreement together — he helps write the rules. Ownership creates compliance.",
  },
];

const RoadmapSection = () => {
  const [active, setActive] = useState(0);
  const s = stages[active];
  return (
    <div>
      <div style={styles.ageTabs}>
        {stages.map((st, i) => (
          <button
            key={i}
            style={{ ...styles.ageTab(i === active), borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
            onClick={() => setActive(i)}
          >
            {st.label}<span style={styles.ageLabel}>{st.sub}</span>
          </button>
        ))}
      </div>

      <div style={styles.ageHeader}>
        <div style={styles.ageBadgeBig(s.color)}>
          <span style={{ fontSize: "16px", fontWeight: "600", lineHeight: 1 }}>{s.sub.split(" ")[0]}</span>
          <span style={{ fontSize: "9px", opacity: 0.7, letterSpacing: "0.05em" }}>yrs</span>
        </div>
        <div>
          <div style={{ fontSize: "17px", fontWeight: "500", color: "#e8e0d0", marginBottom: "3px" }}>{s.title}</div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>{s.subtitle}</div>
        </div>
      </div>

      <ErikBox><strong style={{ color: "#7F77DD" }}>Erikson: </strong>{s.erikson}</ErikBox>

      <SectionLabel>Core Milestones</SectionLabel>
      <div style={styles.milestoneGrid}>
        {s.milestones.map((m, i) => <MilestoneCard key={i} {...m} />)}
      </div>

      <SectionLabel>Daily / Weekly Practices (India × Japan Merged)</SectionLabel>
      <div style={styles.card}>
        {s.routines.map((r, i) => <RoutineRow key={i} {...r} />)}
      </div>

      <SectionLabel>Activities & Hobbies</SectionLabel>
      <div style={styles.chips}>
        {s.activities.map((a, i) => <div key={i} style={styles.chip}>{a}</div>)}
      </div>

      <WarningBox><strong>Parent reminder: </strong>{s.warning}</WarningBox>
    </div>
  );
};

const compareRows = [
  { domain: "Discipline", india: "Parent-led, correction-heavy, respect for hierarchy", japan: "Shitsuke: self-imposed, modelled not enforced", merged: "Model behaviour first; correct gently. Explain the 'why' behind every rule" },
  { domain: "Independence", india: "Child is supported by family; independence comes later", japan: "Child walks to school alone by age 6; packs bag by age 4", merged: "Scaffold independence in stages — let him do things himself in safe contexts from age 3" },
  { domain: "Academics", india: "Early focus, tutors common, marks-driven", japan: "No homework until age 10; play-based learning prioritised", merged: "Ages 2–7: play-first. Ages 8–10: structured academics + intrinsic motivation" },
  { domain: "Emotions", india: "Expression within family encouraged; outward stoicism expected", japan: "Emotional restraint; gaman (endure with patience)", merged: "Safe emotional expression at home; graceful composure in public. Both are taught explicitly" },
  { domain: "Cleanliness", india: "Cleanliness is a duty ('cleanliness is godliness')", japan: "Communal cleaning; students clean own classrooms daily", merged: "Daily family tidy-up ritual (10 mins). Child has a zone they own. Pride in shared space" },
  { domain: "Food", india: "Eating together is sacred; specific foods for health", japan: "Hara hachi bu (eat till 80% full); varied small portions", merged: "Eat together daily. Introduce concept of 'enough.' Offer variety, not restriction" },
  { domain: "Elder respect", india: "Pranaam, touching feet, using 'ji/saab' suffixes", japan: "Deep bow, senpai-kohai courtesy, deference in language", merged: "Teach both forms. Practice at home. Explain respect as recognising wisdom, not hierarchy" },
  { domain: "Failure", india: "Family rallies around; may shield child from failure", japan: "Ganbaru: 'do your best and persist.' Failure is a teacher", merged: "Acknowledge his feelings, then help him analyse what went wrong. Don't rescue — coach" },
];

const dialData = [
  { age: "Ages 2–4", india: 55, japan: 45, label: "Warmth & attachment lead; introduce shitsuke gently" },
  { age: "Ages 5–7", india: 45, japan: 55, label: "Autonomy & self-sufficiency increase; family stays central" },
  { age: "Ages 8–10", india: 50, japan: 50, label: "Full integration — both frameworks equally active" },
];

const CrossCulturalSection = () => (
  <div>
    <SectionLabel>Direct Comparison</SectionLabel>
    <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
      <table style={styles.compareTable}>
        <thead>
          <tr>
            <th style={styles.th()}>Domain</th>
            <th style={styles.th("#BA7517")}>🇮🇳 Indian Style</th>
            <th style={styles.th("#378ADD")}>🇯🇵 Japanese Style</th>
            <th style={styles.th("#1D9E75")}>✦ Merged Practice</th>
          </tr>
        </thead>
        <tbody>
          {compareRows.map((r, i) => (
            <tr key={i}>
              <td style={{ ...styles.td, fontWeight: "600", color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>{r.domain}</td>
              <td style={styles.td}>{r.india}</td>
              <td style={styles.td}>{r.japan}</td>
              <td style={{ ...styles.td, color: "rgba(29,158,117,0.8)" }}>{r.merged}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <SectionLabel>Balance Strategy — The Dial Model</SectionLabel>
    <div style={styles.card}>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "14px", lineHeight: "1.6" }}>
        Neither culture should dominate. At different ages, lean slightly one way, then the other. The goal is integration, not alternation.
      </div>
      {dialData.map((d, i) => (
        <div key={i} style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#e8e0d0" }}>{d.age}</span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{d.label}</span>
          </div>
          <div style={{ display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden", gap: "2px" }}>
            <div style={{ width: `${d.india}%`, background: "#BA7517", borderRadius: "5px 0 0 5px", opacity: 0.75 }} />
            <div style={{ width: `${d.japan}%`, background: "#185FA5", borderRadius: "0 5px 5px 0", opacity: 0.75 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <span style={{ fontSize: "11px", color: "#BA7517" }}>🇮🇳 {d.india}%</span>
            <span style={{ fontSize: "11px", color: "#185FA5" }}>🇯🇵 {d.japan}%</span>
          </div>
        </div>
      ))}
    </div>

    <SectionLabel>Common Pitfalls to Avoid</SectionLabel>
    {[
      { title: "Over-scheduling (Indian tendency)", body: "Between school, tuition, music, and sport, children in Indian households often have zero unstructured time. Research (Gray, 2013) shows free play is the primary mechanism for emotional regulation development. Guard 90 minutes of free play daily until age 10." },
      { title: "Emotional suppression (Japanese tendency)", body: "Gaman and group harmony are virtues — but suppressed emotions in childhood correlate with psychosomatic illness and social withdrawal later. Create a daily 5-minute 'feelings check-in' where he can name emotions without judgment. This is the Indian gift to the Japanese framework." },
      { title: "Comparison with peers", body: "'Raju got 95, why did you get 80?' is the single most damaging phrase in Indian child-rearing. It activates shame (Erikson), reduces intrinsic motivation (Deci & Ryan's Self-Determination Theory), and damages the parent-child bond. Replace with: 'Tell me about what you found hard. Let us work on it.'" },
      { title: "Helicopter parenting vs neglected autonomy", body: "Indian families may over-intervene; a misread of Japanese autonomy may go too far the other way. The balance is 'supervised independence' — he decides what, you decide within what boundaries. Let him choose his hobby from a curated list, not from open-ended pressure." },
    ].map((a, i) => <Accordion key={i} title={a.title}>{a.body}</Accordion>)}
  </div>
);

const ResourcesSection = () => (
  <div>
    <SectionLabel>Nutrition Philosophy</SectionLabel>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "10px", marginBottom: "1.2rem" }}>
      {[
        { label: "🇮🇳 Indian Principles", rgb: "186,117,23", items: ["Warm, freshly cooked meals", "Ghee for healthy brain fats", "Turmeric milk at night", "Seasonal fruits & sabzi", "Avoid cold drinks", "Festivals = special foods"] },
        { label: "🇯🇵 Japanese Principles", rgb: "24,95,165", items: ["Ichiju sansai (1 soup, 3 sides)", "Small, varied portions", "Hara hachi bu (eat 80% full)", "Fermented foods (miso)", "Minimal sugar until age 5", "Eat slowly, mindfully"] },
        { label: "✦ Fusion for India", rgb: "15,110,86", items: ["Dal-rice + miso broth", "Add seaweed to salads", "Smaller servings, more variety", "No second helpings habit", "Fermented: idli, dosa, curd", "Eat together, no screens"] },
      ].map((n, i) => (
        <div key={i} style={styles.nutCard(n.rgb)}>
          <div style={{ fontSize: "11px", fontWeight: "600", color: `rgb(${n.rgb})`, marginBottom: "7px" }}>{n.label}</div>
          <ul style={styles.miList}>
            {n.items.map((it, j) => (
              <li key={j} style={{ ...styles.miItem, paddingLeft: "12px" }}>
                <span style={{ position: "absolute", left: 0, color: `rgba(${n.rgb},0.5)` }}>·</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <SectionLabel>Books for Parents</SectionLabel>
    <div style={styles.resGrid}>
      {[
        { type: "Parenting Science", title: "The Whole-Brain Child", desc: "Siegel & Bryson — how to integrate left/right brain in discipline and emotional coaching" },
        { type: "Japanese Philosophy", title: "Ikigai for Families", desc: "Applying Japanese purpose-finding to raise children with intrinsic direction" },
        { type: "Indian Wisdom", title: "Panchatantra (original)", desc: "Ancient Indian fables encoding social intelligence, ethics, and strategy for young minds" },
        { type: "Developmental Science", title: "How Children Learn", desc: "John Holt — classic work on child-led learning and conditions for real intellectual growth" },
        { type: "Emotional Intelligence", title: "Raising an Emotionally Intelligent Child", desc: "John Gottman — the emotion coaching model, most compatible with merged Indian-Japanese style" },
        { type: "Autonomy & Play", title: "Free to Learn", desc: "Peter Gray — evidence for why unstructured play is non-negotiable developmental infrastructure" },
      ].map((b, i) => (
        <div key={i} style={styles.resCard}>
          <div style={{ fontSize: "10px", fontWeight: "600", color: "rgba(255,160,50,0.55)", letterSpacing: "0.06em", marginBottom: "4px", textTransform: "uppercase" }}>{b.type}</div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#e8e0d0", marginBottom: "3px" }}>{b.title}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.5" }}>{b.desc}</div>
        </div>
      ))}
    </div>

    <SectionLabel>Books for the Child (by stage)</SectionLabel>
    <div style={styles.resGrid}>
      {[
        { type: "Ages 2–4", title: "Totto-chan (adapted)", desc: "Japanese school life; curiosity and being different are celebrated" },
        { type: "Ages 2–4", title: "Akimbo & the Elephants", desc: "Builds empathy, nature awareness, and courage in young boys" },
        { type: "Ages 5–7", title: "Jataka Tales", desc: "Buddhist-origin Indian stories; moral reasoning made concrete and memorable" },
        { type: "Ages 5–7", title: "My Neighbour Totoro (book)", desc: "Japanese — wonder, sibling bonds, nature reverence, accepting the unknown" },
        { type: "Ages 8–10", title: "The Alchemist (simplified)", desc: "Purpose, persistence, reading signs — aligns with both dharma and ikigai thinking" },
        { type: "Ages 8–10", title: "The Giver", desc: "Community, conformity, and individual conscience — sparks exactly the right dinner debate" },
      ].map((b, i) => (
        <div key={i} style={styles.resCard}>
          <div style={{ fontSize: "10px", fontWeight: "600", color: "rgba(100,180,255,0.55)", letterSpacing: "0.06em", marginBottom: "4px", textTransform: "uppercase" }}>{b.type}</div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#e8e0d0", marginBottom: "3px" }}>{b.title}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.5" }}>{b.desc}</div>
        </div>
      ))}
    </div>

    <SectionLabel>Monitoring & Progress Tools</SectionLabel>
    <div style={styles.monitorGrid}>
      {[
        { icon: "📓", title: "Growth Journal", sub: "Monthly parent entry: 3 things he did better, 1 area to work on" },
        { icon: "⭐", title: "Habit Chart", sub: "Stars for tidy room, reading, kindness — not for grades" },
        { icon: "🗓️", title: "Quarterly Review", sub: "Sit together every 3 months. What are you proud of? What do you want to try?" },
        { icon: "🎙️", title: "Voice Diary", sub: "Ages 4+: record him narrating his day weekly. Play back in a year" },
        { icon: "🩺", title: "Annual Checkup", sub: "Ask the paediatrician about developmental milestones explicitly" },
        { icon: "🤝", title: "Teacher Connect", sub: "Monthly 10-min chat. Ask: 'What does he do when things are hard?'" },
      ].map((m, i) => (
        <div key={i} style={styles.monitorCard}>
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>{m.icon}</div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#e8e0d0", marginBottom: "3px" }}>{m.title}</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.45" }}>{m.sub}</div>
        </div>
      ))}
    </div>

    <div style={styles.footer}>
      This guide synthesises Piaget, Erikson, Bowlby, Vygotsky, and cross-cultural research in developmental psychology.<br />
      Adapt to your child's individual temperament — he is the authority, not any framework.<br />
      <span style={{ opacity: 0.4, fontSize: "11px" }}>Built with love for modern Indian parents · India × Japan Child Development Guide</span>
    </div>
  </div>
);

const FrameworkSection = () => (
  <div>
    <SectionLabel>The Four Pillars of All-Round Development</SectionLabel>
    <div style={styles.pillGrid}>
      {[
        { icon: "🏃", title: "Physical", desc: "Gross & fine motor skills, nutrition, body awareness, outdoor time, yoga/martial arts", rgb: "29,158,117" },
        { icon: "🧠", title: "Intellectual", desc: "Curiosity, problem-solving, language, reading habits, logical reasoning, creativity", rgb: "55,138,221" },
        { icon: "💛", title: "Emotional", desc: "Self-regulation, empathy, resilience, emotional vocabulary, secure attachment", rgb: "216,90,48" },
        { icon: "🤝", title: "Social", desc: "Peer relationships, family bonds, manners, community responsibility, conflict resolution", rgb: "127,119,221" },
      ].map((p, i) => (
        <div key={i} style={styles.pillarCard(p.rgb)}>
          <div style={styles.pillarIcon}>{p.icon}</div>
          <div style={styles.pillarTitle}>{p.title}</div>
          <div style={styles.pillarDesc}>{p.desc}</div>
        </div>
      ))}
    </div>

    <SectionLabel>Philosophical Foundation</SectionLabel>
    <div style={styles.card}>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", marginBottom: "12px", lineHeight: "1.65" }}>
        The Indian and Japanese developmental philosophies are <em>complementary</em>, not contradictory. Both prize excellence, respect, and character. The synthesis creates a child who is emotionally rooted <em>and</em> self-reliant — academically ambitious <em>and</em> communally aware.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[
          { flag: "🇮🇳 Indian Strengths", rgb: "186,117,23", items: ["Deep family bonds & elder respect", "Early academic engagement", "Storytelling & oral tradition", "Spiritual grounding (values, dharma)", "Inclusive social bonding"] },
          { flag: "🇯🇵 Japanese Strengths", rgb: "24,95,165", items: ["Shitsuke (self-discipline, manners)", "Autonomy & self-sufficiency early", "Perseverance (ganbaru mindset)", "Cleanliness & environmental care", "Group harmony & collective pride"] },
        ].map((s, i) => (
          <div key={i} style={{ background: `rgba(${s.rgb},0.07)`, borderRadius: "10px", padding: "0.85rem", border: `1px solid rgba(${s.rgb},0.18)` }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: `rgb(${s.rgb})`, marginBottom: "8px", letterSpacing: "0.05em" }}>{s.flag}</div>
            <ul style={styles.miList}>
              {s.items.map((it, j) => (
                <li key={j} style={{ ...styles.miItem, paddingLeft: "12px" }}>
                  <span style={{ position: "absolute", left: 0, color: `rgba(${s.rgb},0.5)` }}>›</span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <SectionLabel>Guiding Theorists</SectionLabel>
    {[
      { title: "Piaget's Stages", body: "Ages 2–7 = Pre-operational (symbolic thought, egocentric, magical thinking). Ages 7–10 = Concrete Operational (logical reasoning, conservation, reversibility). Match activities to these windows — don't rush abstract thinking before age 7." },
      { title: "Erikson's Crises", body: "Ages 2–3: Autonomy vs Shame. Ages 4–5: Initiative vs Guilt. Ages 6–10: Industry vs Inferiority. Each stage demands a different parenting response — independence, encouragement, and competence-building respectively." },
      { title: "Attachment Theory (Bowlby & Ainsworth)", body: "Secure attachment — consistent, responsive parenting — is the single best predictor of emotional regulation, social confidence, and academic resilience. Both Indian family closeness and Japanese maternal attunement build this foundation." },
      { title: "Vygotsky's Zone of Proximal Development", body: "The sweet spot between what a child can do alone and with guidance. Indian gurukula-style mentorship and Japanese senpai-kohai traditions both operationalize ZPD naturally." },
    ].map((a, i) => <Accordion key={i} title={a.title}>{a.body}</Accordion>)}
  </div>
);

const sections = [
  { id: "framework", label: "Framework", Component: FrameworkSection },
  { id: "roadmap", label: "Age Roadmap", Component: RoadmapSection },
  { id: "crosscultural", label: "Cross-Cultural", Component: CrossCulturalSection },
  { id: "resources", label: "Resources & Tools", Component: ResourcesSection },
];

export default function ChildDevelopmentGuide() {
  const [active, setActive] = useState("framework");
  const ActiveComponent = sections.find((s) => s.id === active).Component;

  return (
    <div style={styles.root}>
      <div style={styles.hero}>
        <div style={styles.heroBadge}>✦ All-Round Development Guide · Ages 2–10</div>
        <h1 style={styles.heroTitle}>Raising a Grounded, Curious Boy</h1>
        <p style={styles.heroSub}>
          A synthesis of Indian family wisdom and Japanese shitsuke — structured as a living, interactive roadmap for modern parents.
        </p>
        <div style={styles.heroFlags}>
          <div style={styles.flagPill}><span>🇮🇳</span> Indian Framework</div>
          <div style={styles.flagPill}><span>🇯🇵</span> Japanese Framework</div>
          <div style={styles.flagPill}><span style={{ color: "#FFA032" }}>♥</span> Merged Practice</div>
        </div>
      </div>

      <div style={styles.container}>
        <nav style={styles.navBar} aria-label="Guide sections">
          {sections.map((s) => (
            <button key={s.id} style={styles.navBtn(active === s.id)} onClick={() => setActive(s.id)}>
              {s.label}
            </button>
          ))}
        </nav>
        <ActiveComponent />
      </div>
    </div>
  );
}
