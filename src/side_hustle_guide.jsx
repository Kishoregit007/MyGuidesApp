import { useState } from "react";

const HUSTLES = [
  {
    id: "farm", icon: "🌾", title: "Agricultural Land & Farming", tagline: "Humans always need food. Land never expires.",
    color: "#1B5E20", accent: "#66BB6A", pale: "#E8F5E9",
    horizon: "100+ years", capital: "₹2–10L", monthly: "₹8K–₹80K+", legacy: "Inheritable land + operating business",
    why: "Food is the oldest human need. Agriculture has run for 10,000 years and will run for 10,000 more. India's food demand grows every year, land appreciates, and farming businesses can be mechanized and inherited by the next generation. The FAO projects global food demand to rise 50% by 2050.",
    phases: [
      { title: "Phase 1 — Research & Acquire (Months 1–12)", steps: [
        "Research agricultural land near irrigation sources in Tier-2/3 districts: Nashik, Nellore, Kolar, Ludhiana offer 1–2 acres for ₹2–8L. Visit tehsildar office to verify title clarity and no encumbrances. Use DILRMP portal (dilrmp.gov.in) for online land records.",
        "Register under PM Kisan scheme at pmkisan.gov.in — get ₹6,000/year direct government support. Visit nearest Krishi Vigyan Kendra (KVK) for free crop training, soil testing, and government scheme guidance.",
        "If land purchase is out of reach, start with agricultural lease agreements (1–5 year contracts) — you can farm and generate income without owning the land. Pay ₹8,000–20,000/acre/year lease rent.",
        "Milestone: Land ownership or lease signed. Soil tested at government lab (₹200–500). First crop cycle planned with KVK guidance."
      ]},
      { title: "Phase 2 — First Crop Cycle (Years 1–2)", steps: [
        "Start with high-demand, fast-cycle crops: onions, tomatoes, ginger, turmeric. These take 3–6 months, have strong APMC mandi demand, and low technical complexity for beginners.",
        "Get soil test done at nearest government agriculture lab before buying any fertilizer — pH, NPK ratios, micronutrient levels determine exactly what your soil needs. Saves ₹5,000–15,000 in unnecessary inputs.",
        "Apply for drip irrigation subsidy from your state agriculture department — covers 55–90% of installation cost depending on state. Drip reduces water use by 40% and increases yield by 20–30%.",
        "Join a local Farmer Producer Organisation (FPO) — collective bargaining at mandis, bulk input purchase discounts of 20–30%. Find your nearest FPO at sfacindia.com.",
        "Milestone: First sale at APMC mandi or local wholesale market. Revenue may be modest — track costs vs. income to understand your unit economics."
      ]},
      { title: "Phase 3 — Diversify & Scale (Years 2–7)", steps: [
        "Add non-crop income layers on your land: rent space to mobile tower companies (₹15,000–60,000/month), solar energy firms, or fish/poultry farming. These run alongside crops without displacing them.",
        "Start value-added processing: dry and pack spices instead of selling raw, cold-press mustard/groundnut oil, make jaggery from sugarcane. Value-added products earn 3–5x more than raw commodity sales.",
        "List on eNAM (National Agriculture Market at enam.gov.in) — India's online mandi. Get price discovery across 1,000+ mandis nationwide, sell to the highest bidder instead of local middlemen.",
        "Apply for Kisan Credit Card (KCC) at your bank — working capital loan at 4% interest rate (government subsidized). Use for seeds, fertilizers, machinery rental without touching personal savings.",
        "Milestone: ₹30,000–50,000/month net from farming + land lease income. First machinery owned. Second income stream (processing or land rental) operational."
      ]},
      { title: "Phase 4 — Business & Legacy (Years 7–20)", steps: [
        "Register as a Farmer Producer Company (FPC) under Companies Act — gives you a legal business entity, easier bank loans, and export eligibility. FPCs get priority lending from NABARD.",
        "Start selling direct-to-consumer via BigBasket Seller, Ninjacart, or a WhatsApp/Instagram network — bypass APMC middlemen who take 15–25% of your revenue.",
        "Export specialty crops: moringa, ashwagandha, aloe vera, organic turmeric. Register with APEDA (apeda.gov.in) to access premium global buyers. Export prices are 3–8x domestic.",
        "Hire a trained farm manager (ITI or agriculture diploma holder) — transition from daily operator to business owner. You review monthly reports, they run daily operations. This is what makes it generational.",
        "Milestone: Business runs without your daily involvement. Revenue ₹1–3L/month. Company structure ready for children to inherit an operating enterprise — not just a piece of land."
      ]}
    ],
    generational: "Land and an agricultural business can be willed to children, grandchildren, and great-grandchildren. The FAO projects global food demand to increase 50% by 2050 — farming will be MORE valuable in 50 years, not less. With a formal company structure and trained management, your farm can outlast you by centuries."
  },
  {
    id: "water", icon: "💧", title: "Water Business (RO Plant & Supply)", tagline: "Clean water is the oil of the 21st century.",
    color: "#0D47A1", accent: "#42A5F5", pale: "#E3F2FD",
    horizon: "100+ years", capital: "₹3–15L", monthly: "₹20K–₹2L+", legacy: "Franchise network + brand",
    why: "India has 600+ million people with inadequate clean water access. The packaged water market grows 15–20% annually. As climate change intensifies groundwater depletion, clean water will become scarcer and more valuable every decade. This business gets MORE relevant with time, not less.",
    phases: [
      { title: "Phase 1 — Setup & Licensing (Months 1–6)", steps: [
        "Choose your entry model: (A) 20L jar bulk water supply — lowest entry cost ₹3–5L, fastest to market. (B) Full bottled water plant (500ml/1L bottles) — ₹8–20L setup, higher margins and scale.",
        "Get BIS ISI Mark certification (IS:14543) — mandatory by law for packaged water. Apply at bis.gov.in. Budget ₹15,000–40,000 for water testing, lab fees, and certification. Without this, you cannot legally sell.",
        "Register your business (proprietorship is fine to start — ₹1,000–2,000 at local municipal office). Get FSSAI food license: basic license ₹100/year for small units, state license ₹2,000/year for medium.",
        "Install RO + UV + ozonation treatment system. Kent Commercial, Aquaguard Commercial, or local manufacturers offer complete setups with AMC. Get 3 quotes before buying.",
        "Milestone: BIS certification received, plant operational, first batch independently lab-tested and approved. Business legally registered."
      ]},
      { title: "Phase 2 — Build Distribution (Months 4–18)", steps: [
        "Start 20L jar delivery to offices, homes, hotels within a 10km radius. One delivery vehicle + 200 jars cycling = ₹80,000–1.2L monthly revenue from this stream alone.",
        "Hire 2 delivery staff on commission model: ₹8–12 per jar delivered. Their income grows as your business grows — aligns incentives, reduces your fixed cost risk.",
        "Partner with 30–50 kirana stores to stock your 1L/500ml bottles. Offer 15–18% shopkeeper margin. Track which stores sell fastest and restock proactively.",
        "Create Google Business listing and WhatsApp Business account. 'Water delivery near me' is a high-intent search — local SEO brings customers already ready to buy.",
        "Milestone: 500+ regular 20L jar customers OR stocked in 50+ retail stores. Monthly net profit ₹25,000–40,000. Delivery operations running without your daily involvement."
      ]},
      { title: "Phase 3 — Expand Revenue Streams (Years 2–5)", steps: [
        "Private label: supply your water in hotels' and restaurants' branded bottles — they pay premium, and their diners see your operation as premium supplier. Opens institutional B2B channel.",
        "Apply for government supply contracts: school mid-day meal programs, hospital supply, railway catering. Government tenders are published at gem.gov.in — high volume and payment reliability.",
        "Install water ATMs in rural/semi-urban areas with water scarcity — ₹1–2L per ATM, dispensing ₹1–5 per litre. 500–2,000 users/day in water-stressed areas. Jal Jeevan Mission contracts available.",
        "Expand geographically — open a second plant in a neighbouring district or franchise your setup to an operator. Franchise fee ₹2–3L + royalty on revenue.",
        "Milestone: 3+ revenue streams active. Monthly net ₹80,000–1.5L. Second plant or first franchise operational."
      ]},
      { title: "Phase 4 — Brand & Legacy (Years 5–20)", steps: [
        "Register your water brand as a trademark at ipindia.gov.in — ₹4,500 per class. A registered brand is a sellable, inheritable asset that has independent monetary value.",
        "Build a franchise network of 5–10 operators across your region. You earn royalties passively — they operate the plants. Standard royalty: 5–8% of their monthly revenue.",
        "Future expansion: wastewater recycling and treatment for industries — growing regulatory requirement from CPCB. Add this as a service to industrial clients in year 8–10.",
        "Document all SOPs, supplier contacts, certification processes in a business manual — makes the business transferable to family or manageable by a hired CEO.",
        "Milestone: Passive franchise royalty income. Brand has regional recognition. Business operates without your daily presence."
      ]}
    ],
    generational: "The UN projects 2/3 of the world will face water stress by 2025. In India, groundwater tables are depleting in 60%+ of districts. Clean water businesses will be more critical in 50 years than today. The infrastructure, brand, and distribution you build is a physical and legal asset that outlasts any technology shift."
  },
  {
    id: "edu", icon: "📚", title: "Educational Publishing & Content", tagline: "Knowledge created once sells forever.",
    color: "#4527A0", accent: "#9C27B0", pale: "#F3E5F5",
    horizon: "70–100 years", capital: "₹0–50K", monthly: "₹5K–₹5L+", legacy: "Copyright IP lasting 60 years post-death",
    why: "Education is eternal. Under Indian copyright law, content you create today generates royalties for 60 years after your death. India's education market will reach $225 billion by 2025. With 1.4 billion people and growing literacy — especially in regional languages — the demand for quality educational content is barely tapped.",
    phases: [
      { title: "Phase 1 — Choose Niche & Build Assets (Months 1–6)", steps: [
        "Pick a niche where you have genuine knowledge AND durable demand: competitive exams (UPSC, JEE, NEET, SSC CGL), professional skills (accounting, law, coding), or vernacular language content (Hindi, Tamil, Telugu — massively underserved vs English).",
        "Start YouTube channel AND a written blog simultaneously — dual asset creation at zero cost. YouTube monetizes at 1,000 subscribers + 4,000 watch hours (roughly 6–18 months of consistent posting). Blog content ranks on Google permanently and generates traffic for years.",
        "Create a free 'lead magnet': a formula sheet, solved paper PDF, cheat sheet, or topic summary. Distribute in student Facebook groups and WhatsApp study groups. Build an email list from day one using Mailchimp free tier.",
        "Register copyright for every written work at copyright.gov.in — ₹500–2,000 per work. In India, copyright lasts your lifetime plus 60 years. This is your children's inheritance.",
        "Milestone: 100+ YouTube subscribers, email list of 500+ students, 1 piece of content on Google page 1."
      ]},
      { title: "Phase 2 — Monetize & Productize (Months 6–24)", steps: [
        "Create your first paid course on Udemy India (widest reach), Teachable, or self-hosted via Instamojo. Price ₹499–2,999. Even 100 students/month at ₹999 = ₹99,900/month recurring from one course.",
        "Write and self-publish a physical book through Notion Press (India) or KDP (Kindle Direct Publishing) — zero upfront cost. You earn 60–70% royalty on digital sales, 10–25% on print. One good textbook can sell for 20+ years.",
        "Approach coaching institutes (Allen, Aakash, FIITJEE franchises) to license your study material — they pay per copy. A 5,000-student institute paying ₹150/book = ₹7.5L per edition.",
        "Partner with schools: approach principals to adopt your workbook as supplementary text. 500 students × ₹200 book = ₹1L from one school. 10 schools = ₹10L per academic year.",
        "Milestone: ₹30,000–60,000 monthly from courses + book sales. Second course or book in production."
      ]},
      { title: "Phase 3 — Publishing House (Years 2–7)", steps: [
        "Register as a publishing company (proprietorship or Pvt Ltd). Get free ISBN numbers from Raja Rammohun Roy National Agency for ISBN (rrrlf.gov.in) — required to sell in bookstores and libraries.",
        "Commission other subject matter experts to write for your imprint — pay per book or per chapter. You transition from author to publisher. Each new title adds to your passive royalty catalog.",
        "Build a catalog of 20–50 titles across related subjects. A publishing house with 30 books earning avg ₹8,000/month each = ₹2.4L/month in royalties with zero daily work.",
        "Translate top-selling titles into Hindi, Tamil, Telugu, Kannada — vernacular textbook market is massive and almost entirely served by a handful of publishers.",
        "Milestone: Publishing house with 20+ titles, ₹1–3L monthly passive royalty income, editorial staff or freelancers handling new titles."
      ]},
      { title: "Phase 4 — Institution & Legacy (Years 7+)", steps: [
        "Register an educational trust or Section 8 company — operate coaching institutes, online schools, or content platforms with significant tax advantages and institutional credibility.",
        "License your curriculum and brand to franchisee coaching centers across India — recurring royalty without you teaching or managing daily operations.",
        "Future play: your entire content library becomes training data or a structured knowledge base for an AI tutoring product — partner with or license to EdTech companies. Your IP becomes the foundation of a tech product.",
        "The IP — books, course recordings, trademark, email list — can be formally willed to your children. Copyright protection: your lifetime + 60 years.",
        "Milestone: A publishing brand with institutional clients, franchise network, and self-sustaining IP portfolio generating income without your active involvement."
      ]}
    ],
    generational: "Textbook publishers like S. Chand have operated 80+ years in India. O'Reilly Media (USA) has published technical books for 40+ years. Copyright law means your children inherit a royalty-generating estate, not just physical assets. With India's education market growing and regional language content barely developed, you are entering an industry at the beginning of its arc."
  },
  {
    id: "funeral", icon: "🕯️", title: "Funeral & End-of-Life Services", tagline: "The most certain demand in existence.",
    color: "#37474F", accent: "#90A4AE", pale: "#ECEFF1",
    horizon: "As long as humans exist", capital: "₹1–5L", monthly: "₹40K–₹3L+", legacy: "Multi-generational family business",
    why: "India has 10 million deaths per year — rising as the population ages. This industry has run for thousands of years. It is recession-proof, pandemic-proof, and impossible to replace with AI or automation. Dignity and ritual always matter. Japan's funeral companies are 200+ years old. India's funeral sector is 95% unorganized — the first professional operators will build durable brands.",
    phases: [
      { title: "Phase 1 — Learn, License & Setup (Months 1–8)", steps: [
        "Research municipal regulations in your city — funeral services require establishment license from nagar palika/municipal corporation. Contact local civic body for hearse vehicle permits and business registration requirements. Each state varies.",
        "Get an ambulance/hearse vehicle permit from Regional Transport Office (RTO). A second-hand hearse costs ₹3–8L. Alternatively, begin by partnering with an existing hearse operator and focus on coordination/arrangement services first (lower capital).",
        "Establish ties with 2–3 crematoriums and burial grounds in your area. Understand their capacity, peak hours, documentation requirements. Build personal relationships with managers — this network IS your business infrastructure.",
        "Complete a mortician or funeral services training course available in Mumbai, Delhi, Bengaluru through private institutes — 3–6 months, ₹15,000–50,000. Learn body preparation, preservation, documentation, and family counseling basics.",
        "Milestone: All licenses obtained, vehicle acquired or partnership signed, crematorium relationships established, first service SOP documented."
      ]},
      { title: "Phase 2 — Build Client Network (Months 6–24)", steps: [
        "Partner with hospitals as their recommended vendor for family funeral arrangements. Hospitals manage hundreds of deaths monthly and families in shock need a trusted referral. Approach hospital social workers and mortuary managers directly.",
        "Build relationships with local religious officiants — pandits, maulvis, pastors. They are often the first call a grieving family makes. A referral fee model (₹500–2,000 per referral) works well and is standard in this industry.",
        "Create a simple website + Google Business listing optimized for '[city] funeral service', '[city] antim sanskar'. Families search in distress — local SEO is the highest ROI marketing in this business.",
        "Offer fully transparent package pricing (₹8,000–35,000 tiers). This industry has a reputation for exploiting grieving families — being the honest, dignified, transparent option creates powerful word-of-mouth in communities.",
        "Milestone: 15–25 services per month at ₹10,000–25,000 average = ₹1.5–6L monthly gross revenue."
      ]},
      { title: "Phase 3 — Premium Services & Scale (Years 2–7)", steps: [
        "Add embalming and refrigerated cold storage — enables inter-city body transportation. With urbanization, millions of people die far from their hometown. Families pay ₹15,000–60,000 for this service. Almost no competition in Tier-2 cities.",
        "Launch pre-need funeral planning — families pay in advance (structured like a fixed deposit) for future funeral arrangements. This creates advance cash flow, builds loyalty, and is a rapidly growing segment in an aging population.",
        "Serve NRI families — the most underserved segment. They need someone trusted to manage Indian funeral arrangements while they travel from abroad. Premium service fees: ₹50,000–2L per case. Market via Indian diaspora community groups and temples abroad.",
        "Add a trained grief counselor to your team — ₹500–2,000 per session. This differentiates you completely from competitors and builds deep community trust and reputation.",
        "Milestone: ₹1.5–3L monthly net. Cold storage facility owned. Pre-need contract portfolio generating advance capital."
      ]},
      { title: "Phase 4 — Brand & Franchise (Years 7+)", steps: [
        "Register as a private limited company — raises institutional credibility, enables bank loans for expansion, and creates a clean legal structure for succession planning.",
        "Document every SOP: intake process, documentation, vendor management, family communication protocols. This operational manual is what makes the business franchisable and transferable to the next generation.",
        "Franchise your service brand and SOP network to 3–5 operators in other cities — ₹5–15L franchise fee per location + monthly royalty. You earn without running daily operations.",
        "Future services: green/eco burial (rapidly growing global trend), digital memorials, online condolence platforms. Funeral homes that add these become full lifecycle end-of-life service companies.",
        "Milestone: A regionally trusted brand across multiple cities, generating franchise royalty income without your daily involvement."
      ]}
    ],
    generational: "India's death rate is rising as the population ages. By 2050, India will have the world's largest elderly population. Funeral services, currently 95% unorganized, will formalize rapidly — early trusted players build durable moats. This business type has existed for millennia and will outlast every technology disruption."
  },
  {
    id: "rental", icon: "🏘️", title: "Rental Property Portfolio", tagline: "The oldest wealth system in human civilization.",
    color: "#1A237E", accent: "#5C6BC0", pale: "#E8EAF6",
    horizon: "100+ years", capital: "₹15–50L (first property)", monthly: "₹8K–₹1L+ per property", legacy: "Physical inheritance across generations",
    why: "Land and property have been the foundation of generational wealth since ancient civilizations. India's urbanization is only 35% — vs 80%+ in developed nations. As hundreds of millions more Indians move to cities over the next 50–100 years, demand for urban rental housing will only intensify. Every major Indian business dynasty built its foundation in real estate.",
    phases: [
      { title: "Phase 1 — First Property (Years 1–3)", steps: [
        "Target Tier-2 cities near growing IT and industrial hubs: Pune, Coimbatore, Indore, Kochi, Bhubaneswar, Vizag. These cities offer better rental yields (3–5%) vs Mumbai/Delhi (1.5–2%) at lower capital entry.",
        "Buy near universities, IT parks, or industrial estates — student and young professional rental demand is consistent, predictable, and growing. Occupancy is rarely a problem near large institutions.",
        "Structure your purchase: 20% down payment from your savings, 80% home loan at 8.5–9%. EMI should not exceed 35% of your monthly income. Run the full math before signing.",
        "Rent out immediately after possession — even partially. One rented bedroom or PG room can cover 30–60% of your EMI from day one, dramatically improving your cash flow.",
        "Milestone: Property purchased, tenant secured, rent covering minimum 40% of EMI. Property appreciating in a growing micro-market."
      ]},
      { title: "Phase 2 — Optimize & Acquire Second (Years 3–7)", steps: [
        "Convert from single-family rental to Paying Guest (PG) accommodation: add bunk beds, attached bathrooms, common kitchen — earn 2–4x the single-family rent on the same property.",
        "Track your total return: rental yield + capital appreciation. In growing Tier-2 cities, total returns often run 15–18% annually — better than most stock portfolios with far less volatility.",
        "Use growing rental income + salary savings to build the down payment for your second property. Target one new property every 3–5 years as a sustainable pace.",
        "Keep meticulous records: rental agreements, rent receipts, maintenance bills. Rental income is taxable, but mortgage interest, property tax, depreciation (30% standard deduction) are all deductible.",
        "Milestone: 2 properties acquired. Monthly gross rental income ₹40,000–80,000. EMIs largely covered by tenants."
      ]},
      { title: "Phase 3 — Commercial & Diversify (Years 7–15)", steps: [
        "Add one commercial property: a small shop in a growing residential layout. Commercial rental yields (6–8%) are double residential, and commercial tenants (banks, medical stores, ATMs) are far more stable than residential.",
        "Consider REITs (Real Estate Investment Trusts) for diversification without management: Embassy Office Parks, Mindspace, Nexus REITs trade on NSE with ₹10,000 minimum. Quarterly dividends, professional management.",
        "If capital allows, build a small apartment complex (4–8 flats) on a plot you own. Construction cost: ₹1,500–2,500/sqft. Developer margin on construction is 40–60%, then ongoing rental income forever.",
        "Register your properties in a family trust or holding company — prevents fragmentation across heirs, simplifies succession, avoids the disputes that destroy family wealth in India.",
        "Milestone: Portfolio of 4–6 properties + REIT holdings generating ₹1.5–3L monthly passive income."
      ]},
      { title: "Phase 4 — Dynasty Asset (Years 15+)", steps: [
        "Create a formal real estate holding company (Private Limited) — properties owned by company, family members are shareholders. Clean inheritance, easier bank financing, professional governance.",
        "Hire a professional property manager at 8–10% of gross rent — makes the entire portfolio passive and manageable by the next generation without your expertise.",
        "Document everything into a 'family property register': title deeds, survey numbers, loan documents, rent agreements, tax receipts, maintenance contacts. This is your family's most important file.",
        "Estate planning: work with a CA and lawyer to structure inheritance tax-efficiently. A registered will + family trust avoids probate delays and legal disputes across generations.",
        "Milestone: A self-sustaining real estate portfolio managed by professionals, structured for clean inheritance, generating multi-lakh monthly passive income."
      ]}
    ],
    generational: "Every major wealthy Indian family — Marwaris, Chettiars, Parsis — built multi-generational wealth through real estate. India needs 25 million new urban housing units by 2030. Property is the most legally protected, physically tangible, and socially understood wealth store available to an Indian family. With a holding company structure, it can be governed cleanly across 3–4 generations."
  },
  {
    id: "ayur", icon: "🌿", title: "Ayurveda & Natural Wellness Brand", tagline: "5,000-year-old wisdom meeting global demand.",
    color: "#1B5E20", accent: "#43A047", pale: "#E8F5E9",
    horizon: "100+ years", capital: "₹50K–5L", monthly: "₹15K–₹5L+", legacy: "Brand, trademarks, formulations",
    why: "Ayurveda is India's gift to the world — a 5,000-year system that is today a $10+ billion global industry growing 16% annually. Patanjali went from zero to ₹10,000 Crore in 15 years. Dabur has been family-run for 140 years. Natural products face growing global demand as synthetic products face regulatory and consumer backlash. This will be MORE relevant in 50 years.",
    phases: [
      { title: "Phase 1 — Learn, Source & Create (Months 1–8)", steps: [
        "Enroll in an AYUSH Ministry approved Ayurveda certificate course — 6-month programs available at government Ayurvedic colleges and online. Learn formulation basics, herb properties, and regulatory framework before making any products.",
        "Identify 3–5 products with proven efficacy, strong demand, and simple formulation: herbal immunity boosters (ashwagandha, giloy, tulsi), hair oils (bhringraj, amla), skin care (neem, turmeric, aloe), herbal teas. Start narrow, go deep.",
        "Source raw materials directly from herb-growing regions: Uttarakhand, Kerala, Himachal Pradesh, Rajasthan. APMC herb markets in Delhi (Khari Baoli), Mumbai, and Bengaluru offer bulk rates 40–60% below retail. Build direct farmer relationships for quality + margin.",
        "Get licensed before selling: AYUSH manufacturing license for Ayurvedic products (state AYUSH department), FSSAI license for food/supplement products (fssai.gov.in), Drugs & Cosmetics Act license for cosmetics. Budget ₹20,000–80,000 for licensing.",
        "Milestone: 3 products formulated, tested for safety and label compliance, licensed, first batch produced. Professional photography done for packaging."
      ]},
      { title: "Phase 2 — Build Brand & Sell Online (Months 6–24)", steps: [
        "List on Amazon India, Flipkart, and Meesho — zero upfront cost, pay commission only on sales. Natural and Ayurvedic products are among the fastest growing categories on Indian e-commerce.",
        "Build a brand story rooted in authenticity — 'traditional formulation from [your region]' or 'crafted by an Ayurvedic practitioner' commands 2–3x price premium over generic herbal products. Story > ingredients.",
        "Create Instagram + YouTube content educating on Ayurveda, ingredient benefits, lifestyle practices — not ads, but genuine education. 10,000 engaged followers convert far better than 100,000 passive ones.",
        "Target NRI diaspora specifically: Indians abroad pay ₹2,000–5,000 for products sold in India for ₹200–500. Ship internationally via India Post (cheapest) or DHL/FedEx for premium buyers. NRI communities are loyal and word-of-mouth spreads fast.",
        "Milestone: ₹50,000–1L monthly from online sales. 200+ positive reviews on Amazon. Second product batch reformulated based on customer feedback."
      ]},
      { title: "Phase 3 — Offline & Export (Years 2–7)", steps: [
        "Partner with Ayurvedic distributors in your state — they supply to pharmacies (medical stores), wellness shops, and Ayurvedic hospitals. Manufacturer margin: 40%; distributor: 20%; retailer: 20%. Still highly profitable at scale.",
        "Get APEDA registration (apeda.gov.in) to export food and herbal products. Register with Spice Board for spice-based products. Indian Ayurvedic products command premium prices in USA, UK, Germany, Australia, and Middle East — export prices 3–8x domestic.",
        "Register your brand trademarks — in India at ipindia.gov.in (₹4,500/class) and internationally via the Madrid Protocol (one application covers 130+ countries). A trademark is a monetizable business asset.",
        "Partner with yoga studios, wellness resorts, Ayurvedic clinics for institutional B2B sales — bulk orders, co-branding opportunities, and access to health-conscious premium customers.",
        "Milestone: Offline presence in 200+ stores. First export shipment. Monthly revenue ₹3–8L. International distributor signed."
      ]},
      { title: "Phase 4 — Brand Empire (Years 7+)", steps: [
        "File patents for unique formulations that show documented clinical efficacy — Himalaya Drug Company and Dabur have done this successfully. A patented formulation is a monopoly asset.",
        "Open a wellness center or Panchakarma clinic as a brand extension — services + products working together. Clinic customers become your most loyal product buyers and brand ambassadors.",
        "License your brand to a larger FMCG or wellness company OR accept strategic PE investment while retaining majority equity. Both are proven exit paths for Indian wellness brands.",
        "Your brand trademark, proprietary formulations, customer database, and distribution network are all formally inheritable assets. Dabur has passed through 4 family generations. Himalaya is now 3rd generation family-managed.",
        "Milestone: A recognized wellness brand with proprietary IP, international distribution, institutional clients, and a self-sustaining business structure."
      ]}
    ],
    generational: "The WHO has formally integrated traditional medicine into global health frameworks. India's AYUSH ministry is actively promoting Ayurvedic exports with dedicated funds and trade missions. Dabur — started 1884, still family-led. Himalaya — started 1930, 3rd generation family-managed. Patanjali — zero to ₹10,000 Crore in 15 years. The global natural wellness wave is just beginning."
  }
];

const STAT_COLORS = {
  "⏳ Horizon": null,
  "💰 Capital": null,
  "📈 Monthly": null,
  "🏛️ Legacy": null,
};

export default function SideHustleGuide() {
  const [selected, setSelected] = useState(null);
  const [openPhase, setOpenPhase] = useState(null);

  const hustle = selected !== null ? HUSTLES[selected] : null;

  function selectHustle(i) {
    setSelected(i);
    setOpenPhase(null);
  }

  function goBack() {
    setSelected(null);
    setOpenPhase(null);
  }

  function togglePhase(i) {
    setOpenPhase(openPhase === i ? null : i);
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "var(--color-background-primary)", color: "var(--color-text-primary)", padding: "24px 4px 48px" }}>

      {hustle === null ? (
        <>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 8 }}>Age 36 · India · Built to Last 100 Years</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.2, margin: "0 0 10px" }}>6 Side Hustles Still Running in 2124</h1>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0, maxWidth: 540 }}>
              Not dropshipping. Not crypto. These are businesses rooted in permanent human needs — food, water, knowledge, shelter, health, mortality — with step-by-step plans from ₹0 to generational wealth.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
            {HUSTLES.map((h, i) => (
              <div key={h.id} onClick={() => selectHustle(i)}
                style={{ cursor: "pointer", border: "1px solid var(--color-border-tertiary)", borderRadius: 12, padding: 16, background: "var(--color-background-primary)", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = h.accent; e.currentTarget.style.background = "var(--color-background-secondary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border-tertiary)"; e.currentTarget.style.background = "var(--color-background-primary)"; }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ fontSize: 26 }}>{h.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25, marginBottom: 3 }}>{h.title}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontStyle: "italic" }}>{h.tagline}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: h.pale, color: h.color, fontWeight: 600 }}>⏳ {h.horizon}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", fontWeight: 500 }}>{h.capital}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{h.monthly}/mo potential</span>
                  <span style={{ fontSize: 12, color: h.accent, fontWeight: 600 }}>Explore →</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: "14px 16px", background: "var(--color-background-secondary)", borderRadius: 10, border: "1px solid var(--color-border-tertiary)", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--color-text-primary)" }}>Why these 6?</strong> Each is built on a permanent human need that existed 2,000 years ago and will exist 100 years from now. All can be started from scratch in India alongside a day job, scaled gradually, and eventually handed to the next generation as an operating business — not just an asset.
          </div>
        </>
      ) : (
        <>
          <button onClick={goBack} style={{ cursor: "pointer", background: "none", border: "none", padding: "6px 0", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
            ← Back to all hustles
          </button>

          {/* Hero banner */}
          <div style={{ background: `linear-gradient(135deg, ${hustle.color} 0%, ${hustle.color}BB 100%)`, borderRadius: 14, padding: "24px 20px", marginBottom: 16 }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>{hustle.icon}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 6px", lineHeight: 1.2 }}>{hustle.title}</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 0 16px", fontStyle: "italic" }}>{hustle.tagline}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[["⏳ Horizon", hustle.horizon], ["💰 Capital", hustle.capital], ["📈 Monthly", hustle.monthly], ["🏛️ Legacy", hustle.legacy]].map(([label, val]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.18)", borderRadius: 8, padding: "6px 12px", minWidth: 90 }}>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Why it lasts */}
          <div style={{ border: `1px solid ${hustle.accent}66`, borderRadius: 10, padding: "14px 16px", background: hustle.pale, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: hustle.color, marginBottom: 6 }}>Why This Lasts 100+ Years</div>
            <p style={{ fontSize: 13, color: hustle.color, lineHeight: 1.65, margin: 0 }}>{hustle.why}</p>
          </div>

          {/* Phase accordion */}
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", marginBottom: 10 }}>Step-by-Step Roadmap — Tap to Expand</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {hustle.phases.map((p, pi) => (
              <div key={pi} style={{ border: "1px solid var(--color-border-tertiary)", borderRadius: 10, overflow: "hidden" }}>
                <div onClick={() => togglePhase(pi)} style={{ cursor: "pointer", padding: "13px 16px", background: openPhase === pi ? "var(--color-background-secondary)" : "var(--color-background-primary)", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: hustle.pale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: hustle.color, flexShrink: 0 }}>{pi + 1}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{p.title}</div>
                  <div style={{ fontSize: 16, color: "var(--color-text-secondary)", transform: openPhase === pi ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</div>
                </div>
                {openPhase === pi && (
                  <div style={{ padding: "14px 16px", background: "var(--color-background-secondary)", borderTop: "1px solid var(--color-border-tertiary)" }}>
                    {p.steps.map((step, si) => (
                      <div key={si} style={{ display: "flex", gap: 10, marginBottom: si < p.steps.length - 1 ? 12 : 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: hustle.accent, flexShrink: 0, marginTop: 7 }} />
                        <p style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.65, margin: 0 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Generational note */}
          <div style={{ background: `${hustle.color}18`, border: `1px solid ${hustle.accent}55`, borderRadius: 12, padding: "18px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: hustle.color, marginBottom: 8 }}>🌳 The Generational Perspective</div>
            <p style={{ fontSize: 13, color: "var(--color-text-primary)", lineHeight: 1.7, margin: "0 0 14px" }}>{hustle.generational}</p>
          </div>

          {/* Other hustles */}
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)", marginBottom: 8 }}>Explore Other Hustles</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {HUSTLES.filter((h) => h.id !== hustle.id).map((h, i) => (
              <div key={h.id} onClick={() => selectHustle(HUSTLES.indexOf(h))}
                style={{ cursor: "pointer", padding: "6px 12px", borderRadius: 20, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", fontSize: 12, color: "var(--color-text-secondary)", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = h.accent; e.currentTarget.style.color = "var(--color-text-primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border-secondary)"; e.currentTarget.style.color = "var(--color-text-secondary)"; }}>
                {h.icon} {h.title.split(" ").slice(0, 3).join(" ")}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
