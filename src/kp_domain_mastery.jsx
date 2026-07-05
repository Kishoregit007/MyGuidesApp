import { useState, useEffect } from "react";

// ── PALETTE & TOKENS ──────────────────────────────────────────────
const T = {
  bg:       "#07090f",
  surface:  "#0e1117",
  card:     "#13171f",
  border:   "#1e2535",
  accent:   "#3b82f6",   // electric blue — engineering authority
  gold:     "#f6a535",   // milestone gold
  green:    "#22c55e",
  red:      "#ef4444",
  muted:    "#4a5568",
  subtle:   "#8892a4",
  body:     "#c8d0de",
  heading:  "#e8edf5",
};

// ── COURSE DATA ───────────────────────────────────────────────────
const PHASES = [
  {
    id: "p1",
    phase: "Phase 1",
    title: "Technical Foundations",
    duration: "Months 1–4",
    color: "#3b82f6",
    icon: "⚙️",
    goal: "Build unshakeable core — eliminate uncertainty-driven anxiety",
    milestone: "Can design and explain any system component without hesitation",
    modules: [
      {
        id: "m1",
        title: "System Design Fundamentals",
        week: "Weeks 1–3",
        priority: "Critical",
        topics: [
          { id: "t1", text: "CAP Theorem — deep understanding with banking examples", done: false },
          { id: "t2", text: "Consistency patterns: Strong, Eventual, Causal", done: false },
          { id: "t3", text: "Distributed system trade-offs in financial context", done: false },
          { id: "t4", text: "Monolith vs Microservices — when each fits banking", done: false },
          { id: "t5", text: "API design: REST vs gRPC vs GraphQL for banking APIs", done: false },
          { id: "t6", text: "Load balancing strategies and session stickiness", done: false },
        ],
        resources: [
          { label: "Designing Data-Intensive Applications — Martin Kleppmann", url: "https://dataintensive.net/", type: "book" },
          { label: "System Design Primer — GitHub", url: "https://github.com/donnemartin/system-design-primer", type: "free" },
          { label: "ByteByteGo System Design Newsletter", url: "https://bytebytego.com/", type: "paid" },
          { label: "High Scalability Blog", url: "http://highscalability.com/", type: "free" },
        ]
      },
      {
        id: "m2",
        title: "Database Architecture & Transactions",
        week: "Weeks 4–6",
        priority: "Critical",
        topics: [
          { id: "t7", text: "ACID properties — deep dive with banking transaction examples", done: false },
          { id: "t8", text: "Isolation levels: Read Uncommitted → Serializable", done: false },
          { id: "t9", text: "Optimistic vs Pessimistic locking strategies", done: false },
          { id: "t10", text: "Two-phase commit and distributed transactions", done: false },
          { id: "t11", text: "Database sharding patterns for high-volume banking", done: false },
          { id: "t12", text: "Read replicas, CQRS, and Event Sourcing", done: false },
          { id: "t13", text: "NoSQL in banking — use cases and limitations", done: false },
        ],
        resources: [
          { label: "Use The Index, Luke — SQL Indexing Guide", url: "https://use-the-index-luke.com/", type: "free" },
          { label: "PostgreSQL Documentation — Transaction Isolation", url: "https://www.postgresql.org/docs/current/transaction-iso.html", type: "free" },
          { label: "Martin Fowler — CQRS Pattern", url: "https://martinfowler.com/bliki/CQRS.html", type: "free" },
          { label: "Event Sourcing Pattern — Microsoft", url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing", type: "free" },
        ]
      },
      {
        id: "m3",
        title: "Banking-Specific Patterns",
        week: "Weeks 7–10",
        priority: "Critical",
        topics: [
          { id: "t14", text: "Idempotency — design and implementation for payment APIs", done: false },
          { id: "t15", text: "Maker-Checker workflow — design patterns and edge cases", done: false },
          { id: "t16", text: "Double-entry bookkeeping and ledger architecture", done: false },
          { id: "t17", text: "Reconciliation systems — design and failure handling", done: false },
          { id: "t18", text: "Saga pattern for distributed financial transactions", done: false },
          { id: "t19", text: "Outbox pattern — guaranteed message delivery", done: false },
          { id: "t20", text: "Audit trail architecture — immutable logging design", done: false },
          { id: "t21", text: "Rate limiting and throttling for banking APIs", done: false },
        ],
        resources: [
          { label: "Stripe Engineering Blog — Idempotency", url: "https://stripe.com/blog/idempotency", type: "free" },
          { label: "Microservices Patterns — Chris Richardson", url: "https://microservices.io/patterns/", type: "free" },
          { label: "Saga Pattern — microservices.io", url: "https://microservices.io/patterns/data/saga.html", type: "free" },
          { label: "Transactional Outbox Pattern", url: "https://microservices.io/patterns/data/transactional-outbox.html", type: "free" },
        ]
      },
      {
        id: "m4",
        title: "Messaging & Event-Driven Architecture",
        week: "Weeks 11–16",
        priority: "High",
        topics: [
          { id: "t22", text: "Kafka deep dive — partitions, offsets, consumer groups", done: false },
          { id: "t23", text: "At-least-once vs exactly-once delivery semantics", done: false },
          { id: "t24", text: "Event-driven architecture for real-time banking", done: false },
          { id: "t25", text: "Dead letter queues and failure handling strategies", done: false },
          { id: "t26", text: "Schema registry and backward compatibility", done: false },
          { id: "t27", text: "Stream processing vs batch processing trade-offs", done: false },
        ],
        resources: [
          { label: "Kafka: The Definitive Guide — Confluent (Free PDF)", url: "https://www.confluent.io/resources/kafka-the-definitive-guide/", type: "free" },
          { label: "Confluent Developer Tutorials", url: "https://developer.confluent.io/", type: "free" },
          { label: "Martin Fowler — Event-Driven Architecture", url: "https://martinfowler.com/articles/201701-event-driven.html", type: "free" },
        ]
      },
    ]
  },
  {
    id: "p2",
    phase: "Phase 2",
    title: "Compliance & Security",
    duration: "Months 5–7",
    color: "#f6a535",
    icon: "🔒",
    goal: "Become the go-to person for regulatory and security architecture",
    milestone: "Can translate RBI/PCI-DSS requirements into system design decisions",
    modules: [
      {
        id: "m5",
        title: "RBI Regulations & Compliance",
        week: "Weeks 17–20",
        priority: "Critical",
        topics: [
          { id: "t28", text: "RBI IT Framework for Banks — key guidelines", done: false },
          { id: "t29", text: "Data localisation requirements and architecture impact", done: false },
          { id: "t30", text: "RBI guidelines on API banking and Open Banking", done: false },
          { id: "t31", text: "Incident reporting requirements — system design impact", done: false },
          { id: "t32", text: "Business Continuity Planning — RBI mandates", done: false },
          { id: "t33", text: "RTO/RPO requirements for banking systems", done: false },
        ],
        resources: [
          { label: "RBI IT Framework for Banks — Official Document", url: "https://www.rbi.org.in/Scripts/PublicationVieReport.aspx?Id=937", type: "free" },
          { label: "RBI Guidelines on Digital Payments", url: "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx", type: "free" },
          { label: "IDRBT Banking Technology Excellence Awards — Case Studies", url: "https://www.idrbt.ac.in/", type: "free" },
        ]
      },
      {
        id: "m6",
        title: "PCI-DSS & Security Architecture",
        week: "Weeks 21–24",
        priority: "Critical",
        topics: [
          { id: "t34", text: "PCI-DSS v4.0 — 12 requirements mapped to system design", done: false },
          { id: "t35", text: "Cardholder Data Environment (CDE) scoping", done: false },
          { id: "t36", text: "Tokenization vs Encryption — when to use which", done: false },
          { id: "t37", text: "Network segmentation for PCI compliance", done: false },
          { id: "t38", text: "Key management systems and HSM integration", done: false },
          { id: "t39", text: "Penetration testing requirements and design implications", done: false },
          { id: "t40", text: "Secure SDLC for banking applications", done: false },
        ],
        resources: [
          { label: "PCI Security Standards Council — Official Docs", url: "https://www.pcisecuritystandards.org/document_library/", type: "free" },
          { label: "OWASP Top 10 for Financial Applications", url: "https://owasp.org/www-project-top-ten/", type: "free" },
          { label: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework", type: "free" },
          { label: "AWS Security Best Practices for Banking", url: "https://aws.amazon.com/financial-services/security-compliance/", type: "free" },
        ]
      },
      {
        id: "m7",
        title: "Authentication & Authorization",
        week: "Weeks 25–28",
        priority: "High",
        topics: [
          { id: "t41", text: "OAuth 2.0 and OpenID Connect for banking APIs", done: false },
          { id: "t42", text: "Multi-factor authentication — design patterns", done: false },
          { id: "t43", text: "Zero Trust Architecture in banking context", done: false },
          { id: "t44", text: "API Gateway security patterns", done: false },
          { id: "t45", text: "JWT design — claims, expiry, refresh token strategy", done: false },
          { id: "t46", text: "Role-Based vs Attribute-Based Access Control", done: false },
        ],
        resources: [
          { label: "OAuth 2.0 Simplified — Aaron Parecki", url: "https://www.oauth.com/", type: "free" },
          { label: "Zero Trust Architecture — NIST SP 800-207", url: "https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf", type: "free" },
          { label: "Auth0 Blog — Financial Services Security", url: "https://auth0.com/blog/", type: "free" },
        ]
      },
    ]
  },
  {
    id: "p3",
    phase: "Phase 3",
    title: "Observability & Reliability",
    duration: "Months 8–10",
    color: "#22c55e",
    icon: "📡",
    goal: "Build systems that explain themselves and never silently fail",
    milestone: "Can design full observability stack and define SLOs for any banking system",
    modules: [
      {
        id: "m8",
        title: "Observability — Metrics, Logs, Traces",
        week: "Weeks 29–33",
        priority: "High",
        topics: [
          { id: "t47", text: "The three pillars: Metrics vs Logs vs Traces", done: false },
          { id: "t48", text: "SLI, SLO, SLA — defining and measuring for banking", done: false },
          { id: "t49", text: "Distributed tracing — Jaeger, Zipkin, OpenTelemetry", done: false },
          { id: "t50", text: "Structured logging — design standards for banking", done: false },
          { id: "t51", text: "Alerting strategy — signal vs noise in financial systems", done: false },
          { id: "t52", text: "Dashboards that matter — what to measure in banking", done: false },
        ],
        resources: [
          { label: "Google SRE Book — Free Online", url: "https://sre.google/sre-book/table-of-contents/", type: "free" },
          { label: "OpenTelemetry Documentation", url: "https://opentelemetry.io/docs/", type: "free" },
          { label: "Honeycomb.io — Observability Guide", url: "https://www.honeycomb.io/resources/", type: "free" },
          { label: "Prometheus Documentation", url: "https://prometheus.io/docs/introduction/overview/", type: "free" },
        ]
      },
      {
        id: "m9",
        title: "Resilience & Fault Tolerance",
        week: "Weeks 34–37",
        priority: "High",
        topics: [
          { id: "t53", text: "Circuit Breaker pattern — implementation and tuning", done: false },
          { id: "t54", text: "Bulkhead pattern for banking service isolation", done: false },
          { id: "t55", text: "Retry strategies — exponential backoff, jitter", done: false },
          { id: "t56", text: "Timeout design — cascading failure prevention", done: false },
          { id: "t57", text: "Chaos Engineering principles for banking systems", done: false },
          { id: "t58", text: "Graceful degradation strategies", done: false },
          { id: "t59", text: "Disaster Recovery architecture and runbooks", done: false },
        ],
        resources: [
          { label: "Release It! — Michael Nygard", url: "https://pragprog.com/titles/mnee2/release-it-second-edition/", type: "book" },
          { label: "Netflix Tech Blog — Resilience Engineering", url: "https://netflixtechblog.com/", type: "free" },
          { label: "AWS Well-Architected Framework — Reliability Pillar", url: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html", type: "free" },
        ]
      },
    ]
  },
  {
    id: "p4",
    phase: "Phase 4",
    title: "Performance & Scale",
    duration: "Months 11–13",
    color: "#a855f7",
    icon: "⚡",
    goal: "Understand and control system performance at every layer",
    milestone: "Can diagnose any performance bottleneck and design the fix",
    modules: [
      {
        id: "m10",
        title: "Caching Architecture",
        week: "Weeks 38–41",
        priority: "High",
        topics: [
          { id: "t60", text: "Cache strategies: Cache-Aside, Write-Through, Write-Behind", done: false },
          { id: "t61", text: "Cache invalidation — the hard problem, solved patterns", done: false },
          { id: "t62", text: "Redis deep dive — data structures, persistence, clustering", done: false },
          { id: "t63", text: "Distributed caching for banking session management", done: false },
          { id: "t64", text: "CDN strategy for banking web applications", done: false },
        ],
        resources: [
          { label: "Redis Documentation", url: "https://redis.io/documentation", type: "free" },
          { label: "AWS ElastiCache Best Practices", url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/BestPractices.html", type: "free" },
          { label: "Caching Strategies — AWS Architecture Blog", url: "https://aws.amazon.com/blogs/architecture/", type: "free" },
        ]
      },
      {
        id: "m11",
        title: "Performance Engineering",
        week: "Weeks 42–46",
        priority: "High",
        topics: [
          { id: "t65", text: "Profiling JVM applications — heap, GC, thread analysis", done: false },
          { id: "t66", text: "Database query optimization — EXPLAIN plans, indexing", done: false },
          { id: "t67", text: "Load testing strategy — JMeter, Gatling for banking APIs", done: false },
          { id: "t68", text: "Identifying and fixing N+1 query problems", done: false },
          { id: "t69", text: "Connection pooling — design and tuning", done: false },
          { id: "t70", text: "Async processing patterns for high-throughput banking", done: false },
        ],
        resources: [
          { label: "Java Performance — Scott Oaks", url: "https://www.oreilly.com/library/view/java-performance-2nd/9781492056102/", type: "book" },
          { label: "Gatling Load Testing Documentation", url: "https://gatling.io/docs/", type: "free" },
          { label: "Brendan Gregg — Systems Performance", url: "https://www.brendangregg.com/systems-performance-2nd-edition-book.html", type: "book" },
        ]
      },
    ]
  },
  {
    id: "p5",
    phase: "Phase 5",
    title: "Leadership & Influence",
    duration: "Months 14–18",
    color: "#ec4899",
    icon: "🎯",
    goal: "Translate technical mastery into organisational influence and career freedom",
    milestone: "Management trusts your estimates. Team looks to you first. Side income begun.",
    modules: [
      {
        id: "m12",
        title: "Technical Communication",
        week: "Weeks 47–52",
        priority: "Critical",
        topics: [
          { id: "t71", text: "Architecture Decision Records (ADRs) — writing and maintaining", done: false },
          { id: "t72", text: "Writing technical proposals that get approved", done: false },
          { id: "t73", text: "Communicating timelines to management — the R&D reality talk", done: false },
          { id: "t74", text: "RFC (Request for Comments) culture — driving tech decisions", done: false },
          { id: "t75", text: "Postmortem writing — blameless, actionable, trusted", done: false },
          { id: "t76", text: "Presenting architecture to non-technical stakeholders", done: false },
        ],
        resources: [
          { label: "Architecture Decision Records — Michael Nygard", url: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions", type: "free" },
          { label: "Staff Engineer — Will Larson", url: "https://staffeng.com/book", type: "book" },
          { label: "The Pragmatic Engineer Newsletter — Engineering Leadership", url: "https://newsletter.pragmaticengineer.com/", type: "paid" },
        ]
      },
      {
        id: "m13",
        title: "Side Income & Knowledge Monetisation",
        week: "Weeks 53–60",
        priority: "High",
        topics: [
          { id: "t77", text: "Build your LinkedIn presence — 1 post per week on domain topics", done: false },
          { id: "t78", text: "Create one technical article on banking system design", done: false },
          { id: "t79", text: "Set up Topmate or similar — 1:1 mentoring profile", done: false },
          { id: "t80", text: "Document one internal pattern as a reusable framework", done: false },
          { id: "t81", text: "Reach out to 3 people in fintech outside current company", done: false },
          { id: "t82", text: "Research 2 consulting platforms for banking tech", done: false },
          { id: "t83", text: "Define your consulting niche — 1 paragraph pitch", done: false },
        ],
        resources: [
          { label: "Topmate — 1:1 Mentoring Platform", url: "https://topmate.io/", type: "free" },
          { label: "Medium Partner Program — Technical Writing", url: "https://medium.com/creator-tools", type: "free" },
          { label: "Hashnode — Developer Blogging Platform", url: "https://hashnode.com/", type: "free" },
          { label: "LinkedIn Creator Mode Guide", url: "https://www.linkedin.com/help/linkedin/answer/a569544", type: "free" },
        ]
      },
    ]
  },
];

const DAILY_RITUAL = [
  { time: "Before phone", task: "Venus mantra — 27x (3 min)", planet: "Venus", color: "#ec4899" },
  { time: "First 20 min", task: "Deep domain study — one topic from current module", planet: "Mercury", color: "#3b82f6" },
  { time: "During study", task: "Write 3 bullet notes in your own words", planet: "Mercury", color: "#3b82f6" },
  { time: "End of session", task: "Mark topic done. Log insight if any.", planet: "Jupiter", color: "#f6a535" },
  { time: "9 PM", task: "Work officially ends. Laptop closed.", planet: "Saturn", color: "#8892a4" },
];

const WEEKLY_RITUALS = [
  { day: "Monday", task: "Review previous week's notes — 10 min", focus: "Consolidation" },
  { day: "Wednesday", task: "Write or explain one concept to someone / LinkedIn draft", focus: "Communication" },
  { day: "Friday", task: "Mark module progress. Update checklist.", focus: "Tracking" },
  { day: "Sunday", task: "Monthly financial review (1st Sunday) + Next week topic planning", focus: "Planning" },
];

// ── COMPONENT ─────────────────────────────────────────────────────
export default function DomainMasteryCourse() {
  const [activePhase, setActivePhase] = useState("p1");
  const [activeTab, setActiveTab] = useState("course");
  const [topics, setTopics] = useState(() => {
    const init = {};
    PHASES.forEach(ph => ph.modules.forEach(m => m.topics.forEach(t => { init[t.id] = false; })));
    return init;
  });
  const [expanded, setExpanded] = useState({});

  const toggleTopic = (id) => setTopics(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleModule = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const totalTopics = Object.keys(topics).length;
  const doneTopics = Object.values(topics).filter(Boolean).length;
  const overallPct = Math.round((doneTopics / totalTopics) * 100);

  const phasePct = (ph) => {
    let total = 0, done = 0;
    ph.modules.forEach(m => m.topics.forEach(t => { total++; if (topics[t.id]) done++; }));
    return total ? Math.round((done / total) * 100) : 0;
  };

  const modulePct = (m) => {
    const done = m.topics.filter(t => topics[t.id]).length;
    return Math.round((done / m.topics.length) * 100);
  };

  const currentPhase = PHASES.find(p => p.id === activePhase);

  const tabs = [
    { id: "course", label: "📚 Course" },
    { id: "daily", label: "⏱ Daily" },
    { id: "progress", label: "📊 Progress" },
    { id: "roadmap", label: "🗺 Roadmap" },
  ];

  const badgeColor = (priority) =>
    priority === "Critical" ? T.red : priority === "High" ? T.gold : T.accent;

  const resourceIcon = (type) =>
    type === "book" ? "📖" : type === "paid" ? "💳" : "🔗";

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: T.body,
      padding: "16px",
      maxWidth: "480px",
      margin: "0 auto",
    }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", marginBottom: "12px"
        }}>
          <div>
            <div style={{ fontSize: "10px", color: T.accent, letterSpacing: "2px", fontWeight: 700, marginBottom: "4px", textTransform: "uppercase" }}>
              Senior Engineer · Banking Tech
            </div>
            <h1 style={{
              fontSize: "20px", fontWeight: 800, margin: 0,
              color: T.heading, lineHeight: 1.2
            }}>Domain Mastery<br />Course</h1>
          </div>
          <div style={{
            textAlign: "center",
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: "12px", padding: "10px 14px",
          }}>
            <div style={{ fontSize: "22px", fontWeight: 800, color: T.accent, lineHeight: 1 }}>{overallPct}%</div>
            <div style={{ fontSize: "9px", color: T.muted, marginTop: "2px" }}>complete</div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ background: T.surface, borderRadius: "4px", height: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${overallPct}%`,
            background: `linear-gradient(90deg, ${T.accent}, #7c3aed)`,
            borderRadius: "4px", transition: "width 0.4s ease"
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "10px", color: T.muted }}>{doneTopics} / {totalTopics} topics</span>
          <span style={{ fontSize: "10px", color: T.muted }}>18-month programme</span>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        display: "flex", gap: "4px", marginBottom: "18px",
        background: T.surface, borderRadius: "10px", padding: "4px"
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, padding: "7px 4px", borderRadius: "7px", border: "none",
            cursor: "pointer", fontSize: "11px",
            background: activeTab === t.id ? T.card : "transparent",
            color: activeTab === t.id ? T.heading : T.muted,
            fontWeight: activeTab === t.id ? 700 : 400,
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ══ COURSE TAB ══ */}
      {activeTab === "course" && (
        <div>
          {/* Phase Selector */}
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px" }}>
            {PHASES.map(ph => (
              <button key={ph.id} onClick={() => setActivePhase(ph.id)} style={{
                padding: "6px 12px", borderRadius: "20px", border: `1px solid ${activePhase === ph.id ? ph.color : T.border}`,
                cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap",
                background: activePhase === ph.id ? `${ph.color}18` : "transparent",
                color: activePhase === ph.id ? ph.color : T.muted,
                fontWeight: activePhase === ph.id ? 700 : 400,
                transition: "all 0.15s",
              }}>
                {ph.icon} {ph.phase}
              </button>
            ))}
          </div>

          {currentPhase && (
            <div>
              {/* Phase Header */}
              <div style={{
                background: `${currentPhase.color}10`,
                border: `1px solid ${currentPhase.color}30`,
                borderLeft: `3px solid ${currentPhase.color}`,
                borderRadius: "12px", padding: "14px", marginBottom: "14px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: currentPhase.color, fontWeight: 700, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {currentPhase.phase} · {currentPhase.duration}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: T.heading, marginBottom: "6px" }}>
                      {currentPhase.icon} {currentPhase.title}
                    </div>
                  </div>
                  <div style={{
                    fontSize: "16px", fontWeight: 800, color: currentPhase.color,
                    background: `${currentPhase.color}15`, borderRadius: "8px",
                    padding: "4px 10px", flexShrink: 0
                  }}>{phasePct(currentPhase)}%</div>
                </div>
                <div style={{ fontSize: "11px", color: T.subtle, marginBottom: "6px" }}>
                  🎯 <em>{currentPhase.goal}</em>
                </div>
                <div style={{
                  fontSize: "11px", color: T.body,
                  background: `${currentPhase.color}0d`, borderRadius: "8px",
                  padding: "8px 10px", borderLeft: `2px solid ${currentPhase.color}`
                }}>
                  <strong style={{ color: currentPhase.color }}>Milestone: </strong>{currentPhase.milestone}
                </div>
              </div>

              {/* Modules */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {currentPhase.modules.map(mod => {
                  const pct = modulePct(mod);
                  const isOpen = expanded[mod.id];
                  const doneCt = mod.topics.filter(t => topics[t.id]).length;

                  return (
                    <div key={mod.id} style={{
                      background: T.card, border: `1px solid ${T.border}`,
                      borderRadius: "12px", overflow: "hidden"
                    }}>
                      {/* Module Header */}
                      <div onClick={() => toggleModule(mod.id)} style={{
                        padding: "13px 14px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "10px"
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "4px" }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: T.heading }}>{mod.title}</span>
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <span style={{
                              fontSize: "9px", padding: "2px 7px", borderRadius: "8px",
                              background: `${badgeColor(mod.priority)}20`,
                              color: badgeColor(mod.priority), fontWeight: 700
                            }}>{mod.priority}</span>
                            <span style={{ fontSize: "10px", color: T.muted }}>{mod.week}</span>
                            <span style={{ fontSize: "10px", color: T.muted }}>{doneCt}/{mod.topics.length}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "36px", height: "36px", borderRadius: "50%",
                            background: `conic-gradient(${currentPhase.color} ${pct * 3.6}deg, ${T.surface} 0deg)`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            position: "relative"
                          }}>
                            <div style={{
                              width: "26px", height: "26px", borderRadius: "50%",
                              background: T.card, display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "9px", fontWeight: 700, color: currentPhase.color
                            }}>{pct}%</div>
                          </div>
                          <span style={{ color: T.muted, fontSize: "12px" }}>{isOpen ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      {/* Module Body */}
                      {isOpen && (
                        <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 14px" }}>
                          {/* Topics */}
                          <div style={{ marginBottom: "14px" }}>
                            <div style={{ fontSize: "10px", color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                              Topics
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              {mod.topics.map(t => (
                                <div key={t.id} onClick={() => toggleTopic(t.id)}
                                  style={{
                                    display: "flex", alignItems: "flex-start", gap: "10px",
                                    cursor: "pointer", padding: "6px 8px", borderRadius: "8px",
                                    background: topics[t.id] ? `${currentPhase.color}0d` : "transparent",
                                    transition: "background 0.15s"
                                  }}>
                                  <div style={{
                                    width: "18px", height: "18px", borderRadius: "4px",
                                    border: `1.5px solid ${topics[t.id] ? currentPhase.color : T.border}`,
                                    background: topics[t.id] ? currentPhase.color : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0, marginTop: "1px", transition: "all 0.15s"
                                  }}>
                                    {topics[t.id] && <span style={{ color: "#fff", fontSize: "10px", fontWeight: 700 }}>✓</span>}
                                  </div>
                                  <span style={{
                                    fontSize: "12px", lineHeight: "1.5",
                                    color: topics[t.id] ? T.muted : T.body,
                                    textDecoration: topics[t.id] ? "line-through" : "none"
                                  }}>{t.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Resources */}
                          <div>
                            <div style={{ fontSize: "10px", color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                              Resources
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              {mod.resources.map((r, i) => (
                                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                                  style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    padding: "8px 10px", borderRadius: "8px",
                                    background: T.surface, border: `1px solid ${T.border}`,
                                    textDecoration: "none", transition: "border-color 0.15s"
                                  }}>
                                  <span style={{ fontSize: "14px" }}>{resourceIcon(r.type)}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "11px", color: T.accent, fontWeight: 500, lineHeight: 1.3 }}>{r.label}</div>
                                  </div>
                                  <span style={{
                                    fontSize: "8px", padding: "2px 6px", borderRadius: "6px",
                                    background: r.type === "free" ? "#22c55e20" : r.type === "book" ? "#f6a53520" : "#3b82f620",
                                    color: r.type === "free" ? T.green : r.type === "book" ? T.gold : T.accent,
                                    fontWeight: 700, textTransform: "uppercase"
                                  }}>{r.type}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ DAILY TAB ══ */}
      {activeTab === "daily" && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: T.heading, marginBottom: "4px" }}>
              Your 3 Non-Negotiables
            </div>
            <div style={{ fontSize: "12px", color: T.subtle, marginBottom: "14px" }}>
              These hold regardless of mood, energy, or circumstance.
            </div>
            {[
              { label: "Venus Mantra · 27x", detail: "ॐ शुं शुक्राय नमः · Before phone · 3 minutes", color: "#ec4899", emoji: "🌺" },
              { label: "Deep Domain Study · 20 min", detail: "One topic. Before anything reactive. Every day.", color: T.accent, emoji: "📖" },
              { label: "9 PM Boundary", detail: "Work ends. Laptop closed. Privately held.", color: T.green, emoji: "🔒" },
            ].map((item, i) => (
              <div key={i} style={{
                background: `${item.color}0e`,
                border: `1px solid ${item.color}30`,
                borderLeft: `3px solid ${item.color}`,
                borderRadius: "10px", padding: "12px 14px", marginBottom: "8px",
                display: "flex", gap: "12px", alignItems: "flex-start"
              }}>
                <span style={{ fontSize: "20px" }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: T.heading, marginBottom: "3px" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: T.subtle }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: T.heading, marginBottom: "12px" }}>
              Study Session Flow
            </div>
            {DAILY_RITUAL.map((r, i) => (
              <div key={i} style={{
                display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start"
              }}>
                <div style={{
                  width: "2px", background: i < DAILY_RITUAL.length - 1 ? T.border : "transparent",
                  position: "relative", flexShrink: 0, alignSelf: "stretch"
                }}>
                  <div style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: r.color, position: "absolute", left: "-4px", top: "4px"
                  }} />
                </div>
                <div style={{ paddingLeft: "8px", paddingBottom: "4px" }}>
                  <div style={{ fontSize: "10px", color: r.color, fontWeight: 700, marginBottom: "2px", textTransform: "uppercase" }}>
                    {r.time}
                  </div>
                  <div style={{ fontSize: "12px", color: T.body }}>{r.task}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: T.heading, marginBottom: "12px" }}>
              Weekly Rhythm
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {WEEKLY_RITUALS.map((r, i) => (
                <div key={i} style={{
                  background: T.card, border: `1px solid ${T.border}`,
                  borderRadius: "10px", padding: "10px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: T.accent }}>{r.day} </span>
                    <span style={{ fontSize: "12px", color: T.body }}>— {r.task}</span>
                  </div>
                  <span style={{
                    fontSize: "9px", padding: "2px 8px", borderRadius: "8px",
                    background: `${T.accent}18`, color: T.accent, fontWeight: 700, whiteSpace: "nowrap"
                  }}>{r.focus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ PROGRESS TAB ══ */}
      {activeTab === "progress" && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: T.heading, marginBottom: "14px" }}>
              Phase Progress
            </div>
            {PHASES.map(ph => {
              const pct = phasePct(ph);
              let total = 0, done = 0;
              ph.modules.forEach(m => m.topics.forEach(t => { total++; if (topics[t.id]) done++; }));
              return (
                <div key={ph.id} style={{
                  background: T.card, border: `1px solid ${T.border}`,
                  borderRadius: "12px", padding: "14px", marginBottom: "8px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: ph.color }}>{ph.icon} {ph.phase}: </span>
                      <span style={{ fontSize: "12px", color: T.body }}>{ph.title}</span>
                      <div style={{ fontSize: "10px", color: T.muted, marginTop: "2px" }}>{ph.duration}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: ph.color }}>{pct}%</div>
                      <div style={{ fontSize: "10px", color: T.muted }}>{done}/{total}</div>
                    </div>
                  </div>
                  <div style={{ background: T.surface, borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${pct}%`,
                      background: ph.color, borderRadius: "4px", transition: "width 0.4s ease"
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 21-Day Tracker */}
          <div style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: "12px", padding: "14px"
          }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: T.heading, marginBottom: "4px" }}>
              21-Day Commitment Tracker
            </div>
            <div style={{ fontSize: "11px", color: T.subtle, marginBottom: "12px" }}>
              Mark each day you complete your 3 non-negotiables
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
              {Array.from({ length: 21 }, (_, i) => (
                <div key={i} style={{
                  aspectRatio: "1", borderRadius: "8px",
                  background: T.surface, border: `1px solid ${T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", color: T.muted, fontWeight: 700
                }}>{i + 1}</div>
              ))}
            </div>
            <div style={{ fontSize: "10px", color: T.muted, marginTop: "10px", textAlign: "center" }}>
              Print this page or recreate in a notebook. Cross off each day.
            </div>
          </div>
        </div>
      )}

      {/* ══ ROADMAP TAB ══ */}
      {activeTab === "roadmap" && (
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: T.heading, marginBottom: "4px" }}>
            18-Month Mastery Roadmap
          </div>
          <div style={{ fontSize: "11px", color: T.subtle, marginBottom: "16px" }}>
            What you're building toward — and why
          </div>

          {/* Timeline */}
          <div style={{ position: "relative", paddingLeft: "20px" }}>
            <div style={{
              position: "absolute", left: "7px", top: "8px", bottom: "8px",
              width: "2px", background: T.border
            }} />

            {[
              {
                when: "Month 3", color: T.accent, emoji: "⚙️",
                title: "Technical Clarity",
                desc: "Background anxiety from uncertainty begins to reduce. You stop second-guessing core decisions. First signs of becoming the 'go-to' person in your team."
              },
              {
                when: "Month 6", color: T.gold, emoji: "🔒",
                title: "Compliance Authority",
                desc: "You can translate RBI/PCI requirements into system design. Management starts trusting your timeline estimates. Overtime begins to reduce naturally."
              },
              {
                when: "Month 9", color: T.green, emoji: "📡",
                title: "Systems Thinking Mastery",
                desc: "You can see failure before it happens. Your postmortems are trusted. You begin to articulate architectural trade-offs in business language."
              },
              {
                when: "Month 12", color: "#a855f7", emoji: "⚡",
                title: "Performance Ownership",
                desc: "You can diagnose and fix any performance problem. You stop carrying uncertainty home. Work stays at work — not because of willpower, but because mastery creates mental closure."
              },
              {
                when: "Month 15", color: "#ec4899", emoji: "🎯",
                title: "Influence & Side Income",
                desc: "You write one article that gets noticed. You mentor one person. You earn your first rupee outside the job. The financial parallel track begins."
              },
              {
                when: "Month 18", color: T.gold, emoji: "🌟",
                title: "Pre-Ketu Foundation Complete",
                desc: "You enter 2026 as a genuine domain expert with a side knowledge asset, clear financial trajectory, and a job that no longer owns your mental space. Ketu Mahadasha can begin its inner work from a position of strength."
              },
            ].map((item, i) => (
              <div key={i} style={{ position: "relative", marginBottom: "18px" }}>
                <div style={{
                  position: "absolute", left: "-16px", top: "4px",
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: item.color, border: `2px solid ${T.bg}`,
                  zIndex: 1
                }} />
                <div style={{
                  background: `${item.color}0d`, border: `1px solid ${item.color}25`,
                  borderRadius: "10px", padding: "12px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "10px", color: item.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                      {item.emoji} {item.when}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: T.heading, marginBottom: "4px" }}>{item.title}</div>
                  <div style={{ fontSize: "11px", color: T.subtle, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chart horizon */}
          <div style={{
            background: "linear-gradient(135deg, #7c3aed18, #ec489918)",
            border: "1px solid #7c3aed30",
            borderRadius: "12px", padding: "14px", marginTop: "4px"
          }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#a78bfa", marginBottom: "6px" }}>
              🪐 Beyond the Course — Your Chart's Promise
            </div>
            <div style={{ fontSize: "11px", color: T.subtle, lineHeight: 1.7 }}>
              <strong style={{ color: T.body }}>2026–2033 · Ketu Mahadasha</strong><br />
              Deep clarification. Detachment from what's not real. Inner work rewarded. Career restructuring becomes possible from a position of strength.<br /><br />
              <strong style={{ color: T.body }}>2033–2053 · Venus Mahadasha</strong><br />
              Your master planet runs for 20 years. Everything you built — skills, investments, relationships, knowledge assets — Venus multiplies. This is your golden era. It rewards preparation, not luck.
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{
        marginTop: "24px", textAlign: "center",
        fontSize: "10px", color: T.muted,
        borderTop: `1px solid ${T.border}`, paddingTop: "14px", lineHeight: 1.8
      }}>
        KP · Senior Engineer · Banking Tech · Hyderabad<br />
        Taurus Lagna · Rohini Nakshatra · Mercury Mahadasha<br />
        <span style={{ color: "#3b82f640" }}>20 min/day · compounded · 18 months</span>
      </div>
    </div>
  );
}
