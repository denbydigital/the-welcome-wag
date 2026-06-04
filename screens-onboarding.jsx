// Welcome Wag — onboarding screens: Welcome, Sign up, Profile setup.
const { useState: useStateO } = React;

/* Shared scroll scaffold for mobile screens */
function WWScreen({ children, scroll = true, tabBar, footer, padBottom = 110 }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "var(--cream-50)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: "var(--font-body)" }}>
      <div className="ww-scroll" style={{ flex: 1, minHeight: 0, overflowY: scroll ? "auto" : "hidden", paddingTop: 52, paddingBottom: footer ? 0 : (tabBar ? padBottom : 28) }}>
        {children}
      </div>
      {footer}
      {tabBar}
    </div>
  );
}

/* ─── Welcome / splash ──────────────────────────────────────── */
function WelcomeScreen({ onContinue, onSignIn }) {
  return (
    <WWScreen>
      <div style={{ padding: "20px 24px 24px", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <img src="assets/mark.svg" style={{ position: "absolute", right: -90, top: 90, width: 320, opacity: 0.05 }} alt="" />
        </div>
        <div style={{ marginTop: 18, display: "flex", justifyContent: "center", position: "relative" }}>
          <img src="assets/mark.svg" style={{ width: 88, height: 88 }} alt="" />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", gap: 18, position: "relative" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 39, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05, color: "var(--ink-900)", margin: 0 }}>
            A warm welcome<br />for your new dog.
          </h1>
          <p style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontSize: 19, lineHeight: 1.35, color: "var(--ink-700)", margin: "0 14px", textWrap: "pretty" }}>
            Tailored guidance, reminders and records — from day one to settled. Made for new owners across Australia.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8, position: "relative" }}>
          <WWButton variant="primary" size="lg" full onClick={onContinue} iconRight="arrow-right">Get started</WWButton>
          <WWButton variant="ghost" size="md" full onClick={onSignIn}>I've used Welcome Wag before</WWButton>
        </div>
      </div>
    </WWScreen>
  );
}

/* ─── Sign up (Access & Setup) ──────────────────────────────── */
function AuthScreen({ onBack, onComplete }) {
  const [email, setEmail] = useStateO("");
  const [pw, setPw] = useStateO("");
  const strong = pw.length >= 8;
  const valid = /\S+@\S+\.\S+/.test(email) && strong;
  return (
    <WWScreen>
      <div style={{ padding: "8px 20px 0" }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "var(--radius-pill)", border: 0, background: "var(--paper)", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-900)", marginBottom: 22 }}>
          <WWIcon name="arrow-left" size={18} />
        </button>
        <div style={{ marginBottom: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Create your account</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 29, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0 }}>Let's set up a safe home for your dog's details.</h1>
          <p style={{ fontSize: 14, color: "var(--ink-500)", margin: "8px 0 0", lineHeight: 1.45 }}>So your profile, plan and reminders are here whenever you come back. It's free, and we won't email you marketing.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <WWInput label="Email" value={email} onChange={setEmail} placeholder="you@email.com" prefixIcon="mail" type="email" autoFocus />
          <WWInput label="Password" value={pw} onChange={setPw} placeholder="At least 8 characters" prefixIcon="lock" type="password"
            help={pw.length === 0 ? "Use 8+ characters." : strong ? undefined : "A little longer — 8 characters minimum."} />
          {pw.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--cream-200)", overflow: "hidden" }}>
                <div style={{ width: strong ? "100%" : "45%", height: "100%", borderRadius: 999, background: strong ? "var(--sage-500)" : "var(--honey-500)", transition: "all 220ms var(--ease-out)" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: strong ? "var(--sage-700)" : "var(--honey-600)" }}>{strong ? "Strong" : "Keep going"}</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 20px 24px", background: "linear-gradient(to top, var(--cream-50) 65%, transparent)" }}>
        <WWButton variant="primary" size="lg" full disabled={!valid} onClick={onComplete} iconRight="arrow-right">Create account</WWButton>
        <p style={{ fontSize: 11.5, color: "var(--ink-500)", textAlign: "center", margin: "12px 0 0", lineHeight: 1.5 }}>
          By continuing you agree to our terms. The Welcome Wag offers guidance, not veterinary diagnosis.
        </p>
      </div>
    </WWScreen>
  );
}

/* ─── Profile setup (multi-step) ────────────────────────────── */
function OnboardingScreen({ onComplete, onBack }) {
  const [step, setStep] = useStateO(0);
  const [name, setName] = useStateO("Cooper");
  const [age, setAge] = useStateO("11");
  const [ageUnit, setAgeUnit] = useStateO("weeks");
  const [breed, setBreed] = useStateO("Cocker Spaniel");
  const [bg, setBg] = useStateO("breeder");
  const [postcode, setPostcode] = useStateO("2042");
  const [stage, setStage] = useStateO("Day 1–7");
  const steps = ["Name", "Age", "Breed", "Background", "Postcode", "Arrival"];

  const next = () => step < steps.length - 1 ? setStep(step + 1) : onComplete?.();
  const back = () => step > 0 ? setStep(step - 1) : onBack?.();

  const Chip = ({ active, onClick, children, sub }) => (
    <button onClick={onClick} style={{
      textAlign: "left", padding: sub ? "14px 16px" : "8px 14px", borderRadius: sub ? 16 : 999, cursor: "pointer",
      border: active ? "1.5px solid var(--brand)" : "1px solid var(--cream-300)",
      background: active ? "var(--brand-tint)" : "var(--paper)",
      color: active ? "var(--brand-press)" : "var(--ink-700)", fontWeight: 600, fontSize: sub ? 15 : 13.5,
      display: sub ? "flex" : "inline-flex", flexDirection: "column", gap: sub ? 3 : 0,
    }}>
      {children}
      {sub && <span style={{ fontSize: 13, fontWeight: 400, color: active ? "var(--brand-press)" : "var(--ink-500)" }}>{sub}</span>}
    </button>
  );

  return (
    <WWScreen>
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <button onClick={back} style={{ width: 38, height: 38, borderRadius: "var(--radius-pill)", border: 0, background: "var(--paper)", boxShadow: "var(--shadow-xs)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-900)" }}>
            <WWIcon name="arrow-left" size={18} />
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((_, i) => (
              <span key={i} style={{ width: i === step ? 22 : 6, height: 6, borderRadius: 999, background: i <= step ? "var(--brand)" : "var(--cream-300)", transition: "all 220ms var(--ease-out)" }} />
            ))}
          </div>
          <div style={{ width: 38 }} />
        </div>

        <div style={{ marginBottom: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Step {step + 1} of {steps.length}</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 29, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.08, margin: 0 }}>
            {step === 0 && "What's your dog's name?"}
            {step === 1 && `How old is ${name || "your dog"}?`}
            {step === 2 && `What breed is ${name || "your dog"}?`}
            {step === 3 && `Where's ${name || "your dog"} coming from?`}
            {step === 4 && "What's your postcode?"}
            {step === 5 && `When does ${name || "your dog"} arrive?`}
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-500)", margin: "8px 0 0", lineHeight: 1.45, textWrap: "pretty" }}>
            {step === 0 && "We'll use this everywhere, so the app feels like a conversation, not a manual."}
            {step === 1 && "An estimate is fine — you can refine it any time."}
            {step === 2 && "Pick the closest if mixed. Breed shapes guidance on exercise, health checks and training."}
            {step === 3 && "A rescue or foster dog may need a gentler start, so we tailor early behaviour guidance."}
            {step === 4 && "Local rules vary across states — registration, tick season, even council requirements. Used for guidance only."}
            {step === 5 && "Guidance changes a lot in the first weeks. We'll meet you where you are."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {step === 0 && <WWInput label="Your dog's name" value={name} onChange={setName} autoFocus help="You can change this later." />}
          {step === 1 && (
            <>
              <WWInput label="Age" value={age} onChange={setAge} suffix={ageUnit} type="number" />
              <div style={{ display: "flex", gap: 8 }}>
                {["weeks", "months", "years"].map((u) => <Chip key={u} active={ageUnit === u} onClick={() => setAgeUnit(u)}>{u}</Chip>)}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <WWInput label="Breed" value={breed} onChange={setBreed} help="Not sure? Pick 'Mixed / unknown'." />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                {["Cocker Spaniel", "Kelpie", "Labrador", "Staffy", "Cavoodle", "Mixed / unknown"].map((b) => (
                  <Chip key={b} active={breed === b} onClick={() => setBreed(b)}>{b}</Chip>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: "breeder", t: "From a breeder", s: "Likely a young puppy with known history." },
                { id: "rescue", t: "Rescue or shelter", s: "We'll allow for transition stress and unknowns." },
                { id: "foster", t: "Foster", s: "Short-term care guidance, gentle settling." },
                { id: "rehome", t: "Rehomed privately", s: "Adjusting to a new home and routine." },
              ].map((o) => <Chip key={o.id} active={bg === o.id} onClick={() => setBg(o.id)} sub={o.s}>{o.t}</Chip>)}
            </div>
          )}
          {step === 4 && <WWInput label="Postcode" value={postcode} onChange={setPostcode} prefixIcon="map-pin" help="We use this for local vets, brands and council rules — not marketing." />}
          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: "arrived", t: "Already home", s: "Day-one essentials and a settling-in plan." },
                { id: "Day 1–7", t: "Arriving this week", s: "Prep the house, the kit and a first vet visit." },
                { id: "month", t: "Within a month", s: "Plan checks, shopping and the right time to collect them." },
                { id: "later", t: "Just exploring", s: "Browse guidance — set up properly later." },
              ].map((o) => <Chip key={o.id} active={stage === o.id} onClick={() => setStage(o.id)} sub={o.s}>{o.t}</Chip>)}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 20px 24px", background: "linear-gradient(to top, var(--cream-50) 70%, transparent)" }}>
        <WWButton variant="primary" size="lg" full onClick={next} iconRight="arrow-right">
          {step === steps.length - 1 ? "Take me to my plan" : "Continue"}
        </WWButton>
        {step < steps.length - 1 && (
          <button onClick={onComplete} style={{ width: "100%", border: 0, background: "transparent", color: "var(--ink-500)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", marginTop: 10 }}>Skip for now</button>
        )}
      </div>
    </WWScreen>
  );
}

Object.assign(window, { WWScreen, WelcomeScreen, AuthScreen, OnboardingScreen });
