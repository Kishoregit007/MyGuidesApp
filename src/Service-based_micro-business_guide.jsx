import { useState } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0A0A0A;--surface:#111111;--surface2:#181818;--surface3:#1F1F1F;
  --border:#2A2A2A;--border2:#333;
  --text:#F0EDE8;--text2:#999;--text3:#666;
  --amber:#E8A320;--amber2:#F5C842;--amber-dim:#2A1F08;
  --green:#22C55E;--green-dim:#0A1F10;
  --red:#EF4444;--red-dim:#1F0A0A;
  --blue:#60A5FA;--blue-dim:#0A1020;
  --purple:#A78BFA;--purple-dim:#150F28;
}
body{background:var(--bg);color:var(--text);font-family:'Instrument Serif',Georgia,serif}
.syne{font-family:'Syne',sans-serif}
.mono{font-family:'JetBrains Mono',monospace}
.serif{font-family:'Instrument Serif',Georgia,serif}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%,100%{opacity:0.6}50%{opacity:1}}
.fade{animation:fadeUp 0.4s ease both}
.card-hover{transition:border-color 0.2s,background 0.2s}
.card-hover:hover{border-color:var(--border2)!important;background:var(--surface2)!important}
`;

const HUSTLES = [
  {
    id:"freelance-writing", icon:"✍️", cat:"Writing & Content",
    title:"Freelance Writing & Copywriting",
    tagline:"Words that sell, inform & rank — forever in demand.",
    color:"#E8A320", dim:"#2A1F08", textCol:"#F5C842",
    timeToFirst:"2–4 weeks",
    monthlyPotential:"₹8,000–₹40,000",
    hoursNeeded:"1–2 hrs/day",
    capitalNeeded:"₹0",
    difficulty:"Beginner",
    skillsNeeded:["Good written English or Hindi","Basic grammar","Ability to research topics online"],
    platforms:["Upwork","Fiverr","Internshala","LinkedIn","ContentMart","WriterAccess","Pepper Content","Peppercontent.io"],
    whatYouDo:"Write blog posts, website copy, product descriptions, social media captions, newsletters, and articles for businesses and individuals who need content but don't have the time or skill to write it themselves.",
    incomeBreakdown:[
      {task:"1 blog post (800–1200 words)",rate:"₹500–₹3,000",time:"2–3 hrs"},
      {task:"Product description (100 words)",rate:"₹100–₹400",time:"30 min"},
      {task:"Website homepage copy",rate:"₹2,000–₹8,000",time:"3–5 hrs"},
      {task:"Email newsletter",rate:"₹800–₹3,000",time:"1–2 hrs"},
      {task:"Social media 10-post pack",rate:"₹1,500–₹5,000",time:"2–3 hrs"},
    ],
    steps:[
      {
        week:"Week 1–2", title:"Build Your Writing Portfolio",
        actions:[
          "Pick ONE niche to specialize in: tech, finance, health, education, real estate, or SaaS. Generalists earn less and get hired slower.",
          "Write 3–5 free sample articles in your chosen niche. Publish them on Medium.com (free) or a free WordPress blog. These are your portfolio pieces — you need samples before you can charge money.",
          "Download Grammarly free version. Install Hemingway Editor at hemingwayapp.com. Both are free and will immediately improve your writing quality.",
          "Create a simple list of 50 local businesses in your city (restaurants, clinics, coaching institutes, gyms, real estate agents) that likely have no blog or poor website content. These are your first targets."
        ]
      },
      {
        week:"Week 2–3", title:"Create Profiles & Pitch",
        actions:[
          "Create a Fiverr gig: 'I will write a 1000-word SEO blog post for ₹500'. Low price is intentional — you need your first 5 reviews. Screenshot: Go to fiverr.com → Selling → Gigs → Create a new gig.",
          "Create an Upwork profile with your 3 portfolio samples. Apply to 10 writing jobs daily. Your proposal: 'I've written similar content — here are 2 samples. I can deliver in 48 hours.'",
          "Join Facebook groups: 'Content Writers India', 'Freelancers in [Your City]', 'Startup India Community'. Post your services with 2 sample links. This is free and often faster than platforms.",
          "WhatsApp message to 20 contacts: 'I've started freelance content writing. If you know any business needing blogs or website content, I'd love a referral. Here are my samples: [link]'."
        ]
      },
      {
        week:"Week 3–6", title:"Land First Clients & Deliver",
        actions:[
          "Your first client will likely pay ₹300–₹600 per article. Accept it. Deliver it 24 hours before deadline. Ask for a review. Reviews are currency on freelance platforms.",
          "Under-promise, over-deliver: if they pay for 800 words, deliver 900. Add a free meta description for their blog post. Small extras create loyal clients who return and refer.",
          "After 3 successful deliveries, raise your Fiverr gig price by 30%. After 10 reviews, raise again. Price increases should track your delivery volume and ratings.",
          "Track every project in a simple Google Sheet: Client name, date, topic, word count, payment, review received. This becomes your business ledger."
        ]
      },
      {
        week:"Month 2–3", title:"Scale to ₹8,000–₹15,000/month",
        actions:[
          "Pitch retainer deals: 'I'll write 4 blogs per month for you at ₹3,000/month'. Predictable income beats one-time projects. Even 2–3 retainer clients = ₹6,000–₹9,000 monthly baseline.",
          "Approach Pepper Content (peppercontent.io) and Internshala — both hire writers for ongoing projects. Apply with your portfolio. These pay ₹1–₹3/word consistently.",
          "Specialize deeper: SEO writing commands 2x rates of general writing. Take a free Semrush SEO writing course (available on their site) and add 'SEO Writer' to your profile.",
          "Create a simple personal website using Carrd.co (free) with your bio, services, rates, and testimonials. Share it on LinkedIn. Your online presence directly affects inbound inquiries."
        ]
      }
    ],
    milestone:"5K target: 2 retainer clients at ₹2,500/month each = ₹5,000. Achievable in 6–8 weeks from a cold start.",
    proTip:"The single biggest mistake new writers make: trying to write for everyone. Pick one industry, become the go-to writer for it. A writer who specializes in 'NBFC loan product descriptions' earns 3x a generalist."
  },

  {
    id:"social-media", icon:"📲", cat:"Digital Marketing",
    title:"Social Media Management",
    tagline:"Every business needs a social presence. Almost none can manage it themselves.",
    color:"#A78BFA", dim:"#150F28", textCol:"#C4B5FD",
    timeToFirst:"1–3 weeks",
    monthlyPotential:"₹8,000–₹35,000",
    hoursNeeded:"1–2 hrs/day",
    capitalNeeded:"₹0–₹500",
    difficulty:"Beginner–Intermediate",
    skillsNeeded:["Basic smartphone photography","Canva (free to learn)","Understanding of Instagram/Facebook"],
    platforms:["Instagram","Facebook","LinkedIn","Local business directories","Justdial listings"],
    whatYouDo:"Create and schedule posts, write captions, respond to comments, and grow the Instagram/Facebook/LinkedIn accounts of local businesses — restaurants, clinics, salons, coaching institutes, boutiques — who are too busy to do it themselves.",
    incomeBreakdown:[
      {task:"Manage 1 Instagram account (12 posts/month)",rate:"₹3,000–₹8,000/mo",time:"30 min/day"},
      {task:"Create 10 Canva graphics",rate:"₹1,000–₹3,000",time:"2–3 hrs"},
      {task:"Write captions for 1 month (20 posts)",rate:"₹1,500–₹4,000",time:"2–3 hrs"},
      {task:"Set up new business Instagram profile",rate:"₹2,000–₹5,000",time:"3–4 hrs"},
      {task:"Run Facebook/Instagram ad campaign",rate:"₹3,000–₹8,000/mo",time:"1 hr/day"},
    ],
    steps:[
      {
        week:"Week 1", title:"Learn Canva & Platform Basics",
        actions:[
          "Open Canva.com (100% free). Spend 2 days learning: templates, resizing for Instagram (1080×1080), adding text, brand colors. Watch 2 Canva tutorial videos on YouTube — 'Canva for beginners 2024 India'.",
          "Study 3 successful local business Instagram accounts in your city. What types of posts get most engagement? Promotions, behind-the-scenes, customer stories, educational posts? Copy the formula, not the content.",
          "Create a mock Instagram content calendar for an imaginary restaurant: 12 posts for one month, 4 different post types (menu highlight, customer review, behind-scenes, promo offer). This is your demo portfolio.",
          "Download Buffer or Meta Business Suite (both free). Learn to schedule posts — this is how you serve multiple clients in 1–2 hours daily instead of logging in all day."
        ]
      },
      {
        week:"Week 2", title:"Get Your First Client Free",
        actions:[
          "Identify 5 local businesses with poor/inactive Instagram: check their last post date, follower count, engagement. Target: restaurants, salons, boutiques, coaching centers, gyms.",
          "Walk in and say: 'I noticed your Instagram hasn't been updated in 2 weeks. I specialize in social media for [restaurant/salon/etc]. Can I manage it free for one month to show you results?' This works 1 in 5 times.",
          "Alternatively: DM the business on Instagram: 'Hi, I help [category] businesses in [city] grow on Instagram. I'd like to manage your account free for 2 weeks — can we talk?'",
          "Deliver results: 12 high-quality posts in month 1. Track: follower growth, post reach, engagement rate (likes+comments÷followers×100). Screenshot the before/after. This becomes your case study."
        ]
      },
      {
        week:"Week 3–6", title:"Convert to Paid & Multiply",
        actions:[
          "After free month: 'Your followers grew from 340 to 520 and reach increased 3x. I'd like to continue at ₹3,500/month for 12 posts and daily engagement.' Most business owners say yes if results were real.",
          "Use that first case study to approach 10 more businesses. 'I helped [Restaurant Name] grow their Instagram followers by 53% in 30 days. I can do the same for you.' Show the screenshot proof.",
          "Create a simple PDF 'Social Media Packages' menu: Basic (8 posts/mo) ₹2,500 | Standard (15 posts/mo) ₹4,500 | Premium (20 posts + stories + ads) ₹8,000. Having packages makes pricing conversations easy.",
          "Join local business WhatsApp groups and Facebook groups for your city. Introduce yourself and your case study. Local business owners refer each other constantly."
        ]
      },
      {
        week:"Month 2–4", title:"Scale to ₹10,000–₹20,000/month",
        actions:[
          "3 clients at ₹3,500/month = ₹10,500. With Buffer scheduling, managing 3 accounts takes only 1.5 hours/day. This is your first ₹10K milestone.",
          "Learn Facebook Ads basics (Meta Blueprint — free certification). Businesses pay ₹3,000–₹8,000/month just for ad management on top of content. This doubles your revenue per client.",
          "Systematize with templates: create 20 reusable Canva templates for each client's brand colors. Batch-create an entire month's posts in one sitting (2 hours) and schedule all at once.",
          "Hire a college student as a subcontractor at ₹500–₹1,000/month to handle basic graphic creation. You manage strategy and client relationships. This is how you scale beyond 4 clients without more of your time."
        ]
      }
    ],
    milestone:"5K target: 2 clients at ₹2,500/month = ₹5,000. Achievable in 4–6 weeks. Each client requires only 30–45 min/day.",
    proTip:"Target restaurants, clinics, and coaching institutes in Tier-2 cities near you — they have consistent revenue, understand marketing value, and almost none have dedicated social media help. One satisfied restaurant owner will refer 5 others."
  },

  {
    id:"tutoring", icon:"📖", cat:"Education",
    title:"Online & Home Tutoring",
    tagline:"India spends more per child on education than food. Demand is infinite.",
    color:"#22C55E", dim:"#0A1F10", textCol:"#4ADE80",
    timeToFirst:"1–2 weeks",
    monthlyPotential:"₹5,000–₹30,000",
    hoursNeeded:"1–2 hrs/day",
    capitalNeeded:"₹0–₹2,000",
    difficulty:"Beginner",
    skillsNeeded:["Strong subject knowledge in any one area","Patience to explain concepts","Basic English or regional language communication"],
    platforms:["UrbanPro","Vedantu","Chegg Tutors","Superprof","WhatsApp (for local students)","YouTube (for discovery)"],
    whatYouDo:"Teach students aged 8–22 in subjects you are strong in: Maths, Science, English, Accounts, Economics, competitive exam prep (SSC, UPSC, NEET, JEE), or professional skills like Tally, Excel, or spoken English.",
    incomeBreakdown:[
      {task:"Class 8–10 Maths (per hour, home tuition)",rate:"₹200–₹500/hr",time:"1 hr"},
      {task:"Class 11–12 Science (per hour)",rate:"₹300–₹800/hr",time:"1 hr"},
      {task:"Competitive exam coaching (per hour)",rate:"₹400–₹1,200/hr",time:"1 hr"},
      {task:"Spoken English (group class, 5 students)",rate:"₹2,000–₹5,000/month per group",time:"1 hr/day"},
      {task:"Online Chegg/Vedantu tutoring (per hour)",rate:"₹200–₹600/hr",time:"1 hr"},
    ],
    steps:[
      {
        week:"Week 1", title:"Choose Subject & Set Up Profile",
        actions:[
          "Pick ONE subject/level combination: 'Class 9–10 Maths' or 'Class 11 Physics' or 'UPSC Economy' or 'Spoken English for professionals'. Being specific gets you more inquiries than being generic.",
          "Register on UrbanPro.com (free) — India's largest tutoring marketplace. Fill in your profile completely: photo, qualification, experience, subjects. Set your rate 20% below market initially to get first reviews.",
          "Register on Chegg Tutors and SuperProf — both pay USD (₹800–₹2,000/hr equivalent) for online tutoring. Requirements: subject knowledge + stable internet. Apply to both.",
          "Create a WhatsApp Business account. Set your profile to show your subjects and availability. Share in all your WhatsApp groups: 'I'm offering home tuition for [subject] for [grade]. Starting at ₹[rate]/hour. [Your area]'."
        ]
      },
      {
        week:"Week 1–2", title:"Get First 2–3 Students",
        actions:[
          "Print 20 flyers (₹200 at local print shop): 'Home Tuition for Maths/Science, Classes 8–10, [Your name], [Phone], [Rate]/hr, [Area]'. Paste in nearby apartment society notice boards, school gates, and grocery stores.",
          "Ask every parent you know: 'My child's school friends, do any need tuition for [subject]?' Word of mouth is the #1 source for tutoring clients in India.",
          "Contact local schools directly: go to the school office and ask if they have a vendor register or a parent notice board where tutors can advertise. Many schools allow this.",
          "Offer the first class free: 'Come for one free trial class. If [student] finds it useful, we continue at [rate].' A free trial removes parent hesitation completely."
        ]
      },
      {
        week:"Week 2–6", title:"Deliver & Retain Students",
        actions:[
          "Use Google Meet or Zoom free for online classes. Share your screen to show problems being solved. Online students can be from anywhere in India — your reach is unlimited.",
          "Send parents a 5-minute weekly WhatsApp voice note: 'This week [student] completed chapter 3. We struggled with quadratic equations but solved it today. Next week we'll do chapter 4.' This communication is rare and parents love it.",
          "Keep a simple Google Sheet: student name, class, topics covered, homework given, next session. This professionalism justifies higher rates over time.",
          "Ask happy parents for referrals after month 1: 'If you know any parent looking for [subject] tuition, I'd appreciate a referral. I currently have 2 slots open.' Never more than 2 slots — creates scarcity."
        ]
      },
      {
        week:"Month 2–4", title:"Scale to ₹8,000–₹15,000/month",
        actions:[
          "10 students × 1 hour × 4 days/week × ₹250/hr = ₹10,000/month. This is completely achievable at 8–10 hours/week total.",
          "Switch solo students to small group classes (3–5 students at same level): you earn ₹250 × 3 students = ₹750/hr instead of ₹250/hr for same prep and time.",
          "Create recorded video lessons on YouTube for commonly asked topics in your subject. This drives inbound inquiries from parents who find your explanations helpful. Pure passive marketing.",
          "Once established, raise rates 15–20% for new students. Existing students stay at old rate — grandfathering builds loyalty while new students subsidize your rate increase."
        ]
      }
    ],
    milestone:"5K target: 5 students × ₹1,000/month each (4 sessions) = ₹5,000. Achievable within 3–4 weeks of starting.",
    proTip:"The most underserved market: working professionals wanting to learn Tally, Excel, Spoken English, or basic programming. They pay ₹500–₹1,500/hr, have flexible schedule (evenings), and don't need you on weekends. Target this segment for maximum hourly rate."
  },

  {
    id:"va", icon:"🗂️", cat:"Admin & Operations",
    title:"Virtual Assistant Services",
    tagline:"Busy founders, coaches & consultants outsource everything they hate doing.",
    color:"#60A5FA", dim:"#0A1020", textCol:"#93C5FD",
    timeToFirst:"1–3 weeks",
    monthlyPotential:"₹8,000–₹40,000",
    hoursNeeded:"1–2 hrs/day",
    capitalNeeded:"₹0",
    difficulty:"Beginner",
    skillsNeeded:["Organized and detail-oriented","Email and calendar management","Basic Excel/Google Sheets","Good English communication"],
    platforms:["Upwork","Fiverr","Truelancer","LinkedIn","RemoteIndian.com","Belay","Time Etc"],
    whatYouDo:"Handle the administrative overflow for busy professionals, coaches, consultants, and small business owners: email management, calendar scheduling, data entry, research, travel booking, customer support replies, document formatting, and social media scheduling.",
    incomeBreakdown:[
      {task:"Email management (1 hr/day)",rate:"₹4,000–₹10,000/month",time:"1 hr/day"},
      {task:"Calendar & appointment scheduling",rate:"₹3,000–₹8,000/month",time:"30 min/day"},
      {task:"Data entry and research projects",rate:"₹150–₹300/hr",time:"Variable"},
      {task:"Customer support email replies",rate:"₹5,000–₹15,000/month",time:"1 hr/day"},
      {task:"Travel & hotel booking",rate:"₹500–₹2,000/booking",time:"1–2 hrs"},
    ],
    steps:[
      {
        week:"Week 1", title:"Define Your Services & Create Profile",
        actions:[
          "Pick 3–4 specific VA services you can confidently offer today: email management, data entry, research, scheduling, PowerPoint formatting. Don't offer everything — focused services get hired faster.",
          "Create a free Upwork profile. Key sections: headline ('Virtual Assistant for Coaches & Consultants | Email + Calendar + Research'), portfolio (create mock samples — format a sample report, build a mock travel itinerary), and hourly rate (start at $5–$8/hr to get first reviews).",
          "Create a Fiverr gig: 'I will be your virtual assistant for 1 hour of admin work — ₹300'. Low barrier to entry, gets first clients fast.",
          "Create a simple 1-page 'Services Menu' PDF using Canva: list your services, what's included, and price. This professionalism impresses Indian clients who find you on LinkedIn."
        ]
      },
      {
        week:"Week 2", title:"Target Indian Coaches & Consultants",
        actions:[
          "Search LinkedIn for: 'Business Coach India', 'Life Coach Hyderabad/Mumbai/Pune', 'Consultant India'. These professionals have high income, are overwhelmed by admin, and are already comfortable paying for services.",
          "Send 10 LinkedIn DMs per day: 'Hi [Name], I see you're running a [coaching/consulting] business. I offer virtual assistant services — email management, scheduling, research — for 2 hours/day. Many coaches find this frees 3–4 hours weekly. Would you be open to a 15-minute chat?'",
          "Join Facebook and Telegram groups for coaches, consultants, and startup founders in India. Post: 'Looking for a reliable VA? I help busy [coaches/founders] with email, calendar, and research. Starting at ₹3,000/month for 1 hr/day.'",
          "Cold email 20 local businesses using Gmail. Subject line: 'Free your time — virtual assistant for admin work'. Keep it under 5 sentences. Offer a free 1-hour trial."
        ]
      },
      {
        week:"Week 3–6", title:"First Client & Systematize",
        actions:[
          "First client goal: ₹3,000–₹5,000/month for 1 hour/day. That's only 20–22 working hours/month. Agree on scope clearly: exactly what tasks, which tools (Gmail, WhatsApp, Google Calendar, Notion), communication method.",
          "Use a free tool like Trello or Notion to track all tasks. Create a daily standup note: send client every evening — 'Tasks completed today: [list]. Tasks for tomorrow: [list]. Questions: [any].' This communication builds trust.",
          "Collect a testimonial after first month. Ask directly: 'Can you write 2–3 sentences about our work together? It helps me get more clients.' Use this testimonial on all your profiles.",
          "Over-deliver in month 1: if they pay for email management, proactively organize their inbox into folders and unsubscribe from spam. Surprise them. Retention beats acquisition every time."
        ]
      },
      {
        week:"Month 2–4", title:"Scale to Multiple Clients",
        actions:[
          "3 clients × ₹3,500/month = ₹10,500. Each client = 1 hr/day. 3 clients = 3 hrs total. Fits within your 1–2 hr/day budget if tasks are batched intelligently.",
          "Specialize into a sub-niche: 'VA for real estate agents', 'VA for YouTubers', 'VA for e-commerce sellers'. Specialists command 30–50% higher rates. Search where your niche hangs out online and target them.",
          "Learn one specialized tool deeply: if clients use Notion, become a Notion expert. If they use HubSpot, learn HubSpot basics. Tool expertise commands ₹500–₹1,000/hr on Upwork.",
          "Create a 'VA Packages' pricing menu for Indian clients: Starter (1 hr/day, 5 days/week) ₹4,500/mo | Growth (2 hrs/day) ₹8,000/mo | Full-Stack (3 hrs/day) ₹12,000/mo."
        ]
      }
    ],
    milestone:"5K target: 1–2 clients at ₹3,000–₹4,000/month each = ₹5,000–₹8,000. One good client referral from a coach or founder network often brings 2–3 more.",
    proTip:"The highest-paying VA niche in India: executive assistants for NRI founders or international clients paying in USD. $5/hr minimum = ₹415/hr. 2 hours/day × 20 days = $200/month = ₹16,600. Find these on Upwork, Toptal, and Contra."
  },

  {
    id:"graphic-design", icon:"🎨", cat:"Design",
    title:"Freelance Graphic Design",
    tagline:"Every business needs a logo, a flyer, a banner. Most can't afford agencies.",
    color:"#F472B6", dim:"#1F0A18", textCol:"#F9A8D4",
    timeToFirst:"2–4 weeks",
    monthlyPotential:"₹6,000–₹35,000",
    hoursNeeded:"1–2 hrs/day",
    capitalNeeded:"₹0–₹1,000",
    difficulty:"Beginner (with Canva) to Intermediate (with Figma/Illustrator)",
    skillsNeeded:["Eye for design (colours, layout, spacing)","Canva or basic Figma","Creative thinking for brand identity"],
    platforms:["Fiverr","Upwork","99designs","Dribbble","Instagram (portfolio)","Local businesses"],
    whatYouDo:"Design logos, social media posts, visiting cards, flyers, banners, presentations, brochures, and packaging labels for small businesses, startups, coaches, and professionals who need professional-looking visuals but can't afford a full-time designer or agency.",
    incomeBreakdown:[
      {task:"Logo design (3 concepts + revisions)",rate:"₹500–₹5,000",time:"2–4 hrs"},
      {task:"Business card design",rate:"₹300–₹1,500",time:"1–2 hrs"},
      {task:"Social media 10-post template pack",rate:"₹1,500–₹5,000",time:"3–4 hrs"},
      {task:"A4 flyer / brochure",rate:"₹500–₹3,000",time:"2–3 hrs"},
      {task:"PowerPoint / pitch deck (10 slides)",rate:"₹2,000–₹8,000",time:"3–5 hrs"},
    ],
    steps:[
      {
        week:"Week 1–2", title:"Learn Canva & Build Portfolio",
        actions:[
          "Learn Canva Pro features (free 30-day trial — start at canva.com). Master: brand kits, frames, mockups, Canva presentations, and removing backgrounds. These are what clients pay for.",
          "Create 5 portfolio pieces proactively: design a logo for an imaginary café, a social media pack for a fictional gym, a flyer for a made-up event, a business card for a mock consultant, a pitch deck for a fake startup. Quality > reality of the client.",
          "Post your 5 portfolio pieces on Instagram using hashtags: #logodesignindia #graphicdesignerforlife #canvadesigner #freelancedesignerIndia. Follow and engage with businesses in your city.",
          "Study competitors on Fiverr: search 'logo design' sorted by 'best selling'. Study what top Indian sellers offer, how their gigs are structured, what prices they charge. Copy the structure, not the designs."
        ]
      },
      {
        week:"Week 2–3", title:"Launch on Fiverr & Local Outreach",
        actions:[
          "Create 3 Fiverr gigs: (1) Logo design ₹300 basic, (2) Social media post design ₹200 for 5 posts, (3) Business card design ₹200. Start low — get reviews first, raise prices after 10 orders.",
          "Go to JustDial or Sulekha and find 30 local businesses (new restaurants, salons, boutiques, clinics). Check if they have a logo or if it looks amateur. DM them on Instagram: 'I noticed your brand could use a fresher logo — I can do it for ₹500. Interested?'",
          "Print and distribute 10 sample visiting cards showing your own brand design — the card itself is your portfolio. Include your Fiverr/Instagram link and 'Graphic Design Services From ₹300'.",
          "Join local business WhatsApp groups and startup communities. When someone asks 'who can make a logo?' — be the first to reply with your portfolio link."
        ]
      },
      {
        week:"Week 3–8", title:"Deliver, Iterate & Raise Rates",
        actions:[
          "Always deliver 2–3 design concepts, not just 1. Clients feel they got more value and are less likely to request endless revisions. Say: '3 directions — pick the one that resonates, then we refine.'",
          "Turnaround time is your superpower: if others take 3–5 days, deliver in 24–48 hours. Speed at the same quality = instant competitive advantage for local clients.",
          "After 5 positive reviews, raise Fiverr prices 40–50%. After 15 reviews, raise again. Your goal: ₹2,000 for logo after 20 reviews, not ₹300 forever.",
          "Offer retainer packs: 'I'll design 15 social media posts every month for ₹4,000'. Predictable income from one client beats chasing new ones constantly."
        ]
      },
      {
        week:"Month 2–5", title:"Productize & Scale",
        actions:[
          "Create ready-to-sell Canva template packs: 'Instagram Feed Template Pack for Restaurants — 20 templates, ₹800'. Sell on Gumroad.com or Etsy. This is passive income from design work done once.",
          "Learn Figma basics (free, 2 weeks): Figma-designed work commands 2–3x higher rates than Canva work. A Figma UI design gig on Upwork pays $30–$80/hour.",
          "Specialize: 'Pitch deck designer for startups' or 'Restaurant menu designer' earns 2–4x a generalist graphic designer. Pick an industry, build 3 portfolio pieces for it, market exclusively to that industry.",
          "Network with web developers on Upwork and LinkedIn — they constantly need designers and will refer overflow work. A developer-designer partnership creates a full-service offering."
        ]
      }
    ],
    milestone:"5K target: 5 small logo/flyer projects at ₹1,000 each = ₹5,000. Or 1 retainer social media design client at ₹5,000/month. Achievable in 4–6 weeks.",
    proTip:"The fastest path to ₹10,000/month: specialize in pitch decks for startup founders. Founders are time-starved, well-funded, and a good pitch deck is worth lakhs to them. Price: ₹5,000–₹15,000 per deck. 1–2 decks/month = target achieved."
  },

  {
    id:"video-editing", icon:"🎬", cat:"Media & Content",
    title:"Video Editing for Content Creators",
    tagline:"India has 500M+ YouTube/Reels consumers. Every creator needs an editor.",
    color:"#F97316", dim:"#1F0E04", textCol:"#FCA572",
    timeToFirst:"2–4 weeks",
    monthlyPotential:"₹8,000–₹50,000",
    hoursNeeded:"1–2 hrs/day",
    capitalNeeded:"₹0–₹3,000",
    difficulty:"Beginner–Intermediate",
    skillsNeeded:["Basic editing software (DaVinci Resolve — free)","Patience with timelines","Good sense of pacing and music"],
    platforms:["Fiverr","Upwork","Instagram (DM creators)","YouTube (DM small creators)","Facebook Groups for content creators"],
    whatYouDo:"Edit raw video footage into polished YouTube videos, Instagram Reels, YouTube Shorts, podcast videos, educational content, wedding/event highlights, or product demo videos. Creators record — you make it watchable.",
    incomeBreakdown:[
      {task:"YouTube video edit (10–15 min)",rate:"₹500–₹3,000",time:"2–3 hrs"},
      {task:"Instagram Reel edit (30–60 sec)",rate:"₹300–₹1,500",time:"1–2 hrs"},
      {task:"Monthly retainer (8 reels)",rate:"₹4,000–₹12,000/mo",time:"1 hr/day"},
      {task:"Wedding highlight video (3 min)",rate:"₹3,000–₹10,000",time:"4–6 hrs"},
      {task:"Corporate explainer (2 min)",rate:"₹5,000–₹20,000",time:"4–8 hrs"},
    ],
    steps:[
      {
        week:"Week 1–2", title:"Learn Editing & Build Samples",
        actions:[
          "Download DaVinci Resolve (free, professional-grade). Watch 'DaVinci Resolve full course for beginners' on YouTube (free, 3–5 hours total). Practice every day for 30–45 minutes.",
          "Find 3 free-to-use videos on Pexels.com or Pixabay.com. Edit them into a 60-second video with cuts, text overlays, background music, color grading, and transitions. This is your first portfolio piece.",
          "Download CapCut (free, mobile) — it is the preferred tool for Reels editing. Create 2 sample Reels using free footage. These demos show potential clients you understand the format.",
          "Edit your own content: record a simple 3-minute explainer video about any topic, edit it with DaVinci Resolve, and upload to YouTube. This shows clients a real finished product."
        ]
      },
      {
        week:"Week 2–3", title:"Target Small YouTube Creators",
        actions:[
          "Search YouTube for channels with 1,000–50,000 subscribers in Hindi or Telugu/Tamil/Kannada — local language creators are growing explosively and most edit their own videos badly.",
          "Watch their videos. Notice what's missing: jump cuts, poor audio mixing, no text overlays, weak thumbnail. Comment on 5 of their videos genuinely first, then DM: 'I'm a video editor. I noticed your content is great but the editing could be tightened. Would you like me to edit 1 video free to show you the difference?'",
          "Create a Fiverr gig: 'I will edit your YouTube video up to 10 minutes for ₹400'. Intentionally low — get 5 reviews first. With 5 reviews at ₹400, raise to ₹800, then ₹1,500.",
          "Join Facebook group 'Indian YouTubers Network' and Telegram groups for content creators. Introduce yourself and offer a free sample edit. Creators talk to each other — one happy client = multiple referrals."
        ]
      },
      {
        week:"Week 3–8", title:"Get First Retainer Client",
        actions:[
          "The goal is NOT one-off projects — it is monthly retainers. Approach: 'I'll edit all your reels for the month — 8 reels — for ₹5,000. You just send me the raw footage, I deliver edited Reels within 48 hours each.'",
          "Deliver 24 hours before promised time. Include a bonus: auto-generated captions, a thumbnail suggestion, or 2 extra seconds of b-roll. These extras cost you 15 minutes but create client loyalty.",
          "Learn to create YouTube thumbnails in Canva — thumbnail design is a sellable add-on. '₹200 per thumbnail' on top of your editing rate adds 20–30% to your monthly income.",
          "Ask every client for a video testimonial — 30 seconds on their phone saying 'I hired this editor and...'. A video testimonial on your Instagram story converts 3x better than text."
        ]
      },
      {
        week:"Month 2–5", title:"Scale Revenue",
        actions:[
          "2 retainer clients (8 reels each at ₹5,000 each) = ₹10,000/month for 2–3 hours/day of editing work.",
          "Add motion graphics using DaVinci Resolve's Fusion or Adobe After Effects (₹1,400/month subscription). Motion graphics command 2–3x higher rates. A 'logo animation' Fiverr gig earns ₹1,500–₹5,000 per order.",
          "Target English YouTube creators internationally on Fiverr and Upwork — they pay USD ($10–$50 per video edit). 1 USD client at $50/video = ₹4,150 for 2–3 hours of work.",
          "Offer course or webinar editing as a specialty — coaches and course creators record raw lectures and need them edited. These are typically long (30–90 min videos) but pay ₹3,000–₹8,000 per video."
        ]
      }
    ],
    milestone:"5K target: 1 retainer client (8 reels, ₹5,000/month). Or 10 Fiverr reels at ₹500 each = ₹5,000. Achievable in 4–7 weeks.",
    proTip:"The fastest growing category: YouTube Shorts and Instagram Reels editing for coaches, doctors, lawyers, and CA firms who are creating educational content but hate editing. They pay ₹500–₹2,000 per Reel and post 4–8 times per month. One client = ₹4,000–₹16,000/month."
  },

  {
    id:"translation", icon:"🌐", cat:"Language",
    title:"Translation & Transcription Services",
    tagline:"India's 22 official languages create an unending translation economy.",
    color:"#34D399", dim:"#0A1F14", textCol:"#6EE7B7",
    timeToFirst:"1 week",
    monthlyPotential:"₹5,000–₹20,000",
    hoursNeeded:"1–2 hrs/day",
    capitalNeeded:"₹0",
    difficulty:"Beginner",
    skillsNeeded:["Fluency in 2+ languages (English + any Indian language)","Good typing speed (30+ WPM)","Attention to detail"],
    platforms:["Upwork","Fiverr","Gengo","One Hour Translation","Rev.com (transcription)","Otter.ai partner","Pramukhime","IGNOU translation projects"],
    whatYouDo:"Translate documents, websites, apps, legal papers, medical reports, and marketing content between English and Indian regional languages (Hindi, Telugu, Tamil, Kannada, Marathi, Gujarati, Bengali, etc.). Or transcribe audio/video recordings into text.",
    incomeBreakdown:[
      {task:"Translation (per 1,000 words, EN↔Hindi)",rate:"₹500–₹2,000",time:"1–2 hrs"},
      {task:"Legal/medical document translation",rate:"₹2–₹5 per word",time:"Variable"},
      {task:"Subtitle/caption translation (per min of video)",rate:"₹30–₹100/min",time:"3–4x video duration"},
      {task:"Audio transcription (per minute of audio)",rate:"₹15–₹60/min",time:"4–5x audio duration"},
      {task:"Website localization (per page)",rate:"₹1,000–₹5,000/page",time:"2–3 hrs"},
    ],
    steps:[
      {
        week:"Week 1", title:"Test, Set Up & Apply",
        actions:[
          "Take a free translation test on Upwork, Gengo (gengo.com), and Fiverr. These platforms have quality tests — passing them gives you a 'Tested' badge that immediately increases hire rates.",
          "Apply to Rev.com for transcription work (accepts Indian applicants). Rev pays $0.45–$1.10/minute of audio. 2 hours/day of transcription = $10–$20/day = ₹800–₹1,650/day.",
          "Create a Fiverr gig: 'I will translate 500 words from English to [Language] in 24 hours for ₹300'. For transcription: 'I will transcribe 10 minutes of clear audio for ₹400'.",
          "List on Upwork: create a translator/transcriptionist profile. Language pair is your product — be specific: 'English to Telugu Medical Document Translator'. Niche profiles get shortlisted faster."
        ]
      },
      {
        week:"Week 2–4", title:"Target High-Value Translation Niches",
        actions:[
          "Legal translation (contracts, affidavits, court documents) and medical translation (patient reports, clinical trials) pay 3–5x general translation rates. Study basic legal/medical vocabulary for your language pair.",
          "Contact law firms and hospitals in your city directly. Email: 'I provide certified English ↔ [Language] translation for legal and medical documents. Turnaround: 24 hours. Rate: ₹2/word. Do you have occasional translation needs?'",
          "Contact content agencies (ContentMart, Pepper Content, WriterAccess) — they all need regional language translators and pay per word on recurring projects.",
          "Government translation demand: IGNOU, state government offices, and courts regularly need certified translators. Contact your district court translator registration office for empanelment."
        ]
      },
      {
        week:"Week 4–8", title:"Build Recurring Clients",
        actions:[
          "Target app developers and SaaS companies: they need their interface text translated into regional languages for Bharat market expansion. One app translation project = 5,000–20,000 words = ₹5,000–₹40,000.",
          "Subtitle translation: approach small YouTube channels who want Hindi subtitles on English content (or vice versa). ₹30–₹60/minute of video. A 10-minute video = ₹300–₹600 per video, 2–3 hrs work.",
          "Create a simple rate card PDF: list your language pairs, document types handled, rates, turnaround time, payment methods. Share this whenever you pitch a client — it signals professionalism.",
          "Collect samples: for each type of document you translate (legal, medical, technical, marketing), keep an anonymized sample in your portfolio. Show clients a before-and-after of a translation."
        ]
      },
      {
        week:"Month 2–4", title:"Scale with Volume",
        actions:[
          "On Rev, experienced transcriptionists handle 2–3 hours of audio daily earning $20–$40/day = ₹1,650–₹3,300/day. Scale time on platform as you build speed.",
          "Register as a translation vendor with localization companies: Lionbridge, TransPerfect, Moravia, Translations.com — all hire Indian language translators as freelancers. Apply at their vendor portals.",
          "Build a translation memory using free tool OmegaT: it saves previously translated phrases and auto-suggests them for similar future text. This increases your speed 30–40% over time.",
          "Partner with other translators for different language pairs — if you do English-Telugu, partner with an English-Kannada translator. Refer work to each other and take a 10% coordination fee."
        ]
      }
    ],
    milestone:"5K target: 10,000 words/month of English-Hindi translation at ₹0.50/word = ₹5,000. Or 100 minutes/month of audio transcription at ₹50/minute = ₹5,000. Both achievable in 2–3 weeks.",
    proTip:"The highest-paying translation work in India: clinical trial and pharmaceutical translation. Pharmaceutical companies need patient consent forms, protocols, and questionnaires translated into regional languages. Rates: ₹3–₹8/word. One project = ₹15,000–₹60,000. Find these through CRO (Contract Research Organisation) websites."
  },

  {
    id:"bookkeeping", icon:"📊", cat:"Finance & Accounts",
    title:"Bookkeeping & Accounts Assistance",
    tagline:"Every business must maintain accounts. Most small ones do it badly or not at all.",
    color:"#F59E0B", dim:"#1F1404", textCol:"#FCD34D",
    timeToFirst:"2–3 weeks",
    monthlyPotential:"₹8,000–₹40,000",
    hoursNeeded:"1–2 hrs/day",
    capitalNeeded:"₹0–₹2,000",
    difficulty:"Intermediate",
    skillsNeeded:["Basic commerce/accounts knowledge (Class 11–12 level)","Tally or Excel proficiency","GST basics","Organized and accurate"],
    platforms:["Upwork","Fiverr","LinkedIn","Local small businesses","CA firms (as subcontractors)"],
    whatYouDo:"Maintain accounts, record daily transactions, reconcile bank statements, prepare GST returns, generate invoices, manage accounts payable/receivable, and create monthly P&L reports for small businesses and self-employed professionals who don't have a full-time accountant.",
    incomeBreakdown:[
      {task:"Monthly bookkeeping (small business, 50 txns)",rate:"₹2,000–₹6,000/mo",time:"1 hr/day"},
      {task:"GST return filing (GSTR-1 + GSTR-3B)",rate:"₹500–₹1,500/return",time:"1–2 hrs"},
      {task:"Invoice creation and tracking",rate:"₹1,000–₹3,000/mo",time:"30 min/day"},
      {task:"TDS filing",rate:"₹500–₹2,000/quarter",time:"2–3 hrs"},
      {task:"Annual accounts preparation for ITR",rate:"₹2,000–₹8,000",time:"4–8 hrs"},
    ],
    steps:[
      {
        week:"Week 1–2", title:"Build or Refresh Skills",
        actions:[
          "Download Tally ERP 9 free education version from tallysolutions.com. Watch the official Tally tutorial playlist on YouTube (15–20 videos, each 10–15 minutes). Learn: ledger creation, voucher entry, balance sheet generation.",
          "Learn GST return filing basics on the GSTN portal (gst.gov.in has free training videos). Understanding GSTR-1, GSTR-3B, and GSTR-2A reconciliation makes you immediately useful to any GST-registered business.",
          "Complete a free Tally certification (available on TallyAcademy.com — free for basic level). Add this certification to your Upwork and LinkedIn profile.",
          "If you know Excel: learn VLOOKUP, SUMIF, pivot tables. These are used heavily in basic bookkeeping for businesses that don't use Tally. YouTube has free courses in Hindi and English."
        ]
      },
      {
        week:"Week 2–3", title:"Target Small Businesses Locally",
        actions:[
          "Your best clients: shops, restaurants, small manufacturers, freelancers, and self-employed professionals (doctors, architects, coaches) who are GST registered but managing accounts themselves badly.",
          "Knock on doors of 10 local shops in your commercial area: 'I maintain accounts for small businesses — Tally entries, GST returns, monthly reports. Do you have an accountant? No? I can help for ₹2,500/month.' Simple and direct.",
          "Contact local CA firms: 'I have Tally and GST knowledge and can handle basic bookkeeping for your smaller clients as a subcontractor.' CAs often have more clients than bandwidth and will pay ₹5,000–₹15,000/month for competent help.",
          "Post on Sulekha.com and JustDial as 'Part-time Accountant / Bookkeeper, [Your City]'. These platforms drive local service inquiries and are free to list."
        ]
      },
      {
        week:"Week 3–8", title:"Deliver & Build Retainer Base",
        actions:[
          "Month 1 pricing: charge slightly below market (₹1,500–₹2,000/month for small client) to get your first 2 clients quickly. Once you have 2 positive testimonials, raise rates for all new clients.",
          "Deliver a monthly 'Business Health Report' even if the client doesn't ask for it — 1 page showing: revenue this month, expenses, net profit, GST liability, outstanding receivables. This report becomes why they can't leave you.",
          "Set up recurring reminders for every client's GST due dates, TDS dates, advance tax dates. Missing a client's filing date is the fastest way to lose them. Never miss a deadline.",
          "Use Zoho Books free tier (for businesses under ₹1.5 Cr revenue) — it integrates with GST portal and auto-generates GST returns. Offering this instead of Tally is a value-add for clients who want cloud access."
        ]
      },
      {
        week:"Month 2–4", title:"Scale to ₹15,000–₹25,000/month",
        actions:[
          "5 small business clients at ₹3,000/month each = ₹15,000. Each client = 30–45 min/day max for simple bookkeeping. This is manageable within your 1–2 hour window.",
          "Expand to ITR filing season (July–October): charge ₹2,000–₹5,000 per ITR for small businesses. With 10 existing clients, this adds ₹20,000–₹50,000 in one quarter.",
          "Learn GST audit assistance and e-invoicing — new compliance requirements businesses struggle with. Being the person who 'solves GST headaches' makes you indispensable.",
          "Subcontract to other bookkeepers once you have 8+ clients — you handle client relationships and quality, they handle data entry. You earn the margin. This is how you scale past your time limit."
        ]
      }
    ],
    milestone:"5K target: 2 clients at ₹2,500/month each = ₹5,000. Completely achievable in 3–4 weeks with 2–3 local small business clients.",
    proTip:"The fastest entry point: WhatsApp your existing network of self-employed contacts — doctors, architects, freelancers, small traders. 'I'm offering bookkeeping and GST filing for ₹2,000/month. Interested?' 1 in 10 will say yes. Your personal network trusts you before a stranger does."
  },

  {
    id:"consulting", icon:"💡", cat:"Professional Services",
    title:"Niche Consulting in Your Domain",
    tagline:"Your 10+ years of professional experience is a product someone will pay for today.",
    color:"#818CF8", dim:"#10102A", textCol:"#A5B4FC",
    timeToFirst:"2–4 weeks",
    monthlyPotential:"₹10,000–₹80,000",
    hoursNeeded:"1–2 hrs/day",
    capitalNeeded:"₹0–₹1,000",
    difficulty:"Intermediate–Advanced",
    skillsNeeded:["Deep expertise in any professional domain","Ability to diagnose problems and recommend solutions","Confident communication"],
    platforms:["LinkedIn","Clarity.fm","Upwork (consulting category)","Expert networks (GLG, Techsci, Third Bridge)","Your personal network"],
    whatYouDo:"Advise businesses, startups, or individuals on specific problems in your domain of expertise — whether that's HR, operations, marketing, finance, IT, manufacturing, supply chain, healthcare, or any professional field you've worked in for 5+ years. You charge for your brain, not your time doing the work.",
    incomeBreakdown:[
      {task:"1-hour strategy call with startup founder",rate:"₹2,000–₹10,000",time:"1 hr prep + 1 hr call"},
      {task:"Monthly advisory retainer (4 calls/month)",rate:"₹8,000–₹30,000/mo",time:"4–6 hrs/month"},
      {task:"Business plan / strategy document review",rate:"₹3,000–₹15,000",time:"2–4 hrs"},
      {task:"Expert network call (GLG, Techsci)",rate:"$100–$400/hr",time:"1 hr"},
      {task:"LinkedIn consulting (DM responses)",rate:"₹1,000–₹5,000/hr",time:"1 hr"},
    ],
    steps:[
      {
        week:"Week 1–2", title:"Define Your Consulting Offer",
        actions:[
          "Write down: what specific problem can you solve for businesses using your professional experience? Be hyper-specific. Not 'HR consulting' but 'I help manufacturing SMEs reduce employee attrition from 30% to below 15% using structured onboarding and retention policies.' Specificity is credibility.",
          "Identify your target client: startup founder, SME owner, corporate team lead, new entrepreneur. The more specific your client avatar, the easier it is to find and convert them.",
          "Create a simple 'Consulting Offer' document (1 page, Canva or Word): Problem you solve, Who you help, What you offer (strategy call, monthly advisory, project-based), Price, Your background. This is your sales document.",
          "Register on Clarity.fm — a marketplace where professionals charge per minute for phone advice. Set your rate at ₹10–₹15/minute ($0.12–$0.18). You'll earn from global professionals seeking Indian market expertise."
        ]
      },
      {
        week:"Week 2–3", title:"Build LinkedIn Credibility",
        actions:[
          "Update LinkedIn headline: 'Helping [Target Client] solve [Problem] | 10 years in [Industry] | Consultant'. This immediately signals consulting availability to your network.",
          "Post 3 times per week on LinkedIn — not career updates, but insights from your domain: '3 reasons manufacturing SMEs lose good employees in year 1' or '5 things I wish I knew about GST when running a small business'. This is your credibility-building content.",
          "Write a LinkedIn article (long-form): 'How I solved [specific problem] at [company/situation without naming them]'. Articles rank on Google and establish authority beyond your existing network.",
          "Send 10 LinkedIn connection requests/day to startup founders, SME owners, and professionals in your target industry. Personalize each message: 'I help [industry type] businesses with [your expertise]. Would love to connect.'"
        ]
      },
      {
        week:"Week 3–6", title:"Land First Paying Clients",
        actions:[
          "Offer a 'Discovery Call' framing: 'Free 30-minute call to understand your challenge. If I can help, I'll tell you exactly how. No pressure.' This converts much better than leading with a fee.",
          "After the free call, present a simple proposal: 'Based on our call, I can help you [specific outcome] over [timeframe] through [monthly advisory calls/a strategy document/workshops]. Investment: ₹[X]/month.'",
          "Register with expert networks: GLG (GLG.it), Techsci Research, Third Bridge, and Guidepoint. These connect you to corporations doing market research who pay $100–$400/hr for 1-hour expert calls. Apply at each portal.",
          "Ask your professional contacts directly: 'I've started advising businesses on [your domain]. Do you know any startup founders or business owners who struggle with this?' Warm referrals convert 5x better than cold outreach."
        ]
      },
      {
        week:"Month 2–5", title:"Systematize & Scale Revenue",
        actions:[
          "Create a productized consulting offer: 'The [Your Specialty] 90-Day Transformation — 3 months, bi-weekly calls, specific deliverables, outcome guarantee. ₹25,000 total.' Defined scope = higher closing rate than open-ended advisory.",
          "Package your knowledge: create a consulting framework document, a checklist, a diagnostic tool. Clients pay for frameworks, not just conversation. 'Our 12-point [Domain] Audit' sounds more valuable than 'I'll review your setup'.",
          "Speak at local startup events, MSME forums, chamber of commerce meetings. Speaking builds credibility faster than any other medium. One 20-minute talk typically generates 3–5 consulting inquiries.",
          "Create a paid workshop (2–3 hours, ₹1,500–₹3,000/attendee, 10–20 attendees) on a specific problem you solve. A workshop with 15 attendees at ₹2,000 = ₹30,000 in a single evening. Platforms: Zoom, Eventbrite, Townscript."
        ]
      }
    ],
    milestone:"5K target: 1 advisory retainer client at ₹5,000/month for 4 strategy calls. Or 2 discovery-to-consulting conversions at ₹2,500 each. Your professional network is already full of potential first clients.",
    proTip:"The fastest ₹10,000/month path for experienced professionals: register on GLG.it and Techsci as an industry expert. These platforms pay $150–$400 for a single 1-hour call about your industry. 2 calls/month = $300–$800 = ₹25,000–₹66,000. Application: go to their website, submit your LinkedIn profile as an expert application."
  }
];

const CATEGORY_COLORS = {
  "Writing & Content": "#E8A320",
  "Digital Marketing": "#A78BFA",
  "Education": "#22C55E",
  "Admin & Operations": "#60A5FA",
  "Design": "#F472B6",
  "Media & Content": "#F97316",
  "Language": "#34D399",
  "Finance & Accounts": "#F59E0B",
  "Professional Services": "#818CF8",
};

function Badge({ children, color }) {
  return (
    <span className="mono" style={{
      fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 3, fontWeight: 500,
      background: color + "22", color: color, border: `1px solid ${color}44`
    }}>{children}</span>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{ background: "#181818", border: "1px solid #2A2A2A", borderRadius: 4, padding: "10px 14px", flex: 1 }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: 4 }}>{label}</div>
      <div className="syne" style={{ fontSize: 13, fontWeight: 600, color: color || "#F0EDE8" }}>{value}</div>
    </div>
  );
}

function HustleDetail({ h, onBack }) {
  const [openStep, setOpenStep] = useState(0);
  return (
    <div className="fade">
      <button onClick={onBack} className="syne" style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12, letterSpacing: "0.08em", padding: "0 0 20px", display: "flex", alignItems: "center", gap: 6 }}>
        ← BACK TO ALL OPTIONS
      </button>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${h.dim} 0%, #111 100%)`, border: `1px solid ${h.color}33`, borderRadius: 8, padding: "28px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          <span style={{ fontSize: 36 }}>{h.icon}</span>
          <div>
            <div style={{ marginBottom: 6 }}><Badge color={h.color}>{h.cat}</Badge></div>
            <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, color: "#F0EDE8", lineHeight: 1.2, marginBottom: 4 }}>{h.title}</h2>
            <p className="serif" style={{ fontSize: 15, color: "#999", fontStyle: "italic" }}>{h.tagline}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            ["Time to First ₹", h.timeToFirst],
            ["Monthly Potential", h.monthlyPotential],
            ["Hours/Day", h.hoursNeeded],
            ["Capital Needed", h.capitalNeeded],
            ["Difficulty", h.difficulty],
          ].map(([l, v]) => <StatPill key={l} label={l} value={v} color={h.textCol} />)}
        </div>
      </div>

      {/* What you do */}
      <div style={{ border: "1px solid #2A2A2A", borderRadius: 6, padding: "16px 18px", background: "#111", marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", marginBottom: 8 }}>What You Actually Do</div>
        <p className="serif" style={{ fontSize: 15, color: "#C8C4BC", lineHeight: 1.7 }}>{h.whatYouDo}</p>
      </div>

      {/* Skills needed */}
      <div style={{ border: "1px solid #2A2A2A", borderRadius: 6, padding: "16px 18px", background: "#111", marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", marginBottom: 10 }}>Skills You Need (Be Honest)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {h.skillsNeeded.map(s => (
            <span key={s} className="serif" style={{ fontSize: 13, background: "#181818", border: "1px solid #333", borderRadius: 4, padding: "4px 10px", color: "#A0A0A0" }}>✓ {s}</span>
          ))}
        </div>
      </div>

      {/* Income breakdown */}
      <div style={{ border: "1px solid #2A2A2A", borderRadius: 6, overflow: "hidden", marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", padding: "12px 18px", borderBottom: "1px solid #2A2A2A", background: "#151515" }}>Income Breakdown — What Each Task Pays</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#141414" }}>
              {["Task", "Rate (₹)", "Time"].map(h2 => (
                <th key={h2} className="mono" style={{ textAlign: "left", padding: "8px 14px", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", borderBottom: "1px solid #222", fontWeight: 500 }}>{h2}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {h.incomeBreakdown.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1E1E1E" }}>
                <td className="serif" style={{ padding: "10px 14px", color: "#C8C4BC", fontSize: 13 }}>{r.task}</td>
                <td className="mono" style={{ padding: "10px 14px", color: h.textCol, fontSize: 12, fontWeight: 500 }}>{r.rate}</td>
                <td className="mono" style={{ padding: "10px 14px", color: "#555", fontSize: 11 }}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Step by step guide */}
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", marginBottom: 10 }}>Step-by-Step Guide — From Zero to ₹5,000–₹10,000/month</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {h.steps.map((s, i) => (
          <div key={i} style={{ border: `1px solid ${openStep === i ? h.color + "55" : "#2A2A2A"}`, borderRadius: 6, overflow: "hidden", transition: "border-color 0.2s" }}>
            <div onClick={() => setOpenStep(openStep === i ? -1 : i)}
              style={{ padding: "14px 18px", background: openStep === i ? h.dim : "#111", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "background 0.2s" }}>
              <div className="mono" style={{ width: 22, height: 22, borderRadius: "50%", background: openStep === i ? h.color : "#222", color: openStep === i ? "#0A0A0A" : "#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, transition: "all 0.2s" }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: openStep === i ? h.textCol : "#555", marginBottom: 2 }}>{s.week}</div>
                <div className="syne" style={{ fontSize: 14, fontWeight: 600, color: openStep === i ? "#F0EDE8" : "#888" }}>{s.title}</div>
              </div>
              <span style={{ color: "#444", fontSize: 14, transform: openStep === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
            </div>
            {openStep === i && (
              <div style={{ padding: "16px 18px 18px", background: "#0D0D0D", borderTop: `1px solid ${h.color}33` }} className="fade">
                {s.actions.map((a, ai) => (
                  <div key={ai} style={{ display: "flex", gap: 12, marginBottom: ai < s.actions.length - 1 ? 14 : 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: h.color, flexShrink: 0, marginTop: 9 }} />
                    <p className="serif" style={{ fontSize: 14, color: "#B8B4AC", lineHeight: 1.72 }}>{a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Milestone */}
      <div style={{ background: h.dim, border: `1px solid ${h.color}44`, borderRadius: 6, padding: "16px 18px", marginBottom: 12 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: h.color, marginBottom: 6 }}>🎯 5K Target Milestone</div>
        <p className="serif" style={{ fontSize: 14, color: h.textCol, lineHeight: 1.65 }}>{h.milestone}</p>
      </div>

      {/* Pro tip */}
      <div style={{ background: "#0F0F0F", border: "1px solid #2A2A2A", borderLeft: `4px solid ${h.color}`, borderRadius: "0 6px 6px 0", padding: "14px 18px" }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>⚡ Pro Insight</div>
        <p className="serif" style={{ fontSize: 14, color: "#A0A0A0", lineHeight: 1.68 }}>{h.proTip}</p>
      </div>

      {/* Platforms */}
      <div style={{ marginTop: 14 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#555", marginBottom: 8 }}>Platforms & Where to Find Clients</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {h.platforms.map(p => (
            <span key={p} className="mono" style={{ fontSize: 10, background: "#161616", border: "1px solid #2A2A2A", borderRadius: 4, padding: "4px 10px", color: "#777" }}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServiceHustleGuide() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [checks, setChecks] = useState(Array(HUSTLES.length).fill(false));

  const cats = ["All", ...Array.from(new Set(HUSTLES.map(h => h.cat)))];
  const filtered = filter === "All" ? HUSTLES : HUSTLES.filter(h => h.cat === filter);

  if (selected !== null) return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", padding: "28px 24px 60px" }}>
      <style>{CSS}</style>
      <HustleDetail h={HUSTLES[selected]} onBack={() => setSelected(null)} />
    </div>
  );

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "#F0EDE8", fontFamily: "'Instrument Serif', Georgia, serif" }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background: "#0A0A0A", borderBottom: "1px solid #1E1E1E", padding: "40px 28px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,163,32,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#444", marginBottom: 14 }}>
          Service-Based Micro Business Guide · India · 1–2 Hours/Day
        </div>
        <h1 className="syne" style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.15, marginBottom: 10, color: "#F0EDE8" }}>
          Earn ₹5,000–₹10,000/Month<br />
          <span style={{ color: "#E8A320" }}>with Just 1–2 Hours Daily</span>
        </h1>
        <p className="serif" style={{ fontSize: 16, color: "#666", lineHeight: 1.6, maxWidth: 520, marginBottom: 24, fontStyle: "italic" }}>
          9 service-based businesses you can start from zero, in India, this week — each requiring no capital, no office, and at most 2 hours per day alongside a full-time job.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            ["₹0–₹3K", "Capital to Start"],
            ["1–2 hrs", "Daily Time"],
            ["4–8 weeks", "Avg. Time to First ₹5K"],
            ["9 Options", "Across 6 Categories"],
          ].map(([v, l]) => (
            <div key={l} style={{ background: "#111", border: "1px solid #222", borderRadius: 4, padding: "10px 14px" }}>
              <div className="syne" style={{ fontSize: 15, fontWeight: 700, color: "#E8A320" }}>{v}</div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ borderBottom: "1px solid #1A1A1A", padding: "0 28px", display: "flex", gap: 0, overflowX: "auto" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} className="mono"
            style={{ background: "none", border: "none", borderBottom: filter === c ? "2px solid #E8A320" : "2px solid transparent", padding: "12px 16px", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: filter === c ? "#E8A320" : "#444", cursor: "pointer", whiteSpace: "nowrap", marginBottom: -1, transition: "all 0.15s" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ padding: "24px 24px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
        {filtered.map((h) => {
          const idx = HUSTLES.indexOf(h);
          return (
            <div key={h.id} onClick={() => setSelected(idx)} className="card-hover"
              style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: "18px 18px 16px", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 26 }}>{h.icon}</span>
                <Badge color={h.color}>{h.cat}</Badge>
              </div>
              <h3 className="syne" style={{ fontSize: 14, fontWeight: 700, color: "#F0EDE8", lineHeight: 1.3, marginBottom: 4 }}>{h.title}</h3>
              <p className="serif" style={{ fontSize: 12, color: "#555", fontStyle: "italic", lineHeight: 1.5, marginBottom: 14 }}>{h.tagline}</p>
              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                <span className="mono" style={{ fontSize: 9, color: "#444", background: "#161616", border: "1px solid #222", borderRadius: 3, padding: "2px 7px" }}>⏱ {h.hoursNeeded}</span>
                <span className="mono" style={{ fontSize: 9, color: "#444", background: "#161616", border: "1px solid #222", borderRadius: 3, padding: "2px 7px" }}>💰 {h.capitalNeeded}</span>
                <span className="mono" style={{ fontSize: 9, color: "#444", background: "#161616", border: "1px solid #222", borderRadius: 3, padding: "2px 7px" }}>🚀 {h.timeToFirst}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="syne" style={{ fontSize: 13, fontWeight: 700, color: h.textCol }}>{h.monthlyPotential}/mo</span>
                <span className="mono" style={{ fontSize: 9, color: "#444", letterSpacing: "0.1em" }}>EXPLORE →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <div style={{ margin: "0 24px 40px", padding: "18px 20px", background: "#111", border: "1px solid #1E1E1E", borderRadius: 6 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#444", marginBottom: 8 }}>How to Pick Your Option</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            ["If you can write well →", "Freelance Writing or Consulting"],
            ["If you know any subject well →", "Online Tutoring"],
            ["If you speak 2+ languages →", "Translation & Transcription"],
            ["If you're organized →", "Virtual Assistant Services"],
            ["If you're visually creative →", "Graphic Design or Video Editing"],
            ["If you have domain expertise →", "Niche Consulting or Bookkeeping"],
          ].map(([if_, then]) => (
            <div key={if_} style={{ display: "flex", gap: 8 }}>
              <span className="serif" style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>{if_}</span>
              <span className="syne" style={{ fontSize: 13, color: "#E8A320", fontWeight: 600 }}>{then}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}