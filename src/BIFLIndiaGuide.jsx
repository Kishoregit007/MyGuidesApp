import { useState } from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  ink: "#18120e",
  cream: "#f6f2eb",
  rust: "#b84c2a",
  rustPale: "#f0ddd7",
  gold: "#b8882a",
  goldPale: "#f0e6c8",
  forest: "#2b4535",
  forestPale: "#d4e4da",
  stone: "#796e62",
  stoneLight: "#e8e3db",
  white: "#ffffff",
};
const shadow = "0 2px 12px rgba(24,18,14,0.08)";
const shadowHover = "0 6px 28px rgba(24,18,14,0.12)";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_TABS = [
  { id: "kitchen",    label: "🍳 Kitchen" },
  { id: "apparel",    label: "👕 Apparel" },
  { id: "footwear",   label: "👟 Footwear" },
  { id: "tools",      label: "🔧 Tools" },
  { id: "furniture",  label: "🪑 Furniture" },
  { id: "watches",    label: "⌚ Watches" },
  { id: "bags",       label: "🎒 Bags" },
  { id: "fitness",    label: "🏋️ Fitness" },
  { id: "badminton",  label: "🏸 Badminton" },
  { id: "desk",       label: "🖥️ Desk / EDC" },
  { id: "guide",      label: "📖 BIFL Rules" },
];

const TOOLS_TABLE = [
  { tool: "Pliers / Spanners Set",  brand: "Taparia (India)",      why: "Chrome-vanadium, drop-forged, ISI certified",         price: "₹200 – ₹1,500",   life: "30+ years",    url: "https://www.amazon.in/s?k=taparia+tools",           urlLabel: "Amazon ↗" },
  { tool: "Screwdriver Set",        brand: "Stanley Fatmax",        why: "Hardened tip, comfort grip, CrV steel",               price: "₹800 – ₹2,500",   life: "Lifetime",     url: "https://www.amazon.in/s?k=stanley+fatmax+screwdriver", urlLabel: "Amazon ↗" },
  { tool: "Multi-Tool",             brand: "Leatherman Wave+",      why: "25-year warranty, 420HC stainless, all tools lock",   price: "₹7,000 – ₹12,000", life: "25yr warranty", url: "https://www.amazon.in/s?k=leatherman+wave+plus",    urlLabel: "Amazon ↗" },
  { tool: "Hammer (Ball Peen)",     brand: "Taparia 800g",          why: "Drop-forged, heat-treated, fibreglass handle",        price: "₹300 – ₹800",     life: "Lifetime",     url: "https://www.amazon.in/s?k=taparia+hammer",          urlLabel: "Amazon ↗" },
  { tool: "Cordless Drill",         brand: "Bosch GSR 120-LI",      why: "Brushless motor, Indian service centres nationwide",  price: "₹5,500 – ₹12,000", life: "15–20 years", url: "https://www.amazon.in/s?k=bosch+gsr+120+li",        urlLabel: "Amazon ↗" },
  { tool: "Measuring Tape",         brand: "Stanley PowerLock 5m",  why: "Mylar coating, blade lock, 25yr history",             price: "₹400 – ₹900",     life: "15–20 years",  url: "https://www.amazon.in/s?k=stanley+powerlock+5m",    urlLabel: "Amazon ↗" },
];

const PRINCIPLES = [
  { num: "01", title: "Material Over Brand",   text: "Cast iron, full-grain leather, borosilicate glass, 18/8 stainless steel — these outlast any brand. A local sheesham carpenter beats any branded MDF showroom." },
  { num: "02", title: "Repairability Test",    text: "Before buying: can you get spare parts? Is there a service centre in Hyderabad? Can a local craftsman fix it? No to all three = not BIFL." },
  { num: "03", title: "Cost Per Use",          text: "Price ÷ (years × uses/year). A ₹15,000 knife used daily for 30 years = ₹1.37/day. A ₹500 knife replaced every 2 years × 15 = ₹7,500 spent." },
  { num: "04", title: "Dumb Over Smart",       text: "Smart appliances with apps become obsolete when the server shuts down. A mechanical pressure cooker has zero software. It will work in 2080." },
  { num: "05", title: "Service Network",       text: "The best German tool is useless if no one services it in Hyderabad. Sujata, Taparia, Hawkins, Godrej all pass this test. Many imports don't." },
  { num: "06", title: "Buy Secondhand",        text: "Old Godrej almirahs, 1980s Seiko automatics, vintage cast iron — already proven. OLX and Sunday markets are BIFL goldmines at 20% of new price." },
];

// ─── Reusable Sub-components ──────────────────────────────────────────────────

function SectionHead({ eyebrow, title, desc }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.rust, marginBottom: 8 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,5vw,38px)", fontWeight: 700, color: C.ink }}>{title}</h2>
      <p style={{ color: C.stone, fontSize: 14.5, marginTop: 8, maxWidth: 660 }}>{desc}</p>
    </div>
  );
}

function Badge({ type, label }) {
  const colors = {
    bifl:     { bg: C.rust,    color: "#fff" },
    premium:  { bg: C.gold,    color: C.ink  },
    heritage: { bg: C.forest,  color: "#fff" },
    new:      { bg: "#4285f4", color: "#fff" },
    sport:    { bg: "#7b4ca5", color: "#fff" },
  };
  const s = colors[type] || colors.bifl;
  return (
    <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, padding: "2px 7px", borderRadius: 1, background: s.bg, color: s.color, marginRight: 4 }}>
      {label}
    </span>
  );
}

function MetaRow({ label, value, type }) {
  const valColor = type === "price" ? C.rust : type === "life" ? C.forest : C.ink;
  const valFont  = type === "price" ? "monospace" : "inherit";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", borderTop: `1px solid ${C.stoneLight}`, fontSize: 12.5 }}>
      <span style={{ color: C.stone, fontWeight: 500 }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: "right", maxWidth: "62%", fontSize: 12, color: valColor, fontFamily: valFont }}>{value}</span>
    </div>
  );
}

function BuyLink({ href, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ fontSize: 11, padding: "4px 10px", border: `1px solid ${hovered ? C.forest : C.stoneLight}`, borderRadius: 1, color: hovered ? C.white : C.forest, background: hovered ? C.forest : C.white, fontWeight: 500, textDecoration: "none", transition: "all 0.15s", display: "inline-block" }}
    >
      {label}
    </a>
  );
}

function SrcAttr({ color, text }) {
  return (
    <div style={{ fontSize: 10, color: C.stone, marginTop: 8, fontStyle: "italic", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
      <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {text}
    </div>
  );
}

function Card({ src = "claude", icon, badges, name, desc, rows, buyLabel, links, srcAttr, expandContent, children }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const borderColor = src === "both" ? C.gold : src === "gemini" ? "#4285f4" : C.rust;

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: C.white, border: `1px solid ${C.stoneLight}`, borderLeft: `3px solid ${borderColor}`, borderRadius: 2, overflow: "hidden", boxShadow: hovered ? shadowHover : shadow, transition: "box-shadow 0.2s", display: "flex", flexDirection: "column" }}
    >
      {/* Head */}
      <div style={{ padding: "18px 18px 0", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
            {badges.map((b, i) => <Badge key={i} type={b.type} label={b.label} />)}
          </div>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 700, lineHeight: 1.25, color: C.ink }}>{name}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 18px", flex: 1 }}>
        <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: desc }} />
        {rows && (
          <div style={{ marginTop: 12 }}>
            {rows.map((r, i) => <MetaRow key={i} label={r.label} value={r.value} type={r.type} />)}
          </div>
        )}
        {children}
      </div>

      {/* Footer */}
      <div style={{ padding: "11px 18px", background: C.cream, borderTop: `1px solid ${C.stoneLight}` }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, color: C.stone, marginBottom: 6 }}>{buyLabel || "Buy Direct"}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {links.map((l, i) => <BuyLink key={i} href={l.href} label={l.label} />)}
        </div>
        {srcAttr && <SrcAttr color={srcAttr.color} text={srcAttr.text} />}
      </div>

      {/* Expandable */}
      {expandContent && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: "none", border: `1px solid ${C.stoneLight}`, padding: "8px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, color: C.ink, margin: "10px 18px 0", borderRadius: 1, fontFamily: "inherit" }}
          >
            <span>Why Sujata beats Preethi</span>
            <span style={{ transition: "transform 0.2s", display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
          </button>
          {expanded && (
            <div style={{ margin: "8px 18px 14px", background: C.cream, padding: 14, fontSize: 12.5, lineHeight: 1.8, color: "#555", borderRadius: 1 }}
              dangerouslySetInnerHTML={{ __html: expandContent }} />
          )}
        </>
      )}
    </div>
  );
}

function CardGrid({ children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 18 }}>
      {children}
    </div>
  );
}

function WarnBox({ children, style = {} }) {
  return (
    <div style={{ background: "#fffbf0", border: `1px solid ${C.gold}`, borderLeft: `4px solid ${C.gold}`, padding: "14px 18px", borderRadius: 1, margin: "20px 0", fontSize: 13.5, color: "#5a4510", ...style }}>
      {children}
    </div>
  );
}

function UpgradeNote({ children }) {
  return (
    <div style={{ background: "linear-gradient(135deg,#f0f7f3,#e8f3ed)", border: `1px solid #b0d0bc`, borderLeft: `4px solid ${C.forest}`, padding: "14px 18px", borderRadius: 1, margin: "20px 0", fontSize: 13.5, color: C.forest }}>
      {children}
    </div>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────

function KitchenSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 01" title="Kitchen & Cookware" desc="The highest BIFL ROI category. Correct once, done for 50 years. Key upgrade: Sujata Dynamix replaces Preethi as the true BIFL mixer. Stahl tri-ply added for serious cooks." />
      <UpgradeNote>
        <strong>✅ Upgrade from v1:</strong> Sujata Dynamix is now the BIFL mixer pick. Its 900W double ball-bearing motor runs 90 minutes non-stop — Preethi cannot match this. Stahl Artisan tri-ply is added for those who want premium SS cookware over cast iron.
      </UpgradeNote>
      <CardGrid>
        <Card src="both" icon="🍳" badges={[{ type: "bifl", label: "True BIFL" }]} name="Cast Iron Cookware — Indus Valley"
          desc="Pre-seasoned kadai and tawa designed for Indian cooking. Gets naturally non-stick with every use. Full iron body: no coatings to flake, no planned obsolescence. Improves for generations."
          rows={[{ label: "Top Pick", value: "Pre-Seasoned Kadai 2.5L" }, { label: "Price", value: "₹1,200 – ₹3,000", type: "price" }, { label: "Lifespan", value: "50–100+ years", type: "life" }]}
          links={[{ href: "https://www.theindusvalley.in", label: "TheIndusValley.in ↗" }, { href: "https://www.amazon.in/s?k=indus+valley+cast+iron", label: "Amazon India ↗" }]}
          srcAttr={{ color: C.gold, text: "Recommended by both Claude & Gemini" }} />

        <Card src="gemini" icon="🥘" badges={[{ type: "bifl", label: "True BIFL" }, { type: "new", label: "Gemini Pick" }]} name="Stahl Artisan Tri-Ply SS Cookware"
          desc="India's best tri-ply brand. The aluminium core runs all the way up the sides — no burning at edges. For those who prefer stainless steel over cast iron. Warp-proof, dishwasher safe."
          rows={[{ label: "Budget Pick", value: "Vinod Platinum ₹1,500–₹3,500" }, { label: "Best Pick", value: "Stahl Artisan ₹2,500–₹5,500", type: "price" }, { label: "Lifespan", value: "30–40 years", type: "life" }]}
          links={[{ href: "https://www.stahlkitchens.com", label: "StahlKitchens.com ↗" }, { href: "https://www.amazon.in/s?k=stahl+artisan+triply", label: "Amazon India ↗" }]}
          srcAttr={{ color: "#4285f4", text: "Gemini's unique find — added to this guide" }} />

        <Card src="both" icon="⚡" badges={[{ type: "bifl", label: "True BIFL" }, { type: "new", label: "Upgraded Pick" }]} name="Sujata Dynamix Mixer Grinder"
          desc="The definitive Indian BIFL mixer. 900W double ball-bearing motor runs 90 minutes non-stop without overheating. In production for 45 years. Spare parts available nationally — like old Maruti 800."
          rows={[{ label: "Model", value: "Dynamix 900W (3 jars)" }, { label: "Price", value: "₹5,500 – ₹7,000", type: "price" }, { label: "Motor Life", value: "25–30+ years", type: "life" }, { label: "Note", value: "Replaces Preethi in our guide" }]}
          links={[{ href: "https://www.amazon.in/Sujata-Dynamix-900-Watt-Mixer-Grinder/dp/B078JT7LTD", label: "Amazon India ↗" }, { href: "https://sujataappliances.com", label: "Sujata Official ↗" }, { href: "https://www.croma.com/search/?q=sujata+dynamix", label: "Croma ↗" }]}
          srcAttr={{ color: C.gold, text: "Gemini flagged this; confirmed correct. Upgraded from Preethi." }}
          expandContent="🏆 <b>Motor:</b> Sujata uses double ball-bearing motor (commercial grade). Preethi uses single bearing.<br>⏱️ <b>Runtime:</b> Sujata: 90 min continuous. Preethi: 3–5 min before mandatory rest.<br>🔧 <b>Parts:</b> Sujata parts available offline in most cities.<br>📅 <b>Heritage:</b> 45 years in production with same core design." />

        <Card src="both" icon="🥘" badges={[{ type: "bifl", label: "True BIFL" }]} name="Hawkins Contura Pressure Cooker (SS)"
          desc="Stainless steel body, replaceable gasket and whistle. Hawkins has supplied spare parts for every model made since the 1970s. The only cookware that may outlast the cast iron."
          rows={[{ label: "Price", value: "₹1,200 – ₹4,000", type: "price" }, { label: "Gasket Replacement", value: "₹80 every 2–3 yrs" }, { label: "Body Life", value: "20–30 years", type: "life" }]}
          links={[{ href: "https://www.hawkinsindia.com", label: "HawkinsIndia.com ↗" }, { href: "https://www.amazon.in/s?k=hawkins+contura+stainless", label: "Amazon India ↗" }]} />

        <Card src="claude" icon="🔪" badges={[{ type: "bifl", label: "True BIFL" }]} name="Victorinox Fibrox Chef's Knife"
          desc="High-carbon stainless steel, professionally rated. Used in hotel kitchens globally. Sharpened indefinitely. One knife replaces a drawer of cheap blades."
          rows={[{ label: "Model", value: "Fibrox Pro 20cm" }, { label: "Price", value: "₹2,500 – ₹4,500", type: "price" }, { label: "Premium Step-up", value: "Wüsthof Classic ₹15,000+" }, { label: "Lifespan", value: "Lifetime (with sharpening)", type: "life" }]}
          links={[{ href: "https://www.amazon.in/s?k=victorinox+fibrox+chef+knife", label: "Amazon India ↗" }, { href: "https://www.victorinox.com/in/en/", label: "Victorinox India ↗" }]} />

        <Card src="claude" icon="🫙" badges={[{ type: "heritage", label: "Heritage India" }]} name="Borosil Glass Jars, Bottles & Cookware"
          desc="Borosilicate glass — no leaching, thermal shock resistant, 60 years in Indian labs and kitchens. Microwave safe, dishwasher safe. Bottles, mixing bowls, bakeware — all last 20+ years."
          rows={[{ label: "Price Range", value: "₹250 – ₹2,000", type: "price" }, { label: "Lifespan", value: "20+ years", type: "life" }]}
          links={[{ href: "https://www.borosil.com", label: "Borosil.com ↗" }, { href: "https://www.amazon.in/s?k=borosil+glass", label: "Amazon India ↗" }]} />
      </CardGrid>
    </div>
  );
}

function ApparelSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 02" title="Clothing & Apparel" desc="Natural fibres age beautifully. Synthetics pill, fade, and end in landfill. Gemini found two outstanding India-specific brands not in the original guide." />
      <CardGrid>
        <Card src="gemini" icon="👖" badges={[{ type: "bifl", label: "True BIFL" }, { type: "new", label: "Gemini Find" }]} name="Korra Jeans — Raw Selvedge Denim"
          desc="Delhi-based. Each pair is stitched by one tailor who signs it. Raw selvedge denim from Raymond + Italian Candiani mills using organic cotton. Molds to your body over 6–12 months. Includes a <strong>free lifetime repair service</strong> — the most BIFL policy in Indian fashion."
          rows={[{ label: "Price", value: "₹3,000 – ₹5,000", type: "price" }, { label: "Unique Feature", value: "Repair service + tailor signature" }, { label: "Lifespan", value: "10–15 years (repaired)", type: "life" }]}
          links={[{ href: "https://www.amazon.in/s?k=korra+jeans", label: "Amazon India ↗" }, { href: "https://www.myntra.com/korra-jeans", label: "Myntra ↗" }]}
          srcAttr={{ color: "#4285f4", text: "Gemini's best apparel find. Free repair service makes this genuinely BIFL." }} />

        <Card src="gemini" icon="👔" badges={[{ type: "bifl", label: "True BIFL" }, { type: "new", label: "Gemini Find" }]} name="Bombay Shirt Company — Custom Shirts"
          desc="Custom-fit shirts in Egyptian and premium cotton. The BIFL policy: <strong>free lifetime alterations</strong> — if your body changes, they resize the shirt. So you never throw it away. Hyderabad store at Jubilee Hills, Road No. 36."
          rows={[{ label: "Price", value: "₹2,200 – ₹4,500", type: "price" }, { label: "Hyderabad Store", value: "Jubilee Hills Road No. 36" }, { label: "BIFL Feature", value: "Free lifetime alterations", type: "life" }]}
          links={[{ href: "https://www.bombayshirts.com", label: "BombayShirts.com ↗" }]}
          srcAttr={{ color: "#4285f4", text: "Gemini find. Lifetime alterations = genuine BIFL service." }} />

        <Card src="gemini" icon="👕" badges={[{ type: "bifl", label: "True BIFL" }]} name="Uniqlo U Heavyweight T-Shirt"
          desc="Thick, dense cotton that doesn't lose shape after 100 washes. The 'U' collection is Uniqlo's quality line. At ₹990–₹1,290 — the best cost-per-use T-shirt available in India. Sarath City Mall, Hyderabad."
          rows={[{ label: "Price", value: "₹990 – ₹1,290", type: "price" }, { label: "Hyderabad", value: "Sarath City Capital Mall" }, { label: "Lifespan", value: "8–12 years", type: "life" }]}
          links={[{ href: "https://www.uniqlo.com/in/en/", label: "Uniqlo India ↗" }]} />

        <Card src="claude" icon="🧣" badges={[{ type: "heritage", label: "Heritage India" }]} name="Khadi / Handloom Cotton"
          desc="India's original BIFL textile. Gets softer with every wash. Chanderi, Ikat, or plain Khadi kurtas — 20 years old and still better than new. FabIndia carries curated handloom. Khadi Gramodyog is the purist's choice."
          rows={[{ label: "Price", value: "₹800 – ₹5,000", type: "price" }, { label: "Lifespan", value: "15–25 years", type: "life" }]}
          links={[{ href: "https://khadiindia.gov.in", label: "Khadi India ↗" }, { href: "https://www.fabindia.com", label: "FabIndia ↗" }]} />
      </CardGrid>
    </div>
  );
}

function FootwearSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 03" title="Footwear" desc="The BIFL test for shoes: can the sole be replaced by a local cobbler? Goodyear Welt construction (sole stitched, not glued) is the answer. Bridlen is India's hidden gem here." />
      <CardGrid>
        <Card src="gemini" icon="👞" badges={[{ type: "premium", label: "Premium BIFL" }, { type: "new", label: "Gemini Find" }]} name="Bridlen — Goodyear Welted Shoes (Made in India)"
          desc="India's first Goodyear-welted shoe brand. Chennai-made, Indo-Japanese collaboration. Uses leather from the world's top tanneries (Shinki Hikaku shell cordovan, Weinheimer). The welt is stitched directly into a channeled insole — stronger than standard GYW. Resoleable indefinitely by any cobbler."
          rows={[{ label: "Main Line", value: "₹29,000 – ₹36,000", type: "price" }, { label: "Founders Line", value: "₹36,000 – ₹56,000", type: "price" }, { label: "Construction", value: "Goodyear + hand-welt hybrid", type: "life" }, { label: "Lifespan", value: "20–30 years (resoled)", type: "life" }]}
          buyLabel="Buy Direct (Online Only)"
          links={[{ href: "https://bridlen.com", label: "Bridlen.com ↗" }]}
          srcAttr={{ color: "#4285f4", text: "Gemini's best footwear find. Most Indians don't know this brand exists." }} />

        <Card src="both" icon="💼" badges={[{ type: "heritage", label: "Heritage India" }]} name="Hidesign Full-Grain Leather (Bags & Belts)"
          desc="Pondicherry-made, vegetable-tanned full-grain leather. Develops a patina. Solid brass hardware. Stick to classic brown/tan bags and belts — avoid their fashion/synthetic ranges. A Hidesign bag from 2005 looks better today than when it was bought."
          rows={[{ label: "Belts", value: "₹1,500 – ₹2,500", type: "price" }, { label: "Bags", value: "₹8,000 – ₹20,000", type: "price" }, { label: "Lifespan", value: "20–25 years", type: "life" }]}
          links={[{ href: "https://hidesign.com", label: "Hidesign.com ↗" }, { href: "https://www.amazon.in/s?k=hidesign+full+grain", label: "Amazon India ↗" }]} />

        <Card src="gemini" icon="🥾" badges={[{ type: "bifl", label: "True BIFL" }]} name="Woodland Boots (Heavy Duty)"
          desc="Not glamorous, but genuinely indestructible. Thick nubuck leather + vulcanised rubber sole. Survives Indian monsoons, construction sites, and hilly terrain. Widely available and serviceable across India."
          rows={[{ label: "Price", value: "₹3,500 – ₹6,000", type: "price" }, { label: "Available", value: "Woodland stores (every mall)" }, { label: "Lifespan", value: "8–12 years", type: "life" }]}
          links={[{ href: "https://www.woodland.in", label: "Woodland.in ↗" }, { href: "https://www.amazon.in/s?k=woodland+boots+men", label: "Amazon India ↗" }]} />
      </CardGrid>
    </div>
  );
}

function ToolsSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 04" title="Hand Tools" desc="Taparia is the Indian BIFL gold standard — chrome-vanadium steel at local prices. Both AI systems agreed on this. Leatherman and Stanley round out the premium tier." />
      <div style={{ overflowX: "auto", margin: "20px 0", borderRadius: 2, boxShadow: shadow }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: C.white }}>
          <thead>
            <tr style={{ background: C.ink }}>
              {["Tool", "BIFL Brand", "Why", "Price", "Life", "Buy"].map(h => (
                <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.cream, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOOLS_TABLE.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.stoneLight}`, background: i % 2 === 1 ? C.cream : C.white }}>
                <td style={{ padding: "10px 14px", fontWeight: 600, fontSize: 13 }}>{row.tool}</td>
                <td style={{ padding: "10px 14px" }}>{row.brand}</td>
                <td style={{ padding: "10px 14px" }}>{row.why}</td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", color: C.rust, fontWeight: 600 }}>{row.price}</td>
                <td style={{ padding: "10px 14px", color: C.forest, fontWeight: 600 }}>{row.life}</td>
                <td style={{ padding: "10px 14px" }}>
                  <a href={row.url} target="_blank" rel="noopener noreferrer" style={{ color: C.forest, fontSize: 11.5, fontWeight: 500 }}>{row.urlLabel}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <WarnBox>
        <strong>📍 Hyderabad Buy:</strong> For Taparia tools, visit hardware markets at <strong>Ranigunj</strong> (near Sultan Bazaar). Physical inspection is important — avoid cheap lookalike brands with similar packaging.
      </WarnBox>
    </div>
  );
}

function FurnitureSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 05" title="Furniture & Storage" desc="Buy the wood, not the laminate. Both AI systems agreed: Sheesham solid wood and Godrej steel almirahs are India's furniture BIFL answers." />
      <WarnBox>
        <strong>⚠️ MDF Warning (Hyderabad-specific):</strong> Hyderabad's monsoon humidity will warp, bubble and delaminate MDF/particle board furniture within 3–7 years. Sheesham and steel are the only options that survive the climate long-term.
      </WarnBox>
      <CardGrid>
        <Card src="both" icon="🪑" badges={[{ type: "bifl", label: "True BIFL" }]} name="Sheesham Solid Wood Furniture"
          desc="Indian Rosewood. Dense, naturally oil-rich, termite-resistant. Used in temples for centuries. Beds, dining tables, bookshelves — all built in solid sheesham will outlast your grandchildren. Insist on a 'Solid Wood' certificate when buying."
          rows={[{ label: "Dining Set", value: "₹25,000 – ₹80,000", type: "price" }, { label: "Bed Frame", value: "₹18,000 – ₹55,000", type: "price" }, { label: "Lifespan", value: "80–100+ years", type: "life" }]}
          links={[{ href: "https://www.saraff.com", label: "Saraf Furniture ↗" }, { href: "https://www.woodenstreet.com", label: "WoodenStreet.com ↗" }, { href: "https://www.pepperfry.com/solid-wood.html", label: "Pepperfry ↗" }]} />

        <Card src="both" icon="🗄️" badges={[{ type: "heritage", label: "Heritage India" }]} name="Godrej Steel Almirah"
          desc="Cold-rolled steel. Termite-proof, fireproof, warp-proof. Godrej almirahs from the 1970s are still in active daily use. The Centurion/Slimline models in steel will survive any Hyderabad monsoon, any termite attack."
          rows={[{ label: "Price", value: "₹8,000 – ₹25,000", type: "price" }, { label: "Lifespan", value: "40–60+ years", type: "life" }]}
          links={[{ href: "https://www.godrejinterio.com", label: "Godrej Interio ↗" }, { href: "https://www.amazon.in/s?k=godrej+steel+almirah", label: "Amazon India ↗" }]} />

        <Card src="gemini" icon="🪑" badges={[{ type: "bifl", label: "True BIFL" }, { type: "new", label: "Gemini Find" }]} name="Featherlite Ergonomic Office Chair"
          desc="Indian corporate standard. The Liberate/Helix models have replaceable armrests, gas cylinders, and caster wheels — fully repairable. Featherlite has multiple Hyderabad showrooms where you can test sit before buying. Critical for 14+ hour desk work days."
          rows={[{ label: "Models", value: "Liberate / Helix" }, { label: "Price", value: "₹15,000 – ₹25,000", type: "price" }, { label: "Hyderabad", value: "Multiple showrooms" }, { label: "Lifespan", value: "15–20 years (parts replaceable)", type: "life" }]}
          links={[{ href: "https://www.featherlite.in", label: "Featherlite.in ↗" }]}
          srcAttr={{ color: "#4285f4", text: "Critical addition given your long desk hours. Gemini correctly flagged this." }} />
      </CardGrid>
    </div>
  );
}

function WatchesSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 06" title="Watches" desc="Gemini never covered watches. A mechanical watch has no battery, no software, no planned obsolescence — every part is replaceable by a watchmaker." />
      <CardGrid>
        <Card src="claude" icon="⌚" badges={[{ type: "bifl", label: "True BIFL" }]} name="Seiko 5 Sports Automatic"
          desc="Japanese automatic movement. No battery. Self-winds from wrist motion. 100m water resistance. The most recommended under-₹20k BIFL watch globally. Service every 7–10 years at any watch shop."
          rows={[{ label: "Price", value: "₹10,000 – ₹22,000", type: "price" }, { label: "Service", value: "Every 7–10 yrs (~₹3,000)" }, { label: "Lifespan", value: "50+ years", type: "life" }]}
          links={[{ href: "https://www.amazon.in/s?k=seiko+5+sports+automatic", label: "Amazon India ↗" }, { href: "https://www.watcho.in/seiko", label: "WatchO.in ↗" }]} />

        <Card src="claude" icon="🛡️" badges={[{ type: "bifl", label: "True BIFL" }]} name="Casio G-Shock (DW-5600 / GA-2100)"
          desc="The toughest daily wear watch on earth. Shock-resistant, 200m water-resistant. The original G-Shock from 1983 still runs. Battery every 3–5 years (₹200). Module inside is replaceable if needed."
          rows={[{ label: "Price", value: "₹5,000 – ₹18,000", type: "price" }, { label: "Battery", value: "₹200 / 3–5 years" }, { label: "Lifespan", value: "20–30+ years", type: "life" }]}
          links={[{ href: "https://www.amazon.in/s?k=casio+g-shock+original", label: "Amazon India ↗" }, { href: "https://www.casioindiashop.com", label: "Casio India ↗" }]} />
      </CardGrid>
    </div>
  );
}

function BagsSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 07" title="Bags & Luggage" desc="The BIFL test: can the zipper or wheel be replaced? Samsonite and Osprey both pass. Both AI systems agreed on Samsonite." />
      <CardGrid>
        <Card src="both" icon="🧳" badges={[{ type: "bifl", label: "True BIFL" }]} name="Samsonite Polycarbonate Trolley"
          desc="Polycarbonate (not ABS — ABS cracks). Samsonite's 10-year global warranty is honored in India. Broken wheel at year 5 → they fix it. 360° spinner wheels replaceable. Industry-proven 30-year lifespan."
          rows={[{ label: "Price", value: "₹12,000 – ₹35,000", type: "price" }, { label: "Budget Pick", value: "VIP 100% Polycarbonate ₹5,000" }, { label: "Warranty", value: "10 years global", type: "life" }]}
          links={[{ href: "https://www.samsonite.in", label: "Samsonite India ↗" }, { href: "https://www.amazon.in/s?k=samsonite+polycarbonate", label: "Amazon India ↗" }]} />

        <Card src="claude" icon="🎒" badges={[{ type: "premium", label: "Premium BIFL" }]} name="Osprey Backpack (All Mighty Guarantee)"
          desc="The most iron-clad warranty in bags: repair or replace for ANY reason, for life, including damage. No receipts required. Ideal for daily work carry, trekking, camera gear."
          rows={[{ label: "Price", value: "₹12,000 – ₹25,000", type: "price" }, { label: "Warranty", value: "Lifetime — All Mighty Guarantee", type: "life" }]}
          links={[{ href: "https://www.amazon.in/s?k=osprey+farpoint", label: "Amazon India ↗" }, { href: "https://www.decathlon.in/s?q=osprey", label: "Decathlon ↗" }]} />
      </CardGrid>
    </div>
  );
}

function FitnessSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 08" title="Home Gym & Fitness" desc="Gemini's unique contribution: Bullrock cast iron weights. This is the correct India-specific BIFL answer for home gyms. Cast iron plates last literally 100 years." />
      <CardGrid>
        <Card src="gemini" icon="🏋️" badges={[{ type: "bifl", label: "True BIFL" }, { type: "new", label: "Gemini Find" }]} name="Bullrock Cast Iron Olympic Plates"
          desc="Indian powerlifting brand, Nashik-made. Machined cast iron with resin sand-cast treatment for corrosion resistance. You can drop them, leave them outside, ignore them — they will outlast your great-grandchildren. Ships via surface freight across India."
          rows={[{ label: "Cast Iron Plates", value: "~₹170–₹223 per kg", type: "price" }, { label: "Calibrated PL Plates", value: "~₹278 per kg", type: "price" }, { label: "Range", value: "1.25kg to 25kg plates" }, { label: "Lifespan", value: "100+ years", type: "life" }]}
          links={[{ href: "https://bullrockfitness.com", label: "BullrockFitness.com ↗" }, { href: "https://www.amazon.in/s?k=bullrock+cast+iron+plates", label: "Amazon India ↗" }]}
          srcAttr={{ color: "#4285f4", text: "Gemini's best fitness find. Not in original guide. Correct BIFL pick for home gym." }} />
      </CardGrid>
    </div>
  );
}

function BadmintonSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 09" title="Badminton Equipment" desc="Gemini knew about your badminton interest and gave excellent sport-specific BIFL picks. Made-in-Japan Yonex + Asics Gel are the correct answers." />
      <CardGrid>
        <Card src="gemini" icon="🏸" badges={[{ type: "sport", label: "Badminton BIFL" }, { type: "new", label: "Gemini Find" }]} name="Yonex Astrox / Arcsaber — Made in Japan"
          desc="The key distinction: Made-in-Japan Yonex uses High Modulus Graphite — holds string tension longer, frame is less likely to crack on clashes. China/Taiwan models use standard graphite. Buying offline from specialist shops avoids fakes."
          rows={[{ label: "Models", value: "Astrox 88D/S Pro, Arcsaber 11 Pro" }, { label: "Price", value: "₹14,000 – ₹18,000", type: "price" }, { label: "Buy Offline", value: "Chevalier Sports (Secunderabad)" }, { label: "Or", value: "Sachin Sports (Koti)" }]}
          buyLabel="Buy Online (verify MIJ label)"
          links={[{ href: "https://www.amazon.in/s?k=yonex+astrox+made+in+japan", label: "Amazon India ↗" }, { href: "https://www.yonex.com/india", label: "Yonex India ↗" }]} />

        <Card src="gemini" icon="👟" badges={[{ type: "sport", label: "Badminton BIFL" }, { type: "new", label: "Gemini Find" }]} name="Asics Gel-Blade / Gel-Rocket (Court Shoes)"
          desc="Badminton destroys knees and shoes. Asics Gel cushioning doesn't compress and flatten out like standard foam. The Gel-Blade sole is extremely grippy on wooden courts and exceptionally durable — protects knees long-term."
          rows={[{ label: "Entry", value: "Gel Rocket ₹4,500", type: "price" }, { label: "Pro Pick", value: "Gel Blade ₹7,000–₹9,000", type: "price" }, { label: "Hyderabad", value: "Inorbit Mall / Forum Mall" }]}
          links={[{ href: "https://www.amazon.in/s?k=asics+gel+blade+badminton", label: "Amazon India ↗" }, { href: "https://www.asics.com/in/en-in/", label: "Asics India ↗" }]} />
      </CardGrid>
    </div>
  );
}

function DeskSection() {
  return (
    <div>
      <SectionHead eyebrow="Category 10" title="Desk, EDC & Keyboards" desc="Gemini added TVS Gold — the legendary Indian mechanical keyboard. Both systems agree on keyboards being BIFL buys. Stationery picks from original guide carried forward." />
      <CardGrid>
        <Card src="gemini" icon="⌨️" badges={[{ type: "heritage", label: "Heritage India" }, { type: "new", label: "Gemini Find" }]} name="TVS Gold Mechanical Keyboard"
          desc="The 'Bank Keyboard' of India. Cherry MX Blue switches rated for 50M keystrokes. Built like a tank with a steel backplate. Looks like 1995, works like forever. You will never need another keyboard for typing."
          rows={[{ label: "Price", value: "₹2,500 – ₹3,000", type: "price" }, { label: "Switch Life", value: "50M keystrokes / ~25 years", type: "life" }]}
          links={[{ href: "https://www.amazon.in/s?k=tvs+gold+mechanical+keyboard", label: "Amazon India ↗" }, { href: "https://www.flipkart.com/search?q=tvs+gold+keyboard", label: "Flipkart ↗" }]} />

        <Card src="gemini" icon="🎛️" badges={[{ type: "bifl", label: "True BIFL" }]} name="Keychron K-Series (Wireless Mechanical)"
          desc="Modern BIFL keyboard. Hot-swappable switches (replace individual switches without soldering). Mac/Windows switch. Wireless. Individual switches are replaceable — so if one key breaks in 10 years, you fix just that key."
          rows={[{ label: "Price", value: "₹7,000 – ₹12,000", type: "price" }, { label: "Key Feature", value: "Hot-swappable (fully repairable)", type: "life" }]}
          links={[{ href: "https://keychron.in", label: "Keychron.in ↗" }, { href: "https://www.meckeys.com", label: "MecKeys.com ↗" }]} />

        <Card src="claude" icon="🖊️" badges={[{ type: "bifl", label: "True BIFL" }]} name="Fisher Space Pen (Pressurized)"
          desc="Pressurized cartridge — writes in any orientation, underwater, extreme heat/cold. NASA-certified. Cartridge replaceable (₹600 every 2–3 years). Your grandchildren will use this pen."
          rows={[{ label: "Price", value: "₹4,000 – ₹7,000", type: "price" }, { label: "Refill", value: "₹600 / 2–3 years", type: "price" }]}
          links={[{ href: "https://www.amazon.in/s?k=fisher+space+pen+bullet", label: "Amazon India ↗" }]} />

        <Card src="claude" icon="💧" badges={[{ type: "heritage", label: "Heritage India" }]} name="Milton / Borosil Steel Water Bottle"
          desc="18/8 food-grade stainless steel, double-wall vacuum insulated. No taste, no leach, no BPA. Hot 18hr / cold 24hr. Borosil Hydra and Milton Thermosteel are India's BIFL bottle duo."
          rows={[{ label: "Price", value: "₹500 – ₹2,500", type: "price" }, { label: "Lifespan", value: "20–30 years", type: "life" }]}
          links={[{ href: "https://www.amazon.in/s?k=milton+thermosteel+bottle", label: "Amazon (Milton) ↗" }, { href: "https://www.borosil.com/collections/bottles", label: "Borosil.com ↗" }]} />
      </CardGrid>
    </div>
  );
}

function GuideSection() {
  return (
    <div>
      <SectionHead eyebrow="The Playbook" title="How to Shop BIFL in India" desc="Six principles that cut through marketing and tell you if something is genuinely built to last." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14, marginTop: 20 }}>
        {PRINCIPLES.map((p) => (
          <div key={p.num} style={{ background: C.white, borderLeft: `3px solid ${C.rust}`, padding: 18, boxShadow: shadow }}>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 32, fontWeight: 900, color: C.rustPale, lineHeight: 1 }}>{p.num}</div>
            <div style={{ fontWeight: 700, fontSize: 14, margin: "4px 0", color: C.ink }}>{p.title}</div>
            <div style={{ fontSize: 12.5, color: C.stone, lineHeight: 1.6 }}>{p.text}</div>
          </div>
        ))}
      </div>

      <WarnBox style={{ marginTop: 28 }}>
        <strong>🚫 Heritage Washing Warning:</strong> "Genuine leather" = scrap glued together (not full-grain). "Solid wood finish" = MDF with a photo. "Stainless steel" without grade could be 201 (rusts) instead of 304/316. "Lifetime warranty" with 20 exclusion clauses that cover nothing.
      </WarnBox>

      <div style={{ background: C.ink, color: C.cream, borderRadius: 2, padding: 28, margin: "28px 0" }}>
        <h3 style={{ fontFamily: "Georgia,serif", fontSize: 20, color: C.gold, marginBottom: 18 }}>📊 The Definitive BIFL Budget for India</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { title: "Phase 1: Foundation (~₹20,000)", lines: ["Indus Valley Cast Iron Set: ₹3,000", "Hawkins Pressure Cooker: ₹1,800", "Sujata Dynamix Mixer: ₹6,500", "Victorinox Chef Knife: ₹3,000", "Borosil Bottles + Jars: ₹2,000", "G-Shock Watch: ₹6,500"], result: "Kitchen + daily carry ✓" },
            { title: "Phase 2: Upgrade (~₹70,000)", lines: ["Sheesham Dining Table: ₹30,000", "Featherlite Office Chair: ₹18,000", "Samsonite Trolley: ₹15,000", "Seiko Automatic Watch: ₹15,000", "Hidesign Leather Bag: ₹10,000", "Keychron K-Series: ₹8,000"], result: "Workspace + travel + heirloom ✓" },
          ].map((col) => (
            <div key={col.title} style={{ background: "rgba(255,255,255,0.06)", padding: 16, borderRadius: 1 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>{col.title}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: "#a09080", lineHeight: 2 }}>
                {col.lines.map((l, i) => <div key={i}>{l}</div>)}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#7dba84", marginTop: 10 }}>{col.result}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const SECTIONS = {
  kitchen:   <KitchenSection />,
  apparel:   <ApparelSection />,
  footwear:  <FootwearSection />,
  tools:     <ToolsSection />,
  furniture: <FurnitureSection />,
  watches:   <WatchesSection />,
  bags:      <BagsSection />,
  fitness:   <FitnessSection />,
  badminton: <BadmintonSection />,
  desk:      <DeskSection />,
  guide:     <GuideSection />,
};

export default function BIFLIndiaGuide() {
  const [activeTab, setActiveTab] = useState("kitchen");

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.cream, color: C.ink, lineHeight: 1.6, minHeight: "100vh" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        table { border-collapse: collapse; }
        ::-webkit-scrollbar { height: 4px; } 
        ::-webkit-scrollbar-thumb { background: ${C.stoneLight}; border-radius: 2px; }
      `}</style>

      {/* Hero */}
      <div style={{ background: C.ink, padding: "52px 24px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(184,136,42,0.12), transparent)", pointerEvents: "none" }} />
        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: C.gold, marginBottom: 14, position: "relative", zIndex: 1 }}>
          Definitive Edition · India 2026 · Claude + Gemini Merged
        </div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(38px,8vw,76px)", fontWeight: 900, lineHeight: 1.05, color: C.white, letterSpacing: -1, position: "relative", zIndex: 1 }}>
          Buy It For <span style={{ color: C.gold }}>Life</span>
        </h1>
        <p style={{ color: "#a09080", fontSize: 15, fontWeight: 300, maxWidth: 540, margin: "18px auto 0", position: "relative", zIndex: 1 }}>
          The best picks from two AI systems, cross-verified, corrected, and ranked with direct buy links for India.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 24, position: "relative", zIndex: 1 }}>
          {["🏆 Best-of-Both", "🔗 Live Buy Links", "🇮🇳 India-First", "🏙️ Hyderabad Context", "♾️ Lifetime Value"].map(b => (
            <span key={b} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#c8b89a", fontSize: 11, fontWeight: 500, padding: "5px 14px", borderRadius: 20, letterSpacing: 0.5 }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Source Legend */}
      <div style={{ background: C.forest, color: C.forestPale, fontSize: 12, textAlign: "center", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <strong style={{ color: "#a8d0b8" }}>Source Legend:</strong>
        {[{ label: "🟡 Gold border = Best of Both (Claude + Gemini agreed)" }, { label: "🔵 Blue border = Gemini's unique find" }, { label: "🔴 Red border = Claude's unique pick" }].map(t => (
          <span key={t.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 500 }}>{t.label}</span>
        ))}
      </div>

      {/* Nav */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.stoneLight}`, position: "sticky", top: 0, zIndex: 100, overflowX: "auto" }}>
        <div style={{ display: "flex", minWidth: "max-content", padding: "0 16px" }}>
          {NAV_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? C.rust : "transparent"}`, padding: "13px 15px", fontFamily: "inherit", fontSize: 12, fontWeight: 500, color: activeTab === tab.id ? C.rust : C.stone, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5, transition: "all 0.18s" }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 20px 56px" }}>
        {SECTIONS[activeTab]}
      </div>

      {/* Footer */}
      <footer style={{ background: C.ink, color: "#6a5e52", textAlign: "center", padding: "28px 20px", fontSize: 12 }}>
        <strong style={{ color: C.gold }}>BIFL India — Definitive Edition</strong> · Merged best picks from Claude + Gemini · June 2026
        <br />
        <span style={{ display: "block", marginTop: 6 }}>Prices are indicative. Verify before purchase. Buy links go to official stores or Amazon India.</span>
      </footer>
    </div>
  );
}
