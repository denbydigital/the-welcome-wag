export const WW_FOODS = [
  { name: "Pumpkin", cat: "Vegetables", verdict: "safe", trust: "vet", conf: "high", note: "Plain, cooked pumpkin is gentle on the stomach and a good source of fibre.", detail: "Plain steamed or roasted pumpkin (no butter, salt or spices) settles a loose tummy and is safe in small amounts. A tablespoon mixed into dinner is plenty for a puppy.", alts: ["Carrot", "Sweet potato"] },
  { name: "Grapes & sultanas", cat: "Fruit", verdict: "unsafe", trust: "vet", conf: "high", severity: "high", note: "Toxic to dogs — can cause acute kidney failure even in tiny amounts.", detail: "Grapes, sultanas and raisins are toxic to dogs. The toxic dose is unpredictable, so there is no safe amount. If your dog has eaten any, treat it as urgent.", alts: ["Blueberries", "Apple (no seeds)"] },
  { name: "Chicken (cooked)", cat: "Meat", verdict: "safe", trust: "vet", conf: "high", note: "Plain cooked chicken with no bones, skin or seasoning is an everyday staple.", detail: "Boiled or roasted chicken breast, off the bone and unseasoned, is one of the safest proteins and a common bland-diet ingredient. Never feed cooked bones — they splinter.", alts: ["Turkey (cooked)", "White fish"] },
  { name: "Cheese", cat: "Dairy", verdict: "caution", trust: "vet", conf: "medium", note: "Small amounts are fine for most dogs; high in fat and some dogs are lactose-sensitive.", detail: "A pea-sized piece makes a great training treat. Avoid if your dog gets loose stools, and steer clear of soft, mouldy or heavily salted cheeses.", alts: ["Plain yoghurt (small)", "Cooked chicken"] },
  { name: "Onion & garlic", cat: "Pantry", verdict: "unsafe", trust: "vet", conf: "high", severity: "high", note: "Damage red blood cells — toxic raw, cooked, powdered or in leftovers.", detail: "All forms of the allium family are toxic and the effect builds up over time. Watch for them hidden in gravy, stocks and table scraps. Keep all human leftovers out of reach.", alts: ["Pumpkin", "Green beans"] },
  { name: "Peanut butter", cat: "Pantry", verdict: "caution", trust: "community", conf: "medium", note: "Great for enrichment — but only if it's xylitol-free. Always check the label.", detail: "A smear in a KONG keeps a puppy busy. Xylitol (a sweetener in some 'no added sugar' brands) is highly toxic to dogs, so read every label. Choose a plain, unsalted peanut butter.", alts: ["Plain yoghurt", "Mashed banana"] },
  { name: "Apple", cat: "Fruit", verdict: "safe", trust: "vet", conf: "high", note: "Crunchy and hydrating — remove the core and seeds first.", detail: "Apple slices are a low-fat, vitamin-rich treat. Remove the core and pips (which contain trace cyanide) and cut into puppy-safe pieces.", alts: ["Blueberries", "Watermelon (no rind)"] },
  { name: "Macadamia nuts", cat: "Pantry", verdict: "unsafe", trust: "vet", conf: "high", severity: "high", note: "An Australian classic that's toxic to dogs — even a few can cause weakness and tremors.", detail: "Macadamias cause weakness, vomiting, tremors and hyperthermia in dogs, usually within 12 hours. Keep the nut bowl and any macadamia cookies well out of reach.", alts: ["Carrot sticks", "Apple"] },
  { name: "Vegemite", cat: "Pantry", verdict: "caution", trust: "community", conf: "caution", note: "Very high in salt — a tiny scrape is unlikely to harm, but it's not a treat to offer.", detail: "We don't have strong evidence here, so we're cautious: Vegemite's salt and yeast-extract content means it's best avoided. A licked-clean knife won't hurt, but don't make it a habit.", alts: ["Plain peanut butter", "Pumpkin"] },
]

export const WW_BEHAVIOURS = [
  { id: "night-crying", icon: "moon", tone: "sky", cat: "Settling", title: "Crying at night", normal: "Very common", sub: "Almost every puppy does this in week one.", trust: "vet" },
  { id: "chewing", icon: "bone", tone: "honey", cat: "Mouthing", title: "Chewing everything", normal: "Normal for age", sub: "Teething peaks around 12–16 weeks.", trust: "vet" },
  { id: "toileting", icon: "footprints", tone: "sage", cat: "Toilet training", title: "Indoor accidents", normal: "Expected", sub: "Bladder control is still developing.", trust: "vet" },
  { id: "barking", icon: "megaphone", tone: "brand", cat: "Vocal", title: "Barking at sounds", normal: "Common", sub: "New home, new noises — it settles.", trust: "community" },
  { id: "jumping", icon: "arrow-up", tone: "honey", cat: "Greeting", title: "Jumping up", normal: "Learned habit", sub: "Easy to redirect early.", trust: "vet" },
  { id: "separation", icon: "door-open", tone: "coral", cat: "Alone time", title: "Distress when alone", normal: "Watch closely", sub: "Build up alone-time slowly.", trust: "vet" },
  { id: "nipping", icon: "hand", tone: "sky", cat: "Mouthing", title: "Nipping hands", normal: "Normal play", sub: "Bite inhibition is being learned.", trust: "vet" },
  { id: "pacing", icon: "repeat", tone: "neutral", cat: "Settling", title: "Pacing & restlessness", normal: "Adjusting", sub: "Often eases as routine forms.", trust: "community" },
]

export const WW_SHOPPING = [
  { cat: "Feeding", icon: "utensils-crossed", items: [
    { name: "Stainless steel bowls (×2)", why: "Easy to clean and won't harbour bacteria like plastic.", brand: "Peggy", price: "$18", urgency: "now", have: false },
    { name: "Puppy food — current brand", why: "Keep on the breeder's food for 1–2 weeks to avoid tummy upset.", brand: "Black Hawk Puppy", price: "$36", urgency: "now", have: false },
    { name: "Slow-feeder mat", why: "Slows fast eaters and adds enrichment at mealtimes.", brand: "LickiMat", price: "$15", urgency: "soon", have: false },
  ]},
  { cat: "Sleeping", icon: "bed", items: [
    { name: "Crate or playpen", why: "A safe den helps settle and supports toilet training.", brand: "Pet One", price: "$89", urgency: "now", have: false },
    { name: "Washable bedding", why: "Accidents happen in week one — two sets means one's always clean.", brand: "Snooza", price: "$45", urgency: "now", have: false },
  ]},
  { cat: "Safety & ID", icon: "shield-check", items: [
    { name: "Council registration", why: "Required in most states — register once vaccinated and microchipped.", brand: "Service NSW", price: "from $26", urgency: "now", have: false },
    { name: "Flat collar + ID tag", why: "A visible tag gets a lost puppy home fast.", brand: "Anley", price: "$22", urgency: "now", have: false },
    { name: "Adjustable harness", why: "Kinder than collar-pressure for a small puppy learning to walk.", brand: "EzyDog", price: "$39", urgency: "soon", have: false },
  ]},
  { cat: "Play & training", icon: "bone", items: [
    { name: "KONG (puppy size)", why: "Stuff and freeze for crate time — a sanity-saver in week one.", brand: "KONG Puppy", price: "$16", urgency: "soon", have: false },
    { name: "Treat pouch + training treats", why: "Tiny soft treats make early recall and toilet training easy.", brand: "Prime100", price: "$24", urgency: "nice", have: false },
  ]},
]

export const WW_VETS = [
  { name: "Newtown Veterinary Clinic", suburb: "King St, Newtown", dist: "650 m", open: true, hours: "Open until 7pm", phone: "(02) 9519 4111", note: "Puppy-friendly · weekend hours", rating: "Recommended" },
  { name: "Inner West Animal Hospital", suburb: "Enmore Rd, Enmore", dist: "1.4 km", open: true, hours: "Open until 6pm", phone: "(02) 9557 2233", note: "Has in-house pathology" },
  { name: "Sydney Animal Emergency", suburb: "Rosebery", dist: "4.2 km", open: true, hours: "24 hours", phone: "(02) 9197 5800", note: "After-hours & emergencies", emergency: true },
]

export const WW_VET_QUESTIONS = [
  "Is my dog's weight on track for their age and breed?",
  "When is the next vaccination due, and what does it cover?",
  "When should we start flea, tick and worming treatment?",
  "What's your advice on desexing timing for this breed?",
  "Any breed-specific things I should watch for?",
]

export const WW_ROUTINE = [
  { time: "6:30am", label: "Wake & toilet", icon: "sunrise", tone: "honey", note: "Straight outside — puppies need to go the moment they wake." },
  { time: "7:00am", label: "Breakfast", icon: "utensils-crossed", tone: "brand", note: "Meal 1 of 3. Same spot, same time." },
  { time: "7:30am", label: "Toilet break", icon: "footprints", tone: "sage", essential: true },
  { time: "9:00am", label: "Nap / crate time", icon: "moon", tone: "sky", note: "Puppies sleep 18–20 hrs a day. Protect rest." },
  { time: "11:30am", label: "Play & training", icon: "bone", tone: "honey", note: "5 mins of recall, then free play." },
  { time: "12:00pm", label: "Lunch", icon: "utensils-crossed", tone: "brand", note: "Meal 2 of 3." },
  { time: "12:30pm", label: "Toilet break", icon: "footprints", tone: "sage", essential: true },
  { time: "3:00pm", label: "Nap / crate time", icon: "moon", tone: "sky" },
  { time: "5:30pm", label: "Dinner", icon: "utensils-crossed", tone: "brand", note: "Meal 3 of 3." },
  { time: "8:30pm", label: "Wind-down & last toilet", icon: "footprints", tone: "sage", note: "Calm play only, then settle for the night." },
]

export const WW_TIMELINE = {
  today: [
    { icon: "bell", tone: "honey", title: "Heartworm prevention", sub: "Monthly · ask your vet to start", meta: "Today" },
    { icon: "stethoscope", tone: "sage", title: "Second vaccination", sub: "C3 booster · book with your vet", meta: "Fri 6 Jun" },
    { icon: "map-pin", tone: "sky", title: "Council registration", sub: "Required in most states once microchipped", meta: "2 days" },
  ],
  upcoming: [
    { stage: "First week", title: "Start short on-lead walks", when: "From day 8", desc: "Once the second vaccination has had a week to take effect." },
    { stage: "First month", title: "Begin puppy preschool", when: "Week 3", desc: "Early socialisation window closes around 16 weeks — book ahead." },
    { stage: "First month", title: "Desexing conversation", when: "Week 4", desc: "Talk timing with your vet at the next visit." },
  ],
}
