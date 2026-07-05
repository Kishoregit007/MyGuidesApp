import { useState } from "react";

const PILLARS = [
  {
    id: "identity",
    emoji: "🌱",
    title: "Know Who You Actually Are",
    subtitle: "Your true nature — not your role",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.07)",
    revelation: "You are not your job title, your deliverables, or your family role. You are a Rohini Moon — a soul whose deepest nature is creative, nourishing, magnetic, and beauty-seeking. When life reduces you to tasks, you lose yourself. This section reconnects you to what's underneath.",
    practices: [
      {
        title: "The 5-Minute Identity Anchor",
        freq: "Every morning",
        time: "5 min",
        icon: "🪞",
        core: "Before opening any app or starting any work, sit and ask yourself one question: 'What is alive in me today?' Not what needs to be done — what is alive. Write one sentence in response. This single habit breaks the autopilot that drains Rohini souls.",
        depth: "Your Moon in 1st house means your identity and your emotional state are fused. If you don't check in with yourself first, the day's demands define who you are. This 5-minute pause creates a gap between you and your role — and in that gap, your real self breathes."
      },
      {
        title: "One Thing That Is Purely Yours",
        freq: "Daily",
        time: "20–30 min",
        icon: "🎯",
        core: "Identify ONE activity that belongs only to you — not to your employer, not to your family, not to productivity. It could be music, a walk, sketching, cooking something creative, reading fiction, playing with an idea. Protect this time like a meeting you cannot cancel.",
        depth: "Taurus Lagna + Rohini = you have a deep creative and sensory self that corporate life systematically suppresses. When this self has no expression, you experience it as exhaustion — but it's actually creative starvation. 20 minutes of true personal expression recharges more than 2 hours of passive rest."
      },
      {
        title: "The 'Not Me' Audit — Monthly",
        freq: "Monthly • 1st Sunday",
        time: "30 min",
        icon: "✂️",
        core: "Once a month, list everything on your plate. Then honestly mark each item: 'This is aligned with who I am' or 'This is not really me.' You don't have to drop things immediately — but seeing clearly is the first act of reclaiming yourself.",
        depth: "Exalted Mars in 9th is a dharma planet. It demands that your life activities align with your deeper purpose. When too many 'not me' things pile up, Mars creates a subtle but grinding fatigue — your soul's resistance to misalignment."
      }
    ]
  },
  {
    id: "silence",
    emoji: "🤫",
    title: "Reclaim Silence",
    subtitle: "The rarest resource for a Rohini Moon",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.07)",
    revelation: "You live in constant input — Slack, meetings, WhatsApp, decisions, code reviews, your child's needs, your partner's world. Your Moon in 1st house absorbs ALL of it. Silence is not laziness for you. It is the only way your nervous system processes and resets. Without it, you run on empty.",
    practices: [
      {
        title: "10 Minutes of Absolute Nothing",
        freq: "Daily — non-negotiable",
        time: "10 min",
        icon: "⬛",
        core: "Sit somewhere quiet. No phone, no music, no podcast, no mantra even. Just exist. Look at the wall, the sky, the floor. Allow thoughts to pass without engaging them. Do not try to meditate — just stop doing. This is harder than it sounds for high-performing people, and more powerful.",
        depth: "Rohini natives are natural absorbers of beauty and emotion. But absorption without release becomes congestion — mental, emotional, and physical. This daily emptying is not wasted time. It is the single most restorative practice for your chart type. Even 10 minutes daily changes your baseline within 3 weeks."
      },
      {
        title: "Phone-Free First and Last Hour",
        freq: "Daily",
        time: "First & last 60 min of day",
        icon: "📵",
        core: "No phone for the first hour after waking and the last hour before sleep. These are the two windows when your Moon is most vulnerable to external programming. Guard them fiercely. The world will not collapse — but you will quietly rebuild.",
        depth: "Mercury Mahadasha has trained you to be always-on, always-responsive. This is also what is exhausting you. Mercury's gift is communication — but Mercury without boundaries becomes mental noise. Reclaiming these two hours is an act of self-sovereignty."
      },
      {
        title: "One Meal in Complete Silence",
        freq: "Daily or weekly",
        time: "15–20 min",
        icon: "🍽️",
        core: "Eat one meal per day (or at least once a week) with no screens, no conversation, no input. Just taste your food. Notice texture, warmth, flavour. This is not a spiritual practice — it is a biological reset. Taurus rules the mouth and digestion. Mindful eating is literally a Taurus superpower.",
        depth: "When was the last time you fully tasted your food? Venus (your master planet) governs sensory pleasure. Modern life has stolen your access to this. Reclaiming it, even once a day, reconnects you to Venus's gifts: presence, pleasure, and peace."
      }
    ]
  },
  {
    id: "body",
    emoji: "🌿",
    title: "Come Back to Your Body",
    subtitle: "Taurus lives in the physical — you've been living in your head",
    color: "#10B981",
    bg: "rgba(16,185,129,0.07)",
    revelation: "You spend 14–16 hours a day in abstract mental work — code, architecture, systems, meetings. But your Taurus Lagna is an EARTH sign. Your body is not a vehicle for your brain — it is your primary home. When you neglect the body, the Taurus soul goes offline. That offline feeling is what you're calling exhaustion.",
    practices: [
      {
        title: "The 5-Minute Floor Practice",
        freq: "Daily — anytime",
        time: "5 min",
        icon: "🧘",
        core: "Lie flat on the floor — not a bed, the actual floor. Arms by sides, eyes closed. Feel the ground beneath you. Take 10 slow breaths where the exhale is twice as long as the inhale. That is all. No posture, no technique, no goal. Just floor and breath.",
        depth: "Taurus is ruled by Venus and connected to the Earth element. Literally touching the ground recalibrates your nervous system in ways no amount of thinking can. This is called 'grounding' in both Ayurveda and modern neuroscience. 5 minutes on the floor does more for your exhaustion than 30 minutes of anxious rest on a sofa."
      },
      {
        title: "Daily Walk Without Destination",
        freq: "Daily",
        time: "20–30 min",
        icon: "🚶",
        core: "Walk — but without a fitness goal. No step count, no heart rate target, no podcast. Just walk and look around. Notice trees, sky, sounds, smells. Walk slowly enough to observe. This is not exercise — this is presence practice for a Taurus soul.",
        depth: "Your exalted Mars in 9th has been running on ambition-fuel for years. Mars needs movement, yes — but purposeless, joyful movement is equally important. A goal-free walk tells your nervous system: right now, we are safe. We are not performing. We are just alive. This message, received daily, gradually dissolves exhaustion."
      },
      {
        title: "Touch Something Real Every Day",
        freq: "Daily — micro-practice",
        time: "2 min",
        icon: "🌱",
        core: "Once a day, deliberately engage your sense of touch with something natural: soil, a plant, running water, a stone, wood, grass underfoot. Hold it, feel its texture, temperature, weight. Stay with it for 2 full minutes. This sounds trivially simple. For a Taurus it is profoundly restorative.",
        depth: "Venus (your ruling planet) governs the sense of touch. Modern life has replaced touch with screens. Every time you reconnect to physical texture, you are reactivating Venus's gifts in your chart — pleasure, stability, presence, and beauty. Rohini's symbol is a chariot (vehicle) — you are meant to be embodied and moving, not fixed in a chair."
      },
      {
        title: "Stretch Your Back — Daily 7-Minute Sequence",
        freq: "Daily",
        time: "7 min",
        icon: "🔄",
        core: "Cat-Cow (1 min) → Child's Pose (2 min) → Supine Twist each side (2 min) → Legs up the wall (2 min). Do this before bed. No yoga experience needed. This sequence directly addresses lower back compression from desk work and signals the body it is safe to release the day.",
        depth: "14–16 hours of sitting compresses the lumbar spine and locks tension into the psoas muscle — the body's primary stress-holder. When your body holds tension, your mind cannot truly rest. This sequence takes 7 minutes and breaks the cycle between physical holding and mental exhaustion."
      }
    ]
  },
  {
    id: "meaning",
    emoji: "🔥",
    title: "Reconnect to Purpose",
    subtitle: "Your Mars in 9th will not let you live without meaning",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.07)",
    revelation: "Exalted Mars in the 9th house is a Dharma Mars — it is not satisfied by career achievement alone. It needs to feel that what you are doing matters. When work is just tasks and income, this Mars creates a quiet despair that masquerades as tiredness. You need a 'why' that is larger than the sprint.",
    practices: [
      {
        title: "The One-Line Purpose Statement",
        freq: "Write once, review weekly",
        time: "20 min to write",
        icon: "📜",
        core: "Write one sentence that answers: 'I am here to ___.' Not your job description — your life's purpose as you feel it. It doesn't have to be grand. It can be: 'I am here to build things that protect my family and leave something meaningful behind.' Keep it where you see it daily.",
        depth: "Mars in 9th literally governs your dharma — your life's right path. When that path is invisible, Mars energy has nowhere to go and turns into chronic fatigue or frustration. A clear, felt sense of purpose gives Mars its direction and transforms exhaustion into drive. Review and refine this sentence every Sunday."
      },
      {
        title: "The Weekly 'Why' Check-In",
        freq: "Every Sunday evening",
        time: "10 min",
        icon: "🧭",
        core: "Ask three questions before the week begins: What am I doing this week that connects to something I care about? What is one thing I can do this week that will matter in 5 years? Who am I serving through my work — beyond my employer? Write brief answers. Don't overthink.",
        depth: "Routine without reflection becomes a treadmill. Rohini Moon natives in particular need regular meaning-injections — not grand life overhauls, but small weekly reminders that their actions connect to something real. This 10-minute check-in is the antidote to feeling lost."
      },
      {
        title: "The Legacy Thought — 2 Min Daily",
        freq: "Daily — morning or evening",
        time: "2 min",
        icon: "🌅",
        core: "Once a day, briefly think about your child's future self, or someone whose life you want to positively shape. Let that image fill you for 2 minutes. That is all. No journaling required, no action. Just feel the love and responsibility of it. Let it anchor you to what matters.",
        depth: "Jupiter in your 2nd house connects wealth and wisdom to family legacy. When you consciously connect your daily effort to your child's future, Jupiter activates its full power in your chart — turning routine effort into meaningful action. This simple practice silently shifts your motivation from survival to legacy."
      }
    ]
  },
  {
    id: "joy",
    emoji: "💗",
    title: "Protect Your Joy",
    subtitle: "Venus demands pleasure — not later, but now",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.07)",
    revelation: "Venus is your Lagna lord and Rashi lord — your master planet. Venus's primary language is joy, beauty, pleasure, and delight. When Venus is starved — when there is no beauty, no play, no sensory pleasure in daily life — your entire chart weakens. Vitality drops, creativity fades, relationships feel transactional. Joy is not a reward for finishing work. It is a requirement for your chart to function.",
    practices: [
      {
        title: "One Beautiful Thing Daily",
        freq: "Daily — any time",
        time: "5 min",
        icon: "🌸",
        core: "Deliberately seek or create one beautiful thing each day. A flower in a glass, a favourite song played properly with headphones, cooking something you love, 5 minutes watching the sunset. Do not scroll past beauty — stop and receive it fully. This is a Venus practice.",
        depth: "Rohini Nakshatra is symbolised by a lotus and governed by Brahma — the creator. You are fundamentally a beauty-sensitive being. When your environment is entirely functional and utilitarian — just screens, meetings, and deliverables — your soul quietly grieves. One daily beauty moment is not luxury. It is maintenance."
      },
      {
        title: "Laugh Once a Day — Genuinely",
        freq: "Daily",
        time: "However long it takes",
        icon: "😄",
        core: "Find one thing that genuinely makes you laugh each day. Not scroll past a meme — actually laugh. With your child, a colleague, a show, a memory. If you cannot find something, notice that: it is a signal your joy reserves are low and need intentional refilling.",
        depth: "Moon in 1st house Taurus + Venus as Lagna lord = laughter is literally medicinal for your chart. It releases Moon's emotional tension, activates Venus's pleasure channels, and resets your nervous system. People who laugh daily live longer — and in Jyotish terms, they are honouring their Moon."
      },
      {
        title: "Create Something Small Each Week",
        freq: "Weekly",
        time: "30–60 min",
        icon: "✏️",
        core: "Create something that has no practical purpose — just for the joy of making. Cook a new recipe. Sketch something. Write a paragraph about something you love. Build a small thing with your child. Arrange your desk beautifully. The output doesn't matter. The act of creating does.",
        depth: "Mercury in 1st + Venus as Lagna lord = you have genuine creative intelligence that your current work may not be fully using. When creativity has no outlet, it doesn't disappear — it converts into anxiety, restlessness, and a nameless dissatisfaction. A weekly creative act releases this pressure and reconnects you to your Rohini nature."
      }
    ]
  },
  {
    id: "evening",
    emoji: "🌙",
    title: "The Evening Reset",
    subtitle: "How you end the day determines who you wake up as",
    color: "#6366F1",
    bg: "rgba(99,102,241,0.07)",
    revelation: "Most people end their day by scrolling until they pass out. For a Moon-in-1st native, this is particularly damaging — you literally carry the day's data into sleep, process it through the night, and wake more tired than you slept. A deliberate evening ritual transforms this. It is the single highest-leverage habit for your chart.",
    practices: [
      {
        title: "The Day Closure Practice",
        freq: "Daily — 9:00 PM",
        time: "5 min",
        icon: "🔒",
        core: "At 9 PM, physically close your work — shut the laptop, close work apps. Then say, out loud or silently: 'Today is complete. I did what I could. I am enough.' This is not affirmation — it is a permission slip to stop. Many high-performers cannot stop because no one has given them permission. Give it to yourself.",
        depth: "Mercury Mahadasha has trained your nervous system to always find the next thing to do. Without a conscious closure, your brain continues processing work problems through the night. The physical act of closing your laptop + a verbal release trains your nervous system that the work cycle has ended. Within weeks, sleep quality improves noticeably."
      },
      {
        title: "One Honest Sentence About the Day",
        freq: "Daily — before sleep",
        time: "2 min",
        icon: "📖",
        core: "Write or think one honest sentence about your day. Not a summary — one true feeling. 'Today I felt proud when...' or 'Today I was irritable and I think it was because...' or 'Today was a wash and that's okay.' Honesty with yourself is a Moon practice. Suppression is what exhausts you.",
        depth: "Moon in 1st house means your feelings are your data. When you don't acknowledge them, they don't go away — they go underground and create the slow drain you feel as chronic tiredness. One honest sentence per night is a tiny act of self-acknowledgment that gradually clears the backlog of unfelt experiences."
      },
      {
        title: "Warm Milk + Gratitude Before Sleep",
        freq: "Nightly",
        time: "10 min",
        icon: "🥛",
        core: "Warm milk with a pinch of nutmeg and cardamom, drunk slowly, while thinking of 2–3 things from the day that were genuinely good — however small. Your child's face, a problem you solved, a good meal, a moment of quiet. Feel the gratitude, don't just list it.",
        depth: "Warm milk (Taurus + Moon food) activates the parasympathetic nervous system and provides natural melatonin precursors. Nutmeg is a classical Ayurvedic sleep aid. Combined with conscious gratitude (Jupiter activation), this practice compounds over time into better sleep, better mood, and a quiet confidence that is your Rohini birthright."
      }
    ]
  }
];

export default function TrueNatureGuide() {
  const [activeSection, setActiveSection] = useState("identity");
  const [expandedPractice, setExpandedPractice] = useState(null);

  const current = PILLARS.find(p => p.id === activeSection);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #080810 0%, #100820 40%, #081008 100%)",
      fontFamily: "'Georgia', serif",
      color: "#e8d5b7",
      padding: "16px",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "30px", marginBottom: "6px" }}>🌺</div>
        <h1 style={{
          fontSize: "19px", fontWeight: "bold", margin: "0 0 6px",
          background: "linear-gradient(90deg, #F59E0B, #EC4899, #8B5CF6)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          lineHeight: "1.3"
        }}>Return to Yourself</h1>
        <p style={{ fontSize: "12px", color: "#a89070", margin: "0 0 10px", lineHeight: "1.5" }}>
          For a Rohini Moon • Taurus Soul • Who Has Been Running Too Long
        </p>
        <div style={{
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "12px", padding: "12px", maxWidth: "340px", margin: "0 auto"
        }}>
          <p style={{ fontSize: "11px", color: "#c4a882", lineHeight: "1.7", margin: 0, fontStyle: "italic" }}>
            "You are not lost. You have simply been giving everything to everyone else and keeping nothing for yourself. These practices are not about doing more — they are about returning to what is already yours."
          </p>
        </div>
      </div>

      {/* Section Pills */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "18px" }}>
        {PILLARS.map(p => (
          <button key={p.id} onClick={() => { setActiveSection(p.id); setExpandedPractice(null); }}
            style={{
              padding: "7px 11px", borderRadius: "20px", border: "none",
              cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap",
              background: activeSection === p.id ? p.color : "rgba(255,255,255,0.06)",
              color: activeSection === p.id ? "#080810" : "#c4a882",
              fontWeight: activeSection === p.id ? "bold" : "normal",
              transition: "all 0.2s",
            }}>
            {p.emoji} {p.title.split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>

      {/* Section Content */}
      {current && (
        <div>
          {/* Section Header */}
          <div style={{
            background: current.bg,
            border: `1px solid ${current.color}30`,
            borderLeft: `4px solid ${current.color}`,
            borderRadius: "14px", padding: "16px", marginBottom: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "22px" }}>{current.emoji}</span>
              <div>
                <div style={{ color: current.color, fontWeight: "bold", fontSize: "15px" }}>{current.title}</div>
                <div style={{ fontSize: "10px", color: "#a89070" }}>{current.subtitle}</div>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#c4a882", lineHeight: "1.7", margin: 0 }}>
              {current.revelation}
            </p>
          </div>

          {/* Practices */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {current.practices.map((p, i) => {
              const key = `${activeSection}-${i}`;
              const isExpanded = expandedPractice === key;

              return (
                <div key={key} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${isExpanded ? current.color + "50" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "12px", overflow: "hidden", transition: "all 0.2s"
                }}>
                  {/* Practice Header */}
                  <div onClick={() => setExpandedPractice(isExpanded ? null : key)}
                    style={{ padding: "14px", cursor: "pointer", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "22px", flexShrink: 0 }}>{p.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: "bold", color: "#e8d5b7", marginBottom: "4px" }}>
                        {p.title}
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: "9px", padding: "2px 8px", borderRadius: "10px",
                          background: `${current.color}18`, color: current.color,
                        }}>🔄 {p.freq}</span>
                        <span style={{
                          fontSize: "9px", padding: "2px 8px", borderRadius: "10px",
                          background: "rgba(255,255,255,0.05)", color: "#a89070",
                        }}>⏱ {p.time}</span>
                      </div>
                    </div>
                    <span style={{ color: "#6b5a45", fontSize: "14px", flexShrink: 0 }}>
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Collapsed Preview */}
                  {!isExpanded && (
                    <div style={{ padding: "0 14px 14px", paddingTop: "0" }}>
                      <p style={{ fontSize: "12px", color: "#9a8060", lineHeight: "1.5", margin: 0, fontStyle: "italic" }}>
                        {p.core.slice(0, 100)}…
                      </p>
                    </div>
                  )}

                  {/* Expanded */}
                  {isExpanded && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px" }}>
                      <div style={{
                        fontSize: "10px", color: current.color, fontWeight: "bold",
                        textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px"
                      }}>The Practice</div>
                      <p style={{ fontSize: "12px", color: "#e8d5b7", lineHeight: "1.7", margin: "0 0 14px" }}>
                        {p.core}
                      </p>
                      <div style={{
                        background: `${current.color}0d`,
                        border: `1px solid ${current.color}25`,
                        borderRadius: "10px", padding: "12px"
                      }}>
                        <div style={{
                          fontSize: "10px", color: current.color, fontWeight: "bold",
                          textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px"
                        }}>Why This Works for Your Chart</div>
                        <p style={{ fontSize: "12px", color: "#c4a882", lineHeight: "1.7", margin: 0 }}>
                          {p.depth}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Anchor */}
      <div style={{
        marginTop: "28px",
        background: "rgba(139,92,246,0.07)",
        border: "1px solid rgba(139,92,246,0.2)",
        borderRadius: "14px", padding: "16px", textAlign: "center"
      }}>
        <div style={{ fontSize: "18px", marginBottom: "8px" }}>🌙</div>
        <p style={{ fontSize: "12px", color: "#c4a882", lineHeight: "1.8", margin: "0 0 8px" }}>
          <strong style={{ color: "#e8d5b7" }}>A gentle reminder from your chart:</strong><br />
          Rohini Nakshatra is the most nourishing star in the sky.<br />
          But even the most nourishing thing must first nourish itself.<br />
          You cannot pour from an empty vessel.<br />
          These practices are not indulgence — they are how you refill.
        </p>
        <div style={{ fontSize: "11px", color: "#6b5a45" }}>
          Taurus Lagna • Rohini Nakshatra • Return to Self Guide
        </div>
      </div>
    </div>
  );
}
