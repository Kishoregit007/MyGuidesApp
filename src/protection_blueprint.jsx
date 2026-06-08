import { useState } from "react";

/* ── STYLES ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#FAFAF7;--surface:#FFFFFF;--surface2:#F5F3EE;--surface3:#EDE9E0;
  --border:#DDD9CE;--border2:#C8C3B5;
  --ink:#1A1714;--ink2:#4A453C;--ink3:#8A8478;
  --gold:#B5820C;--gold-bg:#FBF5E6;--gold-border:#E8D48A;
  --green:#1B6B3A;--green-bg:#EBF5EF;--green-border:#9DD4B2;
  --blue:#1A4A7A;--blue-bg:#EBF2FA;--blue-border:#93BBE0;
  --red:#8B1A1A;--red-bg:#FBEBEB;--red-border:#E8A0A0;
  --teal:#1A6B6B;--teal-bg:#EBF5F5;--teal-border:#93D4D4;
}
body{background:var(--bg);color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif;font-size:14px}
.bask{font-family:'Libre Baskerville',Georgia,serif}
.mono{font-family:'IBM Plex Mono',monospace}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fade{animation:fadeIn 0.35s ease both}
.tab-btn{background:none;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all 0.15s}
.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;transition:all 0.2s}
.card:hover{border-color:var(--border2);box-shadow:0 2px 12px rgba(0,0,0,0.06)}
.pill{display:inline-flex;align-items:center;gap:4px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.05em;padding:3px 9px;border-radius:20px;font-weight:500}
.toggle-row{cursor:pointer;transition:background 0.15s}
.toggle-row:hover{background:var(--surface2)}
`;

/* ── DATA ── */

// Phase 1 — Emergency Fund Options
const EMERGENCY_NEED = 6 * 40000; // 6 months × ₹40K expenses (₹60K income family)

const SAVINGS_OPTS = [
  {
    rank:1, name:"IDFC FIRST Bank Savings", type:"High-Yield Savings", icon:"🏦",
    rate:"7.0% p.a.", rateNum:7.0, liquidity:"Instant", safety:"RBI Regulated + DICGC ₹5L insured",
    minBal:"₹10,000", app:"IDFC FIRST Mobile", taxNote:"Interest taxable at slab rate",
    color:"var(--green)", cbg:"var(--green-bg)", cborder:"var(--green-border)",
    pros:["Highest rate among large private banks","Instant access 24×7 via app","DICGC insured up to ₹5 Lakh","Zero AMC savings account"],
    cons:["Rate can change anytime","Taxable interest reduces effective yield at 30% slab"],
    bestFor:"Keeping 1–2 months emergency money in an instantly liquid account",
    howToOpen:"Download IDFC FIRST Bank app → Open savings account → Complete KYC with Aadhaar + PAN → Video KYC done in 10 minutes online",
    effectiveRate:"4.9% (at 30% tax slab)"
  },
  {
    rank:2, name:"Kotak 811 Digital Savings", type:"Digital Savings Account", icon:"📱",
    rate:"6.0% p.a.", rateNum:6.0, liquidity:"Instant", safety:"RBI + DICGC ₹5L insured",
    minBal:"₹0 (zero balance)", app:"Kotak 811 App", taxNote:"Interest taxable at slab rate",
    color:"var(--blue)", cbg:"var(--blue-bg)", cborder:"var(--blue-border)",
    pros:["Zero minimum balance — no penalty","Easy digital onboarding","Strong established bank credibility","Good app interface"],
    cons:["Lower rate vs. IDFC","Rate variable"],
    bestFor:"Keeping emergency fund with zero balance pressure, reliable large bank safety",
    howToOpen:"Download Kotak 811 app → Aadhaar-based video KYC → Account ready in 24 hrs",
    effectiveRate:"4.2% (at 30% tax slab)"
  },
  {
    rank:3, name:"Liquid Mutual Funds (HDFC/SBI/Nippon)", type:"Liquid Fund (Debt MF)", icon:"📊",
    rate:"~7.0–7.3% p.a.", rateNum:7.2, liquidity:"T+1 (next day) | Instant up to ₹50K",
    safety:"SEBI regulated, invests in T-Bills & govt securities",
    minBal:"₹500 SIP | ₹1,000 lump sum", app:"Groww / Coin / ET Money", taxNote:"Taxed as debt MF — at slab rate on gains",
    color:"var(--gold)", cbg:"var(--gold-bg)", cborder:"var(--gold-border)",
    pros:["Highest returns of all liquid options","Instant redemption up to ₹50,000","No lock-in period","Beats FD rates without lock-in"],
    cons:["Not zero-risk (credit risk is very low but exists)","Returns slightly variable","Tax same as savings account interest"],
    bestFor:"Parking months 2–6 of emergency fund — earns more, still accessible",
    howToOpen:"Open Groww.in → Go to Mutual Funds → Search 'Liquid Fund' → Start with ₹5,000 lump sum → Instant redemption enabled",
    effectiveRate:"~5.0–5.1% (at 30% slab)",
    topFunds:["HDFC Liquid Fund — ₹72,000 Cr AUM, most stable","SBI Liquid Fund — PSU backed trust","Nippon India Liquid — top consistency","Parag Parikh Liquid — conservative, clean portfolio"]
  },
  {
    rank:4, name:"AU Small Finance Bank", type:"Small Finance Bank Savings", icon:"🏪",
    rate:"7.0–7.25% p.a.", rateNum:7.25, liquidity:"Instant ATM+UPI", safety:"RBI regulated + DICGC ₹5L insured",
    minBal:"₹5,000", app:"AU 0101 App", taxNote:"Interest taxable at slab rate",
    color:"var(--teal)", cbg:"var(--teal-bg)", cborder:"var(--teal-border)",
    pros:["High rate competitive with liquid funds","DICGC insurance safety","Good digital banking","Physical branches available"],
    cons:["Smaller bank vs. HDFC/SBI (lower trust factor for some)","Rate change risk","Taxable"],
    bestFor:"Splitting emergency fund across banks — keep ₹1–2L here for diversification",
    howToOpen:"Visit AU Bank branch or download AU 0101 app → Aadhaar + PAN KYC → Savings account",
    effectiveRate:"5.1% (at 30% slab)"
  },
  {
    rank:5, name:"Sweep-In Fixed Deposit (SBI/HDFC)", type:"Auto-Sweep FD", icon:"🔄",
    rate:"6.5–7.0% p.a.", rateNum:6.75, liquidity:"Instant (auto-break into savings)", safety:"Bank + DICGC ₹5L insured",
    minBal:"₹25,000 typically", app:"NetBanking of your primary bank", taxNote:"Interest taxable at slab rate",
    color:"var(--ink3)", cbg:"var(--surface2)", cborder:"var(--border)",
    pros:["Automatic — no manual management","FD rates while keeping liquidity","Works with existing bank account","DICGC safe"],
    cons:["Slightly lower rate than liquid funds","Partial break may affect FD calculation","Not all banks offer seamlessly"],
    bestFor:"People who want 'set and forget' — money auto-sweeps to FD when balance exceeds threshold",
    howToOpen:"Log into your bank's netbanking → Look for 'Auto-Sweep FD' or 'Flexi Deposit' → Set threshold amount (e.g., ₹25,000) → Enable",
    effectiveRate:"4.7% (at 30% slab)"
  }
];

const EMERGENCY_STRATEGY = [
  { month:"Month 1 Corpus: ₹40,000", where:"IDFC FIRST Savings / Kotak 811", why:"Truly instant access. If something happens tomorrow, this is the money you reach first without any delay." },
  { month:"Months 2–3 Corpus: ₹80,000", where:"AU Small Finance Bank / Sweep FD", why:"Still fast access but earns a slightly higher rate. Split from primary account for safety." },
  { month:"Months 4–6 Corpus: ₹1,20,000", where:"HDFC Liquid Mutual Fund", why:"Best rate of all options. Redeemable in T+1 day or ₹50K instantly. This portion you won't need urgently so it can earn more." }
];

// Phase 2A — Health Insurance
const HEALTH_PLANS = [
  {
    rank:1, recommended:true,
    name:"Niva Bupa ReAssure 2.0", provider:"Niva Bupa (formerly Max Bupa)",
    cover:"₹10L–₹1 Cr", estPremium:"₹18,000–₹24,000/yr", csr:"91.6%",
    color:"var(--green)", cbg:"var(--green-bg)", cborder:"var(--green-border)",
    badge:"Best Overall",
    keyFeatures:[
      "Unlimited restoration of sum insured — each claim restores full cover",
      "No room rent sub-limits (any room, any hospital)",
      "Newborn covered from Day 1 if maternity is included",
      "No co-payment clause for claims",
      "Cashless at 10,000+ hospitals across India",
      "No claim bonus: 50% increase in cover for every claim-free year",
      "Direct claim settlement — no TPA middleman delays",
    ],
    waitingPeriod:"30 days general | 2 years pre-existing | 9 months maternity",
    why:"Best-in-class restoration benefit means even if full ₹10L is claimed, it resets for the next claim in the same year. Critical for a young family.",
    buyAt:"nivabupahealth.com directly or Ditto Insurance (unbiased advice)",
    watchOut:"Buy directly online — agent-bought plans same policy but you get better documentation support"
  },
  {
    rank:2, recommended:true,
    name:"HDFC Ergo Optima Secure", provider:"HDFC Ergo",
    cover:"₹5L–₹2 Cr", estPremium:"₹20,000–₹28,000/yr", csr:"98.0%",
    color:"var(--blue)", cbg:"var(--blue-bg)", cborder:"var(--blue-border)",
    badge:"Best CSR",
    keyFeatures:[
      "Highest claim settlement ratio at 98%+ among private insurers",
      "Secure Benefit: covers non-medical consumables (gloves, syringes) others don't",
      "Restoration benefit included",
      "No room rent cap",
      "10,000+ network hospitals",
      "6E Rewards program — earn points on wellness activities",
      "Cashless everywhere — even non-network hospitals for emergencies",
    ],
    waitingPeriod:"30 days general | 3 years pre-existing | 9 months maternity (add-on)",
    why:"HDFC Ergo's claim ratio and non-medical consumable coverage make it the most reliable option when a major claim arises. Less argument at the time of settlement.",
    buyAt:"hdfcergo.com online or PolicyBazaar for comparison",
    watchOut:"Pre-existing condition waiting period is 3 years — longer than Niva Bupa's 2 years"
  },
  {
    rank:3, recommended:true,
    name:"Star Health Family Health Optima", provider:"Star Health Insurance",
    cover:"₹3L–₹25L", estPremium:"₹15,000–₹22,000/yr", csr:"99.06%",
    color:"var(--gold)", cbg:"var(--gold-bg)", cborder:"var(--gold-border)",
    badge:"Best for Baby",
    keyFeatures:[
      "Highest CSR: 99.06% — best claim settlement in the industry",
      "Newborn covered from Day 16 of birth automatically",
      "Maternity benefit after 12 months waiting period (shorter than most)",
      "AYUSH treatment covered (Ayurveda, Homeopathy, Yoga)",
      "Automatic restoration of sum insured",
      "Air ambulance covered",
      "14,000+ network hospitals",
    ],
    waitingPeriod:"30 days general | 1–4 years pre-existing | 12 months maternity",
    why:"Star Health's 99.06% CSR is the highest in India. For a family with a young baby, the Day 16 newborn coverage and strong maternity benefits are standout features.",
    buyAt:"starhealth.in or Policybazaar for multi-insurer comparison",
    watchOut:"Their app and claim process can be slower than Niva Bupa. Claims take 7–10 days vs. Niva Bupa's 4–5 days average"
  },
  {
    rank:4, recommended:false,
    name:"Care Supreme", provider:"Care Health Insurance",
    cover:"₹5L–₹6 Cr", estPremium:"₹14,000–₹20,000/yr", csr:"90.3%",
    color:"var(--teal)", cbg:"var(--teal-bg)", cborder:"var(--teal-border)",
    badge:"Best Value",
    keyFeatures:[
      "Most affordable premium for comprehensive cover",
      "Unlimited restoration",
      "No room rent capping",
      "Annual health check-up included",
      "OPD cover as add-on",
      "Instant cover for accidents from Day 1",
    ],
    waitingPeriod:"30 days general | 4 years pre-existing | 2 years maternity",
    why:"Best for budget-conscious buyers who need solid cover without paying premium pricing. But CSR at 90.3% is lowest on this list — some claim disputes possible.",
    buyAt:"careinsurance.com or PolicyBazaar",
    watchOut:"4-year pre-existing waiting period is the longest here. If you have any existing conditions, this plan will not cover them for 4 years"
  }
];

const TOPUP_PLANS = [
  { name:"Niva Bupa Health Recharge Super Top-Up", baseThreshold:"₹5L deductible", cover:"₹20L additional", premium:"~₹4,000–₹6,000/yr", note:"Stack over your base plan — total effective cover ₹25L" },
  { name:"HDFC Ergo Medisure Super Top-Up", baseThreshold:"₹5L deductible", cover:"₹15L additional", premium:"~₹3,500–₹5,000/yr", note:"Must have base plan with same insurer for best claim experience" },
  { name:"Star Health Super Surplus Top-Up", baseThreshold:"₹5L deductible", cover:"₹20L additional", premium:"~₹4,500–₹6,500/yr", note:"Pairs well with Star base plan — same insurer claim simplicity" },
];

// Phase 2B — Term Insurance
const TERM_PLANS = [
  {
    rank:1, recommended:true,
    name:"Axis Max Life Smart Term Plan Plus", provider:"Axis Max Life Insurance",
    cover:"₹1 Cr (recommended for 60K income)", estPremium:"₹13,000–₹16,000/yr",
    csr:"99.65%", solvency:"1.90x", complaints:"2.17 per 10K policies",
    color:"var(--green)", cbg:"var(--green-bg)", cborder:"var(--green-border)",
    badge:"Highest CSR in India",
    features:[
      "99.65% CSR — highest individual claim settlement ratio in India",
      "Terminal illness payout while still alive (early payout)",
      "Waiver of premium on disability",
      "Income replacement option (monthly payout instead of lump sum)",
      "Online purchase — no agent required",
      "Cover up to age 85 available",
    ],
    coverTerm:"Till age 65 recommended (29 years cover from 36)",
    estAnnualPremium36:"₹13,500–₹16,000/yr for ₹1 Cr cover",
    buyAt:"maxlifeinsurance.com — buy online for 10–15% cheaper than through agent",
    why:"Highest CSR in India (99.65%). When you die, your family needs this claim settled — Max Life's track record is industry-best."
  },
  {
    rank:2, recommended:true,
    name:"HDFC Life Click2Protect Supreme", provider:"HDFC Life",
    cover:"₹1 Cr+", estPremium:"₹14,000–₹18,000/yr",
    csr:"99.5%", solvency:"1.93x", complaints:"1.33 per 10K policies",
    color:"var(--blue)", cbg:"var(--blue-bg)", cborder:"var(--blue-border)",
    badge:"Fewest Complaints",
    features:[
      "Only 1.33 complaints per 10,000 claims — best in industry",
      "Inflation shield: sum assured auto-increases by 5% each year",
      "Return of premium variant available",
      "Critical illness optional add-on (36 illnesses)",
      "Life stage increase: enhance cover at marriage, childbirth",
      "Income benefit option: 50% lump sum + 50% monthly over 10 years",
    ],
    coverTerm:"Till age 65 (29 years from 36)",
    estAnnualPremium36:"₹14,500–₹18,000/yr for ₹1 Cr cover",
    buyAt:"hdfclife.com directly or Policybazaar for comparison",
    why:"HDFC Life has only 1.33 complaints per 10,000 claims — means claims are settled without dispute almost always. Most reliable for family peace of mind."
  },
  {
    rank:3, recommended:true,
    name:"Tata AIA Sampoorna Raksha Promise", provider:"Tata AIA Life",
    cover:"₹1 Cr+", estPremium:"₹13,000–₹17,000/yr",
    csr:"99.13%", solvency:"1.88x", complaints:"4.12 per 10K",
    color:"var(--gold)", cbg:"var(--gold-bg)", cborder:"var(--gold-border)",
    badge:"Best Features",
    features:[
      "Whole life cover option (till age 100)",
      "Critical illness rider for 40 conditions",
      "Premium waiver on first heart attack or cancer",
      "Accidental death additional cover",
      "Monthly income payout option",
      "Stepup benefit: auto-increase sum assured without fresh medicals",
    ],
    coverTerm:"Till age 65 or whole life option",
    estAnnualPremium36:"₹13,000–₹17,000/yr for ₹1 Cr",
    buyAt:"tataaia.com online",
    why:"Tata AIA stands out for rider quality — especially the premium waiver on first heart attack which other plans don't offer at this price point."
  },
  {
    rank:4, recommended:false,
    name:"ICICI Prudential iProtect Smart", provider:"ICICI Prudential Life",
    cover:"₹1 Cr+", estPremium:"₹12,000–₹15,000/yr",
    csr:"97.82%", solvency:"2.01x", complaints:"8.5 per 10K",
    color:"var(--teal)", cbg:"var(--teal-bg)", cborder:"var(--teal-border)",
    badge:"Most Affordable",
    features:[
      "Lowest premium on this list",
      "Accidental death additional sum assured",
      "Critical illness: 34 conditions covered",
      "Terminal illness early payout",
      "iSelect+ feature — add/remove cover as life changes",
    ],
    coverTerm:"Till age 65",
    estAnnualPremium36:"₹12,000–₹15,000/yr for ₹1 Cr",
    buyAt:"iciciprulife.com online",
    why:"Best for pure affordability. But higher complaint ratio (8.5 per 10K) — means some claims face disputes. Fine for straightforward cases but less ideal for complex family situations."
  }
];

const COVERAGE_CALC = (income) => ({
  minimum: income * 10,
  recommended: income * 15,
  ideal: income * 20,
});

/* ── COMPONENTS ── */

function Label({ children, color = "var(--gold)" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      <span className="mono" style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color, fontWeight:500 }}>{children}</span>
      <div style={{ flex:1, height:1, background:"var(--border)" }} />
    </div>
  );
}

function Badge({ children, color, bg, border }) {
  return <span className="mono" style={{ fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", padding:"2px 8px", borderRadius:20, background:bg, color, border:`1px solid ${border}`, fontWeight:500 }}>{children}</span>;
}

function RankDot({ n, color }) {
  return <div className="mono" style={{ width:26, height:26, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }}>{n}</div>;
}

function StarRow({ label, value, sub }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"7px 0", borderBottom:"1px solid var(--border)" }}>
      <span style={{ fontSize:12, color:"var(--ink2)" }}>{label}</span>
      <div style={{ textAlign:"right" }}>
        <span className="mono" style={{ fontSize:12, fontWeight:600, color:"var(--ink)" }}>{value}</span>
        {sub && <div className="mono" style={{ fontSize:9, color:"var(--ink3)", marginTop:1 }}>{sub}</div>}
      </div>
    </div>
  );
}

function EmergencyPage() {
  const [open, setOpen] = useState(null);
  const need = EMERGENCY_NEED;

  return (
    <div className="fade">
      {/* Hero calc */}
      <div style={{ background:"var(--ink)", borderRadius:12, padding:"24px 24px", marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-30, top:-30, width:160, height:160, borderRadius:"50%", background:"rgba(181,130,12,0.12)" }} />
        <div className="mono" style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:12 }}>Phase 1 · Emergency Fund Calculator</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
          {[["Your Monthly Income","₹60,000"],["Monthly Expenses (est.)","₹40,000"],["Emergency Fund Target","₹2,40,000"],["Cover Duration","6 Months"]].map(([l,v])=>(
            <div key={l}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", fontWeight:500, marginBottom:4 }}>{l}</div>
              <div className="bask" style={{ fontSize:22, fontWeight:700, color:"#E8C84A" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:8, padding:"12px 16px", fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>
          📌 <em>Calculation: Monthly expenses ≈ ₹40,000 (₹60K income – rent/EMI/savings). 6 months × ₹40,000 = <strong style={{color:"#E8C84A"}}>₹2,40,000</strong> target. Keep this money completely separate from your investment accounts.</em>
        </div>
      </div>

      {/* Split strategy */}
      <Label>Recommended Split Strategy</Label>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
        {EMERGENCY_STRATEGY.map((s,i)=>(
          <div key={i} style={{ display:"flex", gap:14, padding:"14px 16px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:["var(--green-bg)","var(--blue-bg)","var(--gold-bg)"][i], color:["var(--green)","var(--blue)","var(--gold)"][i], display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0, fontFamily:"'IBM Plex Mono',monospace" }}>{i+1}</div>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:"var(--ink)", marginBottom:3 }}>{s.month}</div>
              <div className="mono" style={{ fontSize:10, color:["var(--green)","var(--blue)","var(--gold)"][i], letterSpacing:"0.06em", marginBottom:4 }}>→ {s.where}</div>
              <div style={{ fontSize:12, color:"var(--ink3)", lineHeight:1.55 }}>{s.why}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Options */}
      <Label>All Options — Compared</Label>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {SAVINGS_OPTS.map((o,i)=>(
          <div key={i} className="card" style={{ borderRadius:10 }}>
            <div style={{ padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }} onClick={()=>setOpen(open===i?null:i)}>
              <div style={{ fontSize:22 }}>{o.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ fontWeight:700, fontSize:14, color:"var(--ink)" }}>{o.name}</span>
                  <Badge color={o.color} bg={o.cbg} border={o.cborder}>{o.type}</Badge>
                  {o.rank===1 && <Badge color="var(--green)" bg="var(--green-bg)" border="var(--green-border)">⭐ Top Pick</Badge>}
                </div>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  <span className="mono" style={{ fontSize:11, color:o.color, fontWeight:600 }}>{o.rate}</span>
                  <span className="mono" style={{ fontSize:11, color:"var(--ink3)" }}>⚡ {o.liquidity}</span>
                  <span className="mono" style={{ fontSize:11, color:"var(--ink3)" }}>Min: {o.minBal}</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                <span className="mono" style={{ fontSize:10, color:"var(--ink3)", background:"var(--surface2)", padding:"2px 8px", borderRadius:4 }}>Effective: {o.effectiveRate}</span>
                <span style={{ fontSize:14, color:"var(--ink3)", transform:open===i?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▾</span>
              </div>
            </div>
            {open===i && (
              <div style={{ padding:"0 16px 16px", background:"var(--surface2)", borderTop:"1px solid var(--border)" }} className="fade">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:14, marginBottom:14 }}>
                  <div>
                    <div className="mono" style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--green)", marginBottom:8 }}>✓ Pros</div>
                    {o.pros.map((p,pi)=><div key={pi} style={{ fontSize:12, color:"var(--ink2)", marginBottom:5, display:"flex", gap:8 }}><span style={{color:"var(--green)",flexShrink:0}}>✓</span>{p}</div>)}
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--red)", marginBottom:8 }}>✗ Cons</div>
                    {o.cons.map((c,ci)=><div key={ci} style={{ fontSize:12, color:"var(--ink2)", marginBottom:5, display:"flex", gap:8 }}><span style={{color:"var(--red)",flexShrink:0}}>✗</span>{c}</div>)}
                  </div>
                </div>
                {o.topFunds && (
                  <div style={{ marginBottom:12 }}>
                    <div className="mono" style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Top Funds to Choose From</div>
                    {o.topFunds.map((f,fi)=><div key={fi} style={{ fontSize:12, color:"var(--ink2)", marginBottom:4, display:"flex", gap:8 }}><span style={{color:"var(--gold)"}}>→</span>{f}</div>)}
                  </div>
                )}
                <div style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)", borderRadius:6, padding:"10px 12px", marginBottom:10 }}>
                  <div className="mono" style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--gold)", marginBottom:4 }}>Best For</div>
                  <div style={{ fontSize:12, color:"var(--ink2)" }}>{o.bestFor}</div>
                </div>
                <div style={{ background:"var(--blue-bg)", border:"1px solid var(--blue-border)", borderRadius:6, padding:"10px 12px" }}>
                  <div className="mono" style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--blue)", marginBottom:4 }}>How to Open</div>
                  <div style={{ fontSize:12, color:"var(--ink2)" }}>{o.howToOpen}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Warning */}
      <div style={{ marginTop:20, padding:"14px 16px", background:"var(--red-bg)", border:"1px solid var(--red-border)", borderRadius:8, fontSize:13, color:"var(--red)", lineHeight:1.65 }}>
        <strong>⚠️ Important:</strong> Keep all emergency fund money in accounts separate from your salary account. Psychological separation prevents accidental spending. Never invest emergency fund in stocks, equity MF, or crypto — you may need it exactly when markets are down.
      </div>
    </div>
  );
}

function HealthPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="fade">
      {/* Profile banner */}
      <div style={{ background:"var(--ink)", borderRadius:12, padding:"20px 22px", marginBottom:22 }}>
        <div className="mono" style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:10 }}>Your Profile · Phase 2A Health Insurance</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
          {[["Age","36 yrs (eldest)"],["Family","You + Spouse + Baby"],["Income","₹60,000/mo"],["Recommended Cover","₹15–25 Lakh"]].map(([l,v])=>(
            <div key={l} style={{ background:"rgba(255,255,255,0.05)", borderRadius:6, padding:"10px 12px" }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)", marginBottom:4, fontWeight:500 }}>{l}</div>
              <div className="bask" style={{ fontSize:14, fontWeight:700, color:"#E8C84A" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>
          💡 <em>At ₹60K/month income, the maximum hospital bill you can absorb without financial stress is approximately ₹1.5–2L. A ₹10L base floater + ₹15L super top-up creates ₹25L cover for roughly ₹22,000–30,000/year total. This is 3–4% of annual income — non-negotiable for a family with a baby.</em>
        </div>
      </div>

      <Label>Recommended Strategy: Base + Super Top-Up</Label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
        {[
          { icon:"🏥", title:"Base Plan: ₹10 Lakh Floater", desc:"Covers all 3 family members. Cashless hospitalisation. Most claims resolved here.", cost:"₹15,000–₹24,000/yr", color:"var(--blue-bg)", border:"var(--blue-border)", col:"var(--blue)" },
          { icon:"🛡️", title:"Super Top-Up: ₹15–20 Lakh", desc:"Kicks in when claim exceeds ₹5L. Adds massive protection at very low extra cost.", cost:"₹4,000–₹7,000/yr", color:"var(--green-bg)", border:"var(--green-border)", col:"var(--green)" },
        ].map((c,i)=>(
          <div key={i} style={{ background:c.color, border:`1px solid ${c.border}`, borderRadius:8, padding:"16px" }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{c.icon}</div>
            <div style={{ fontWeight:700, fontSize:13, color:"var(--ink)", marginBottom:6 }}>{c.title}</div>
            <div style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.6, marginBottom:10 }}>{c.desc}</div>
            <div className="mono" style={{ fontSize:12, fontWeight:600, color:c.col }}>{c.cost}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)", borderRadius:8, padding:"12px 16px", marginBottom:24, fontSize:13, color:"var(--ink2)", lineHeight:1.65 }}>
        <strong style={{color:"var(--gold)"}}>Total cost:</strong> ₹19,000–₹31,000/year for <strong>₹25 Lakh effective family cover</strong>. That's ₹1,600–₹2,600/month — less than a single OPD visit to a top private hospital.
      </div>

      <Label>Top Health Plans for Your Profile</Label>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
        {HEALTH_PLANS.map((p,i)=>(
          <div key={i} className="card" style={{ borderRadius:10 }}>
            <div style={{ padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }} onClick={()=>setOpen(open===i?null:i)}>
              <RankDot n={p.rank} color={p.color} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ fontWeight:700, fontSize:13, color:"var(--ink)" }}>{p.name}</span>
                  <Badge color={p.color} bg={p.cbg} border={p.cborder}>{p.badge}</Badge>
                  {p.recommended && <Badge color="var(--green)" bg="var(--green-bg)" border="var(--green-border)">Recommended</Badge>}
                </div>
                <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                  <span className="mono" style={{ fontSize:11, color:"var(--ink3)" }}>{p.provider}</span>
                  <span className="mono" style={{ fontSize:11, color:p.color, fontWeight:600 }}>CSR: {p.csr}</span>
                  <span className="mono" style={{ fontSize:11, color:"var(--ink3)" }}>{p.estPremium}</span>
                </div>
              </div>
              <span style={{ fontSize:14, color:"var(--ink3)", transform:open===i?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▾</span>
            </div>
            {open===i && (
              <div style={{ padding:"0 16px 18px", background:"var(--surface2)", borderTop:"1px solid var(--border)" }} className="fade">
                <div style={{ marginTop:14, marginBottom:12 }}>
                  <div className="mono" style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--green)", marginBottom:8 }}>Key Features</div>
                  {p.keyFeatures.map((f,fi)=><div key={fi} style={{ fontSize:12, color:"var(--ink2)", marginBottom:5, display:"flex", gap:8, lineHeight:1.5 }}><span style={{color:"var(--green)",flexShrink:0}}>✓</span>{f}</div>)}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                  <div style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)", borderRadius:6, padding:"10px 12px" }}>
                    <div className="mono" style={{ fontSize:9, color:"var(--gold)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Waiting Periods</div>
                    <div style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.55 }}>{p.waitingPeriod}</div>
                  </div>
                  <div style={{ background:"var(--blue-bg)", border:"1px solid var(--blue-border)", borderRadius:6, padding:"10px 12px" }}>
                    <div className="mono" style={{ fontSize:9, color:"var(--blue)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Buy At</div>
                    <div style={{ fontSize:12, color:"var(--ink2)" }}>{p.buyAt}</div>
                  </div>
                </div>
                <div style={{ background:p.cbg, border:`1px solid ${p.cborder}`, borderRadius:6, padding:"10px 12px", marginBottom:8 }}>
                  <div className="mono" style={{ fontSize:9, color:p.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Why Choose This</div>
                  <div style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.55 }}>{p.why}</div>
                </div>
                <div style={{ background:"var(--red-bg)", border:"1px solid var(--red-border)", borderRadius:6, padding:"10px 12px" }}>
                  <div className="mono" style={{ fontSize:9, color:"var(--red)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>⚠️ Watch Out For</div>
                  <div style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.55 }}>{p.watchOut}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Super top-up */}
      <Label>Super Top-Up Plans (Add ₹15–20L Cover for ₹4,000–₹7,000/yr)</Label>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
        {TOPUP_PLANS.map((t,i)=>(
          <div key={i} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, padding:"12px 16px", display:"flex", gap:14, alignItems:"flex-start" }}>
            <div className="mono" style={{ fontSize:11, fontWeight:600, color:"var(--teal)", minWidth:20 }}>{i+1}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:13, color:"var(--ink)", marginBottom:4 }}>{t.name}</div>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:4 }}>
                <span className="mono" style={{ fontSize:11, color:"var(--ink3)" }}>Threshold: {t.baseThreshold}</span>
                <span className="mono" style={{ fontSize:11, color:"var(--green)", fontWeight:600 }}>Extra Cover: {t.cover}</span>
                <span className="mono" style={{ fontSize:11, color:"var(--gold)", fontWeight:600 }}>{t.premium}</span>
              </div>
              <div style={{ fontSize:12, color:"var(--ink3)" }}>{t.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Critical tip */}
      <div style={{ background:"var(--ink)", borderRadius:10, padding:"18px 18px", fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.7 }}>
        <strong style={{color:"#E8C84A"}}>🔑 Most Important Tip:</strong> Do NOT add your parents to the family floater. Their age (even 55+) will spike everyone's premium by 60–80%. Buy a <em>separate senior citizen plan</em> for parents (Star Health Red Carpet or Niva Bupa Senior First) — keeps their needs covered without penalising your family's premium.
      </div>
    </div>
  );
}

function TermPage() {
  const [open, setOpen] = useState(null);
  const annual = 60000 * 12;
  const calc = COVERAGE_CALC(annual);

  return (
    <div className="fade">
      {/* Coverage calc */}
      <div style={{ background:"var(--ink)", borderRadius:12, padding:"20px 22px", marginBottom:22 }}>
        <div className="mono" style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:12 }}>Phase 2B · Term Life Coverage Calculator · ₹60,000/month Income</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
          {[
            ["Minimum (10x)", `₹${(calc.minimum/100000).toFixed(0)}L`, "Bare minimum — family survives short-term"],
            ["Recommended (15x)", `₹${(calc.recommended/100000).toFixed(0)}L`, "Family lives well for 10–12 years without income"],
            ["Ideal (20x)", `₹${(calc.ideal/100000).toFixed(0)}L`, "Family thrives — children's education + spouse retirement funded"],
          ].map(([l,v,d],i)=>(
            <div key={i} style={{ background:i===1?"rgba(232,200,74,0.15)":"rgba(255,255,255,0.05)", border:i===1?"1px solid rgba(232,200,74,0.3)":"1px solid transparent", borderRadius:8, padding:"12px 14px" }}>
              <div style={{ fontSize:9, color:i===1?"rgba(232,200,74,0.7)":"rgba(255,255,255,0.3)", fontWeight:500, marginBottom:6 }}>{l}</div>
              <div className="bask" style={{ fontSize:22, fontWeight:700, color:i===1?"#E8C84A":"rgba(255,255,255,0.6)", marginBottom:4 }}>{v}</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", lineHeight:1.5 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:6, padding:"10px 14px", fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>
          📌 <em>Our recommendation: Buy <strong style={{color:"#E8C84A"}}>₹1.5 Crore cover</strong> today. At 36, a ₹1.5 Cr term plan costs only ₹18,000–₹24,000/year (₹1,500–₹2,000/month). This single purchase protects your spouse and baby's entire financial future.</em>
        </div>
      </div>

      {/* Key rules */}
      <Label>3 Rules Before You Buy Any Term Plan</Label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
        {[
          { n:"1", title:"Buy Online Only", desc:"Online plans are 25–40% cheaper than agent-sold plans. Same policy, same insurer, same claim — just fewer commissions.", color:"var(--green)" },
          { n:"2", title:"Pure Term Only", desc:"NEVER buy Return of Premium or TROP variants. The extra premium invested in index funds grows 4x more than the premium returned.", color:"var(--blue)" },
          { n:"3", title:"Cover till Age 65", desc:"Cover only till retirement, not whole life. Whole life is 3–4x more expensive. After 65, children are independent and debts cleared.", color:"var(--gold)" },
        ].map((r,i)=>(
          <div key={i} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:8, padding:"16px" }}>
            <div className="mono" style={{ fontSize:22, fontWeight:700, color:r.color, marginBottom:8 }}>{r.n}</div>
            <div style={{ fontWeight:700, fontSize:13, color:"var(--ink)", marginBottom:6 }}>{r.title}</div>
            <div style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.6 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <Label>Top Term Plans for Age 36, ₹1.5 Cr Cover</Label>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
        {TERM_PLANS.map((p,i)=>(
          <div key={i} className="card" style={{ borderRadius:10 }}>
            <div style={{ padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }} onClick={()=>setOpen(open===i?null:i)}>
              <RankDot n={p.rank} color={p.color} />
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ fontWeight:700, fontSize:13, color:"var(--ink)" }}>{p.name}</span>
                  <Badge color={p.color} bg={p.cbg} border={p.cborder}>{p.badge}</Badge>
                  {p.recommended && <Badge color="var(--green)" bg="var(--green-bg)" border="var(--green-border)">Recommended</Badge>}
                </div>
                <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                  <span className="mono" style={{ fontSize:11, color:"var(--ink3)" }}>{p.provider}</span>
                  <span className="mono" style={{ fontSize:11, color:p.color, fontWeight:600 }}>CSR: {p.csr}</span>
                  <span className="mono" style={{ fontSize:11, color:"var(--ink3)" }}>Solvency: {p.solvency}</span>
                  <span className="mono" style={{ fontSize:11, color:"var(--ink3)" }}>{p.estAnnualPremium36}</span>
                </div>
              </div>
              <span style={{ fontSize:14, color:"var(--ink3)", transform:open===i?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▾</span>
            </div>
            {open===i && (
              <div style={{ padding:"0 16px 18px", background:"var(--surface2)", borderTop:"1px solid var(--border)" }} className="fade">
                <div style={{ marginTop:14, marginBottom:12 }}>
                  <div className="mono" style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--green)", marginBottom:8 }}>Features</div>
                  {p.features.map((f,fi)=><div key={fi} style={{ fontSize:12, color:"var(--ink2)", marginBottom:5, display:"flex", gap:8, lineHeight:1.5 }}><span style={{color:"var(--green)",flexShrink:0}}>✓</span>{f}</div>)}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                  <div style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)", borderRadius:6, padding:"10px 12px" }}>
                    <div className="mono" style={{ fontSize:9, color:"var(--gold)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Cover Term</div>
                    <div style={{ fontSize:12, color:"var(--ink2)" }}>{p.coverTerm}</div>
                  </div>
                  <div style={{ background:"var(--blue-bg)", border:"1px solid var(--blue-border)", borderRadius:6, padding:"10px 12px" }}>
                    <div className="mono" style={{ fontSize:9, color:"var(--blue)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Buy At</div>
                    <div style={{ fontSize:12, color:"var(--ink2)" }}>{p.buyAt}</div>
                  </div>
                </div>
                <div style={{ background:p.cbg, border:`1px solid ${p.cborder}`, borderRadius:6, padding:"10px 12px" }}>
                  <div className="mono" style={{ fontSize:9, color:p.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Why This Plan</div>
                  <div style={{ fontSize:12, color:"var(--ink2)", lineHeight:1.55 }}>{p.why}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Complaints comparison */}
      <Label>Complaint Ratio Comparison (Lower = Better)</Label>
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, overflow:"hidden", marginBottom:20 }}>
        {TERM_PLANS.map((p,i)=>{
          const maxComplaints = 11;
          const width = (parseFloat(p.complaints) / maxComplaints) * 100;
          return (
            <div key={i} style={{ padding:"12px 16px", borderBottom:i<TERM_PLANS.length-1?"1px solid var(--border)":"none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:12, fontWeight:600, color:"var(--ink)" }}>{p.name.split(" ").slice(0,3).join(" ")}</span>
                <span className="mono" style={{ fontSize:11, fontWeight:600, color:parseFloat(p.complaints)<5?"var(--green)":"var(--red)" }}>{p.complaints} per 10K</span>
              </div>
              <div style={{ height:5, background:"var(--border)", borderRadius:3 }}>
                <div style={{ height:"100%", width:`${width}%`, background:parseFloat(p.complaints)<5?"var(--green)":"var(--red)", borderRadius:3, transition:"width 0.5s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Final summary */}
      <div style={{ background:"var(--ink)", borderRadius:10, padding:"20px 20px" }}>
        <div className="mono" style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.35)", marginBottom:14 }}>Our Final Recommendation · Age 36 · ₹60K Income · Family + Baby</div>
        {[
          ["Health Insurance","Niva Bupa ReAssure 2.0 (₹10L base) + Niva Bupa Super Top-Up (₹15L)", "Total cover ₹25L | ~₹22,000–28,000/yr"],
          ["Term Life","Axis Max Life Smart Term (₹1.5 Cr, till age 65)", "₹20,000–24,000/yr | CSR 99.65%"],
          ["Total Protection Cost","≈ ₹42,000–52,000/year","= ₹3,500–4,300/month for complete family protection"],
        ].map(([l,v,sub],i)=>(
          <div key={i} style={{ display:"flex", gap:14, padding:"12px 0", borderBottom:i<2?"1px solid rgba(255,255,255,0.08)":"none" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#E8C84A", flexShrink:0, marginTop:6 }} />
            <div>
              <div className="mono" style={{ fontSize:9, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>{l}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#E8C84A", marginBottom:2 }}>{v}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
const TABS = [
  { id:"emergency", label:"Phase 1 · Emergency Fund", icon:"🛡️" },
  { id:"health", label:"Phase 2A · Health Insurance", icon:"🏥" },
  { id:"term", label:"Phase 2B · Term Life Insurance", icon:"❤️" },
];

export default function ProtectionGuide() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"var(--ink)" }}>
      <style>{CSS}</style>

      {/* Top header */}
      <div style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:"20px 24px 0" }}>
        <div style={{ marginBottom:16 }}>
          <div className="mono" style={{ fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--ink3)", marginBottom:6 }}>
            Wealth Plan · Phase 1 & 2 · Personalised for ₹60K/month · Family + Baby · Hyderabad
          </div>
          <h1 className="bask" style={{ fontSize:24, fontWeight:700, color:"var(--ink)", lineHeight:1.2, marginBottom:4 }}>
            Your Protection Blueprint
          </h1>
          <p style={{ fontSize:13, color:"var(--ink3)", lineHeight:1.55 }}>
            Best places to keep your emergency fund · Best health insurance for your family · Best term life cover for your income — all specific to your situation in 2025.
          </p>
        </div>

        {/* Tab nav */}
        <div style={{ display:"flex", gap:0, overflowX:"auto" }}>
          {TABS.map((t,i)=>(
            <button key={t.id} className="tab-btn" onClick={()=>setTab(i)}
              style={{ padding:"10px 16px", fontSize:12, fontWeight:600, color:tab===i?"var(--gold)":"var(--ink3)", borderBottom:tab===i?"2px solid var(--gold)":"2px solid transparent", whiteSpace:"nowrap", marginBottom:-1 }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:820, margin:"0 auto", padding:"28px 20px 60px" }}>
        {tab===0 && <EmergencyPage />}
        {tab===1 && <HealthPage />}
        {tab===2 && <TermPage />}
      </div>
    </div>
  );
}
