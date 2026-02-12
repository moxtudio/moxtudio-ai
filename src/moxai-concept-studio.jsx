import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════
   M O X a i   C O N C E P T   S T U D I O
   "The Innovation Engine Hospitality Didn't Know It Needed"
   ══════════════════════════════════════════════════════════════ */

const TEAM_EMAILS = ["j.bargisen@moxpitality.com","t.lapp@moxpitality.com","g.bargisen@moxpitality.com","j.infantino@moxpitality.com"];

/* ── Aurora Borealis Palette ── */
const C = {
  bg: "#060910", bg2: "#0A0E17", surface: "#111827", card: "#1A2233", cardHover: "#1E2840",
  border: "#1F2937", borderLight: "#374151",
  text: "#E5E7EB", textBright: "#F9FAFB", textMuted: "#9CA3AF", textDim: "#6B7280",
  cyan: "#22D3EE", teal: "#2DD4BF", sky: "#38BDF8", indigo: "#818CF8", violet: "#A78BFA",
  gold: "#D4A847",
  success: "#34D399", warn: "#FBBF24", danger: "#F87171",
  glowCyan: "rgba(34,211,238,0.08)", glowTeal: "rgba(45,212,191,0.06)",
};

/* ═══════════════════════════════════════════
   DYNAMIC CONCEPT ENGINE
   Palettes shift based on concept NAME themes
   ═══════════════════════════════════════════ */
const CONCEPT_THEMES = {
  fire: { keywords: ["forge","ember","sear","fire","flame","coal","smoke","iron","hearth","kindling","char","blaze","ash","torch","inferno"],
    primary:"#E87A3E", secondary:"#1A0F0A", accent:"#D4915E", name:"Open Flame",
    materials:["Reclaimed Oak","Matte Black Steel","Butcher Paper","Exposed Bulbs","Raw Concrete"],
    vibe:["Bold","Artisan","Smoky","Industrial","Craft"],
    narrative: n => `You smell it before you see it. Wood smoke curling through the concourse, pulling you in. ${n} is built around one truth: fire transforms everything. The open kitchen isn't hidden — it's the show.`,
    signature: "The open flame sear. Guests watch their protein hit the grill from 10 feet away. The sound, the sizzle, the show." },
  ocean: { keywords: ["salt","brine","tide","drift","coast","shore","wave","reef","anchor","harbor","bay","pearl","current","blue","aqua","fin","shell"],
    primary:"#5B8FA8", secondary:"#0C1A22", accent:"#E8C170", name:"Coastal Drift",
    materials:["Bleached Driftwood","Brass Hardware","White Marble","Rope Details","Sea Glass"],
    vibe:["Breezy","Clean","Fresh","Relaxed","Bright"],
    narrative: n => `The air shifts as you approach. Something bright, clean, unmistakably fresh. ${n} brings coastal energy to the heart of the venue — raw bar glistening on ice, citrus cutting through the noise.`,
    signature: "The raw bar reveal. Crushed ice, glistening seafood, citrus halves, and a shucking station that performs." },
  earth: { keywords: ["garden","root","stone","oak","grove","harvest","meadow","sage","moss","fern","terra","soil","vine","bloom","seed","green","leaf","willow"],
    primary:"#7A9E7E", secondary:"#141C14", accent:"#D4A574", name:"Garden Stone",
    materials:["Live Edge Walnut","Terracotta","Linen","Copper Accents","Living Greenery"],
    vibe:["Organic","Seasonal","Earthy","Refined","Natural"],
    narrative: n => `${n} greets you with green. Living walls, wooden surfaces worn smooth, the scent of herbs that were growing this morning. This is food that knows where it came from.`,
    signature: "The living wall behind the pass. Cooks reach up and pull fresh herbs mid-service. Not decoration — the ingredient list, growing live." },
  electric: { keywords: ["neon","flash","volt","pulse","beat","glow","pop","boom","buzz","riot","loud","bright","rave","amp","surge","bolt"],
    primary:"#E85D75", secondary:"#120818", accent:"#F4C542", name:"Electric Bloom",
    materials:["Neon Signage","Polished Chrome","Terrazzo","Color-Block Tile","Acrylic"],
    vibe:["Vibrant","Bold","Playful","Electric","Modern"],
    narrative: n => `${n} hits different. Loud colors, confident flavors, a menu that doesn't play it safe. Built for people who came to have a good time.`,
    signature: "The flavor wall. Floor-to-ceiling display of every spice, sauce, and condiment. Bold, colorful, completely real." },
  luxe: { keywords: ["midnight","velvet","noir","lux","onyx","obsidian","shadow","silk","raven","eclipse","dusk","twilight","moon","night","diamond","crystal"],
    primary:"#8B7EC8", secondary:"#0E0A1A", accent:"#E2B35B", name:"Midnight Luxe",
    materials:["Velvet","Smoked Mirror","Aged Brass","Dark Walnut","Marble"],
    vibe:["Luxe","Intimate","Elevated","Sultry","Refined"],
    narrative: n => `${n} lowers the lights and raises the standard. Velvet textures, amber glow, a cocktail that arrives before you realize you wanted it. You've arrived somewhere worth being.`,
    signature: "The tableside pour. A signature spirit presented with ceremony — decanted, explained, poured under warm light." },
  warm: { keywords: ["copper","terra","sun","clay","adobe","mesa","rust","sienna","canyon","desert","honey","amber","warm","spice","saffron","turmeric","paprika"],
    primary:"#C4704E", secondary:"#1A110D", accent:"#D4B896", name:"Terracotta Sun",
    materials:["Clay Tile","Rattan","Raw Plaster","Iron","Olive Wood"],
    vibe:["Warm","Mediterranean","Grounded","Rustic","Textured"],
    narrative: n => `Sun-baked warmth radiates from every surface at ${n}. Clay, olive wood, the aroma of slow-roasted everything. Centuries of hospitality belief: feeding someone well is an act of generosity.`,
    signature: "The bread ritual. Warm flatbread torn at the table, dipped in house-pressed olive oil. Simple. Sacred. Unforgettable." },
  playful: { keywords: ["scoop","swirl","candy","sugar","sweet","cream","sprinkle","carnival","fun","joy","happy","bubble","fizz","whimsy","wonder","magic","dream","rainbow"],
    primary:"#F472B6", secondary:"#1A0A14", accent:"#67E8F9", name:"Sugar Rush",
    materials:["Glossy Tile","Rounded Edges","Pastel Laminates","Soft LEDs","Vinyl"],
    vibe:["Playful","Whimsical","Joyful","Nostalgic","Fun"],
    narrative: n => `${n} is pure, unapologetic joy. Bright, sweet, and impossible not to smile at. Every detail says: leave the serious stuff at the door. You're here to have fun.`,
    signature: "The first-bite reaction. Designed to make adults feel like kids again. Colors, textures, and flavors that spark genuine delight." },
  street: { keywords: ["street","alley","corner","market","cart","truck","block","curb","hustle","grind","grit","downtown","urban","sidewalk","stall","lineup","queue"],
    primary:"#F59E0B", secondary:"#1A1408", accent:"#EF4444", name:"Street Heat",
    materials:["Corrugated Metal","Concrete Block","Spray Paint","Wire Mesh","Reclaimed Signage"],
    vibe:["Raw","Authentic","Loud","Fast","Real"],
    narrative: n => `${n} doesn't apologize. It's loud, it's fast, and it's the best thing you'll eat standing up. Street food energy brought indoors with zero compromise on flavor.`,
    signature: "The open window pass. Food comes out hot and fast through a hole in the wall. No frills. All flavor." },
  refined: { keywords: ["provision","drawing","parlor","library","atelier","salon","lounge","club","manor","estate","reserve","collection","cellar","vault","archive"],
    primary:"#A3866A", secondary:"#12100E", accent:"#C9A84C", name:"Old World Reserve",
    materials:["Leather","Mahogany","Brass Library Lamps","Crown Molding","Wool Carpet"],
    vibe:["Sophisticated","Timeless","Distinguished","Classic","Quiet"],
    narrative: n => `${n} feels like walking into a story. Leather, warm wood, soft light. This isn't trendy — it's permanent. The kind of place where the menu hasn't changed in years because it never needed to.`,
    signature: "The sommelier's nod. A glass appears without asking. They already know what you want because they've been watching the room." },
  community: { keywords: ["common","social","gather","table","union","public","house","canteen","mess","hall","kitchen","home","family","neighbor","friend","welcome"],
    primary:"#60A5FA", secondary:"#0A1220", accent:"#FCD34D", name:"Community Table",
    materials:["Reclaimed Farm Table","Bench Seating","Enamelware","Mason Jars","Chalkboard"],
    vibe:["Welcoming","Communal","Honest","Familiar","Generous"],
    narrative: n => `${n} is the opposite of exclusive. Long tables, shared plates, strangers becoming friends over food. This is hospitality at its most human.`,
    signature: "The family-style drop. A massive board hits the center of the table. Everyone reaches. Nobody waits." },
};

function detectTheme(name) {
  const lower = name.toLowerCase();
  for (const [key, theme] of Object.entries(CONCEPT_THEMES)) {
    if (theme.keywords.some(kw => lower.includes(kw))) return key;
  }
  return "fire";
}

/* ═══════════════════════════════════════════
   BRAND PERSONAS / ARCHETYPES
   ═══════════════════════════════════════════ */
const PERSONAS = {
  uncletom: { name:"Uncle Tom", icon:"🤗", tagline:"Warm, fun, friendly — a little goofy",
    desc:"This concept gives you a big hug. It's not trying to impress you. It just wants you to feel good, eat well, and laugh a little. Backyard cookout energy with actual culinary chops.",
    traits:["Approachable pricing","Generous portions","Casual service","Comfort-forward menu","Fun name, not fancy"],
    adj:{foodPC:-3,staff:0.9,vibe:"Comfort dial turned to 11"} },
  superhero: { name:"The Superhero", icon:"⚡", tagline:"Saves you from an awful day",
    desc:"This concept rescues your entire mood. Walk in defeated, walk out restored. That outer-world level of umami that makes you close your eyes and forget where you are for a second.",
    traits:["Signature wow moments","Flavor-first philosophy","Bold hero items","Sensory overload (good kind)","Makes people take photos"],
    adj:{foodPC:4,staff:1.1,vibe:"Main character energy"} },
  professor: { name:"The Cool Professor", icon:"🧠", tagline:"Smart, curated, quietly impressive",
    desc:"Doesn't need to shout. The menu reads like a thesis on flavor. Staff can explain why the bread ferments for 72 hours and make it sound fascinating, not pretentious.",
    traits:["Curated menu (less is more)","Staff as educators","Ingredient storytelling","Thoughtful pacing","Hidden details"],
    adj:{foodPC:5,staff:1.05,vibe:"Substance over flash"} },
  bestfriend: { name:"Your Best Friend", icon:"🙌", tagline:"Always there. Never disappoints.",
    desc:"Reliable. Consistent. The place you go when you don't want to think. It knows your order. Quality never dips. The concept equivalent of a group chat that always delivers.",
    traits:["Consistency is the product","Fast repeat visits","Loyalty mechanics","Rewards regulars","Zero intimidation"],
    adj:{foodPC:-1,staff:0.95,vibe:"Tuesday-night-perfect energy"} },
  maverick: { name:"The Maverick", icon:"🔥", tagline:"Rule-breaker. Trendsetter. Unapologetic.",
    desc:"Doesn't follow the playbook — writes a new one. Unexpected combos, unconventional service, a vibe that makes people feel like they discovered it before everyone else.",
    traits:["Chef-driven surprises","Rotating specials","Instagrammable without trying","Polarizing on purpose","Limited-time drops"],
    adj:{foodPC:6,staff:1.15,vibe:"First-mover energy, slight chaos"} },
  grandma: { name:"Grandma's House", icon:"🏡", tagline:"Soul food. Literally feeds your soul.",
    desc:"No menu — just a feeling. Everything tastes like someone who loves you made it. Portions are generous because love is generous. You leave full in every sense of the word.",
    traits:["Heritage recipes","Generous portions","Warm lighting, soft textures","Staff remembers your name","Dessert is non-negotiable"],
    adj:{foodPC:-2,staff:0.9,vibe:"Nostalgia as a business strategy"} },
};

/* ── Generative Pools ── */
const NAMES = ["The Forge","Ember & Oak","SEAR","Hearthstone","Salt Line","Copper & Flame","The Provision Co.","Basecamp","Streetside Social","The Canteen","Brine & Barrel","The Drawing Room","Coalfire","The Pass","Waypoint","The Lot","Nightcap","Threshold","The Commons","Stone & Smoke","Kindling","Concourse","Ground Level","The Lineup","Quarter Turn","Ovation","First Light","The Encore","Neon Alley","Sugar & Smoke","Fern & Fig","Midnight Table","The Garden Gate","Pearl Dive","Honeycomb","Wild Flour","The Iron Door","Velvet Room","Block Party","Driftwood"];
const TAGLINES = ["Fire-Crafted. Flavor-Forward. Unforgettable.","Where Every Bite Tells a Story.","Built for the Moment.","Crafted with Intention. Served with Soul.","Bold Flavors. No Compromises.","The Experience Starts Here.","Eat Like You Mean It.","Where Craft Meets Crowd.","Not Your Average Anything.","Arrive Hungry. Leave Talking.","Feed the Energy.","Made Here. Made Now.","Unapologetically Delicious."];

const BEV_PROGRAMS = {
  craft:{name:"Craft Cocktail Forward",perCap:18.5,costPct:22,emoji:"🍸",drinks:[{n:"The Opening Act",d:"Bourbon, smoked honey, charred orange",p:16},{n:"Intermission",d:"Gin, cucumber, elderflower, sparkling",p:15},{n:"Standing Ovation",d:"Mezcal, blood orange, agave, tajin",p:17}]},
  beer:{name:"Premium Draft Forward",perCap:14,costPct:26,emoji:"🍺",drinks:[{n:"Local Rotation IPA",d:"Regional craft, 16oz pour",p:13},{n:"House Lager",d:"Custom-brewed, sessionable",p:11},{n:"Seasonal Sour",d:"Fruited sour, quarterly rotation",p:14}]},
  premium:{name:"Full Premium Bar",perCap:22,costPct:20,emoji:"🥂",drinks:[{n:"Reserve Pour",d:"Curated top-shelf, neat or rocks",p:22},{n:"The House Martini",d:"Precision gin or vodka, three olive",p:18},{n:"Champagne Service",d:"Glass or bottle, French house",p:19}]},
  nonalc:{name:"Non-Alc Forward",perCap:11,costPct:18,emoji:"🧃",drinks:[{n:"Zero Proof Paloma",d:"Grapefruit, agave, lime, sparkling",p:10},{n:"Botanical Spritz",d:"Juniper, citrus, tonic, edible flower",p:9},{n:"Cold Pressed Flight",d:"Three seasonal juice blends",p:12}]},
};

const SCENARIOS = {
  premium:{name:"Sold-Out Showstopper",emoji:"🔥",att:95,foodPC:28,staff:1.3,menu:"Full + chef specials",flavor:"Playoffs, concerts, galas. Maximum everything."},
  standard:{name:"Solid Tuesday",emoji:"✊",att:78,foodPC:22,staff:1.0,menu:"Full menu",flavor:"Regular season. Your bread and butter. Literally."},
  low:{name:"Rainy Wednesday",emoji:"🌧",att:45,foodPC:19,staff:0.65,menu:"Hero items only",flavor:"Lean and mean. Still on-brand. Still delicious."},
  festival:{name:"Festival Endurance",emoji:"🎪",att:100,foodPC:35,staff:1.5,menu:"Extended + grab-and-go",flavor:"Multi-day chaos. High throughput. Hydrate."},
};

const POSITIONS = {
  grab:{name:"High-Volume Grab",emoji:"🏃",foodPC:16,avgCheck:14,flavor:"Speed over ceremony. Lower price, higher turns."},
  balanced:{name:"Balanced Sweet Spot",emoji:"⚖️",foodPC:22,avgCheck:20,flavor:"Quality meets throughput. The Goldilocks zone."},
  premium:{name:"Premium Destination",emoji:"✨",foodPC:32,avgCheck:28,flavor:"Higher price, lower volume. People come ON PURPOSE."},
  ultra:{name:"Ultra VIP",emoji:"👑",foodPC:48,avgCheck:42,flavor:"Exclusive, curated, white-glove. Velvet rope."},
};

const MENU_ITEMS = [
  {id:1,name:"Smoked Brisket Board",cat:"Hero",price:24,cost:7.20,desc:"14-hour smoked brisket, house pickles, burnt ends, cornbread"},
  {id:2,name:"Wood-Fired Flatbread",cat:"Hero",price:18,cost:4.50,desc:"Sourdough base, roasted garlic, seasonal toppings"},
  {id:3,name:"Charred Street Corn",cat:"Hero",price:12,cost:2.40,desc:"Flame-kissed, cotija, lime crema, chili threads"},
  {id:4,name:"The Signature Burger",cat:"Hero",price:22,cost:6.16,desc:"Double smash, aged cheddar, caramelized onion, brioche"},
  {id:5,name:"Loaded Fries",cat:"Side Kick",price:14,cost:3.08,desc:"Hand-cut, smoked cheese sauce, pickled jalapeño"},
  {id:6,name:"Seasonal Grain Bowl",cat:"Side Kick",price:16,cost:4.00,desc:"Rotating grains, roasted veg, herb vinaigrette"},
  {id:7,name:"Smoked Wings (6pc)",cat:"Side Kick",price:16,cost:4.48,desc:"Slow-smoked, flash-fried, choice of glaze"},
  {id:8,name:"House Cookie",cat:"Side Kick",price:8,cost:1.44,desc:"Brown butter chocolate chunk, sea salt, warm"},
];

const BREAK_STAGES = [
  {stage:"THE OBVIOUS",emoji:"👀",q:"What does everyone assume the problem is?",sub:"Start with the thing everybody says in meetings. We'll blow past it.",color:C.textMuted},
  {stage:"THE FRICTION",emoji:"🔍",q:"Where does the guest experience actually break?",sub:"Not where leadership thinks. Where it ACTUALLY breaks. Be specific.",color:C.cyan},
  {stage:"THE UNSAID",emoji:"🤫",q:"What's the constraint nobody will name out loud?",sub:"Budget? Talent? Leadership ego? Equipment from 2004? Say the thing.",color:C.teal},
  {stage:"THE FLIP",emoji:"🔄",q:"What if the opposite of the current approach were true?",sub:"Inversion is where breakthroughs hide. Flip every assumption.",color:C.sky},
  {stage:"THE MOONSHOT",emoji:"🚀",q:"What's the 100x solution if money and politics vanished?",sub:"Dream without limits first. We'll engineer reality second. Go big.",color:C.gold},
];

const MOXIE = {
  story:["Your narrative is the foundation. Everything flows from how the guest FEELS.","Toggle palettes and watch vibe keywords shift. If the story survives, it's real.","A concept without a signature moment is a menu with walls around it."],
  look:["Materials tell the story before a word is read. Close your eyes — what does this space SMELL like?","Share your screen with the client. Let them drive the palette. When they lean forward, you found it.","If the logo doesn't feel right at 52pt, the concept isn't cooked yet."],
  menu:["Hero items: photographable AND executable at volume. Test both or you're lying to yourself.","Every item earns its spot. One sentence why it exists, or it gets cut. Ruthless love.","Watch the food cost % shift as you add items. Math doesn't care about your feelings."],
  bar:["Bev per cap is the fastest revenue lever. Toggle programs and watch The Numbers dance.","Non-alc forward isn't a trend. It's table stakes. How prominent is yours?","Batch vs. made-to-order changes your entire labor model. Decide here."],
  numbers:["Change the scenario and watch revenue cascade. Break your concept on purpose.","Margin below 65%? Flag it. Above 72%? Maybe underinvesting in quality.","Drag venue capacity. Does this concept work at 5K AND 80K? That's the test."],
  ops:["Prep complexity above 3/5? You need a dedicated prep team or you're kidding yourself.","Staff multipliers compound fast. Premium events need to justify extra labor with per cap.","Speed under 3 min at volume requires parallel production. Does your footprint support it?"],
  personas:["Personas aren't costumes. They're decision filters. Stuck on a menu choice? Ask: 'Would Uncle Tom serve this?'","Switch personas mid-build. If the concept survives, it's flexible. If it breaks, you found a weakness.","The best concepts can describe themselves as a person. If yours can't, it's still too abstract."],
  moxbreak:["Real innovation starts here. Not with ideas — with courage to name what's broken.","Most teams skip to solutions. The breakthrough lives in the problem nobody says out loud.","A well-defined problem is 80% of the solution. Take your time here."],
};

function ANum({value,pre="",suf="",dec=0}){const[d,setD]=useState(value);useEffect(()=>{const s=d,diff=value-s,dur=400,t0=Date.now();const go=()=>{const p=Math.min((Date.now()-t0)/dur,1);setD(s+diff*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(go)};requestAnimationFrame(go)},[value]);return<span>{pre}{d.toFixed(dec)}{suf}</span>}

const ShuffleBtn=({onClick,label})=>(<button onClick={onClick} style={{background:`linear-gradient(135deg,${C.cyan}10,${C.teal}06)`,border:`1px solid ${C.cyan}20`,borderRadius:8,color:C.cyan,cursor:"pointer",padding:"5px 11px",fontSize:11,fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,transition:"all 0.2s",display:"flex",alignItems:"center",gap:4}} onMouseOver={e=>{e.currentTarget.style.background=C.cyan+"18";e.currentTarget.style.transform="scale(1.03)"}} onMouseOut={e=>{e.currentTarget.style.background=`linear-gradient(135deg,${C.cyan}10,${C.teal}06)`;e.currentTarget.style.transform="scale(1)"}}>🎲 {label}</button>);

export default function MOXaiStudio(){
  const[mode,setMode]=useState("build");
  const[conceptName,setConceptName]=useState("The Forge");
  const[tagline,setTagline]=useState("Fire-Crafted. Flavor-Forward. Unforgettable.");
  const[bevProg,setBevProg]=useState("craft");
  const[scenario,setScenario]=useState("standard");
  const[positioning,setPositioning]=useState("balanced");
  const[capacity,setCapacity]=useState(40000);
  const[menuItems,setMenuItems]=useState(MENU_ITEMS);
  const[tab,setTab]=useState("story");
  const[panelOpen,setPanelOpen]=useState(true);
  const[moxieOpen,setMoxieOpen]=useState(false);
  const[moxieIdx,setMoxieIdx]=useState(0);
  const[fbOpen,setFbOpen]=useState(false);
  const[fbText,setFbText]=useState("");
  const[fbSent,setFbSent]=useState(false);
  const[brkStage,setBrkStage]=useState(0);
  const[brkAns,setBrkAns]=useState({});
  const[labStep,setLabStep]=useState(0);
  const[editName,setEditName]=useState(false);
  const[editTag,setEditTag]=useState(false);
  const[role,setRole]=useState("designer");
  const[persona,setPersona]=useState(null);

  const themeKey=detectTheme(conceptName);
  const theme=CONCEPT_THEMES[themeKey];
  const bev=BEV_PROGRAMS[bevProg];
  const evt=SCENARIOS[scenario];
  const pos=POSITIONS[positioning];
  const pa=persona?PERSONAS[persona].adj:{foodPC:0,staff:1,vibe:""};
  const adjFPC=pos.foodPC+(pa.foodPC||0);
  const att=Math.round(capacity*(evt.att/100));
  const foodRev=att*adjFPC;
  const bevRev=att*bev.perCap;
  const totalRev=foodRev+bevRev;
  const gross=totalRev-(foodRev*0.28)-(bevRev*(bev.costPct/100));
  const margin=totalRev>0?(gross/totalRev)*100:0;
  const staff=Math.round(18*evt.staff*(pa.staff||1));
  const tips=MOXIE[mode==="break"?"moxbreak":tab==="personas"?"personas":tab]||MOXIE.story;
  const shuffle=(a,c)=>{let n;do{n=a[Math.floor(Math.random()*a.length)]}while(n===c&&a.length>1);return n};

  const sendFb=()=>{console.log("Moxie Feedback:",{concept:conceptName,theme:theme.name,feedback:fbText,persona:persona?PERSONAS[persona].name:"None",to:TEAM_EMAILS});setFbSent(true);setTimeout(()=>{setFbSent(false);setFbOpen(false);setFbText("")},2400)};

  const TABS=role==="designer"
    ?[{id:"story",l:"Story",e:"📖"},{id:"look",l:"Look",e:"🎨"},{id:"menu",l:"Menu",e:"🍽"},{id:"bar",l:"Bar",e:"🍸"},{id:"numbers",l:"Numbers",e:"📊"},{id:"ops",l:"Blueprint",e:"⚙️"},{id:"personas",l:"Persona",e:"🎭"}]
    :[{id:"story",l:"Story",e:"📖"},{id:"look",l:"Look",e:"🎨"},{id:"menu",l:"Menu",e:"🍽"},{id:"bar",l:"Bar",e:"🍸"},{id:"numbers",l:"Numbers",e:"📊"}];

  const st={
    app:{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Space Grotesk',sans-serif"},
    nav:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 22px",borderBottom:`1px solid ${C.border}`,background:C.bg+"EE",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:50},
    logo:{fontSize:16,fontWeight:700,letterSpacing:3,background:`linear-gradient(135deg,${C.cyan},${C.teal},${C.sky})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
    mb:a=>({padding:"5px 13px",borderRadius:8,border:a?`1px solid ${C.cyan}35`:`1px solid transparent`,background:a?C.cyan+"10":"transparent",color:a?C.cyan:C.textMuted,cursor:"pointer",fontSize:12,fontWeight:a?700:500,fontFamily:"'Space Grotesk',sans-serif",transition:"all 0.2s"}),
    rp:a=>({padding:"3px 10px",borderRadius:20,fontSize:10,letterSpacing:1.5,textTransform:"uppercase",border:`1px solid ${a?C.teal:C.textDim}35`,color:a?C.teal:C.textDim,background:a?C.teal+"0C":"transparent",cursor:"pointer",fontWeight:600,fontFamily:"'Space Grotesk',sans-serif",transition:"all 0.2s"}),
    main:{display:"flex",minHeight:"calc(100vh - 47px)"},
    cnt:{flex:1,padding:"22px 30px",overflowY:"auto",maxHeight:"calc(100vh - 47px)"},
    pnl:{width:panelOpen?305:0,background:C.bg2,borderLeft:panelOpen?`1px solid ${C.border}`:"none",overflowY:"auto",overflowX:"hidden",maxHeight:"calc(100vh - 47px)",transition:"width 0.3s",flexShrink:0},
    pnlIn:{padding:panelOpen?"16px":"0",opacity:panelOpen?1:0,transition:"opacity 0.2s ease 0.1s",width:305,boxSizing:"border-box"},
    tp:{position:"fixed",right:panelOpen?313:8,top:60,zIndex:40,background:C.card,border:`1px solid ${C.cyan}20`,color:C.cyan,width:24,height:24,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,transition:"right 0.3s",fontFamily:"'Space Grotesk',sans-serif"},
    tbar:{display:"flex",gap:2,marginBottom:22,flexWrap:"wrap"},
    tb:a=>({padding:"6px 11px",borderRadius:8,border:"none",background:a?C.cyan+"12":"transparent",color:a?C.cyan:C.textMuted,cursor:"pointer",fontSize:12,fontWeight:a?700:500,fontFamily:"'Space Grotesk',sans-serif",transition:"all 0.2s",display:"flex",alignItems:"center",gap:4}),
    hn:{fontSize:40,fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.textBright,lineHeight:1.1,cursor:"pointer",marginBottom:5},
    ht:{fontSize:12,color:C.cyan,letterSpacing:3,textTransform:"uppercase",fontWeight:500,cursor:"pointer",marginBottom:16},
    sl:{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.textDim,marginBottom:11,fontWeight:600,display:"flex",alignItems:"center",gap:5},
    nr:{fontSize:15,lineHeight:1.9,color:C.text+"DD",maxWidth:640,fontFamily:"'Playfair Display',serif"},
    cd:{background:C.card,borderRadius:11,padding:"14px 18px",marginBottom:9,border:`1px solid ${C.border}`,transition:"all 0.25s"},
    ss:{background:C.card,borderRadius:11,padding:"13px 15px",flex:1,minWidth:115,border:`1px solid ${C.border}`},
    ssl:{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.textDim,marginBottom:4,fontWeight:600},
    ssv:{fontSize:22,fontWeight:700,color:C.cyan,fontFamily:"'Playfair Display',serif"},
    inp:{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 11px",color:C.text,fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:"'Space Grotesk',sans-serif",outline:"none"},
    lbl:{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.textDim,marginBottom:5,display:"block",fontWeight:600},
    sb:a=>({flex:1,padding:"7px 5px",borderRadius:8,border:`1px solid ${a?C.cyan:C.border}`,background:a?C.cyan+"10":C.card,color:a?C.cyan:C.textMuted,cursor:"pointer",fontSize:10,fontWeight:a?700:500,fontFamily:"'Space Grotesk',sans-serif",transition:"all 0.2s",textAlign:"center"}),
    vt:{display:"inline-block",padding:"3px 11px",borderRadius:20,background:theme.primary+"15",border:`1px solid ${theme.primary}28`,color:theme.primary,fontSize:11,fontWeight:600,marginRight:5,marginBottom:5},
    pc:a=>({padding:"12px 14px",borderRadius:11,border:`1px solid ${a?C.cyan:C.border}`,background:a?C.cyan+"08":C.card,cursor:"pointer",marginBottom:7,transition:"all 0.25s"}),
    bw:{maxWidth:660,margin:"0 auto",padding:"32px 0"},
    bc:{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"28px 24px",marginBottom:16},
    bi:{width:"100%",minHeight:85,background:C.surface,border:`1px solid ${C.cyan}12`,borderRadius:10,padding:13,color:C.text,fontSize:13,fontFamily:"'Space Grotesk',sans-serif",outline:"none",resize:"vertical",lineHeight:1.7},
    pb:{height:4,background:C.surface,borderRadius:2,marginBottom:26,overflow:"hidden"},
    pf:p=>({height:"100%",width:`${p}%`,background:`linear-gradient(90deg,${C.teal},${C.cyan},${C.sky})`,borderRadius:2,transition:"width 0.4s"}),
    btn:p=>({padding:"9px 20px",borderRadius:8,border:p?"none":`1px solid ${C.border}`,background:p?`linear-gradient(135deg,${C.teal},${C.cyan})`:"transparent",color:p?"#000":C.textMuted,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",letterSpacing:0.5}),
    fab:{position:"fixed",bottom:20,right:panelOpen?330:22,zIndex:60,width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},${C.cyan})`,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#000",fontWeight:800,boxShadow:`0 4px 20px ${C.teal}30`,transition:"right 0.3s,transform 0.15s",fontFamily:"'Space Grotesk',sans-serif"},
    mp:{position:"fixed",bottom:76,right:panelOpen?330:22,zIndex:60,width:280,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:16,boxShadow:`0 10px 40px rgba(0,0,0,0.6)`,transition:"right 0.3s"},
    fbb:{position:"fixed",bottom:20,right:panelOpen?384:76,zIndex:55,padding:"6px 12px",borderRadius:8,background:C.sky+"12",border:`1px solid ${C.sky}25`,color:C.sky,cursor:"pointer",fontSize:10,fontWeight:600,fontFamily:"'Space Grotesk',sans-serif",transition:"right 0.3s",letterSpacing:0.5},
    fbp:{position:"fixed",bottom:76,right:panelOpen?384:76,zIndex:55,width:300,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:16,boxShadow:`0 10px 40px rgba(0,0,0,0.6)`,transition:"right 0.3s"},
  };

  return(<div style={st.app}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}input:focus,textarea:focus{border-color:${C.cyan}50!important}@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .4s ease forwards}.fu1{animation:fu .4s ease .07s forwards;opacity:0}`}</style>

    {/* NAV */}
    <nav style={st.nav}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <span style={st.logo}>MOXtudio</span>
        <div style={{display:"flex",gap:3,marginLeft:8}}>
          <button style={st.mb(mode==="break")} onClick={()=>setMode(mode==="break"?"build":"break")}>MOXBreak</button>
          <button style={st.mb(mode==="build")} onClick={()=>setMode("build")}>MOXBuild</button>
          <button style={st.mb(mode==="lab")} onClick={()=>setMode(mode==="lab"?"build":"lab")}>MOXLab</button>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <button style={st.rp(role==="designer")} onClick={()=>setRole("designer")}>Designer</button>
        <button style={st.rp(role==="client")} onClick={()=>setRole("client")}>Client</button>
        <span style={{fontSize:9,letterSpacing:2,padding:"3px 7px",borderRadius:20,background:C.teal+"12",color:C.teal,fontWeight:700}}>● LIVE</span>
      </div>
    </nav>

    {/* MOXBREAK */}
    {mode==="break"&&<div style={st.bw} className="fu">
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:26,marginBottom:5}}>🔬</div>
        <div style={{fontSize:26,fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.textBright,marginBottom:5}}>MOXBreak: Find the Real Problem</div>
        <div style={{fontSize:12,color:C.textMuted,maxWidth:440,margin:"0 auto",lineHeight:1.7}}>Five stages. No shortcuts. No hand-waving. The breakthrough lives in the problem nobody wants to say out loud.</div>
      </div>
      <div style={st.pb}><div style={st.pf((brkStage+1)/BREAK_STAGES.length*100)}/></div>
      <div style={st.bc}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
          <span style={{fontSize:18}}>{BREAK_STAGES[brkStage].emoji}</span>
          <span style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:BREAK_STAGES[brkStage].color,fontWeight:700}}>Stage {brkStage+1}: {BREAK_STAGES[brkStage].stage}</span>
        </div>
        <div style={{fontSize:22,fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.textBright,lineHeight:1.3,marginBottom:8}}>{BREAK_STAGES[brkStage].q}</div>
        <div style={{fontSize:12,color:C.textMuted,lineHeight:1.6,marginBottom:16}}>{BREAK_STAGES[brkStage].sub}</div>
        <textarea style={st.bi} placeholder="Don't overthink it. Just type..." value={brkAns[brkStage]||""} onChange={e=>setBrkAns(p=>({...p,[brkStage]:e.target.value}))}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button style={st.btn(false)} onClick={()=>setBrkStage(Math.max(0,brkStage-1))}>{brkStage>0?"← Back":"—"}</button>
        {brkStage<4?<button style={st.btn(true)} onClick={()=>setBrkStage(brkStage+1)}>Keep Going →</button>
        :<button style={st.btn(true)} onClick={()=>{setMode("build");setTab("story")}}>🚀 Launch MOXBuild</button>}
      </div>
      {brkStage===4&&brkAns[4]&&<div style={{...st.cd,marginTop:18,borderColor:C.gold+"35",background:C.gold+"06"}} className="fu1">
        <div style={{fontSize:9,letterSpacing:3,color:C.gold,fontWeight:700,marginBottom:6}}>✨ BREAKTHROUGH UNLOCKED</div>
        <div style={{fontSize:13,color:C.text,lineHeight:1.8}}>Everyone said: <span style={{color:C.textMuted,fontStyle:"italic"}}>"{(brkAns[0]||"...").slice(0,80)}"</span><br/>The real blocker: <span style={{color:C.cyan,fontWeight:700}}>"{(brkAns[2]||"...").slice(0,80)}"</span><br/>The 100x play: <span style={{color:C.gold,fontWeight:700}}>"{(brkAns[4]||"...").slice(0,80)}"</span></div>
      </div>}
    </div>}

    {/* MOXLAB */}
    {mode==="lab"&&<div style={st.bw} className="fu">
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:26,marginBottom:5}}>⚗️</div>
        <div style={{fontSize:26,fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.textBright,marginBottom:5}}>MOXLab: Live Workshop</div>
        <div style={{fontSize:12,color:C.textMuted,maxWidth:440,margin:"0 auto",lineHeight:1.7}}>Problem → solution in one session. Share your screen. Nobody leaves until we build something real.</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:20}}>
        {["🎯 Define It","💡 Ideate","🔨 Stress Test","▶️ Build Live"].map((s2,i)=>(<div key={i} onClick={()=>setLabStep(i)} style={{flex:1,padding:"10px 8px",borderRadius:10,cursor:"pointer",background:labStep===i?C.cyan+"0C":C.card,border:`1px solid ${labStep===i?C.cyan+"35":C.border}`,textAlign:"center",transition:"all 0.2s"}}><div style={{fontSize:11,fontWeight:labStep===i?700:500,color:labStep===i?C.cyan:C.textMuted}}>{s2}</div></div>))}
      </div>
      <div style={st.bc} className="fu">
        {labStep===0&&<><div style={{fontSize:20,fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.textBright,marginBottom:6}}>What are we solving for?</div><div style={{fontSize:12,color:C.textMuted,marginBottom:14,lineHeight:1.6}}>Pull from MOXBreak or start fresh. Lock the challenge before we move.</div>{brkAns[2]&&<div style={{...st.cd,borderColor:C.gold+"30",background:C.gold+"06",marginBottom:12}}><div style={{fontSize:9,letterSpacing:2,color:C.gold,fontWeight:700,marginBottom:2}}>🔬 FROM MOXBreak</div><div style={{fontSize:12,color:C.text}}>"{brkAns[2]}"</div></div>}<textarea style={st.bi} placeholder="State the challenge..."/><button style={{...st.btn(true),marginTop:12}} onClick={()=>setLabStep(1)}>Lock It →</button></>}
        {labStep===1&&<><div style={{fontSize:20,fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.textBright,marginBottom:6}}>What could this look like?</div><div style={{fontSize:12,color:C.textMuted,marginBottom:12}}>No bad ideas. Volume over polish. GO.</div>{[1,2,3].map(i=><div key={i} style={{display:"flex",gap:7,alignItems:"center",marginBottom:7}}><span style={{color:C.cyan,fontWeight:800,fontSize:15,width:22}}>#{i}</span><input style={{...st.inp,flex:1}} placeholder={`Idea ${i}...`}/></div>)}<button style={{...st.btn(true),marginTop:12}} onClick={()=>setLabStep(2)}>Stress Test →</button></>}
        {labStep===2&&<><div style={{fontSize:20,fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.textBright,marginBottom:6}}>Break them on purpose.</div><div style={{fontSize:12,color:C.textMuted,marginBottom:12}}>Can we execute at scale? What breaks first?</div><textarea style={st.bi} placeholder="Capture the stress test..."/><button style={{...st.btn(true),marginTop:12}} onClick={()=>setLabStep(3)}>We Have a Winner →</button></>}
        {labStep===3&&<><div style={{fontSize:20,fontFamily:"'Playfair Display',serif",fontWeight:700,color:C.textBright,marginBottom:6}}>Build it. Right now. Together.</div><div style={{fontSize:12,color:C.textMuted,marginBottom:12}}>Switch to MOXBuild. Client watches it come alive in real time.</div><button style={st.btn(true)} onClick={()=>{setMode("build");setTab("story")}}>🚀 Open MOXBuild</button></>}
      </div>
    </div>}

    {/* MOXBUILD */}
    {mode==="build"&&<><button style={st.tp} onClick={()=>setPanelOpen(!panelOpen)}>{panelOpen?"›":"‹"}</button><div style={st.main}><div style={st.cnt}>
      <div style={st.tbar}>{TABS.map(t=><button key={t.id} style={st.tb(tab===t.id)} onClick={()=>setTab(t.id)}><span>{t.e}</span>{t.l}</button>)}</div>

      {tab==="story"&&<div className="fu">
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
          <div style={{flex:1}}>
            {editName?<input autoFocus value={conceptName} onChange={e=>setConceptName(e.target.value)} onBlur={()=>setEditName(false)} onKeyDown={e=>e.key==="Enter"&&setEditName(false)} style={{...st.inp,fontSize:40,fontFamily:"'Playfair Display',serif",fontWeight:700,background:"transparent",border:"none",borderBottom:`2px solid ${C.cyan}`,padding:"2px 0"}}/>:<div style={st.hn} onClick={()=>setEditName(true)}>{conceptName}</div>}
            {editTag?<input autoFocus value={tagline} onChange={e=>setTagline(e.target.value)} onBlur={()=>setEditTag(false)} onKeyDown={e=>e.key==="Enter"&&setEditTag(false)} style={{...st.inp,fontSize:12,letterSpacing:3,background:"transparent",border:"none",borderBottom:`2px solid ${C.cyan}`,textTransform:"uppercase",padding:"2px 0",color:C.cyan}}/>:<div style={st.ht} onClick={()=>setEditTag(true)}>{tagline}</div>}
          </div>
          <div style={{display:"flex",gap:4,marginTop:5}}><ShuffleBtn onClick={()=>setConceptName(shuffle(NAMES,conceptName))} label="Name"/><ShuffleBtn onClick={()=>setTagline(shuffle(TAGLINES,tagline))} label="Tagline"/></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:14}}><div style={{width:10,height:10,borderRadius:"50%",background:theme.primary,boxShadow:`0 0 8px ${theme.primary}40`}}/><span style={{fontSize:10,color:theme.primary,fontWeight:700,letterSpacing:1}}>{theme.name}</span><span style={{fontSize:10,color:C.textDim}}>— auto-detected from name</span></div>
        <div style={{display:"flex",flexWrap:"wrap",marginBottom:20}}>{theme.vibe.map((w,i)=><span key={i} style={st.vt}>{w}</span>)}</div>

        <div style={{position:"relative",width:"100%",height:200,borderRadius:14,overflow:"hidden",marginBottom:20,border:`2px solid ${theme.primary}25`}}>
          <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Restaurant atmosphere" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:`linear-gradient(to bottom,transparent 20%,${C.bg}EE 100%)`}}/>
        </div>

        {persona&&<div style={{...st.cd,borderColor:C.gold+"28",background:C.gold+"05",marginBottom:18}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}><span style={{fontSize:16}}>{PERSONAS[persona].icon}</span><span style={{fontWeight:700,color:C.gold,fontSize:12}}>Persona: {PERSONAS[persona].name}</span></div><div style={{fontSize:11,color:C.textMuted,lineHeight:1.6}}>{PERSONAS[persona].desc}</div><div style={{fontSize:9,color:C.gold,marginTop:6,fontWeight:600}}>💡 {PERSONAS[persona].adj.vibe}</div></div>}
        <div style={st.sl}>📖 Experience Narrative</div>
        <p style={st.nr}>{theme.narrative(conceptName)}</p>
        <div style={{...st.sl,marginTop:22}}>⭐ Signature Moment</div>
        <p style={{...st.nr,fontSize:13,fontStyle:"italic",borderLeft:`3px solid ${theme.primary}`,paddingLeft:14}}>{theme.signature}</p>
      </div>}

      {tab==="look"&&<div className="fu">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={st.sl}>🎨 Dynamic Palette — {theme.name}</div><ShuffleBtn onClick={()=>setConceptName(shuffle(NAMES,conceptName))} label="New Concept"/></div>
        <div style={{fontSize:10,color:C.textDim,marginBottom:14,fontStyle:"italic"}}>Palette auto-shifts with concept name. Rename "The Forge" to "Pearl Dive" and watch the entire identity transform.</div>

        <div style={{position:"relative",width:"100%",height:240,borderRadius:14,overflow:"hidden",marginBottom:24,border:`2px solid ${theme.primary}30`}}>
          <img src={themeKey==="fire"?"https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1200":themeKey==="ocean"?"https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200":themeKey==="earth"?"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200":themeKey==="electric"?"https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=1200":themeKey==="luxe"?"https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200":themeKey==="warm"?"https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1200":themeKey==="playful"?"https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=1200":themeKey==="street"?"https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=1200":themeKey==="refined"?"https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg?auto=compress&cs=tinysrgb&w=1200":"https://images.pexels.com/photos/1850595/pexels-photo-1850595.jpeg?auto=compress&cs=tinysrgb&w=1200"} alt={theme.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:`linear-gradient(135deg,${theme.primary}15,${theme.secondary}80)`}}/>
          <div style={{position:"absolute",bottom:16,left:16,right:16}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:C.textBright,textShadow:"0 2px 12px rgba(0,0,0,0.6)"}}>{conceptName}</div>
            <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:C.text+"CC",marginTop:4,fontWeight:500}}>{theme.name} Aesthetic</div>
          </div>
        </div>

        <div style={{display:"flex",gap:14,marginBottom:24}}>{[["Primary",theme.primary],["Secondary",theme.secondary],["Accent",theme.accent]].map(([l,h])=><div key={l} style={{textAlign:"center"}}><div style={{width:64,height:64,borderRadius:11,background:h,marginBottom:5,boxShadow:`0 4px 16px ${h}20`}}/><div style={{fontSize:9,color:C.textDim,letterSpacing:1,textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontSize:10,color:C.text,fontFamily:"monospace",marginTop:1}}>{h}</div></div>)}</div>
        <div style={st.sl}>🧱 Materials</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:20}}>{theme.materials.map(m=><span key={m} style={{padding:"4px 11px",borderRadius:8,background:C.card,color:C.text,fontSize:10,fontWeight:500,border:`1px solid ${C.border}`}}>{m}</span>)}</div>
        <div style={st.sl}>🪧 Brand Preview</div>
        <div style={{background:`linear-gradient(135deg,${theme.secondary},${C.bg})`,borderRadius:14,padding:36,textAlign:"center",border:`1px solid ${theme.primary}15`}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:44,fontWeight:700,color:theme.primary,lineHeight:1.1}}>{conceptName}</div><div style={{fontSize:10,letterSpacing:4,textTransform:"uppercase",color:C.text+"55",marginTop:8,fontWeight:500}}>{tagline}</div><div style={{width:36,height:2,background:theme.primary,margin:"14px auto 0",borderRadius:1}}/></div>
      </div>}

      {tab==="menu"&&<div className="fu">
        <div style={st.sl}>🍽 Menu — {evt.menu}</div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:8,marginBottom:20}}>
          <div style={{position:"relative",height:120,borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`}}>
            <img src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Hero dish" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:6,background:`linear-gradient(to top,${C.bg}EE,transparent)`,fontSize:8,color:C.textBright,fontWeight:700,letterSpacing:0.5}}>HERO DISH</div>
          </div>
          <div style={{position:"relative",height:120,borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`}}>
            <img src="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Signature cocktail" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:6,background:`linear-gradient(to top,${C.bg}EE,transparent)`,fontSize:8,color:C.textBright,fontWeight:700,letterSpacing:0.5}}>SIGNATURE DRINK</div>
          </div>
          <div style={{position:"relative",height:120,borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`}}>
            <img src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Side dish" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:6,background:`linear-gradient(to top,${C.bg}EE,transparent)`,fontSize:8,color:C.textBright,fontWeight:700,letterSpacing:0.5}}>SIDES & MORE</div>
          </div>
        </div>

        {["Hero","Side Kick"].map(cat=><div key={cat}><div style={{fontSize:10,letterSpacing:2,color:cat==="Hero"?C.cyan:C.teal,textTransform:"uppercase",fontWeight:700,marginBottom:5,marginTop:cat==="Side Kick"?16:0}}>{cat==="Hero"?"⭐ Hero Items":"🤝 Side Kicks"}</div>{menuItems.filter(i=>i.cat===cat).map(item=><div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,marginBottom:1,color:C.textBright}}>{item.name}</div><div style={{fontSize:11,color:C.textMuted}}>{item.desc}</div>{role==="designer"&&<div style={{fontSize:9,color:C.textDim,marginTop:2}}>Cost: ${item.cost.toFixed(2)} ({((item.cost/item.price)*100).toFixed(0)}%)</div>}</div><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontWeight:700,color:C.cyan,fontSize:15,fontFamily:"'Playfair Display',serif"}}>${item.price}</span><button onClick={()=>setMenuItems(p=>p.filter(x=>x.id!==item.id))} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:13,padding:"1px 4px"}}>×</button></div></div>)}</div>)}
        <button onClick={()=>{const nid=Math.max(...menuItems.map(i=>i.id))+1;setMenuItems(p=>[...p,{id:nid,name:"New Item",cat:"Side Kick",price:14,cost:3.50,desc:"Tap to customize"}])}} style={{background:C.cyan+"08",border:`1px dashed ${C.cyan}22`,borderRadius:10,padding:10,width:"100%",color:C.cyan,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'Space Grotesk',sans-serif",marginTop:10}}>+ Add to the Menu</button>
      </div>}

      {tab==="bar"&&<div className="fu">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={st.sl}>{bev.emoji} {bev.name}</div><ShuffleBtn onClick={()=>{const k=Object.keys(BEV_PROGRAMS);setBevProg(shuffle(k,bevProg))}} label="Switch"/></div>

        <div style={{position:"relative",width:"100%",height:160,borderRadius:14,overflow:"hidden",marginBottom:20,border:`2px solid ${C.cyan}25`}}>
          <img src={bevProg==="craft"?"https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1200":bevProg==="beer"?"https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=1200":bevProg==="premium"?"https://images.pexels.com/photos/1170599/pexels-photo-1170599.jpeg?auto=compress&cs=tinysrgb&w=1200":"https://images.pexels.com/photos/4021985/pexels-photo-4021985.jpeg?auto=compress&cs=tinysrgb&w=1200"} alt="Bar program" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:`linear-gradient(135deg,${C.cyan}08,${C.bg}CC)`}}/>
          <div style={{position:"absolute",bottom:12,left:14,right:14}}>
            <div style={{fontSize:18,fontWeight:700,color:C.textBright,fontFamily:"'Playfair Display',serif",textShadow:"0 2px 8px rgba(0,0,0,0.6)"}}>{bev.name}</div>
          </div>
        </div>

        <div style={{display:"flex",gap:10,marginBottom:20}}><div style={st.ss}><div style={st.ssl}>Bev Per Cap</div><div style={st.ssv}><ANum value={bev.perCap} pre="$" dec={2}/></div></div><div style={st.ss}><div style={st.ssl}>Pour Cost</div><div style={st.ssv}><ANum value={bev.costPct} suf="%" dec={0}/></div></div></div>
        <div style={st.sl}>🍹 Signature Pours</div>
        {bev.drinks.map((d,i)=><div key={i} style={st.cd}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:13,marginBottom:1,color:C.textBright}}>{d.n}</div><div style={{fontSize:11,color:C.textMuted}}>{d.d}</div></div><span style={{fontWeight:700,color:C.cyan,fontSize:15,fontFamily:"'Playfair Display',serif"}}>${d.p}</span></div></div>)}
      </div>}

      {tab==="numbers"&&<div className="fu">
        <div style={st.sl}>📊 Financial Model — {evt.name} × {pos.name} {persona?`× ${PERSONAS[persona].name}`:""}</div>
        <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:20}}>
          {[{l:"Revenue",v:`$${totalRev>=1e6?(totalRev/1e6).toFixed(1)+"M":(totalRev/1e3).toFixed(0)+"K"}`},{l:"Gross Profit",v:`$${gross>=1e6?(gross/1e6).toFixed(1)+"M":(gross/1e3).toFixed(0)+"K"}`},{l:"Margin",v:`${margin.toFixed(1)}%`,c:margin>=65?C.success:margin>=55?C.warn:C.danger},{l:"Attendance",v:att.toLocaleString()},{l:"Staff",v:staff}].map((x,i)=><div key={i} style={st.ss}><div style={st.ssl}>{x.l}</div><div style={{...st.ssv,color:x.c||C.cyan}}>{x.v}</div></div>)}
        </div>
        <div style={st.sl}>Revenue Split</div>
        <div style={st.cd}>{[{l:"Food",v:foodRev,c:C.teal},{l:"Beverage",v:bevRev,c:C.sky}].map((r,i)=><div key={i} style={{marginBottom:i===0?10:0}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,fontWeight:600}}>{r.l}</span><span style={{fontWeight:700,color:r.c,fontSize:12}}>${(r.v/1000).toFixed(0)}K</span></div><div style={{height:5,borderRadius:3,background:C.surface,overflow:"hidden"}}><div style={{height:"100%",width:`${totalRev>0?(r.v/totalRev)*100:0}%`,background:r.c,borderRadius:3,transition:"width 0.5s"}}/></div></div>)}</div>
        <div style={{...st.sl,marginTop:16}}>Per Capita</div>
        <div style={{display:"flex",gap:9}}><div style={st.ss}><div style={st.ssl}>Food</div><div style={st.ssv}><ANum value={adjFPC} pre="$" dec={2}/></div></div><div style={st.ss}><div style={st.ssl}>Bev</div><div style={st.ssv}><ANum value={bev.perCap} pre="$" dec={2}/></div></div><div style={st.ss}><div style={st.ssl}>Combined</div><div style={{...st.ssv,color:C.gold}}><ANum value={adjFPC+bev.perCap} pre="$" dec={2}/></div></div></div>
      </div>}

      {tab==="ops"&&role==="designer"&&<div className="fu">
        <div style={st.sl}>⚙️ Blueprint — {evt.name}</div>
        <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:20}}>
          <div style={st.ss}><div style={st.ssl}>Staff/Shift</div><div style={st.ssv}><ANum value={staff} dec={0}/></div></div>
          <div style={st.ss}><div style={st.ssl}>Prep</div><div style={st.ssv}>3<span style={{fontSize:11,color:C.textDim}}>/5</span></div></div>
          <div style={st.ss}><div style={st.ssl}>Speed</div><div style={st.ssv}>4<span style={{fontSize:11,color:C.textDim}}>min</span></div></div>
          <div style={st.ss}><div style={st.ssl}>Footprint</div><div style={st.ssv}>800<span style={{fontSize:11,color:C.textDim}}>sf</span></div></div>
        </div>
        <div style={st.sl}>👥 Staffing</div>
        <div style={st.cd}>{[{r:"Lead Cook",c:Math.max(1,Math.round(2*evt.staff))},{r:"Line Cooks",c:Math.max(2,Math.round(4*evt.staff))},{r:"Cashiers",c:Math.max(1,Math.round(3*evt.staff))},{r:"Prep/Runner",c:Math.max(1,Math.round(3*evt.staff))},{r:"Bar Staff",c:Math.max(1,Math.round(4*evt.staff))},{r:"Supervisor",c:Math.max(1,Math.round(2*evt.staff))}].map((x,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<5?`1px solid ${C.bg}`:""}}><span style={{fontSize:11}}>{x.r}</span><span style={{fontWeight:700,color:C.cyan,fontSize:12}}>{x.c}</span></div>)}</div>
      </div>}

      {tab==="personas"&&<div className="fu">
        <div style={st.sl}>🎭 Brand Persona — Who is this concept?</div>
        <div style={{fontSize:12,color:C.textMuted,marginBottom:16,lineHeight:1.7}}>Every great concept has a personality. Pick one and it shifts your pricing, portion philosophy, and the entire vibe. Think of it like casting the lead character for your space.</div>
        {Object.entries(PERSONAS).map(([k,p])=><div key={k} style={st.pc(persona===k)} onClick={()=>setPersona(persona===k?null:k)}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <span style={{fontSize:22}}>{p.icon}</span>
              <div><div style={{fontWeight:700,fontSize:13,color:persona===k?C.cyan:C.textBright}}>{p.name}</div><div style={{fontSize:11,color:C.textMuted}}>{p.tagline}</div></div>
            </div>
            {persona===k&&<span style={{fontSize:9,color:C.cyan,fontWeight:700,letterSpacing:2}}>ACTIVE</span>}
          </div>
          {persona===k&&<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
            <div style={{fontSize:11,color:C.text,lineHeight:1.7,marginBottom:8}}>{p.desc}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{p.traits.map((t,i)=><span key={i} style={{padding:"2px 9px",borderRadius:6,background:C.cyan+"0C",border:`1px solid ${C.cyan}18`,fontSize:9,color:C.cyan,fontWeight:600}}>{t}</span>)}</div>
            <div style={{fontSize:9,color:C.gold,marginTop:7,fontWeight:600}}>💡 {p.adj.vibe}</div>
            <div style={{fontSize:9,color:C.textDim,marginTop:2}}>Food per cap: {p.adj.foodPC>0?"+":""}${p.adj.foodPC} | Staff: {p.adj.staff}x</div>
          </div>}
        </div>)}
      </div>}

    </div>

    {/* CONFIG PANEL */}
    <div style={st.pnl}><div style={st.pnlIn}>
      <div style={{fontSize:12,fontWeight:700,marginBottom:16,color:C.textBright}}>🎛 Configure</div>
      <div style={{marginBottom:12}}><label style={st.lbl}>Concept Name</label><div style={{display:"flex",gap:4}}><input style={{...st.inp,flex:1}} value={conceptName} onChange={e=>setConceptName(e.target.value)}/><ShuffleBtn onClick={()=>setConceptName(shuffle(NAMES,conceptName))} label="🎲"/></div><div style={{fontSize:8,color:theme.primary,fontWeight:600,marginTop:3}}>● {theme.name} (auto-detected)</div></div>
      <div style={{marginBottom:12}}><label style={st.lbl}>Tagline</label><div style={{display:"flex",gap:4}}><input style={{...st.inp,flex:1}} value={tagline} onChange={e=>setTagline(e.target.value)}/><ShuffleBtn onClick={()=>setTagline(shuffle(TAGLINES,tagline))} label="🎲"/></div></div>
      <div style={{marginBottom:12}}><label style={st.lbl}>Positioning</label><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>{Object.entries(POSITIONS).map(([k,p])=><button key={k} style={st.sb(positioning===k)} onClick={()=>setPositioning(k)}>{p.emoji} {p.name.split(" ").slice(0,2).join(" ")}</button>)}</div></div>
      <div style={{marginBottom:12}}><label style={st.lbl}>Beverage</label><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>{Object.entries(BEV_PROGRAMS).map(([k,b])=><button key={k} style={st.sb(bevProg===k)} onClick={()=>setBevProg(k)}>{b.emoji} {b.name.split(" ").slice(0,2).join(" ")}</button>)}</div></div>
      <div style={{marginBottom:12}}><label style={st.lbl}>Event Scenario</label>{Object.entries(SCENARIOS).map(([k,e])=><div key={k} style={{padding:"7px 9px",borderRadius:8,border:`1px solid ${scenario===k?C.cyan+"35":C.border}`,background:scenario===k?C.cyan+"08":"transparent",cursor:"pointer",marginBottom:3}} onClick={()=>setScenario(k)}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:scenario===k?700:500,fontSize:11}}>{e.emoji} {e.name}</span><span style={{fontSize:9,color:scenario===k?C.cyan:C.textDim}}>{e.att}%</span></div>{scenario===k&&<div style={{fontSize:9,color:C.textMuted,marginTop:2}}>{e.flavor}</div>}</div>)}</div>
      <div style={{marginBottom:12}}><label style={st.lbl}>Venue Capacity</label><input type="range" min={5000} max={80000} step={1000} value={capacity} onChange={e=>setCapacity(+e.target.value)} style={{width:"100%",accentColor:C.cyan}}/><div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.textDim,marginTop:1}}><span>5K</span><span style={{color:C.cyan,fontWeight:700}}>{(capacity/1000).toFixed(0)}K</span><span>80K</span></div></div>
      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:4}}><label style={st.lbl}>📊 Live</label>{[{l:"Attendance",v:att.toLocaleString()},{l:"Revenue",v:`$${(totalRev/1000).toFixed(0)}K`},{l:"Margin",v:`${margin.toFixed(1)}%`,c:margin>=65?C.success:margin>=55?C.warn:C.danger},{l:"Staff",v:staff}].map((x,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:2}}><span style={{color:C.textDim}}>{x.l}</span><span style={{fontWeight:700,color:x.c||C.cyan}}>{x.v}</span></div>)}</div>
    </div></div>
    </div></>}

    {/* MOXIE FAB */}
    <button style={st.fab} onClick={()=>setMoxieOpen(!moxieOpen)} onMouseOver={e=>e.currentTarget.style.transform="scale(1.08)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>{moxieOpen?"×":"M"}</button>
    {moxieOpen&&<div style={st.mp}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}><div style={{width:24,height:24,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},${C.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#000",fontWeight:800}}>M</div><div><div style={{fontSize:11,fontWeight:700,color:C.textBright}}>Moxie</div><div style={{fontSize:8,color:C.textMuted}}>Your opinionated co-strategist</div></div></div>
    <div style={{background:C.card,borderRadius:10,padding:12,marginBottom:8,border:`1px solid ${C.border}`}}><p style={{fontSize:11,color:C.text,lineHeight:1.7,margin:0}}>{tips[moxieIdx%tips.length]}</p></div>
    <button onClick={()=>setMoxieIdx(i=>i+1)} style={{...st.sb(true),width:"100%",padding:7}}>Hit Me Again →</button></div>}

    {/* MOXIE FEEDBACK */}
    <button style={st.fbb} onClick={()=>setFbOpen(!fbOpen)}>{fbOpen?"×":"💬 MOX Feedback"}</button>
    {fbOpen&&<div style={st.fbp}><div style={{fontSize:11,fontWeight:700,color:C.textBright,marginBottom:2}}>💬 Feedback to MOX Team</div><div style={{fontSize:9,color:C.textMuted,marginBottom:10,lineHeight:1.5}}>Goes straight to the MOX team with AI context. We read everything.</div>
    {fbSent?<div style={{textAlign:"center",padding:16}}><div style={{fontSize:20,marginBottom:4}}>✓</div><div style={{fontSize:12,color:C.teal,fontWeight:700}}>Sent! We're on it.</div></div>:<><textarea value={fbText} onChange={e=>setFbText(e.target.value)} placeholder="Questions, ideas, complaints, dreams..." style={{...st.bi,minHeight:65,marginBottom:7}}/><button onClick={sendFb} disabled={!fbText.trim()} style={{...st.btn(true),width:"100%",opacity:fbText.trim()?1:0.4}}>Send →</button></>}</div>}
  </div>);
}
