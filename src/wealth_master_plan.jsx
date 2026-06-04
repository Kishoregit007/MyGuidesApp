import './wealth_master_plan.css'

const INVESTMENTS = [
  {
    instrument: 'Nifty 50 Index Fund (SIP)',
    return: '12–14% CAGR',
    risk: 'medium',
    tax: '10% LTCG above ₹1.25L',
    use: 'Core long-term wealth building'
  },
  {
    instrument: 'Flexi Cap Mutual Fund',
    return: '13–16% CAGR',
    risk: 'medium',
    tax: '10% LTCG above ₹1.25L',
    use: 'Active management, long horizon'
  },
  {
    instrument: 'PPF (Public Provident Fund)',
    return: '7.1% (tax-free)',
    risk: 'low',
    tax: 'EEE — fully exempt',
    use: 'Safe debt allocation + 80C'
  },
  {
    instrument: 'EPF (if employed)',
    return: '8.25% (tax-free)',
    risk: 'low',
    tax: 'EEE — fully exempt',
    use: 'Mandatory retirement saving'
  },
  {
    instrument: 'NPS Tier 1 (75% equity)',
    return: '10–12%',
    risk: 'medium',
    tax: 'Extra ₹50K deduction (80CCD-1B)',
    use: 'Retirement + tax optimisation'
  },
  {
    instrument: 'Sovereign Gold Bonds (SGB)',
    return: 'Gold appreciation + 2.5% p.a.',
    risk: 'low',
    tax: 'Nil at maturity (8 years)',
    use: 'Gold hedge allocation'
  }
]

const MISTAKES = [
  {
    icon: '⏰',
    title: 'Waiting for the "Right Time" to Invest',
    desc: 'Market at all-time high? Do not wait. Market crashed 30%? Do not panic sell — keep your SIPs running. Time in the market always beats timing the market. Waiting just two years to begin costs ₹15–25L in final corpus on a ₹20,000/month SIP at 12% over 20 years.'
  },
  {
    icon: '📱',
    title: 'Following Stock Tips & YouTube Traders',
    desc: 'India financial social media is full of traders showing winning trades, never their losses. No one can reliably predict which stock doubles next month. SEBI data confirms 89% of retail F&O traders lost money in FY2023-24. The evidence-based path is boring: index funds, long-term SIPs, consistent holding.'
  },
  {
    icon: '🏡',
    title: 'Treating Your Home as Your Only Investment',
    desc: 'A ₹50L property in a Tier-2 city appreciating 6% annually reaches ₹1.2 Crore in 15 years. The same ₹50L invested in Nifty 50 at 12% CAGR reaches ₹2.7 Crore. Real estate also carries maintenance costs, property tax, vacancy risk, and illiquidity. One house for living is wise. Concentrating wealth in a single illiquid asset is not.'
  },
  {
    icon: '💸',
    title: 'Lifestyle Inflation: "I Will Save More When I Earn More"',
    desc: 'Every time income rises, expenses mysteriously expand to fill the space. The solution: automate your SIP debit on salary credit day (1st or 5th of month). Increase SIP by 10% each January automatically. What you do not see, you do not spend. The percentage of income saved matters more than the absolute rupee amount.'
  },
  {
    icon: '🔢',
    title: 'Ignoring Tax Efficiency — The Silent Wealth Destroyer',
    desc: 'A 30% tax slab investor in a bank FD earning 7% effectively receives only 4.9% post-tax. The same investor in ELSS earns 12–14% with only 10% LTCG on gains above ₹1.25L. The annual tax saving stack of ₹2.25L in deductions creates ₹67,500/year in tax relief that can be reinvested — adding ₹60–80L to the final corpus over 20 years.'
  },
  {
    icon: '😰',
    title: 'Panic-Selling During Market Corrections',
    desc: 'The Nifty 50 fell 60% in 2008 and 38% in 2020. In both cases, investors who kept SIPs running made extraordinary returns within 2–3 years. Those who sold locked in permanent losses. Market crashes are the best SIP opportunities — you purchase more units at lower prices. The only question during a crash is: can I afford to keep investing? If yes, do not stop.'
  }
]

export default function WealthMasterPlan() {
  return (
    <div className="wealth-document">
      {/* PRINT BAR */}
      <div className="print-bar no-print">
        <div className="print-bar-left">Wealth-Building Master Plan · Age 36 · India</div>
        <button className="print-btn" onClick={() => window.print()}>
          ⬇ Download / Print PDF
        </button>
      </div>

      <div className="document">
        {/* COVER */}
        <div className="cover">
          <div className="cover-inner">
            <div className="cover-badge">Personal Finance Blueprint · India · 2025</div>
            <h1>
              Your Wealth-Building<br />
              <em>Master Plan</em>
            </h1>
            <p className="cover-sub">
              A complete, realistic roadmap from zero to financial freedom — built for a 36-year-old Indian.
            </p>
            <div className="cover-stats">
              <div className="cover-stat">
                <div className="val">₹2–5 Cr</div>
                <div className="lbl">Goal by age 56</div>
              </div>
              <div className="cover-stat">
                <div className="val">20–30%</div>
                <div className="lbl">Income to save</div>
              </div>
              <div className="cover-stat">
                <div className="val">12–15%</div>
                <div className="lbl">Expected CAGR</div>
              </div>
              <div className="cover-stat">
                <div className="val">5 Phases</div>
                <div className="lbl">Clear milestones</div>
              </div>
            </div>
            <div className="cover-meta">
              <div className="cover-meta-item">
                Subject<span>Personal Wealth Building</span>
              </div>
              <div className="cover-meta-item">
                For<span>36-Year-Old Indian Male</span>
              </div>
              <div className="cover-meta-item">
                Horizon<span>20 Years (2025–2045)</span>
              </div>
              <div className="cover-meta-item">
                Instruments<span>MF · EPF · PPF · NPS · SGB</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 0: FOUNDATION */}
        <div className="section">
          <div className="section-label">Overview</div>
          <h2 className="section-title">Before You Invest a Single Rupee</h2>
          <p className="section-intro">
            Wealth-building is not about picking the hottest stock. It is about laying a foundation so solid that no emergency, market crash, or life event can topple it.
          </p>

          <div className="intro-box">
            <div className="intro-col">
              <h4>The Starting Mindset</h4>
              <p>
                Starting at 36 is not late. It is 24 years before the standard Indian retirement age of 60. With disciplined compounding, ₹15,000/month started today becomes ₹2.5 Crore+ by age 56. The investor who starts at 36 and never stops beats the one who started at 22 and got distracted.
              </p>
            </div>
            <div className="intro-col">
              <h4>The Non-Negotiable Sequence</h4>
              <p>
                Do not skip steps. Insurance and an emergency fund are not optional — they are the walls that protect your compounding engine. A single hospitalization or job loss without these in place sets you back 3–5 years. The sequence is: Protect → Stabilise → Invest → Grow → Preserve.
              </p>
            </div>
          </div>

          <div className="ornament">— ✦ —</div>

          {/* Phase 1 */}
          <div className="phase-card p1">
            <div className="phase-head">
              <div className="phase-num">1</div>
              <div className="phase-head-text">
                <h3>Financial Foundation</h3>
                <div className="phase-meta">Months 1–6 · Immediate Priority</div>
              </div>
              <div className="phase-tag">Emergency First</div>
            </div>
            <div className="phase-body">
              <ul className="phase-steps">
                <li>
                  <span className="step-icon">🛡️</span>
                  <div className="step-text">
                    <strong>Build a 6-Month Emergency Fund.</strong> Before a single rupee goes into a mutual fund, save 6 months of total living expenses in a liquid account. If monthly expenses are ₹30,000 — save ₹1.8 Lakh minimum. This is your personal recession buffer: job loss, medical, family emergency — none of these should force you to break your investments.
                    <div className="step-tip"><strong>Where to park it:</strong> HDFC/SBI high-yield savings account or a liquid mutual fund on Paytm Money / Groww — both return 6.5–7.5% and allow same-day withdrawal. Never park emergency funds in equities.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">📊</span>
                  <div className="step-text">
                    <strong>Conduct a Net Worth Audit.</strong> On a single sheet of paper, list every asset (savings, FDs, gold, EPF, LIC policies, property) and every liability (home loan, car loan, personal loans, credit card balances). Subtract total liabilities from total assets. This is your real starting number — even if negative, knowing it gives you power over it.
                    <div className="step-tip"><strong>Hidden assets to check:</strong> Old PF accounts from previous employers (EPFO portal: epfindia.gov.in), dormant FDs, LIC policy surrender values, and Aadhaar-linked bank accounts via DigiLocker.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">💳</span>
                  <div className="step-text">
                    <strong>Eliminate All High-Interest Debt First.</strong> Any debt above 10% interest rate is mathematically destroying your wealth faster than any investment can create it. Credit cards (36–48% p.a.) and personal loans (14–24% p.a.) must be cleared before investing. Use the avalanche method: pay minimum on all debts, throw every extra rupee at the highest-rate debt first.
                    <div className="step-tip"><strong>Exception:</strong> Home loan at 8–9% is acceptable to carry — don't rush prepayment. But credit card rollover balance? Eliminate this month, not next.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">📋</span>
                  <div className="step-text">
                    <strong>Create a Zero-Based Monthly Budget.</strong> Every rupee of income gets assigned a purpose before the month begins. Framework: Fixed necessities (rent, EMIs, groceries, utilities) — max 50% of income. Savings and investments — minimum 20–30%. Lifestyle and discretionary — the remainder. Track using ET Money, Walnut App, or a simple spreadsheet. Review every month without fail.
                    <div className="step-tip"><strong>Key insight:</strong> At 36, every ₹1,000 saved and invested today becomes ₹8,000–10,000 in 20 years at 12% CAGR. The habit of tracking spending, once built, persists for life.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="phase-card p2">
            <div className="phase-head">
              <div className="phase-num">2</div>
              <div className="phase-head-text">
                <h3>Protection Layer</h3>
                <div className="phase-meta">Months 1–3 · Non-Negotiable</div>
              </div>
              <div className="phase-tag">Insurance First</div>
            </div>
            <div className="phase-body">
              <ul className="phase-steps">
                <li>
                  <span className="step-icon">🏥</span>
                  <div className="step-text">
                    <strong>Health Insurance — ₹10–25 Lakh Cover.</strong> A single serious hospitalisation without insurance can wipe out 2–5 years of savings. At 36, a ₹10L family floater health policy costs ₹18,000–25,000/year. Add a super top-up to reach ₹25L total cover for an additional ₹5,000–8,000/year. This is the single best financial decision you can make today.
                    <div className="step-tip"><strong>Recommended policies:</strong> Niva Bupa ReAssure, Care Supreme, HDFC Ergo Optima Restore. Key features to demand: no claim bonus, restoration benefit, no room rent sub-limit, and direct cashless at major hospitals.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">🛡️</span>
                  <div className="step-text">
                    <strong>Term Life Insurance — 15–20x Annual Income.</strong> If you have dependents (spouse, children, parents), a pure term life cover is mandatory. A ₹1 Crore cover at age 36 costs only ₹12,000–18,000/year. Buy exclusively online — 30–40% cheaper than through agents. Never buy ULIPs or endowment plans as insurance substitutes.
                    <div className="step-tip"><strong>Recommended products:</strong> HDFC Click2Protect, Tata AIA Sampoorna Raksha, Max Life Smart Secure Plus. Buy online, choose a cover period until age 65, and add critical illness rider only if budget allows.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">📜</span>
                  <div className="step-text">
                    <strong>Evaluate and Possibly Surrender LIC Endowment Policies.</strong> If you hold an LIC Money Back, Jeevan Anand, or endowment plan, calculate its true internal rate of return — typically 4–5% p.a. — far below inflation. Compare the surrender value today vs. continuing until maturity. In many cases, surrendering and reinvesting in PPF + ELSS produces substantially better outcomes.
                    <div className="step-tip"><strong>Exception:</strong> If your policy matures within 2–3 years, continue it. The math changes near maturity as the exit penalty reduces. For policies with 7+ years remaining, reassess carefully with a fee-only financial advisor.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION: INVESTING */}
        <div className="section">
          <div className="section-label">Core Wealth Engine</div>
          <h2 className="section-title">Building Your Investment Portfolio</h2>
          <p className="section-intro">
            Once the foundation is set, your money needs to work for you continuously — compounding silently in the background. These are the instruments that will build the bulk of your wealth over 20 years.
          </p>

          {/* Phase 3 */}
          <div className="phase-card p3">
            <div className="phase-head">
              <div className="phase-num">3</div>
              <div className="phase-head-text">
                <h3>Core Investing Engine</h3>
                <div className="phase-meta">Month 6 Onwards · Years 1–10</div>
              </div>
              <div className="phase-tag">Wealth Builder</div>
            </div>
            <div className="phase-body">
              <ul className="phase-steps">
                <li>
                  <span className="step-icon">📈</span>
                  <div className="step-text">
                    <strong>Start SIPs in Mutual Funds — Your Primary Engine.</strong> Systematic Investment Plans in equity mutual funds are the most powerful wealth-building tool available to an Indian retail investor. The Nifty 50 index has returned 12–14% CAGR over every 15-year rolling period in history. Start with whatever amount you can — ₹2,000, ₹5,000, ₹10,000. Increase by 10% each January without fail.
                    <div className="step-tip"><strong>Recommended allocation:</strong> 40% Nifty 50 Index Fund + 30% Flexi Cap Fund + 30% Mid Cap Index Fund. Use direct plans only (no distributor commission) via Coin by Zerodha, ET Money, or Groww. Never use regular plans — the 1–1.5% annual difference costs you ₹30–50L over 20 years.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">🏢</span>
                  <div className="step-text">
                    <strong>Maximise EPF and Open a PPF Account.</strong> If employed, ensure your full EPF contribution is made each month (8.5% of basic + equal employer contribution). Separately, open a PPF account at any bank or post office and invest up to ₹1.5L per year. PPF gives 7.1% interest, fully tax-free under the EEE status.
                    <div className="step-tip"><strong>Never withdraw EPF early.</strong> Early PF withdrawal is one of the most expensive financial mistakes Indians make. ₹3L in PF at 35 becomes ₹25L+ by retirement at 8.25% tax-free. Withdrawing for a car or home renovation destroys decades of compounding.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">📉</span>
                  <div className="step-text">
                    <strong>Open an NPS Account for Extra Tax Benefit.</strong> National Pension System (Tier 1) gives an additional ₹50,000 deduction under Section 80CCD(1B) — completely separate from the standard 80C limit. Investing ₹50,000/year saves ₹15,000–16,500 in taxes at the 30% slab while building a retirement corpus that grows tax-free. Choose 75% equity allocation (maximum allowed at age 36).
                    <div className="step-tip"><strong>Total tax deduction stack:</strong> 80C ₹1.5L + 80CCD(1B) NPS ₹50K + 80D health insurance ₹25K = ₹2.25L in deductions = ₹52,500–67,500 annual tax saving at 30% bracket.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">🪙</span>
                  <div className="step-text">
                    <strong>Gold via Sovereign Gold Bonds — 5–10% of Portfolio.</strong> Gold is a hedge, not a wealth creator. Keep 5–10% of your investable corpus in Sovereign Gold Bonds (SGBs) issued by the RBI — you get gold price appreciation PLUS 2.5% annual interest, and the maturity amount is completely tax-free. Never buy physical gold as an investment.
                    <div className="step-tip"><strong>How to buy:</strong> SGBs are issued in tranches — check RBI announcements. Buy through your bank or stockbroker at ₹50/gram discount on online purchase. 8-year lock-in but tradeable on exchanges if you need early exit. SGB is the only gold investment that actually pays you to hold gold.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* ALLOCATION CHART */}
          <div style={{ marginTop: '36px', marginBottom: '28px' }}>
            <div className="section-label">Suggested Allocation</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '20px' }}>
              First 3 years — adjust as portfolio grows
            </div>
            <div className="alloc-grid">
              <div className="alloc-item">
                <div className="alloc-bar-wrap">
                  <div className="alloc-bar" style={{ height: '100%', background: '#B8861A' }}></div>
                </div>
                <div className="alloc-pct">40%</div>
                <div className="alloc-name">Equity<br />Mutual Funds</div>
              </div>
              <div className="alloc-item">
                <div className="alloc-bar-wrap">
                  <div className="alloc-bar" style={{ height: '62.5%', background: '#1A4D2E' }}></div>
                </div>
                <div className="alloc-pct">25%</div>
                <div className="alloc-name">EPF +<br />PPF</div>
              </div>
              <div className="alloc-item">
                <div className="alloc-bar-wrap">
                  <div className="alloc-bar" style={{ height: '37.5%', background: '#1A2E4D' }}></div>
                </div>
                <div className="alloc-pct">15%</div>
                <div className="alloc-name">Real<br />Estate</div>
              </div>
              <div className="alloc-item">
                <div className="alloc-bar-wrap">
                  <div className="alloc-bar" style={{ height: '25%', background: '#7B5800' }}></div>
                </div>
                <div className="alloc-pct">10%</div>
                <div className="alloc-name">Sovereign<br />Gold Bonds</div>
              </div>
              <div className="alloc-item">
                <div className="alloc-bar-wrap">
                  <div className="alloc-bar" style={{ height: '25%', background: '#5C5140' }}></div>
                </div>
                <div className="alloc-pct">10%</div>
                <div className="alloc-name">Debt<br />Mutual Funds</div>
              </div>
            </div>
          </div>
          <div className="phase-card p4">
            <div className="phase-head">
              <div className="phase-num">4</div>
              <div className="phase-head-text">
                <h3>Revenue Diversification</h3>
                <div className="phase-meta">Years 2–7 · Build Extra Income Streams</div>
              </div>
              <div className="phase-tag">Income Multiplier</div>
            </div>
            <div className="phase-body">
              <ul className="phase-steps">
                <li>
                  <span className="step-icon">💼</span>
                  <div className="step-text">
                    <strong>Grow Your Primary Income First.</strong> Your greatest wealth-building asset at 36 is your earning power. A 20% salary increase on ₹60,000/month adds ₹12,000/month — that is ₹1.44L/year more to invest, becoming ₹12L+ in 20 years at 12% CAGR. Invest aggressively in upskilling: professional certifications, strategic job switches, and building your professional network. In India, switching employers every 2–3 years yields 30–50% salary hikes vs. 8–10% annual increments.
                  </div>
                </li>
                <li>
                  <span className="step-icon">🏠</span>
                  <div className="step-text">
                    <strong>Real Estate — One Smart Property.</strong> Buy a home for self-use in a growing Tier-2 city with a 20–25% down payment and an EMI below 35% of monthly income. Focus on end-use property with appreciation potential near IT parks, universities, or industrial growth corridors. Avoid under-construction projects unless the developer has RERA registration and a strong delivery track record.
                    <div className="step-tip"><strong>Yield reality check:</strong> Rental yield in India is only 2–3% — significantly below EPF and PPF. Real estate investment thesis must rely on capital appreciation, not rental income alone. Do the full math before buying any second property.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">💻</span>
                  <div className="step-text">
                    <strong>Build One Side Income Stream.</strong> Even ₹10,000/month extra = ₹1.2L/year that compounds powerfully over time. Choose a side income that leverages your existing professional skills: freelancing on Upwork or Toptal, consulting in your domain, online tutoring via Vedantu or Chegg, content creation, or a service-based micro-business. Service-based businesses need less capital and less time than product-based at this life stage.
                    <div className="step-tip"><strong>Target:</strong> ₹10,000/month from a side hustle by the end of Year 1. Scale from there. At 36 with responsibilities, protect your time and health — do not take on a second business that requires full-time energy.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">📊</span>
                  <div className="step-text">
                    <strong>Direct Stocks — Only After 3 Years of MF Experience.</strong> Once you understand market behaviour through mutual funds, consider allocating 10–15% of investable corpus to direct equity. Restrict to Nifty 50 companies only initially. Absolutely avoid F&O (futures and options) — SEBI data shows 89% of retail F&O traders lose money. F&O is not investing; it is speculation with structural disadvantages.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* INVESTMENT TABLE SECTION */}
        <div className="section">
          <div className="section-label">Investment Reference</div>
          <h2 className="section-title">All Instruments at a Glance</h2>
          <p className="section-intro">Every investment option available to an Indian resident, with returns, risk, and tax treatment — in one reference table.</p>

          <table className="inv-table">
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Expected Return</th>
                <th>Risk</th>
                <th>Tax Status</th>
                <th>Best Used For</th>
              </tr>
            </thead>
            <tbody>
              {INVESTMENTS.map((inv, idx) => (
                <tr key={idx}>
                  <td>{inv.instrument}</td>
                  <td>{inv.return}</td>
                  <td>
                    <span className={`risk ${inv.risk}`}>{inv.risk.charAt(0).toUpperCase() + inv.risk.slice(1)}</span>
                  </td>
                  <td>{inv.tax}</td>
                  <td>{inv.use}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="rule" />

          {/* TAX SECTION */}
          <div style={{ marginTop: '28px' }}>
            <div className="section-label">Tax Optimisation</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '22px', marginBottom: '8px' }}>
              Your Annual Tax-Saving Stack
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--mid)', fontStyle: 'italic', marginBottom: '20px' }}>
              At the 30% tax bracket, you can legally save ₹52,500–67,500 per year.
            </p>

            <div className="tax-grid">
              <div className="tax-card">
                <div className="instrument">80C Deductions</div>
                <div className="limit">Limit: ₹1,50,000/year</div>
                <div className="desc">
                  EPF contribution, PPF investment, ELSS mutual fund, home loan principal repayment, children's tuition fees. All eligible under this single limit. Prioritise ELSS for the equity growth component.
                </div>
              </div>
              <div className="tax-card">
                <div className="instrument">80CCD(1B) — NPS</div>
                <div className="limit">Limit: ₹50,000/year</div>
                <div className="desc">
                  Completely over and above the 80C limit. Open a Tier 1 NPS account at eNPS.nsdl.com and invest ₹50,000/year. This is an additional tax deduction available only for NPS that most salaried Indians miss.
                </div>
              </div>
              <div className="tax-card">
                <div className="instrument">80D — Health Insurance</div>
                <div className="limit">Limit: ₹25,000–75,000/year</div>
                <div className="desc">
                  ₹25,000 for your own + spouse + children's health insurance premium. Additional ₹25,000–50,000 for parents (higher if senior citizen). Pay premiums via cheque or digital — cash payments not eligible.
                </div>
              </div>
            </div>

            <div className="total-save">
              <div>
                <div className="ts-label">Total Annual Tax Deductions Available</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontStyle: 'italic' }}>
                  80C + 80CCD(1B) + 80D combined
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="ts-val">₹2,25,000</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.1em', marginTop: '4px' }}>
                  SAVES ₹67,500/YEAR AT 30% SLAB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE SECTION */}
        <div className="section">
          <div className="section-label">Retirement & Legacy</div>
          <h2 className="section-title">Phase 5 — The Endgame</h2>
          <p className="section-intro">
            Wealth without a plan to preserve and transfer it is incomplete. This phase converts your accumulation engine into a sustainable income machine.
          </p>

          <div className="phase-card p5">
            <div className="phase-head">
              <div className="phase-num">5</div>
              <div className="phase-head-text">
                <h3>Retirement & Legacy Planning</h3>
                <div className="phase-meta">Years 7+ · Age 43 Onwards</div>
              </div>
              <div className="phase-tag">Endgame</div>
            </div>
            <div className="phase-body">
              <ul className="phase-steps">
                <li>
                  <span className="step-icon">🎯</span>
                  <div className="step-text">
                    <strong>Define Your Personal Retirement Number.</strong> Use the 25x rule: your target corpus = 25 × annual expenses at retirement. If you need ₹60,000/month today (₹7.2L/year), with 6% inflation over 20 years, your retirement monthly need becomes approximately ₹1.93L/month (₹23.2L/year). Corpus required: ₹23.2L × 25 = ₹5.8 Crore. With a ₹5.8 Crore corpus invested at 8% post-retirement (in balanced/debt funds), you can withdraw ₹23L/year indefinitely without depleting principal.
                    <div className="step-tip"><strong>Key assumption:</strong> This is your financial independence number where work becomes completely optional.</div>
                  </div>
                </li>
                <li>
                  <span className="step-icon">🔄</span>
                  <div className="step-text">
                    <strong>Rebalance from Growth to Stability at Age 50+.</strong> Approaching retirement, gradually migrate from high equity to a balanced allocation. Age 50: 70% equity, 30% debt. Age 55: 50% equity, 50% debt. Age 60: 30% equity, 70% debt. This "glide path" protects your corpus from a market crash destroying your wealth just as you need to draw on it. Balanced Advantage Funds automate this rebalancing.
                  </div>
                </li>
                <li>
                  <span className="step-icon">📝</span>
                  <div className="step-text">
                    <strong>Write a Will and Nominate Every Account.</strong> Ensure every financial account — bank, demat, EPF, PPF, NPS, insurance policy — has a valid, current nominee. Write a Will specifying exactly who receives what. Without a will, assets are frozen in legal disputes that can last years. A registered Will costs ₹5,000–15,000 via a lawyer, and registration at the sub-registrar (₹500–1,000) makes it nearly uncontestable.
                    <div className="step-tip"><strong>Online services:</strong> WillJini and GetMyCounsel offer affordable online Will drafting starting at ₹1,500. Still register the original document at a sub-registrar office for legal strength.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* TIMELINE */}
          <div style={{ marginTop: '36px' }}>
            <div className="section-label">Wealth Timeline</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '24px' }}>
              Assumption: ₹20,000/month SIP, increasing 10% annually, 12% CAGR
            </div>
            <div className="timeline">
              <div className="tl-item">
                <div className="tl-dot"></div>
                <div className="tl-year">Age 37 — Year 1</div>
                <h4>Foundation Complete</h4>
                <p>Emergency fund built. Insurance in place. First SIP running. Budget system operating. Net worth may still be near zero or negative — that is completely normal and expected at this stage.</p>
              </div>
              <div className="tl-item">
                <div className="tl-dot"></div>
                <div className="tl-year">Age 40 — Year 4</div>
                <h4>First ₹12–18 Lakh Milestone</h4>
                <p>SIP corpus growing visibly. EPF + PPF accumulating. All high-interest debt cleared. Side income generating ₹10,000+/month. The compounding flywheel is beginning to spin.</p>
              </div>
              <div className="tl-item">
                <div className="tl-dot"></div>
                <div className="tl-year">Age 45 — Year 9</div>
                <h4>₹50–80 Lakh Range</h4>
                <p>Major inflection point. Investments are now earning more per month than many people earn as a salary. Real estate appreciating. Multiple income streams operational. Confidence in the system builds.</p>
              </div>
              <div className="tl-item">
                <div className="tl-dot"></div>
                <div className="tl-year">Age 50 — Year 14</div>
                <h4>₹1.5–2 Crore Range</h4>
                <p>Children's education funded or close to it. Home loan nearly paid off. Begin retirement glide path — reduce equity exposure gradually. Financial freedom is now visible on the horizon.</p>
              </div>
              <div className="tl-item">
                <div className="tl-dot"></div>
                <div className="tl-year">Age 56 — Year 20</div>
                <h4>₹3–5 Crore Range</h4>
                <p>Retirement readiness achieved. Multiple passive income streams established. Work becomes optional, not mandatory. Will and estate plan in place. The wealth-building mission is complete.</p>
              </div>
            </div>
          </div>
        </div>

        {/* MISTAKES SECTION */}
        <div className="section">
          <div className="section-label">Risk Management</div>
          <h2 className="section-title">Mistakes That Destroy Indian Investors</h2>
          <p className="section-intro">
            Knowing what not to do is as important as knowing what to do. These six errors collectively prevent 90% of Indians from building meaningful wealth.
          </p>

          <div className="trap-list">
            {MISTAKES.map((mistake, idx) => (
              <div key={idx} className="trap-item">
                <div className="trap-icon">{mistake.icon}</div>
                <div>
                  <h4>{mistake.title}</h4>
                  <p>{mistake.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* AVOID GRID */}
          <div style={{ marginTop: '28px' }}>
            <div className="section-label">Absolute Avoids</div>
            <div className="avoid-grid">
              <div className="avoid-item">
                <div className="x">✗</div>
                <div>
                  <strong>F&O Trading</strong> — 89% of retail traders lose. Structural disadvantage for retail investors.
                </div>
              </div>
              <div className="avoid-item">
                <div className="x">✗</div>
                <div>
                  <strong>Penny Stocks & Tips</strong> — Pump-and-dump operations designed to transfer money from you to operators.
                </div>
              </div>
              <div className="avoid-item">
                <div className="x">✗</div>
                <div>
                  <strong>ULIPs & Endowment Plans</strong> — High hidden charges, poor insurance cover, poor investment returns. Worst of both worlds.
                </div>
              </div>
              <div className="avoid-item">
                <div className="x">✗</div>
                <div>
                  <strong>Crypto (Large Allocation)</strong> — Unregulated in India, 30% flat tax, extreme volatility. Maximum 2–3% if at all.
                </div>
              </div>
              <div className="avoid-item">
                <div className="x">✗</div>
                <div>
                  <strong>Chit Funds (Informal)</strong> — Unregistered chit funds have high fraud risk. If participating, only KSFE or Shriram registered chits.
                </div>
              </div>
              <div className="avoid-item">
                <div className="x">✗</div>
                <div>
                  <strong>Guaranteed 15%+ Schemes</strong> — No legitimate investment guarantees above-FD returns. If it sounds extraordinary, it is a scam.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHECKLIST SECTION */}
        <div className="section">
          <div className="section-label">Action Plan</div>
          <h2 className="section-title">Your First-30-Days Checklist</h2>
          <p className="section-intro">Do these in order. Do not skip to investments before completing foundation items.</p>

          <div className="check-cols">
            <div className="check-item">
              <div className="check-box"></div>
              <div>Open a demat + trading account (Zerodha or Groww)</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Calculate monthly budget: income minus all expenses</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Open high-interest savings for emergency corpus</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Get health insurance — minimum ₹10L family cover</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Buy term life insurance if dependents exist</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>List all debts with interest rates — create payoff priority</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Clear all credit card outstanding balance this month</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Start first SIP — even ₹500 in Nifty 50 Index Fund</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Open PPF account at bank or post office</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Open NPS Tier 1 account at eNPS.nsdl.com</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Verify all EPF accounts linked to UAN</div>
            </div>
            <div className="check-item">
              <div className="check-box"></div>
              <div>Add nominee to every bank and insurance account</div>
            </div>
          </div>
        </div>

        {/* CLOSING */}
        <div className="closing">
          <blockquote>
            "The investor who starts today with discipline always outperforms the investor who waits for certainty."
          </blockquote>
          <cite>The Compounding Principle · Indian Personal Finance</cite>
          <p className="final-note">
            This plan was built for a 36-year-old Indian male starting from zero in 2025.
            <br />
            All figures are indicative. Past returns do not guarantee future performance.
            <br />
            Consult a SEBI-registered fee-only financial advisor for personalised guidance.
            <br />
            <br />
            Start ugly. Start small. Start now.
          </p>
        </div>
      </div>
    </div>
  )
}
