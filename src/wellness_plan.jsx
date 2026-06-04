import { useState } from "react";

const days = [
  {
    day: "MON",
    label: "Monday",
    theme: "Strength + Reset",
    color: "#2DD4BF",
    schedule: [
      { time: "6:00 AM", duration: "5 min", activity: "Morning breathwork", detail: "Box breathing: 4s inhale → 4s hold → 4s exhale → 4s hold. Repeat 5 rounds. Activates parasympathetic system, drops cortisol immediately.", type: "mind" },
      { time: "6:05 AM", duration: "20 min", activity: "Strength Training (Upper Body)", detail: "Push-ups 3×12, Dumbbell rows 3×10, Shoulder press 3×10, Plank 3×30s. No gym? Bodyweight works perfectly.", type: "body" },
      { time: "6:25 AM", duration: "5 min", activity: "Cold water face splash + sunlight", detail: "Splash face with cold water 10 times. Step outside for 5 min of direct sunlight — resets circadian rhythm and boosts serotonin.", type: "body" },
      { time: "8:00 AM", duration: "—", activity: "Breakfast (Break fast here)", detail: "2 eggs + 1 cup oats + handful of nuts + black coffee or green tea. High protein start. No sugar. This is your eating window start if doing 16:8.", type: "food" },
      { time: "Every hour", duration: "5 min", activity: "Desk break walk", detail: "Set a timer. Stand, walk to another room, do 10 neck rolls. Prevents postural damage and metabolic stagnation from 13-hr sitting.", type: "body" },
      { time: "1:00 PM", duration: "—", activity: "Lunch", detail: "Large salad + lean protein (chicken, dal, paneer, fish) + complex carb (brown rice, roti). No refined sugar. Eat slow.", type: "food" },
      { time: "7:00 PM", duration: "30 min", activity: "Zone 2 Walk", detail: "Brisk walk — you should be able to speak full sentences but feel slightly breathless. This is the longevity zone. 30 min outdoor walk after work.", type: "body" },
      { time: "7:30 PM", duration: "—", activity: "Dinner (last meal)", detail: "Light: soup, vegetables, protein. No heavy carbs at night. Eating window closes here for 16:8.", type: "food" },
      { time: "9:30 PM", duration: "10 min", activity: "Evening meditation", detail: "Sit still, close eyes, focus only on breath. Use Insight Timer app (free). Even 10 minutes measurably reduces cortisol and lengthens telomeres over time.", type: "mind" },
      { time: "10:30 PM", duration: "—", activity: "Lights out", detail: "Non-negotiable. Consistent sleep time is more powerful than sleep duration. Dark room, cool temperature (18–20°C). No phone in bed.", type: "sleep" },
    ]
  },
  {
    day: "TUE",
    label: "Tuesday",
    theme: "Cardio + Mind",
    color: "#F472B6",
    schedule: [
      { time: "6:00 AM", duration: "5 min", activity: "Morning breathwork", detail: "4-7-8 technique: Inhale 4s, hold 7s, exhale 8s. Do 4 cycles. Reduces anxiety hormones within minutes.", type: "mind" },
      { time: "6:05 AM", duration: "25 min", activity: "Zone 2 Cardio (Cycling/Jog/Brisk Walk)", detail: "Keep heart rate at 120–140 bpm. This is mitochondrial repair zone. Best done fasted for fat adaptation. Indoors on stationary bike works too.", type: "body" },
      { time: "8:00 AM", duration: "—", activity: "Breakfast", detail: "Smoothie: banana + spinach + protein powder + flaxseed + almond milk. Or eggs + avocado toast on whole grain.", type: "food" },
      { time: "Every hour", duration: "5 min", activity: "20-20-20 Eye Rule", detail: "Every 20 min: look at something 20 feet away for 20 seconds. Prevents eye strain and blurred vision from screen work. Set reminder.", type: "body" },
      { time: "1:00 PM", duration: "—", activity: "Lunch", detail: "Include fatty fish (salmon/mackerel/sardines) 2x a week — rich in Omega-3 for brain and eye health. Or walnuts if vegetarian.", type: "food" },
      { time: "3:00 PM", duration: "10 min", activity: "Midday reset walk", detail: "Step outside. Short walk in sunlight. Vitamin D boost. Resets focus. Even 10 min reduces afternoon cortisol spike.", type: "body" },
      { time: "7:00 PM", duration: "20 min", activity: "Yoga / Stretching", detail: "Focus on hip flexors, thoracic spine, hamstrings — all destroyed by desk work. YouTube: 'Yoga for desk workers' — follow any 20-min session.", type: "body" },
      { time: "7:30 PM", duration: "—", activity: "Dinner", detail: "Vegetable-heavy meal. Lentils, chickpeas, mixed vegetables, small portion of whole grain.", type: "food" },
      { time: "9:30 PM", duration: "15 min", activity: "Journaling", detail: "Write 3 things: What went well today. What drained you. One thing you're grateful for. This offloads mental stress physically onto paper — measurably reduces anxiety.", type: "mind" },
      { time: "10:30 PM", duration: "—", activity: "Sleep", detail: "Same time every night. Your cortisol and melatonin patterns will normalize within 2 weeks.", type: "sleep" },
    ]
  },
  {
    day: "WED",
    label: "Wednesday",
    theme: "Strength + Recovery",
    color: "#A78BFA",
    schedule: [
      { time: "6:00 AM", duration: "5 min", activity: "Breathwork + sunlight", detail: "Wim Hof style: 30 deep breaths, exhale hold for 30s, deep inhale hold 15s. Repeat 3 rounds. Boosts energy without caffeine.", type: "mind" },
      { time: "6:05 AM", duration: "20 min", activity: "Strength Training (Lower Body)", detail: "Squats 3×15, Lunges 3×10 each, Glute bridges 3×15, Calf raises 3×20. Lower body training boosts testosterone significantly.", type: "body" },
      { time: "8:00 AM", duration: "—", activity: "Breakfast + Supplements", detail: "This is your supplement day anchor: Take Vitamin D3+K2, Omega-3, Magnesium (at night), Creatine 5g with breakfast. Consistency > dose.", type: "food" },
      { time: "Every hour", duration: "5 min", activity: "Desk break + posture check", detail: "Roll shoulders back 10x. Chin tuck 10x. These prevent the hunchback posture that compresses lungs and signals 'old' to your nervous system.", type: "body" },
      { time: "1:00 PM", duration: "—", activity: "Lunch", detail: "High protein: 150g+ of lean meat, legumes, or paneer. Add turmeric to food — powerful anti-inflammatory, slows cellular aging.", type: "food" },
      { time: "7:00 PM", duration: "30 min", activity: "Zone 2 Walk or Rest", detail: "If body feels heavy — rest today. Active recovery (slow walk) is better than forcing exercise. Listen to your body. This is skill, not weakness.", type: "body" },
      { time: "7:30 PM", duration: "—", activity: "Dinner", detail: "Soup-based meal. Easy to digest. Your gut rests better with simpler evening meals.", type: "food" },
      { time: "9:00 PM", duration: "20 min", activity: "Read (physical book)", detail: "Non-work, non-screen reading. Fiction, philosophy, biography. Activates different neural circuits, reduces stress hormones better than screen time.", type: "mind" },
      { time: "10:30 PM", duration: "—", activity: "Sleep", detail: "Magnesium Glycinate 200-400mg before bed. Improves deep sleep quality significantly. Most people are deficient.", type: "sleep" },
    ]
  },
  {
    day: "THU",
    label: "Thursday",
    theme: "HIIT + Mental Detox",
    color: "#FB923C",
    schedule: [
      { time: "6:00 AM", duration: "5 min", activity: "Morning breathwork", detail: "Simple 5-5-5: Inhale 5s, hold 5s, exhale 5s. 5 rounds. Ground yourself before the day's demands hit.", type: "mind" },
      { time: "6:05 AM", duration: "20 min", activity: "HIIT Session", detail: "20 min only. 8 rounds: 20s all-out effort (sprint/burpees/jump squats) + 10s rest. This is your VO2 Max training — the single strongest predictor of how long you live.", type: "body" },
      { time: "8:00 AM", duration: "—", activity: "Breakfast", detail: "Post-HIIT: higher carb day. Oats + banana + eggs. Replenish glycogen stores. Green tea over coffee today.", type: "food" },
      { time: "Every hour", duration: "5 min", activity: "Walk break + 20-20-20", detail: "Combine movement and eye rest into one break. Walk to a window, look into distance for 20 seconds.", type: "body" },
      { time: "1:00 PM", duration: "—", activity: "Lunch", detail: "Mediterranean style: olive oil, vegetables, legumes, fish or chicken. This specific diet pattern has the strongest anti-aging evidence base.", type: "food" },
      { time: "6:00 PM", duration: "15 min", activity: "Phone/News detox window", detail: "No news, no social media from 6 PM onward. This alone reduces cortisol levels measurably. Your nervous system cannot wind down with constant information input.", type: "mind" },
      { time: "7:00 PM", duration: "20 min", activity: "Family time (fully present)", detail: "No phone. Engage with family. Play with kids. Talk to partner. Strong relationships are one of the top 3 longevity predictors in every Blue Zone study.", type: "mind" },
      { time: "7:30 PM", duration: "—", activity: "Dinner", detail: "Light. Protein + vegetables. No screens at dinner table.", type: "food" },
      { time: "9:30 PM", duration: "10 min", activity: "Meditation", detail: "Body scan meditation: mentally move attention from toes to head, releasing tension. Excellent for stress discharge and sleep preparation.", type: "mind" },
      { time: "10:30 PM", duration: "—", activity: "Sleep", detail: "Room temperature 18°C. Blackout curtains if possible. This optimizes deep sleep — when HGH (Human Growth Hormone) is released for repair.", type: "sleep" },
    ]
  },
  {
    day: "FRI",
    label: "Friday",
    theme: "Mobility + Flow",
    color: "#34D399",
    schedule: [
      { time: "6:00 AM", duration: "5 min", activity: "Morning breathwork", detail: "Alternate nostril breathing (Nadi Shodhana): close right, inhale left, close left, exhale right. Repeat 10 cycles. Balances nervous system hemispheres.", type: "mind" },
      { time: "6:05 AM", duration: "25 min", activity: "Full Body Mobility + Yoga", detail: "Sun salutations x5, hip openers, spinal twists, forward folds. This reverses the postural damage from desk work. Find '25 min morning yoga' on YouTube.", type: "body" },
      { time: "8:00 AM", duration: "—", activity: "Breakfast", detail: "Your most relaxed breakfast of the week. Eat slowly, chew well. Digestion begins in the mouth — this matters more than you think for nutrient absorption.", type: "food" },
      { time: "Every hour", duration: "5 min", activity: "Movement break", detail: "Lighter day at desk intentionally. Friday: protect your mental energy. Batch administrative tasks, avoid new stressors.", type: "body" },
      { time: "1:00 PM", duration: "—", activity: "Lunch", detail: "Eat something you genuinely enjoy. Psychological pleasure from food is real — chronic joyless eating is its own stressor.", type: "food" },
      { time: "6:30 PM", duration: "30 min", activity: "Nature walk", detail: "Park, garden, any green space. Research shows 2 hours/week in nature measurably drops cortisol, blood pressure, and inflammation. Friday evening walk = weekly ritual.", type: "body" },
      { time: "7:30 PM", duration: "—", activity: "Dinner + social", detail: "Eat with family. Share. Laugh. No calorie counting tonight — the social-emotional benefit outweighs minor dietary variation.", type: "food" },
      { time: "9:00 PM", duration: "—", activity: "Wind down freely", detail: "Read, music, gentle conversation. Let the week decompress. Your nervous system needs unstructured time to reorganize.", type: "mind" },
      { time: "11:00 PM", duration: "—", activity: "Sleep (slight flexibility)", detail: "You can sleep slightly later on Fridays, but aim for 7.5+ hours still. Don't break consistency by more than 1 hour.", type: "sleep" },
    ]
  },
  {
    day: "SAT",
    label: "Saturday",
    theme: "Long Cardio + Restore",
    color: "#FBBF24",
    schedule: [
      { time: "7:00 AM", duration: "—", activity: "Natural wake-up", detail: "No alarm if possible. Let your body complete its sleep cycle. Waking naturally (without alarm) is itself a sign of good sleep health.", type: "sleep" },
      { time: "7:30 AM", duration: "10 min", activity: "Morning sunlight + breathwork", detail: "Sit outside with tea or water. 10 min of morning sunlight exposure. This is the most powerful circadian anchor available.", type: "mind" },
      { time: "8:00 AM", duration: "45-60 min", activity: "Long Zone 2 Cardio", detail: "Your weekly long session. Walk, cycle, swim — 45-60 min at conversational pace. This is where mitochondrial biogenesis happens most. Podcast or music is fine.", type: "body" },
      { time: "9:30 AM", duration: "—", activity: "Breakfast (larger)", detail: "Weekend treat breakfast — eggs, whole grain, fruit, nuts. Sit down, eat slowly, no rush. This is intentional recovery nutrition.", type: "food" },
      { time: "11:00 AM", duration: "—", activity: "Bloodwork or Health Admin", detail: "Use Saturday mornings to schedule/review bloodwork. Get testosterone, Vitamin D, B12, thyroid, CRP checked quarterly. Track your numbers — what gets measured gets managed.", type: "body" },
      { time: "1:00 PM", duration: "—", activity: "Lunch", detail: "Eat with family or friends. Social eating = slower eating = better digestion and lower cortisol.", type: "food" },
      { time: "3:00 PM", duration: "20 min", activity: "Nap (optional)", detail: "A 20-min nap (not longer — sets off deep sleep and causes grogginess) measurably improves afternoon cognition, reaction time, and reduces cardiovascular stress.", type: "sleep" },
      { time: "5:00 PM", duration: "30 min", activity: "Creative / hobby time", detail: "Something purely for you. Music, writing, cooking something new, gardening. Purposeful play activates different neurological circuits and is anti-aging at the cellular level.", type: "mind" },
      { time: "7:30 PM", duration: "—", activity: "Dinner", detail: "Cook a wholesome meal. The act of cooking is itself mindful and therapeutic.", type: "food" },
      { time: "10:00 PM", duration: "—", activity: "Sleep", detail: "Earlier than weekday target if possible. Saturday deep sleep is where the week's physical adaptation is consolidated.", type: "sleep" },
    ]
  },
  {
    day: "SUN",
    label: "Sunday",
    theme: "Deep Rest + Intention",
    color: "#60A5FA",
    schedule: [
      { time: "7:30 AM", duration: "—", activity: "Slow morning", detail: "No rushing. This is the most important anti-aging practice of the week — genuine rest. The nervous system cannot repair under constant demand.", type: "mind" },
      { time: "8:00 AM", duration: "20 min", activity: "Longer meditation", detail: "20 min today. Body scan + visualization: imagine every cell in your body healthy, energized, young. Guided meditation on Insight Timer — search 'cellular healing'.", type: "mind" },
      { time: "9:00 AM", duration: "—", activity: "Breakfast + supplement review", detail: "Review your supplement routine. Are you taking consistently? Adjust, refill, recommit for the week ahead.", type: "food" },
      { time: "10:30 AM", duration: "30 min", activity: "Light walk or swimming", detail: "Active recovery only. No intensity. A gentle 30-min walk with family, or swim if available. Movement without stress.", type: "body" },
      { time: "1:00 PM", duration: "—", activity: "Lunch (biggest meal of week)", detail: "Sunday meal is nutritionally dense. Cook something wholesome with multiple vegetables, quality protein, healthy fats. Eat without guilt.", type: "food" },
      { time: "3:00 PM", duration: "60 min", activity: "Weekly reflection + planning", detail: "Sit quietly. Review the week: What energized you? What depleted you? Plan next week's non-negotiables. This metacognitive practice reduces decision fatigue and existential anxiety.", type: "mind" },
      { time: "5:00 PM", duration: "30 min", activity: "Family / relationship time", detail: "Fully present. No phones. A walk together, a game, conversation. Relationships are a top-3 longevity predictor — invest here consciously.", type: "mind" },
      { time: "7:30 PM", duration: "—", activity: "Light dinner", detail: "Earliest and lightest dinner of the week. Give your gut maximum overnight rest before Monday.", type: "food" },
      { time: "9:00 PM", duration: "15 min", activity: "Week-ahead intention setting", detail: "Write 3 intentions for the coming week — not tasks, but states of being. 'I will stay calm under pressure. I will move my body daily. I will sleep before 11.' This primes your subconscious.", type: "mind" },
      { time: "10:00 PM", duration: "—", activity: "Early sleep", detail: "Earliest bedtime of the week. Sunday deep sleep resets the entire biological week. This single habit has outsized impact on Monday energy.", type: "sleep" },
    ]
  }
];

const typeColors = {
  body: { bg: "#0F3D2E", border: "#2DD4BF", dot: "#2DD4BF", label: "BODY" },
  mind: { bg: "#2D1B4E", border: "#A78BFA", dot: "#A78BFA", label: "MIND" },
  food: { bg: "#3D2000", border: "#FBBF24", dot: "#FBBF24", label: "FUEL" },
  sleep: { bg: "#0A1628", border: "#60A5FA", dot: "#60A5FA", label: "SLEEP" },
};

const timeline = [
  { period: "Week 1–2", color: "#2DD4BF", title: "You Feel It First", points: ["Sleep gets deeper — you notice you wake less", "Morning energy slightly better", "Cortisol starts dropping — less reactive to stress", "Body begins adjusting to movement rhythm"] },
  { period: "Week 3–4", color: "#F472B6", title: "Visible Shifts Begin", points: ["Stamina noticeably improved", "Digestion and gut health improving", "Skin quality begins to improve (hydration, glow)", "Mental clarity sharper — brain fog reducing"] },
  { period: "Month 2–3", color: "#FB923C", title: "Measurable Change", points: ["Bloodwork numbers improving (inflammation, glucose)", "Muscle tone visibly returning", "Body weight redistributing (less belly, more muscle)", "Mood stability — less anxiety, more groundedness", "Vision strain reduced with 20-20-20 discipline"] },
  { period: "Month 4–6", color: "#A78BFA", title: "Biological Age Shifts", points: ["VO2 max improving — you feel it in daily tasks", "Testosterone likely rising (check bloodwork)", "Grey hair slowing (oxidative stress reducing)", "You feel and look measurably younger", "People start asking what changed"] },
  { period: "Month 6–12", color: "#FBBF24", title: "Transformation Complete", points: ["Biological age 5–8 years younger than chronological", "New baseline energy — this is your new normal", "Stress resilience fundamentally different", "Sleep, movement, food feel effortless — they're identity now"] },
  { period: "Year 2+", color: "#34D399", title: "Compounding Returns", points: ["Epigenetic changes solidifying", "Disease risk dropping measurably", "Cognitive sharpness maintained into 40s-50s", "You become the proof that aging is negotiable"] },
];

export default function WellnessPlan() {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedItem, setExpandedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("plan");

  const currentDay = days[activeDay];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080C10",
      color: "#E8EDF2",
      fontFamily: "'Georgia', serif",
      overflowX: "hidden"
    }}>
      {/* Header */}
      <div style={{
        padding: "40px 24px 0",
        maxWidth: 800,
        margin: "0 auto"
      }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#4A6080", marginBottom: 8, fontFamily: "monospace" }}>
          AGE 36 · MALE · DESK WORKER · ANTI-AGING PROTOCOL
        </div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 400,
          lineHeight: 1.1,
          marginBottom: 8,
          background: "linear-gradient(135deg, #E8EDF2 0%, #7BA7C4 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Your Weekly<br />Longevity Blueprint
        </h1>
        <p style={{ color: "#4A6080", fontSize: 15, lineHeight: 1.6, marginBottom: 32, maxWidth: 500 }}>
          A science-backed daily protocol designed to reverse biological aging, rebuild stamina, and reconnect you to vitality.
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, borderBottom: "1px solid #1A2535" }}>
          {["plan", "timeline"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab ? `2px solid ${currentDay.color}` : "2px solid transparent",
                color: activeTab === tab ? "#E8EDF2" : "#4A6080",
                cursor: "pointer",
                fontSize: 13,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "monospace",
                transition: "all 0.2s",
                marginBottom: -1
              }}
            >
              {tab === "plan" ? "Weekly Plan" : "Results Timeline"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "plan" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
          {/* Day selector */}
          <div style={{
            display: "flex",
            gap: 8,
            marginBottom: 32,
            overflowX: "auto",
            paddingBottom: 8,
          }}>
            {days.map((d, i) => (
              <button
                key={d.day}
                onClick={() => { setActiveDay(i); setExpandedItem(null); }}
                style={{
                  flex: "0 0 auto",
                  padding: "10px 14px",
                  background: activeDay === i ? d.color : "#0D1620",
                  border: `1px solid ${activeDay === i ? d.color : "#1A2535"}`,
                  borderRadius: 8,
                  color: activeDay === i ? "#080C10" : "#4A6080",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  fontFamily: "monospace",
                  transition: "all 0.2s",
                }}
              >
                {d.day}
              </button>
            ))}
          </div>

          {/* Day Header */}
          <div style={{
            padding: "24px",
            background: `linear-gradient(135deg, #0D1620 0%, ${currentDay.color}15 100%)`,
            border: `1px solid ${currentDay.color}30`,
            borderRadius: 12,
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: currentDay.color, fontFamily: "monospace", marginBottom: 4 }}>
                {currentDay.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 22, fontWeight: 400 }}>{currentDay.theme}</div>
            </div>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: `${currentDay.color}20`,
              border: `2px solid ${currentDay.color}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: currentDay.color,
              fontFamily: "monospace",
              letterSpacing: 1
            }}>
              {currentDay.schedule.length}<br />
              <span style={{ fontSize: 8 }}>ACTS</span>
            </div>
          </div>

          {/* Schedule */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {currentDay.schedule.map((item, i) => {
              const tc = typeColors[item.type];
              const isOpen = expandedItem === i;
              return (
                <div
                  key={i}
                  onClick={() => setExpandedItem(isOpen ? null : i)}
                  style={{
                    background: isOpen ? tc.bg : "#0D1620",
                    border: `1px solid ${isOpen ? tc.border : "#1A2535"}`,
                    borderRadius: 10,
                    padding: "16px 20px",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: tc.dot,
                      flexShrink: 0,
                      boxShadow: `0 0 6px ${tc.dot}`
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, color: "#4A6080", fontFamily: "monospace", flexShrink: 0 }}>{item.time}</span>
                        <span style={{ fontSize: 15, color: "#E8EDF2", fontWeight: 500 }}>{item.activity}</span>
                      </div>
                      {item.duration !== "—" && (
                        <span style={{ fontSize: 11, color: tc.dot, fontFamily: "monospace", letterSpacing: 1 }}>{item.duration}</span>
                      )}
                    </div>
                    <div style={{
                      fontSize: 9,
                      letterSpacing: 1.5,
                      color: tc.dot,
                      border: `1px solid ${tc.border}40`,
                      padding: "2px 6px",
                      borderRadius: 3,
                      fontFamily: "monospace",
                      flexShrink: 0
                    }}>
                      {tc.label}
                    </div>
                    <div style={{ color: "#4A6080", fontSize: 12, flexShrink: 0 }}>
                      {isOpen ? "▲" : "▼"}
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: `1px solid ${tc.border}30`,
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "#A0B4C8",
                      paddingLeft: 20,
                    }}>
                      {item.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
            {Object.entries(typeColors).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: v.dot }} />
                <span style={{ fontSize: 11, color: "#4A6080", fontFamily: "monospace", letterSpacing: 1 }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 60px" }}>
          <div style={{ marginBottom: 24, color: "#4A6080", fontSize: 14, lineHeight: 1.6 }}>
            Results are not linear — they compound. Here's what to expect if you follow this protocol consistently.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {timeline.map((item, i) => (
              <div key={i} style={{
                background: "#0D1620",
                border: `1px solid ${item.color}30`,
                borderLeft: `3px solid ${item.color}`,
                borderRadius: 10,
                padding: "20px 24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    letterSpacing: 2,
                    color: item.color,
                    background: `${item.color}15`,
                    padding: "4px 10px",
                    borderRadius: 4,
                    border: `1px solid ${item.color}30`
                  }}>
                    {item.period}
                  </div>
                  <div style={{ fontSize: 16, color: "#E8EDF2" }}>{item.title}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {item.points.map((p, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: item.color, marginTop: 2, flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: 13, color: "#A0B4C8", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 24,
            padding: "20px 24px",
            background: "#0D1620",
            border: "1px solid #1A2535",
            borderRadius: 10
          }}>
            <div style={{ fontSize: 13, color: "#4A6080", lineHeight: 1.8, fontStyle: "italic" }}>
              "The body is not a machine that wears down. It is a living system that responds to signals. Every action you take today is a signal. Sleep is a signal. Movement is a signal. Food is a signal. Stillness is a signal. At 36, you are not declining — you are simply running on the wrong inputs. Change the inputs."
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
